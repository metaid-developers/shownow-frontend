import { getMetafilePinId, stripMetafilePrefix } from "./metafile";

export const METAFILE_FILES_API =
  "https://file.metaid.io/metafile-indexer/api/v1/files";

const ACCELERATE_CONTENT_PATH = "accelerate/content";
const DATA_OR_BLOB_URL_PATTERN = /^(data:|blob:)/i;
const ABSOLUTE_HTTP_URL_PATTERN = /^https?:\/\//i;
const TYPED_MEDIA_PREFIXES = ["video/", "audio/", "image/"] as const;
const CONTENT_PATH_MARKERS = [
  "/accelerate/content/",
  "/man/content/",
  "/content/",
];

function normalizePathSource(source: string): string {
  return source.trim().replace(/^\/+/, "");
}

function stripQueryAndHash(source: string): string {
  return source.split(/[?#]/)[0];
}

function extractPinIdFromContentPath(pathname: string): string | undefined {
  for (const marker of CONTENT_PATH_MARKERS) {
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) {
      continue;
    }

    const rest = pathname.slice(markerIndex + marker.length);
    const candidate = stripQueryAndHash(rest).split("/")[0];
    return candidate ? getMetafilePinId(candidate) : undefined;
  }

  return undefined;
}

export function getMetafilePinIdFromSource(
  source: string | null | undefined
): string | undefined {
  if (!source) {
    return undefined;
  }

  const trimmed = source.trim();
  if (!trimmed || DATA_OR_BLOB_URL_PATTERN.test(trimmed)) {
    return undefined;
  }

  if (trimmed.startsWith("metafile://")) {
    return getMetafilePinId(trimmed);
  }

  if (ABSOLUTE_HTTP_URL_PATTERN.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      return extractPinIdFromContentPath(url.pathname);
    } catch (error) {
      return undefined;
    }
  }

  const normalizedPath = normalizePathSource(trimmed);
  const contentPathPinId = extractPinIdFromContentPath(`/${normalizedPath}`);
  if (contentPathPinId) {
    return contentPathPinId;
  }

  if (
    TYPED_MEDIA_PREFIXES.some((prefix) =>
      stripMetafilePrefix(normalizedPath).startsWith(prefix)
    )
  ) {
    return getMetafilePinId(normalizedPath);
  }

  return getMetafilePinId(stripQueryAndHash(normalizedPath));
}

export function buildMetafileOriginalUrl(pinId: string): string {
  return `${METAFILE_FILES_API}/${ACCELERATE_CONTENT_PATH}/${pinId}`;
}

export function buildMetafileImagePreviewUrl(pinId: string): string {
  return `${buildMetafileOriginalUrl(pinId)}?process=preview`;
}

export function getMetafileOriginalUrl(source: string): string {
  const pinId = getMetafilePinIdFromSource(source);
  return pinId ? buildMetafileOriginalUrl(pinId) : source;
}

export function getMetafileImagePreviewUrl(source: string): string {
  const pinId = getMetafilePinIdFromSource(source);
  return pinId ? buildMetafileImagePreviewUrl(pinId) : source;
}
