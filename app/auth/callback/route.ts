import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const returnedState = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      {
        error,
      },
      { status: 400 }
    );
  }

  if (!code || !returnedState) {
    return NextResponse.json(
      {
        error: "Missing authorization code or state",
      },
      { status: 400 }
    );
  }

  const state = request.cookies.get("aws_lpu_state")?.value;
  const codeVerifier =
    request.cookies.get("aws_lpu_code_verifier")?.value;

  if (!state || returnedState !== state) {
    return NextResponse.json(
      {
        error: "Invalid state",
      },
      { status: 400 }
    );
  }

  if (!codeVerifier) {
    return NextResponse.json(
      {
        error: "Missing PKCE code verifier",
      },
      { status: 400 }
    );
  }

  const clientId = process.env.AWS_LPU_CLIENT_ID;
  const clientSecret = process.env.AWS_LPU_CLIENT_SECRET;
  const redirectUri = process.env.AWS_LPU_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      {
        error: "AWS LPU SSO is not configured",
      },
      { status: 500 }
    );
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const tokenResponse = await fetch(
    "https://sso.awslpu.in/oauth/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
      cache: "no-store",
    }
  );

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();

    return NextResponse.json(
      {
        error: "Token exchange failed",
        details: errorBody,
      },
      { status: 400 }
    );
  }

  const tokens = await tokenResponse.json();

  if (!tokens.access_token) {
    return NextResponse.json(
      {
        error: "No access token received",
      },
      { status: 400 }
    );
  }

  const userResponse = await fetch(
    "https://sso.awslpu.in/oauth/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
      cache: "no-store",
    }
  );

  if (!userResponse.ok) {
    return NextResponse.json(
      {
        error: "Failed to fetch user information",
      },
      { status: 400 }
    );
  }

  const user = await userResponse.json();

  if (
    typeof user.sub !== "string" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string" ||
    typeof user.role !== "string"
  ) {
    return NextResponse.json(
      {
        error: "Invalid user information",
      },
      { status: 400 }
    );
  }

  const response = NextResponse.redirect(
    new URL("/auth/success", request.url)
  );

  const sessionMaxAge =
    Number(tokens.expires_in) || 60 * 60 * 24 * 30;

  response.cookies.set(
    "aws_lpu_access_token",
    tokens.access_token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionMaxAge,
    }
  );

  response.cookies.delete("aws_lpu_state");
  response.cookies.delete("aws_lpu_nonce");
  response.cookies.delete("aws_lpu_code_verifier");

  return response;
}