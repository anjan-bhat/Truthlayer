import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';

/**
 * Google sign-in on Base44 (requires VITE_BASE44_APP_ID). Do not use redirectToLogin:
 * GET /login without app_id returns JSON "App not found" and breaks the browser tab.
 */
export function startHostedLogin(returnPath = '/feed') {
  if (!appParams.appId) {
    window.alert(
      'Add VITE_BASE44_APP_ID to your .env file (copy from your project in the Base44 editor), then restart the dev server.'
    );
    return;
  }
  const next =
    returnPath.startsWith('http')
      ? returnPath
      : `${window.location.origin}${returnPath.startsWith('/') ? returnPath : `/${returnPath}`}`;
  base44.auth.loginWithProvider('google', next);
}
