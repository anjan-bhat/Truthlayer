import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appParams } from "@/lib/app-params";

const DEFAULT_HOST = "https://base44.app";

/** Same path the SDK uses for Google auth — not /login (that route returns JSON without app context). */
function hostedAuthLoginUrl(fromUrl) {
  const base =
    (import.meta.env.VITE_BASE44_APP_BASE_URL || DEFAULT_HOST).replace(/\/$/, "");
  const params = new URLSearchParams({
    app_id: appParams.appId,
    from_url: fromUrl,
  });
  return `${base}/api/apps/auth/login?${params.toString()}`;
}

export default function LoginRedirect() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appParams.appId) {
      setError("missing_app_id");
      return;
    }
    const fromQuery = searchParams.get("from_url");
    const next = fromQuery || `${window.location.origin}/feed`;
    window.location.replace(hostedAuthLoginUrl(next));
  }, [searchParams]);

  if (error === "missing_app_id") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground px-6 text-center">
        <p className="text-sm text-muted-foreground max-w-md">
          Set <code className="text-foreground">VITE_BASE44_APP_ID</code> in{" "}
          <code className="text-foreground">.env</code>, restart{" "}
          <code className="text-foreground">npm run dev</code>, then try again.
        </p>
        <a
          href="/"
          className="text-sm text-primary underline underline-offset-4"
        >
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
    </div>
  );
}
