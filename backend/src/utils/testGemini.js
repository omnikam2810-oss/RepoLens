import dotenv from 'dotenv';
import { createGeminiClient } from '../services/geminiService.js';
import { env } from '../config/env.js';

dotenv.config();

const listAvailableModels = async () => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.geminiApiKey}`);
  if (!response.ok) return [];

  const data = await response.json();
  return (data.models || [])
    .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
    .map((model) => model.name)
    .slice(0, 20);
};

const runGeminiConnectivityTest = async () => {
  if (!env.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is missing. Add it to backend/.env before running this test.');
  }

  const client = createGeminiClient();
  const model = client.getGenerativeModel({
    model: env.geminiModel,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(
    [
      'Return only valid JSON.',
      'Analyze this sample repository in one short response.',
      JSON.stringify({
        repository: {
          name: 'sample-api',
          description: 'A small Express API used to test repository analysis.',
        },
        files: ['package.json', 'src/server.js', 'src/routes/health.routes.js'],
      }),
      'Schema: {"status":"string","summary":"string","model":"string"}',
    ].join('\n\n'),
  );

  const text = result.response.text();
  const parsed = JSON.parse(text);

  console.log('Gemini connectivity test passed.');
  console.log(
    JSON.stringify(
      {
        status: parsed.status || 'ok',
        model: env.geminiModel,
        summary: parsed.summary,
      },
      null,
      2,
    ),
  );
};

runGeminiConnectivityTest().catch((error) => {
  console.error('Gemini connectivity test failed.');
  console.error(error.message);

  listAvailableModels()
    .then((models) => {
      if (models.length) {
        console.error('Available generateContent models for this key:');
        models.forEach((model) => console.error(`- ${model.replace('models/', '')}`));
      }
      process.exit(1);
    })
    .catch(() => process.exit(1));
});
