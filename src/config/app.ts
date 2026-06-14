export const appConfig = {
  domain: import.meta.env.VITE_APP_DOMAIN || 'localhost:8080',
  name: import.meta.env.VITE_APP_NAME || 'Gemüt!',
  description: 'Società di mediazione immobiliare per acquisto, vendita e locazione',
  author: 'Gemüt!',
  url: `https://${import.meta.env.VITE_APP_DOMAIN || 'localhost:8080'}`,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID
  }
};

export default appConfig;
