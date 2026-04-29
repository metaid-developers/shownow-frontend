type UserInfoLike = {
  avatar?: string | null;
  background?: string | null;
  name?: string | null;
  globalMetaId?: string | null;
  metaid?: string | null;
  metaId?: string | null;
  bio?: unknown;
};

type LocalProfile = Record<string, unknown>;

const PROFILE_TEXT_PRIORITY_KEYS = [
  "role",
  "bio",
  "description",
  "summary",
  "about",
  "goal",
  "background",
  "soul",
];

export function normalizeProfileMediaUrl(
  value: string | null | undefined,
  baseUrl: string
): string {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${baseUrl}${value}`;
}

export function normalizeProfileText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeProfileText).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of PROFILE_TEXT_PRIORITY_KEYS) {
      const text = normalizeProfileText(record[key]);
      if (text) {
        return text;
      }
    }

    return Object.values(record)
      .map(normalizeProfileText)
      .filter(Boolean)
      .join(" / ");
  }

  return "";
}

export function normalizeUserInfo<T extends UserInfoLike>(
  userInfo: T | undefined
): (T & { globalMetaId: string; metaid: string; bio: string }) | undefined {
  if (!userInfo) {
    return undefined;
  }

  return {
    ...userInfo,
    globalMetaId: userInfo.globalMetaId || "",
    metaid: userInfo.metaid || userInfo.metaId || "",
    bio: normalizeProfileText(userInfo.bio),
  };
}

export function buildUserState({
  address,
  userInfo,
  profile,
  baseUrl,
}: {
  address: string;
  userInfo?: UserInfoLike;
  profile: LocalProfile;
  baseUrl: string;
}) {
  const normalizedUserInfo = normalizeUserInfo(userInfo);

  return {
    avatar: normalizeProfileMediaUrl(normalizedUserInfo?.avatar, baseUrl),
    background: normalizeProfileMediaUrl(
      normalizedUserInfo?.background,
      baseUrl
    ),
    name: normalizedUserInfo?.name || normalizeProfileText(profile.name) || "",
    globalMetaId:
      normalizedUserInfo?.globalMetaId ||
      normalizeProfileText(profile.globalMetaId) ||
      "",
    metaid: normalizedUserInfo?.metaid || "",
    bio: normalizedUserInfo?.bio || normalizeProfileText(profile.bio) || "",
    address,
  };
}
