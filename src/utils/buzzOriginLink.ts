export type BuzzOriginLinkMode = "plain" | "linked";

export function getBuzzOriginLinkMode(host: string): BuzzOriginLinkMode {
  return host.trim() ? "linked" : "plain";
}
