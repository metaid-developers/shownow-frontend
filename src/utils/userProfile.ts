type UserInfoLike = {
  avatar?: string | null;
  background?: string | null;
  name?: string | null;
  metaid?: string | null;
  metaId?: string | null;
  bio?: string | null;
};

type LocalProfile = Record<string, string>;

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
  return {
    avatar: normalizeProfileMediaUrl(userInfo?.avatar, baseUrl),
    background: normalizeProfileMediaUrl(userInfo?.background, baseUrl),
    name: userInfo?.name || profile.name || "",
    metaid: userInfo?.metaid || userInfo?.metaId || "",
    bio: userInfo?.bio || profile.bio || "",
    address,
  };
}
