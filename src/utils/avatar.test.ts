import assert from "node:assert/strict";
import {
  buildAvatarThumbnailUrl,
  getAvatarPinId,
  normalizeAvatarUrl,
} from "./avatar";

const avatarPinId =
  "92fcff9ceada16c20d26322748e877b2d48dee54cf09770768bb8b27998b90f9i0";
const thumbnailAvatarUrl =
  "https://file.metaid.io/metafile-indexer/api/v1/users/avatar/accelerate/92fcff9ceada16c20d26322748e877b2d48dee54cf09770768bb8b27998b90f9i0?process=thumbnail";

assert.equal(getAvatarPinId(`/content/${avatarPinId}`), avatarPinId);
assert.equal(buildAvatarThumbnailUrl(avatarPinId), thumbnailAvatarUrl);
assert.equal(
  normalizeAvatarUrl({
    avatar: `/content/${avatarPinId}`,
    avatarId: avatarPinId,
  }),
  thumbnailAvatarUrl
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
