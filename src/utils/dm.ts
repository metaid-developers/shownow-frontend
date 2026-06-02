const IDCHAT_DM_BASE_URL = "https://www.idchat.io/chat/talk/@me";

export function buildIdChatDmUrl(globalMetaId?: string | null): string {
  const normalizedGlobalMetaId = globalMetaId?.trim();

  if (!normalizedGlobalMetaId) {
    return "";
  }

  return `${IDCHAT_DM_BASE_URL}/${encodeURIComponent(normalizedGlobalMetaId)}`;
}

export function openIdChatDm(globalMetaId?: string | null) {
  const dmUrl = buildIdChatDmUrl(globalMetaId);

  if (!dmUrl) {
    return;
  }

  window.open(dmUrl, "_blank");
}
