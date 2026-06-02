import assert from "node:assert/strict";
import { normalizePinIdForContent } from "./pinId";

async function main() {
  assert.equal(
    normalizePinIdForContent(
      "94af4d811a12b05d45ae09f4080095a290f15edf39eac50890522ff3a572c4f8"
    ),
    "94af4d811a12b05d45ae09f4080095a290f15edf39eac50890522ff3a572c4f8i0"
  );

  assert.equal(
    normalizePinIdForContent(
      "94af4d811a12b05d45ae09f4080095a290f15edf39eac50890522ff3a572c4f8i0"
    ),
    "94af4d811a12b05d45ae09f4080095a290f15edf39eac50890522ff3a572c4f8i0"
  );
}

main()
  .then(() => {
    console.log("pin id helper tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
