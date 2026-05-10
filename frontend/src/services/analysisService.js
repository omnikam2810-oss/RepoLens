import { apiClient } from './apiClient';

export const analyzeRepositoryRequest = async ({ repositoryUrl, mode }) => {
  const response = await apiClient.post('/analyze', { repositoryUrl, mode });
  return response.data.data;
};
