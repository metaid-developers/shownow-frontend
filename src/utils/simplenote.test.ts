import assert from "node:assert/strict";
import {
  isMarkdownNote,
  parseSimpleNote,
  prepareNoteMarkdown,
} from "./simplenote";

const noteJson = JSON.stringify({
  title: "Hello Note",
  subtitle: "A subtitle",
  coverImg: "",
  contentType: "text/markdown",
  content:
    "# Title\n\n![cover](metafile://abc123i0)\n\n[doc](metafile://def456i0.pdf)\n\n[related](pin://fff000i0)",
  attachments: [],
  tags: ["demo"],
});

const note = parseSimpleNote(noteJson);
assert.ok(note);
assert.equal(note!.title, "Hello Note");
assert.equal(note!.tags!.length, 1);
assert.ok(isMarkdownNote(note));

assert.equal(parseSimpleNote("plain text"), null);
assert.equal(parseSimpleNote('{"broken"'), null);
assert.ok(!isMarkdownNote(parseSimpleNote('{"content":"x"}')));

const prepared = prepareNoteMarkdown(note!.content);
assert.match(
  prepared,
  /!\[cover\]\(https:\/\/file\.metaid\.io\/metafile-indexer\/api\/v1\/files\/accelerate\/content\/abc123i0\?process=preview\)/
);
// pin ids do not carry file extensions; the metafileUrl helper strips them
assert.match(
  prepared,
  /\[doc\]\(https:\/\/file\.metaid\.io\/metafile-indexer\/api\/v1\/files\/accelerate\/content\/def456i0\)/
);
assert.match(prepared, /\[related\]\(\/buzz\/fff000i0\)/);
assert.ok(!prepared.includes("metafile://"));

// video-typed metafile urIs keep their pin id when rewritten
const videoPrepared = prepareNoteMarkdown("![v](metafile://video/vid999i0)");
assert.match(
  videoPrepared,
  /!\[v\]\(https:\/\/file\.metaid\.io\/metafile-indexer\/api\/v1\/files\/accelerate\/content\/vid999i0\?process=preview\)/
);

console.log("simplenote helper tests passed");
