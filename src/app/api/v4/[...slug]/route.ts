import { NextResponse, NextRequest } from "next/server";

// Define a type for our server-side token cache
interface TokenCache {
  token: string | null;
  expiresAt: number;
}

// This is a server-side cache for the access token. It persists across requests.
let tokenCache: TokenCache = {
  token: null,
  expiresAt: 0,
};

async function getAccessToken(): Promise<string | null> {
  // Return cached token if it's still valid
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    console.log("CACHE: Using server-cached access token.");
    return tokenCache.token;
  }

  // --- Environment-Specific Configuration ---
  const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";

  const tokenUrl = isProduction
    ? "https://oauth2.quran.foundation/oauth2/token"
    : "https://prelive-oauth2.quran.foundation/oauth2/token";

  const clientId = isProduction
    ? process.env.QURAN_CLIENT_ID_PRODUCTION
    : process.env.QURAN_CLIENT_ID_STAGING;

  const clientSecret = isProduction
    ? process.env.QURAN_CLIENT_SECRET_PRODUCTION
    : process.env.QURAN_CLIENT_SECRET_STAGING;

  console.log({ tokenUrl });
  if (!clientId || !clientSecret) {
    console.error(
      "SERVER_ERROR: Missing client credentials for the current environment."
    );
    return null;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  console.log({ auth });
  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // The body now only contains the grant type and the scope.
      body: `grant_type=client_credentials&scope=content`,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SERVER_TOKEN_ERROR:", errorText);
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const expiresIn = data.expires_in || 3600;

    tokenCache = {
      token: accessToken,
      expiresAt: Date.now() + (expiresIn - 60) * 1000,
    };
    return accessToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const apiPath = slug.join("/");
  const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";

  const clientId = isProduction
    ? process.env.QURAN_CLIENT_ID_PRODUCTION
    : process.env.QURAN_CLIENT_ID_STAGING;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { message: "Could not retrieve access token." },
      { status: 500 }
    );
  }
  const baseApiUrl = isProduction
    ? "https://apis.quran.foundation/content/api/v4/"
    : "https://apis-prelive.quran.foundation/content/api/v4/";
  const queryString = req.nextUrl.search;

  const apiUrl = `${baseApiUrl}${apiPath}${queryString}`;
  console.log({ apiPath, apiUrl }, "api path");

  try {
    // Making a simple GET request.
    const apiRes = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-client-id": clientId!,
        "x-auth-token": accessToken,
      },
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.text();
      console.error("PROXY_ERROR: Upstream API returned an error:", errorData);
      // Forward the exact status and error from the external API
      return new Response(errorData, { status: apiRes.status });
    }

    const data = await apiRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("SERVER_PROXY_ERROR:", error);
    return NextResponse.json(
      { message: "An error occurred while proxying the request." },
      { status: 500 }
    );
  }
}

// Export the handler for the HTTP methods you want to support
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
