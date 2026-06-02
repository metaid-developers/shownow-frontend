const TX_ID_PATTERN = /^[0-9a-fA-F]{64}$/;

export function normalizePinIdForContent(pinId: string) {
  if (TX_ID_PATTERN.test(pinId)) {
    return `${pinId}i0`;
  }

  return pinId;
}
