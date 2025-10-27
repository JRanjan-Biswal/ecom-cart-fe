// Get API endpoint from environment variable
const getApiEndpoint = () => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8082/api/v1";
  }
  // Server-side rendering
  return process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8082/api/v1";
};

export const config = {
  endpoint: getApiEndpoint(),
};

