// Lightweight frontend API adapter for standalone mode
export const api = {
  get: async (url: string, config?: any): Promise<{ data: any }> => ({ data: {} }),
  post: async (url: string, data?: any, config?: any): Promise<{ data: any }> => ({ data: {} }),
  put: async (url: string, data?: any, config?: any): Promise<{ data: any }> => ({ data: {} }),
  delete: async (url: string, config?: any): Promise<{ data: any }> => ({ data: {} }),
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },
};
