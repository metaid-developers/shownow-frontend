export const HOME_NEW_BUZZ_QUERY_KEY = ["homebuzzesnew"] as const;
export const HOME_NEW_BUZZ_INITIAL_PAGE_PARAM = "";
export const HOME_NEW_BUZZ_STALE_TIME_MS = 5_000;

type FetchAllBuzzs = (params: {
  size: number;
  lastId?: string;
}) => Promise<API.BuzzListRet>;

export const createHomeNewBuzzQueryOptions = (fetchAllBuzzs: FetchAllBuzzs) => ({
  queryKey: HOME_NEW_BUZZ_QUERY_KEY,
  queryFn: ({ pageParam }: { pageParam: string }) =>
    fetchAllBuzzs({
      size: 10,
      lastId: pageParam,
    }),
  initialPageParam: HOME_NEW_BUZZ_INITIAL_PAGE_PARAM,
  staleTime: HOME_NEW_BUZZ_STALE_TIME_MS,
  getNextPageParam: (lastPage: API.BuzzListRet) => {
    const lastId = lastPage?.data?.lastId;
    if (!lastId) return;
    return lastId;
  },
});
