import assert from "node:assert/strict";
import { getAuthRenderState } from "./authState.ts";

assert.equal(
  getAuthRenderState({
    dashboardLoading: true,
    initializing: true,
    isLogin: false,
    checkLogin: false,
  }),
  "loading"
);

assert.equal(
  getAuthRenderState({
    dashboardLoading: false,
    initializing: true,
    isLogin: false,
    checkLogin: false,
  }),
  "outlet"
);

assert.equal(
  getAuthRenderState({
    dashboardLoading: false,
    initializing: true,
    isLogin: false,
    checkLogin: true,
  }),
  "loading"
);

assert.equal(
  getAuthRenderState({
    dashboardLoading: false,
    initializing: false,
    isLogin: false,
    checkLogin: true,
  }),
  "login"
);

assert.equal(
  getAuthRenderState({
    dashboardLoading: false,
    initializing: false,
    isLogin: true,
    checkLogin: true,
  }),
  "outlet"
);

assert.equal(
  getAuthRenderState({
    dashboardLoading: false,
    initializing: true,
    isLogin: false,
  }),
  "outlet"
);

console.log("auth render state tests passed");
