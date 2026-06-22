import { METAID_TEXT_CONTENT_TYPE } from "./metaidPinContent";

export type QuoteContentResult<TDetails, TContent, TPin = unknown> =
  | {
      type: "details";
      details: TDetails;
    }
  | {
      type: "content";
      content: TContent;
      isLoading: boolean;
      pin?: TPin;
    };

type DetailResponse<TDetails> = {
  data?: TDetails | null;
} | null | undefined;

type QuotePin = Record<string, any> & {
  id: string;
  content?: string;
  contentSummary?: string;
  metaid?: string;
  path?: string;
};

type QuoteFormattedContent = {
  publicContent: string;
  publicFiles?: string[];
  mentions?: Record<string, string>;
  [key: string]: unknown;
};

export function buildQuoteBuzzFromPin<TPin extends QuotePin>(
  pin: TPin,
  content: QuoteFormattedContent
) {
  const body: {
    content: string;
    contentType: string;
    attachments?: string[];
    mentions?: Record<string, string>;
  } = {
    content: content.publicContent,
    contentType: METAID_TEXT_CONTENT_TYPE,
  };

  if (content.publicFiles?.length) {
    body.attachments = content.publicFiles;
  }
  if (content.mentions && Object.keys(content.mentions).length > 0) {
    body.mentions = content.mentions;
  }

  const serializedContent = JSON.stringify(body);
  const genesisTransaction =
    pin.genesisTransaction ?? pin.id.replace(/i\d+$/, "");

  return {
    ...pin,
    path: pin.path ?? "/protocols/paycomment",
    address: pin.address ?? pin.creator ?? "",
    creator: pin.creator ?? pin.address ?? "",
    content: serializedContent,
    contentSummary: serializedContent,
    blocked: pin.blocked ?? false,
    host: pin.host ?? "",
    createMetaId: pin.createMetaId ?? pin.metaid ?? "",
    genesisTransaction,
    genesisHeight: pin.genesisHeight ?? 0,
    txIndex: pin.txIndex ?? 0,
    mrc20MintId: pin.mrc20MintId ?? [],
    MogoID: pin.MogoID ?? "",
    likeCount: pin.likeCount ?? 0,
    commentCount: pin.commentCount ?? 0,
    shareCount: pin.shareCount ?? 0,
    donateCount: pin.donateCount ?? 0,
    hot: pin.hot ?? 0,
    like: pin.like ?? [],
    donate: pin.donate ?? [],
    forwardCount: pin.forwardCount ?? 0,
  };
}

type ResolveQuoteContentParams<
  TRawContent extends object,
  TDetails,
  TContent,
  TPin = unknown
> = {
  fetchDetails: () => Promise<DetailResponse<TDetails>>;
  fetchContent: () => Promise<TRawContent | TContent | string>;
  fetchPin?: () => Promise<TPin | null | undefined>;
  formatContent: (
    rawContent: TRawContent & { content: string }
  ) => Promise<TContent> | TContent;
  emptyContent: () => Promise<TContent> | TContent;
};

export async function resolveQuoteContent<
  TDetails,
  TRawContent extends object,
  TContent,
  TPin = unknown
>({
  fetchDetails,
  fetchContent,
  fetchPin,
  formatContent,
  emptyContent,
}: ResolveQuoteContentParams<TRawContent, TDetails, TContent, TPin>): Promise<
  QuoteContentResult<TDetails, TContent, TPin>
> {
  const details = await fetchDetails();
  if (details?.data) {
    return {
      type: "details",
      details: details.data,
    };
  }

  const [rawContent, pin] = await Promise.all([
    fetchContent(),
    fetchPin?.(),
  ]);
  const quotePin = pin ?? undefined;
  if (typeof rawContent === "string") {
    return {
      type: "content",
      content: await emptyContent(),
      isLoading: true,
      pin: quotePin,
    };
  }

  if (
    rawContent &&
    typeof rawContent === "object" &&
    typeof (rawContent as { content?: unknown }).content === "string"
  ) {
    return {
      type: "content",
      content: await formatContent(
        rawContent as TRawContent & { content: string }
      ),
      isLoading: false,
      pin: quotePin,
    };
  }

  return {
    type: "content",
    content: rawContent as TContent,
    isLoading: false,
    pin: quotePin,
  };
}
