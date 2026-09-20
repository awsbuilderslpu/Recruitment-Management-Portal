import { cookies } from "next/headers";

const SSO_USERINFO_URL =
  "https://sso.awslpu.in/oauth/userinfo";

export type AuthUser = {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  role: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("aws_lpu_access_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(
      SSO_USERINFO_URL,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (
      typeof data.sub !== "string" ||
      typeof data.name !== "string" ||
      typeof data.email !== "string" ||
      typeof data.role !== "string"
    ) {
      return null;
    }

    return {
      sub: data.sub,
      name: data.name,
      email: data.email,
      picture:
        typeof data.picture === "string"
          ? data.picture
          : undefined,
      role: data.role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUserRole(): Promise<string | null> {
  const user = await getCurrentUser();

  return user?.role ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}

export async function requireAdminAccess() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false as const,
      status: 401 as const,
      user: null,
    };
  }

  const role = user.role.toLowerCase();

  if (role !== "admin" && role !== "core") {
    return {
      authorized: false as const,
      status: 403 as const,
      user,
    };
  }

  return {
    authorized: true as const,
    status: 200 as const,
    user,
  };
}