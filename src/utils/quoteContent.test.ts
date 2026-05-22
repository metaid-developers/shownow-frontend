import assert from "node:assert/strict";
import { buildQuoteBuzzFromPin, resolveQuoteContent } from "./quoteContent";

type FormattedContent = {
  publicContent: string;
  publicFiles: string[];
};

async function main() {
  const result = await resolveQuoteContent({
    fetchDetails: async () => ({ data: null }),
    fetchPin: async () => ({
      id: "paycomment-pin-id",
      creator: "comment-author-address",
      timestamp: 1779455087,
    }),
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
  assert.deepEqual(result.pin, {
    id: "paycomment-pin-id",
    creator: "comment-author-address",
    timestamp: 1779455087,
  });

  const quoteBuzz = buildQuoteBuzzFromPin(
    {
      id: "paycomment-pin-id",
      creator: "comment-author-address",
      address: "comment-author-address",
      metaid: "comment-author-metaid",
      timestamp: 1779455087,
      genesisTransaction: "paycomment-txid",
      chainName: "mvc",
      number: 1,
      genesisHeight: 100,
    },
    {
      publicContent: "reply content from paycomment",
      publicFiles: [],
      encryptFiles: [],
      nfts: [],
      video: [],
      buzzType: "normal",
      status: "unpurchased",
    }
  );

  assert.equal(quoteBuzz.creator, "comment-author-address");
  assert.equal(quoteBuzz.timestamp, 1779455087);
  assert.equal(quoteBuzz.path, "/protocols/paycomment");
  assert.equal(JSON.parse(quoteBuzz.content).content, "reply content from paycomment");
  assert.equal(quoteBuzz.forwardCount, 0);

  const quoteBuzzWithoutAddress = buildQuoteBuzzFromPin(
    {
      id: "fallbacktxidi0",
      creator: "comment-author-address",
      timestamp: 1779455087,
    },
    {
      publicContent: "reply content from paycomment",
      publicFiles: [],
      encryptFiles: [],
      nfts: [],
      video: [],
      buzzType: "normal",
      status: "unpurchased",
    }
  );

  assert.equal(quoteBuzzWithoutAddress.address, "comment-author-address");
  assert.equal(quoteBuzzWithoutAddress.genesisTransaction, "fallbacktxid");
}

main()
  .then(() => {
    console.log("quote content helper tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
