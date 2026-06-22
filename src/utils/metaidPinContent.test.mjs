import assert from "node:assert/strict";
import {
  METAID_JSON_CONTENT_TYPE,
  METAID_TEXT_CONTENT_TYPE,
  buildJsonPinData,
  buildTextContentPayload,
} from "./metaidPinContent.ts";

const simpleBuzzPayload = buildTextContentPayload("hello", {
  attachments: ["metafile://abc123i0"],
});
const simpleBuzzPin = buildJsonPinData(simpleBuzzPayload, {
  path: "/protocols/simplebuzz",
  flag: "metaid",
});

assert.equal(simpleBuzzPayload.contentType, METAID_TEXT_CONTENT_TYPE);
assert.equal(simpleBuzzPayload.content, "hello");
assert.equal(simpleBuzzPin.contentType, METAID_JSON_CONTENT_TYPE);
assert.equal(JSON.parse(simpleBuzzPin.body).contentType, METAID_TEXT_CONTENT_TYPE);

const commentPayload = buildTextContentPayload("reply", {
  commentTo: "parent-pin-id",
});
const commentPin = buildJsonPinData(commentPayload, {
  path: "/protocols/paycomment",
  flag: "metaid",
  contentType: METAID_TEXT_CONTENT_TYPE,
});

assert.equal(commentPayload.contentType, METAID_TEXT_CONTENT_TYPE);
assert.equal(commentPin.contentType, METAID_JSON_CONTENT_TYPE);
assert.equal(JSON.parse(commentPin.body).contentType, METAID_TEXT_CONTENT_TYPE);

console.log("metaid pin content contract tests passed");
