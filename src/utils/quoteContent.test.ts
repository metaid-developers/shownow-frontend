import assert from "node:assert/strict";
import { resolveQuoteContent } from "./quoteContent";

type FormattedContent = {
  publicContent: string;
  publicFiles: string[];
};

async function main() {
  const result = await resolveQuoteContent({
    fetchDetails: async () => ({ data: null }),
    fetchContent: async () => ({
      content: "reply content from paycomment",
      contentType: "text/plain;utf-8",
      commentTo: "parent-pin-id",
    }),
    formatContent: async (raw) => ({
      publicContent: raw.content,
      publicFiles: (raw as { attachments?: string[] }).attachments ?? [],
    }),
    emptyContent: async () => ({
      publicContent: "",
      publicFiles: [],
    }),
  });

  assert.equal(result.type, "content");
  assert.equal(result.isLoading, false);
  assert.equal(
    (result.content as FormattedContent).publicContent,
    "reply content from paycomment"
  );
}

main()
  .then(() => {
    console.log("quote content helper tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
