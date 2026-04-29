import assert from "node:assert/strict";
import {
  getMetafileImagePreviewUrl,
  getMetafileOriginalUrl,
  getMetafilePinIdFromSource,
} from "./metafileUrl";

const base = "https://file.metaid.io/metafile-indexer/api/v1/files";
const original = `${base}/accelerate/content/abc123i0`;
const preview = `${original}?process=preview`;

assert.equal(getMetafilePinIdFromSource("metafile://abc123i0.jpg"), "abc123i0");
assert.equal(getMetafilePinIdFromSource("metafile://video/abc123i0"), "abc123i0");
assert.equal(getMetafilePinIdFromSource(`${base}/content/abc123i0.png`), "abc123i0");
assert.equal(
  getMetafilePinIdFromSource(`${base}/accelerate/content/abc123i0?process=preview`),
  "abc123i0"
);
assert.equal(
  getMetafilePinIdFromSource("https://www.show.now/man/content/abc123i0.pdf"),
  "abc123i0"
);

assert.equal(getMetafileImagePreviewUrl("metafile://abc123i0.jpg"), preview);
assert.equal(getMetafileImagePreviewUrl("abc123i0"), preview);
assert.equal(getMetafileImagePreviewUrl(`${base}/content/abc123i0`), preview);

assert.equal(getMetafileOriginalUrl("metafile://abc123i0.jpg"), original);
assert.equal(getMetafileOriginalUrl("metafile://video/abc123i0"), original);
assert.equal(getMetafileOriginalUrl(`${base}/content/abc123i0`), original);
assert.equal(getMetafileOriginalUrl(preview), original);

assert.equal(
  getMetafileOriginalUrl("https://example.com/not-a-metafile/image.png"),
  "https://example.com/not-a-metafile/image.png"
);
assert.equal(
  getMetafileImagePreviewUrl("data:image/png;base64,abc"),
  "data:image/png;base64,abc"
);

console.log("metafile url helper tests passed");
