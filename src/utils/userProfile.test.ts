import assert from "node:assert/strict";
import {
  buildUserState,
  normalizeProfileMediaUrl,
} from "./userProfile";

const baseUrl = "https://man.metaid.io";

assert.equal(normalizeProfileMediaUrl("", baseUrl), "");
assert.equal(
  normalizeProfileMediaUrl("/content/avatar-pin", baseUrl),
  "https://man.metaid.io/content/avatar-pin"
);
assert.equal(
  normalizeProfileMediaUrl(
    "https://metafs.oss-cn-beijing.aliyuncs.com/avatar.png",
    baseUrl
  ),
  "https://metafs.oss-cn-beijing.aliyuncs.com/avatar.png"
);

assert.deepEqual(
  buildUserState({
    address: "14KD4faDFfKBRiYckGFWyxRrmhWZ55k44C",
    profile: { name: "local-name", bio: "local-bio" },
    baseUrl,
  }),
  {
    avatar: "",
    background: "",
    name: "local-name",
    metaid: "",
    bio: "local-bio",
    address: "14KD4faDFfKBRiYckGFWyxRrmhWZ55k44C",
  }
);

assert.deepEqual(
  buildUserState({
    address: "14KD4faDFfKBRiYckGFWyxRrmhWZ55k44C",
    userInfo: {
      avatar: "https://metafs.oss-cn-beijing.aliyuncs.com/avatar.png",
      background: "/content/background-pin",
      name: "vale",
      metaid: "meta-id",
      bio: "",
    },
    profile: {},
    baseUrl,
  }),
  {
    avatar: "https://metafs.oss-cn-beijing.aliyuncs.com/avatar.png",
    background: "https://man.metaid.io/content/background-pin",
    name: "vale",
    metaid: "meta-id",
    bio: "",
    address: "14KD4faDFfKBRiYckGFWyxRrmhWZ55k44C",
  }
);

console.log("userProfile helper tests passed");
