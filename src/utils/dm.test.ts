import assert from "node:assert/strict";
import { buildIdChatDmUrl } from "./dm";

assert.equal(
  buildIdChatDmUrl("idq1j3yu9vmw"),
  "https://www.idchat.io/chat/talk/@me/idq1j3yu9vmw"
);

assert.equal(buildIdChatDmUrl(""), "");
assert.equal(buildIdChatDmUrl(undefined), "");

console.log("dm helper tests passed");
