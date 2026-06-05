type AvatarRecordLike = {
  avatar?: string | null;
  avatarUrl?: string | null;
  avatarImage?: string | null;
  avatarUri?: string | null;
  avatar_uri?: string | null;
  avatarId?: string | null;
  avatarPinId?: string | null;
  chainName?: string | null;
};

const INDEXED_AVATAR_BASE_URL =
  "https://metafs.oss-cn-beijing.aliyuncs.com/indexer/avatar";
const AVATAR_PIN_ID_PATTERN = /([a-f0-9]{64}i\d+)/i;
const DATA_OR_BLOB_URL_PATTERN = /^(data:|blob:)/i;
const ABSOLUTE_HTTP_URL_PATTERN = /^https?:\/\//i;

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeChainName(value: unknown): string {
  const chainName = normalizeText(value).toLowerCase();
  return chainName === "btc" || chainName === "mvc" ? chainName : "mvc";
}

function joinBaseUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function hasContentPath(value: string): boolean {
  if (!value) {
    return false;
  }

  try {
    const path = ABSOLUTE_HTTP_URL_PATTERN.test(value)
      ? new URL(value).pathname
      : value;
    return /(?:^|\/)(?:content|files\/content)\//i.test(path);
  } catch (error) {
    return false;
  }
}

export function getAvatarPinId(value: string | null | undefined): string {
  const normalized = normalizeText(value);
  if (!normalized) {
    return "";
  }

  const match = normalized.match(AVATAR_PIN_ID_PATTERN);
  return match ? match[1] : "";
}

export function buildIndexedAvatarUrl(
  pinId: string | null | undefined,
  chainName?: string | null
): string {
  const normalizedPinId = getAvatarPinId(pinId);
  if (!normalizedPinId) {
    return "";
  }

  const txId = normalizedPinId.replace(/i\d+$/i, "");
  return `${INDEXED_AVATAR_BASE_URL}/${normalizeChainName(
    chainName
  )}/${txId}/${normalizedPinId}.txt`;
}

export function normalizeAvatarUrl(
  value: string | AvatarRecordLike | null | undefined,
  baseUrl = ""
): string {
  const record =
    value && typeof value === "object" ? value : ({} as AvatarRecordLike);
  const rawValue =
    typeof value === "string"
      ? value
      : record.avatar ||
        record.avatarUrl ||
        record.avatarImage ||
        record.avatarUri ||
        record.avatar_uri ||
        "";
  const avatar = normalizeText(rawValue);
  const avatarPinId =
    normalizeText(record.avatarPinId) ||
    normalizeText(record.avatarId) ||
    getAvatarPinId(avatar);

  if (avatar && DATA_OR_BLOB_URL_PATTERN.test(avatar)) {
    return avatar;
  }

  if (avatar && ABSOLUTE_HTTP_URL_PATTERN.test(avatar)) {
    if (hasContentPath(avatar) && avatarPinId) {
      return buildIndexedAvatarUrl(avatarPinId, record.chainName);
    }
    return avatar;
  }

  if (avatarPinId) {
    return buildIndexedAvatarUrl(avatarPinId, record.chainName);
  }

  if (!avatar || /^\/content\/?$/i.test(avatar)) {
    return "";
  }

  return baseUrl ? joinBaseUrl(baseUrl, avatar) : avatar;
}
