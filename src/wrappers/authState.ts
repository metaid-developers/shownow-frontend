export type AuthRenderState = "loading" | "outlet" | "login";

type AuthStateInput = {
  dashboardLoading: boolean;
  initializing: boolean;
  isLogin: boolean;
  checkLogin?: boolean;
};

export const getAuthRenderState = ({
  dashboardLoading,
  initializing,
  isLogin,
  checkLogin,
}: AuthStateInput): AuthRenderState => {
  if (dashboardLoading) return "loading";
  if (!checkLogin) return "outlet";
  if (initializing) return "loading";
  return isLogin ? "outlet" : "login";
};
