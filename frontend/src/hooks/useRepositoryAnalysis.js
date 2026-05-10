import { useState } from 'react';
import { analyzeRepositoryRequest } from '../services/analysisService';

const formatRequestError = (requestError) => {
  const fallbackMessage = 'RepoLens could not analyze this repository. Check the URL and try again.';
  const responseData = requestError.response?.data;
  const message = responseData?.message || fallbackMessage;
  const details = typeof responseData?.details === 'string' ? responseData.details.trim() : '';

  if (!details) return message;

  const compactDetails = details.replace(/\s+/g, ' ').slice(0, 280);
  return `${message} Details: ${compactDetails}`;
};

export const useRepositoryAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeRepository = async ({ repositoryUrl, mode }) => {
    setIsLoading(true);
    setError('');

    try {
      return await analyzeRepositoryRequest({ repositoryUrl, mode });
    } catch (requestError) {
      setError(formatRequestError(requestError));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeRepository, isLoading, error, setError };
};
