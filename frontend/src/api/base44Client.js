import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl: appBaseUrlParam } = appParams;

// Full URL of the Base44 app host (used for /login redirects). If empty, the SDK sends users to /login on localhost → 404.
const appBaseUrl =
  (appBaseUrlParam && String(appBaseUrlParam).trim()) ||
  import.meta.env.VITE_BASE44_APP_BASE_URL ||
  'https://base44.app';

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});
