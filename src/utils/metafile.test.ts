import assert from "node:assert/strict";
import {
  getMetafilePinId,
  isTypedMetafilePath,
  isVideoMetafileUri,
  normalizeVideoMetafileUri,
  stripMetafilePrefix,
} from "./metafile";

assert.equal(stripMetafilePrefix("metafile://abc123.mp4"), "abc123.mp4");
assert.equal(stripMetafilePrefix("abc123.mp4"), "abc123.mp4");

assert.equal(isTypedMetafilePath("metafile://video/abc123i0"), true);
assert.equal(isTypedMetafilePath("video/abc123i0"), true);
assert.equal(isTypedMetafilePath("metafile://abc123i0.mp4"), false);

assert.equal(getMetafilePinId("metafile://video/abc123i0"), "abc123i0");
assert.equal(getMetafilePinId("metafile://abc123i0.mp4"), "abc123i0");
assert.equal(getMetafilePinId("abc123i0.mp4"), "abc123i0");

assert.equal(isVideoMetafileUri("metafile://video/abc123i0"), true);
assert.equal(isVideoMetafileUri("metafile://abc123i0.mp4"), true);
assert.equal(isVideoMetafileUri("abc123i0.mp4"), true);
assert.equal(isVideoMetafileUri("metafile://abc123i0.jpg"), false);

assert.equal(
  normalizeVideoMetafileUri("metafile://video/abc123i0"),
  "metafile://video/abc123i0"
);
assert.equal(
  normalizeVideoMetafileUri("metafile://abc123i0.mp4"),
  "metafile://video/abc123i0"
);
assert.equal(
  normalizeVideoMetafileUri("abc123i0.mp4"),
  "metafile://video/abc123i0"
);
assert.equal(
  normalizeVideoMetafileUri("metafile://abc123i0.jpg"),
  "metafile://abc123i0.jpg"
);

console.log("metafile helper tests passed");
