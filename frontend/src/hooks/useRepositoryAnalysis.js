import { useState } from 'react';
import { analyzeRepositoryRequest } from '../services/analysisService';

export const useRepositoryAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeRepository = async ({ repositoryUrl, mode }) => {
    setIsLoading(true);
    setError('');

    try {
      return await analyzeRepositoryRequest({ repositoryUrl, mode });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        'RepoLens could not analyze this repository. Check the URL and try again.';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeRepository, isLoading, error, setError };
};
