import assert from "node:assert/strict";
import { getBuzzOriginLinkMode } from "./buzzOriginLink";

assert.equal(getBuzzOriginLinkMode(""), "plain");
assert.equal(getBuzzOriginLinkMode("   "), "plain");
assert.equal(getBuzzOriginLinkMode("show.now"), "linked");

console.log("buzz origin link tests passed");
