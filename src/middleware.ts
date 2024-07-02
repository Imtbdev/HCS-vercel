import { auth } from "@/auth";
import { ROUTE_LINKS } from "@/consts/main.consts";
import {
  ADMIN_ROUTE_START,
  API_AUTH_PREFIX,
  authRoutes,
  CALLBACK_URL_KEY,
  DEFAULT_LOGIN_REDIRECT,
  PRIVATE_ROUTE_START,
} from "@/consts/routes.consts";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApproved = !!req.auth?.user.userInfo.active;
  const isAdmin = isLoggedIn && !!req.auth?.user.userInfo.isAdmin;

  const { pathname } = nextUrl;

  const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
  const isAuthRoute = authRoutes.includes(pathname);
  const isPrivateRoute = pathname.startsWith(PRIVATE_ROUTE_START);
  const isAdminRoute = pathname.startsWith(ADMIN_ROUTE_START);

  if (isApiAuthRoute) {
    return;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (!isApproved) {
        return Response.redirect(new URL(ROUTE_LINKS.not_approved, nextUrl));
      }
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  if (isPrivateRoute && !isLoggedIn) {
    const { searchParams, pathname: pathnameRedirect } = nextUrl;

    // start create redirect url
    const callbackUrl = searchParams.get(CALLBACK_URL_KEY);
    let callbackUrlRes: string | null = null;
    if (callbackUrl) {
      callbackUrlRes = callbackUrl;
    } else if (pathnameRedirect) {
      callbackUrlRes = pathnameRedirect;
    }

    const newUrl = new URL(ROUTE_LINKS.auth.login, nextUrl.href);
    if (callbackUrlRes) {
      newUrl.searchParams.set(CALLBACK_URL_KEY, callbackUrlRes);
    }
    // end create redirect url

    return Response.redirect(newUrl);
  }

  if (isPrivateRoute && isLoggedIn && !isApproved) {
    return Response.redirect(new URL(ROUTE_LINKS.not_approved, nextUrl));
  }

  if (isAdminRoute) {
    if (!isAdmin) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    } else if (!isApproved) {
      return Response.redirect(new URL(ROUTE_LINKS.not_approved, nextUrl));
    }
  }

  if (pathname === "/auth") {
    return Response.redirect(new URL(ROUTE_LINKS.auth.login, nextUrl));
  }
  // return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
