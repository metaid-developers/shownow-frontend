import { getMetafileImagePreviewUrl, getMetafileOriginalUrl } from "./metafileUrl";

export const SIMPLENOTE_PATH = "/protocols/simplenote";

export type SimpleNote = {
  title: string;
  subtitle: string;
  coverImg: string;
  contentType: string;
  content: string;
  attachments: string[];
  tags?: string[];
};

export function parseSimpleNote(
  raw: string | null | undefined
): SimpleNote | null {
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    return null;
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return {
      title: parsed.title ?? "",
      subtitle: parsed.subtitle ?? "",
      coverImg: parsed.coverImg ?? "",
      contentType: parsed.contentType ?? "",
      content: parsed.content ?? "",
      attachments: Array.isArray(parsed.attachments) ? parsed.attachments : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch (e) {
    console.log("parse simplenote error", e);
    return null;
  }
}

export const isMarkdownNote = (note: SimpleNote | null): boolean =>
  !!note && note.contentType.toLowerCase().includes("markdown");

// Markdown image destinations get the compressed preview URL so feeds stay
// light; every other metafile reference (plain links, bare text) maps to the
// original downloadable file URL.
const MARKDOWN_METAFILE_IMAGE_RE = /(!\[[^\]]*\]\()metafile:\/\/([^)\s]+)(\))/g;
const METAFILE_URI_RE = /metafile:\/\/([^)\s]+)/g;
const PIN_LINK_RE = /\]\(pin:\/\/([^)\s]+)\)/g;

export function prepareNoteMarkdown(content: string): string {
  let md = content.replace(
    MARKDOWN_METAFILE_IMAGE_RE,
    (_match, prefix: string, uri: string, suffix: string) =>
      `${prefix}${getMetafileImagePreviewUrl(`metafile://${uri}`)}${suffix}`
  );
  md = md.replace(METAFILE_URI_RE, (_match, uri: string) =>
    getMetafileOriginalUrl(`metafile://${uri}`)
  );
  md = md.replace(PIN_LINK_RE, (_match, pinId: string) => `](/buzz/${pinId})`);
  return md;
}
