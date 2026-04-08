import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute
const AUTH_RATE_LIMIT_MAX_REQUESTS = 5; // 5 auth attempts per minute

// CORS configuration
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://yourdomain.com", // Add your production domain
];

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]?.trim() || "unknown"
    : request.headers.get("x-real-ip") || "unknown";
  const path = request.nextUrl.pathname;
  return `${ip}:${path}`;
}

function isRateLimited(request: NextRequest): boolean {
  const key = getRateLimitKey(request);
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    const isAuthEndpoint = request.nextUrl.pathname.startsWith("/api/auth");
    const maxRequests = isAuthEndpoint
      ? AUTH_RATE_LIMIT_MAX_REQUESTS
      : RATE_LIMIT_MAX_REQUESTS;

    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

function handleCORS(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const origin = request.headers.get("origin");
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    const preflightResponse = new NextResponse(null, { status: 200 });

    if (isAllowedOrigin) {
      preflightResponse.headers.set("Access-Control-Allow-Origin", origin);
    }

    preflightResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    preflightResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-csrf-token"
    );
    preflightResponse.headers.set("Access-Control-Allow-Credentials", "true");
    preflightResponse.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

    return preflightResponse;
  }

  // Handle actual requests
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

function setCacheHeaders(request: NextRequest, response: NextResponse): void {
  const path = request.nextUrl.pathname;

  // Static assets - long cache
  if (path.startsWith("/_next/") || path.includes(".")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    ); // 1 year
    return;
  }

  // API routes - no cache
  if (path.startsWith("/api/")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return;
  }

  // Auth pages - no cache
  if (path.startsWith("/auth/")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    return;
  }

  // Dashboard and app pages - short cache
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/org/") ||
    path.startsWith("/profile")
  ) {
    response.headers.set(
      "Cache-Control",
      "private, max-age=0, must-revalidate"
    );
    return;
  }

  // Public pages - moderate cache
  response.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400"); // 1 hour browser, 24 hours CDN
}

export function middleware(request: NextRequest) {
  // Rate limiting
  if (isRateLimited(request)) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": "60",
      },
    });
  }

  // Security headers
  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Note: HSTS is now set globally in next.config.js for better security

  // Set cache headers
  setCacheHeaders(request, response);

  // Handle CORS
  const corsResponse = handleCORS(request, response);

  return corsResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
