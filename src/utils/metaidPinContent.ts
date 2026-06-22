export const METAID_JSON_CONTENT_TYPE = "application/json;utf-8";
export const METAID_TEXT_CONTENT_TYPE = "text/plain;utf-8";

type PinDataFields = Record<string, unknown> & {
  body?: unknown;
  contentType?: string;
};

export function buildTextContentPayload<TExtra extends Record<string, unknown>>(
  content: string,
  extra?: TExtra
) {
  return {
    ...extra,
    content,
    contentType: METAID_TEXT_CONTENT_TYPE,
  };
}

export function buildJsonPinData<TData extends PinDataFields>(
  body: unknown,
  data?: TData
) {
  return {
    ...data,
    body: JSON.stringify(body),
    contentType: METAID_JSON_CONTENT_TYPE,
  };
}
