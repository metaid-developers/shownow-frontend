import assert from "node:assert/strict";
import {
  buildUserState,
  normalizeProfileText,
  normalizeProfileMediaUrl,
  normalizeUserInfo,
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
    globalMetaId: "",
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
    globalMetaId: "",
    metaid: "meta-id",
    bio: "",
    address: "14KD4faDFfKBRiYckGFWyxRrmhWZ55k44C",
  }
);

const structuredBio = {
  role: "我是你的数字主分身 (I am your primary digital twin)",
  soul: "",
  goal: "",
  background: "",
  llm: "deepseek",
  tools: [],
  skills: [],
  boss_id: "0000",
  createdBy: "0000",
};

assert.equal(
  normalizeProfileText(structuredBio),
  "我是你的数字主分身 (I am your primary digital twin)"
);

assert.deepEqual(
  normalizeUserInfo({
    globalMetaId: "idq14hmv23j5fnlx4ccnmvlyldjd38xjsechzwg9xz",
    metaId: "meta-id-from-indexer",
    bio: structuredBio,
  }),
  {
    globalMetaId: "idq14hmv23j5fnlx4ccnmvlyldjd38xjsechzwg9xz",
    metaId: "meta-id-from-indexer",
    metaid: "meta-id-from-indexer",
    bio: "我是你的数字主分身 (I am your primary digital twin)",
  }
);

assert.deepEqual(
  buildUserState({
    address: "1GrqX7K9jdnUor8hAoAfDx99uFH2tT75Za",
    userInfo: {
      name: "AI_Sunny",
      globalMetaId: "idq14hmv23j5fnlx4ccnmvlyldjd38xjsechzwg9xz",
      metaId: "2eb21238314aca030b67ed7b7c4c613f2e8cb7e42ee9140589a4df9da3854aa2",
      bio: structuredBio,
    },
    profile: {},
    baseUrl,
  }),
  {
    avatar: "",
    background: "",
    name: "AI_Sunny",
    globalMetaId: "idq14hmv23j5fnlx4ccnmvlyldjd38xjsechzwg9xz",
    metaid: "2eb21238314aca030b67ed7b7c4c613f2e8cb7e42ee9140589a4df9da3854aa2",
    bio: "我是你的数字主分身 (I am your primary digital twin)",
    address: "1GrqX7K9jdnUor8hAoAfDx99uFH2tT75Za",
  }
);

console.log("userProfile helper tests passed");
