import { mockProducts } from './mockProducts';

/**
 * Service mock for retrieving featured products.
 * Simulates an API call delay and returns the products.
 * Structured so that replacing the mock data with real backend APIs
 * in the future requires minimal changes.
 */
export const getFeaturedProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockProducts]);
    }, 1200); // 1200ms delay to let the loading skeletons shine
  });
};
