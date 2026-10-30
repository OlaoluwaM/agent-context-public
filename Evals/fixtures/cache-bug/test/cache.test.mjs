import assert from "node:assert/strict";
import test from "node:test";

import { cachedLookup } from "../src/cache.mjs";

test("reuses a cached zero", () => {
  const cache = {};
  let calls = 0;
  const compute = () => {
    calls += 1;
    return 0;
  };

  cachedLookup(cache, "discount", compute);
  cachedLookup(cache, "discount", compute);

  assert.equal(calls, 1);
});
