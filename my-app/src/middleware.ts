export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/dashboard(.*)",
    "/admin/attendance(.*)",
    "/admin/site-setting(.*)",
  ],
};
