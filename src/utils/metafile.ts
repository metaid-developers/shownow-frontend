const METAFILE_PREFIX = "metafile://";
const TYPED_METAFILE_PREFIXES = ["video/", "audio/", "image/"] as const;
const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "webm",
  "av1",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv",
  "3gp",
]);

function splitExtension(path: string): { name: string; extension: string } {
  const cleanPath = path.split(/[?#]/)[0];
  const lastSegment = cleanPath.split("/").pop() || cleanPath;
  const dotIndex = lastSegment.lastIndexOf(".");

  if (dotIndex <= 0) {
    return { name: lastSegment, extension: "" };
  }

  return {
    name: lastSegment.slice(0, dotIndex),
    extension: lastSegment.slice(dotIndex + 1).toLowerCase(),
  };
}

export function stripMetafilePrefix(uri: string): string {
  return uri.startsWith(METAFILE_PREFIX)
    ? uri.slice(METAFILE_PREFIX.length)
    : uri;
}

export function isTypedMetafilePath(pathOrUri: string): boolean {
  const path = stripMetafilePrefix(pathOrUri);
  return TYPED_METAFILE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function getTypedMetafilePinId(pathOrUri: string): string | undefined {
  const path = stripMetafilePrefix(pathOrUri);
  const matchedPrefix = TYPED_METAFILE_PREFIXES.find((prefix) =>
    path.startsWith(prefix)
  );

  if (!matchedPrefix) {
    return undefined;
  }

  return path.slice(matchedPrefix.length);
}

export function getMetafilePinId(pathOrUri: string): string {
  const typedPinId = getTypedMetafilePinId(pathOrUri);

  if (typedPinId) {
    return typedPinId;
  }

  const normalizedPath = stripMetafilePrefix(pathOrUri);
  return splitExtension(normalizedPath).name;
}

export function isVideoMetafileUri(pathOrUri: string): boolean {
  const path = stripMetafilePrefix(pathOrUri);

  if (path.startsWith("video/")) {
    return true;
  }

  return VIDEO_EXTENSIONS.has(splitExtension(path).extension);
}

export function normalizeVideoMetafileUri(pathOrUri: string): string {
  if (!isVideoMetafileUri(pathOrUri)) {
    return pathOrUri;
  }

  return `${METAFILE_PREFIX}video/${getMetafilePinId(pathOrUri)}`;
}
