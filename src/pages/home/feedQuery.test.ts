import assert from "node:assert/strict";
import {
  HOME_NEW_BUZZ_INITIAL_PAGE_PARAM,
  HOME_NEW_BUZZ_QUERY_KEY,
  HOME_NEW_BUZZ_STALE_TIME_MS,
  createHomeNewBuzzQueryOptions,
} from "./feedQuery.ts";

const calls: Array<{ size: number; lastId?: string }> = [];
const fetchAllBuzzs = async (params: { size: number; lastId?: string }) => {
  calls.push(params);
  return {
    data: {
      lastId: "next-cursor",
      list: [],
    },
  };
};

const options = createHomeNewBuzzQueryOptions(fetchAllBuzzs);

assert.deepEqual(options.queryKey, HOME_NEW_BUZZ_QUERY_KEY);
assert.equal(options.initialPageParam, HOME_NEW_BUZZ_INITIAL_PAGE_PARAM);
assert.equal(options.staleTime, HOME_NEW_BUZZ_STALE_TIME_MS);

const firstPage = await options.queryFn({
  pageParam: HOME_NEW_BUZZ_INITIAL_PAGE_PARAM,
});

assert.deepEqual(calls, [{ size: 10, lastId: "" }]);
assert.equal(options.getNextPageParam(firstPage), "next-cursor");
assert.equal(options.getNextPageParam({ data: { list: [] } }), undefined);

console.log("home feed query helper tests passed");
