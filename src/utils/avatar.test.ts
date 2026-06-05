import assert from "node:assert/strict";
import {
  buildIndexedAvatarUrl,
  getAvatarPinId,
  normalizeAvatarUrl,
} from "./avatar";

const avatarPinId =
  "92fcff9ceada16c20d26322748e877b2d48dee54cf09770768bb8b27998b90f9i0";
const indexedAvatarUrl =
  "https://metafs.oss-cn-beijing.aliyuncs.com/indexer/avatar/mvc/92fcff9ceada16c20d26322748e877b2d48dee54cf09770768bb8b27998b90f9/92fcff9ceada16c20d26322748e877b2d48dee54cf09770768bb8b27998b90f9i0.txt";

assert.equal(getAvatarPinId(`/content/${avatarPinId}`), avatarPinId);
assert.equal(buildIndexedAvatarUrl(avatarPinId, "mvc"), indexedAvatarUrl);
assert.equal(
  normalizeAvatarUrl({
    avatar: `/content/${avatarPinId}`,
    avatarId: avatarPinId,
  }),
  indexedAvatarUrl
);
assert.equal(
  normalizeAvatarUrl(
    "https://metafs.oss-cn-beijing.aliyuncs.com/avatar.png"
  ),
  "https://metafs.oss-cn-beijing.aliyuncs.com/avatar.png"
);
assert.equal(
  normalizeAvatarUrl("/avatars/default.png", "https://man.metaid.io"),
  "https://man.metaid.io/avatars/default.png"
);

console.log("avatar helper tests passed");
