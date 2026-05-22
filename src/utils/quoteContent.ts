export type QuoteContentResult<TDetails, TContent> =
  | {
      type: "details";
      details: TDetails;
    }
  | {
      type: "content";
      content: TContent;
      isLoading: boolean;
    };

type DetailResponse<TDetails> = {
  data?: TDetails | null;
} | null | undefined;

type ResolveQuoteContentParams<TRawContent extends object, TDetails, TContent> = {
  fetchDetails: () => Promise<DetailResponse<TDetails>>;
  fetchContent: () => Promise<TRawContent | TContent | string>;
  formatContent: (
    rawContent: TRawContent & { content: string }
  ) => Promise<TContent> | TContent;
  emptyContent: () => Promise<TContent> | TContent;
};

export async function resolveQuoteContent<
  TDetails,
  TRawContent extends object,
  TContent
>({
  fetchDetails,
  fetchContent,
  formatContent,
  emptyContent,
}: ResolveQuoteContentParams<TRawContent, TDetails, TContent>): Promise<
  QuoteContentResult<TDetails, TContent>
> {
  const details = await fetchDetails();
  if (details?.data) {
    return {
      type: "details",
      details: details.data,
    };
  }

  const rawContent = await fetchContent();
  if (typeof rawContent === "string") {
    return {
      type: "content",
      content: await emptyContent(),
      isLoading: true,
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
    };
  }

  return {
    type: "content",
    content: rawContent as TContent,
    isLoading: false,
  };
}
