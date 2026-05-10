import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

const RESPONSE_SCHEMA = {
  projectSummary: 'string',
  projectPurpose: 'string',
  projectType: 'string',
  techStack: ['string'],
  features: ['string'],
  folderExplanation: [{ path: 'string', explanation: 'string' }],
  importantFiles: [{ path: 'string', explanation: 'string' }],
  setupInstructions: ['string'],
  architectureOverview: 'string',
  beginnerExplanation: 'string',
  recruiterExplanation: 'string',
  suggestions: ['string'],
  securitySuggestions: ['string'],
  dependencyInsights: ['string'],
  codeQualityScore: { score: 'number from 0 to 100', rationale: 'string' },
};

const fallbackAnalysis = ({ repository, techStack, tree }) => ({
  projectSummary: repository.description || `${repository.name} is a public GitHub repository that needs AI analysis for deeper explanation.`,
  projectPurpose: 'Set GEMINI_API_KEY on the backend to generate a full AI-powered purpose analysis.',
  projectType: repository.language ? `${repository.language} project` : 'Software project',
  techStack,
  features: ['Repository metadata and structure were fetched successfully.'],
  folderExplanation: tree
    .filter((item) => item.type === 'directory')
    .slice(0, 8)
    .map((item) => ({ path: item.path, explanation: 'Directory detected in the repository structure.' })),
  importantFiles: [],
  setupInstructions: ['Review the README and dependency files for project-specific setup steps.'],
  architectureOverview: 'AI architecture analysis is unavailable until GEMINI_API_KEY is configured.',
  beginnerExplanation: 'This repository can be inspected through its files, folders, README, and dependencies.',
  recruiterExplanation: 'Configure Gemini to generate a concise recruiter-friendly project explanation.',
  suggestions: ['Add a Gemini API key to enable full repository intelligence.'],
  securitySuggestions: ['Review dependency versions and environment variable handling.'],
  dependencyInsights: ['Dependency analysis is partially available from detected manifest files.'],
  codeQualityScore: { score: 60, rationale: 'Fallback score generated without AI review.' },
});

export const createGeminiClient = () => {
  if (!env.geminiApiKey) {
    throw new AppError('GEMINI_API_KEY is not configured.', 500);
  }

  return new GoogleGenerativeAI(env.geminiApiKey);
};

export const buildGeminiRepositoryPrompt = ({ messages }) => {
  const systemInstruction = messages.find((message) => message.role === 'system')?.content || '';
  const userContent = messages
    .filter((message) => message.role !== 'system')
    .map((message) => message.content)
    .join('\n\n');

  return [
    systemInstruction,
    'Return only valid JSON. Do not include markdown fences, commentary, or extra text.',
    `The JSON must follow this schema: ${JSON.stringify(RESPONSE_SCHEMA)}`,
    userContent,
  ]
    .filter(Boolean)
    .join('\n\n');
};

const extractJson = (content) => {
  const trimmedContent = content.trim();
  const fencedMatch = trimmedContent.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmedContent;
};

const parseGeminiJsonResponse = (content) => {
  try {
    return JSON.parse(extractJson(content));
  } catch {
    throw new AppError('Gemini returned invalid JSON.', 502);
  }
};

const getGeminiFriendlyMessage = (message) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('quota') || normalizedMessage.includes('rate limit') || message.includes('429')) {
    return 'Gemini quota or rate limit was reached. Wait a bit or check your Google AI Studio quota.';
  }

  if (
    normalizedMessage.includes('api key not valid') ||
    normalizedMessage.includes('invalid api key') ||
    normalizedMessage.includes('permission') ||
    message.includes('403')
  ) {
    return 'Gemini rejected the API key. Check GEMINI_API_KEY in backend/.env.';
  }

  if (
    normalizedMessage.includes('not found') ||
    normalizedMessage.includes('not supported') ||
    message.includes('404')
  ) {
    return `Model "${env.geminiModel}" is not available for this API key or API version. Run "npm run test:gemini" to verify available models.`;
  }

  if (
    normalizedMessage.includes('overloaded') ||
    normalizedMessage.includes('unavailable') ||
    normalizedMessage.includes('timeout') ||
    message.includes('503')
  ) {
    return 'Gemini is temporarily unavailable or overloaded. Try again shortly.';
  }

  if (
    normalizedMessage.includes('too large') ||
    normalizedMessage.includes('token') ||
    normalizedMessage.includes('payload')
  ) {
    return 'The repository prompt was too large for Gemini. Try a smaller repository or reduce fetched files.';
  }

  return 'Gemini returned an unexpected provider error.';
};

const buildGeminiError = (error) => {
  const message = error.message || 'Unknown Gemini API error.';
  const friendlyMessage = getGeminiFriendlyMessage(message);

  return new AppError(`Gemini API request failed. ${friendlyMessage}`, 502, message);
};

export const generateRepositoryAnalysis = async (payload, messages) => {
  if (!env.geminiApiKey) {
    return fallbackAnalysis(payload);
  }

  try {
    const client = createGeminiClient();
    const model = client.getGenerativeModel({
      model: env.geminiModel,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const prompt = buildGeminiRepositoryPrompt({ messages });
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    if (!content) {
      throw new AppError('Gemini returned an empty analysis.', 502);
    }

    return parseGeminiJsonResponse(content);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw buildGeminiError(error);
  }
};
