import type { ContentTranslationMap } from "../types";

export const authSecurityEn: ContentTranslationMap = {
  "auth-authn-vs-authz": {
    title: "Authentication vs Authorization",
    shortExplanation:
      "Authentication answers 'who are you?', authorization answers 'what are you allowed to do?'.",
    detailedExplanation:
      "Authentication is the process of verifying a user's identity: login/password, OAuth, magic link, biometrics. The result of authentication is a confirmed identity (usually as a token or session). Authorization happens after authentication and decides which actions and resources are available to that specific user (roles, permissions, resource ownership). Confusing the two often leads to security bugs: for example, checking only 'is the user logged in' but not whether they're allowed to perform that specific action.",
    pitfalls: [
      "Checking access rights only on the frontend (hiding a button) with no backend check.",
      "Confusing the user's role with ownership of a specific resource — these are different checks.",
    ],
    practiceTask:
      "Describe (in pseudocode or real code) middleware that first checks authentication (a valid token), then separately checks authorization (admin role) for access to /admin.",
  },
  "auth-jwt-vs-session": {
    title: "JWT vs Session",
    shortExplanation:
      "Session-based auth stores session state on the server and only gives the client a session id; JWT stores all the user's data right inside a signed token, requiring no server-side storage.",
    detailedExplanation:
      "With the session-based approach, after login the server creates a record in a session store (usually Redis/a DB) and gives the client a session id (typically in a cookie). On every request, the server looks up the session by that id. With the JWT approach, the server issues the client a signed token that itself contains the needed data (userId, role, expiry) — the server can verify its signature without hitting the DB, but revoking a JWT before it expires is harder than deleting a session record.",
    pitfalls: [
      "Storing too much or sensitive data in a JWT — the token is easily decoded (it's signed, not encrypted).",
      "Making a JWT with a very long lifetime with no revocation mechanism.",
    ],
    practiceTask:
      "Decode (without the secret key) any real JWT on jwt.io and see what data sits in the payload in plain text.",
  },
  "auth-access-refresh-token": {
    title: "Access Token / Refresh Token",
    shortExplanation:
      "An access token is a short-lived token for accessing the API; a refresh token is a long-lived token used only to obtain a new access token.",
    detailedExplanation:
      "The two-token scheme resolves the conflict between security and convenience: a short access-token lifetime (minutes) reduces the damage if it leaks, while a refresh token (days/weeks), stored more securely (an HttpOnly cookie) and used less often, avoids forcing the user to log in again every few minutes. When the access token expires, the client calls a dedicated endpoint with the refresh token and gets a new pair of tokens.",
    pitfalls: [
      "Storing the refresh token in localStorage — it becomes readable via XSS.",
      "Not implementing refresh token revocation (e.g. on logout or suspicious activity).",
    ],
    practiceTask:
      "Describe (in pseudocode) a client-side interceptor that, on getting a 401 from the API, automatically tries to refresh the access token via the refresh token and retries the original request once.",
  },
  "auth-httponly-cookies": {
    title: "HttpOnly Cookies",
    shortExplanation:
      "An HttpOnly cookie is a cookie that's inaccessible from JavaScript (document.cookie), protecting it from theft via XSS attacks.",
    detailedExplanation:
      "Regular cookies and localStorage data are accessible to any JS code running on the page — if the site has an XSS vulnerability (injecting someone else's script), an attacker can read the token and send it to themselves. The HttpOnly flag stops the browser from giving JavaScript access to that cookie — it's only visible in HTTP headers on requests to the server. Combined with the Secure flag (HTTPS only) and SameSite (CSRF protection), this is one of the basic ways to protect authentication tokens.",
    pitfalls: [
      "Treating HttpOnly cookies as full protection against everything — they don't protect against CSRF without an additional SameSite/CSRF token.",
      "Storing tokens that should be protected in localStorage 'just for convenient client-side reading'.",
    ],
    practiceTask:
      "Set up a simple Express/Next.js login endpoint that sets refreshToken as an HttpOnly, Secure, SameSite=Strict cookie, and verify in DevTools that document.cookie doesn't show it.",
  },
  "auth-xss-csrf-cors": {
    title: "XSS / CSRF / CORS",
    shortExplanation:
      "XSS is injecting someone else's JS code into a page; CSRF is performing an unwanted action on behalf of a logged-in user; CORS is a browser mechanism restricting which sites can make requests to your API.",
    detailedExplanation:
      "XSS (Cross-Site Scripting) happens when an app inserts unvalidated user input into the DOM as executable code — an attacker can run their own JS in your site's context. CSRF (Cross-Site Request Forgery) exploits the fact that the browser automatically attaches cookies to requests — a malicious site makes the victim's browser send a request to your API using their active session. CORS isn't a vulnerability but a browser protection mechanism: it stops JS code on one origin from reading responses from an API on another origin unless the server explicitly allows it via headers.",
    pitfalls: [
      "Assuming CORS configuration equals API protection — it isn't; separate server-side auth checks are needed.",
      "Inserting user content via dangerouslySetInnerHTML/innerHTML without sanitization.",
    ],
    practiceTask:
      "Find every place in your (or a training) project where user input is inserted directly into the DOM, and check whether it's sanitized (e.g. via DOMPurify).",
  },
  "auth-localstorage-risks": {
    title: "localStorage: Risks of Storing Tokens",
    shortExplanation:
      "localStorage is fully accessible from any JavaScript code running on the page — including code injected via an XSS vulnerability — so storing access/refresh tokens there makes stealing them trivial for any successful XSS attack.",
    detailedExplanation:
      "Unlike an HttpOnly cookie, which JavaScript fundamentally can't read (document.cookie won't show it), localStorage.getItem('token') is accessible to absolutely any script on the page — legitimate app code, a vulnerable third-party npm package, or a malicious script accidentally injected via XSS. This isn't a theoretical risk: if the app has even one XSS vulnerability anywhere (an unescaped user comment, a vulnerable npm package generating innerHTML from unvalidated data), an attacker gets the token with one line of code and can fully act as the user, sending requests with that token from anywhere, unconstrained by the browser's same-origin policy (unlike a cookie, which the browser only attaches to requests to the matching domain). That's exactly why the common recommendation is to not store sensitive tokens in localStorage at all, and instead use an HttpOnly cookie (unreadable via JS) combined with CSRF protection (e.g. SameSite=Strict/Lax and/or a CSRF token), or keep the access token only in application memory (a JS variable that disappears on page reload) and rely on an HttpOnly refresh-token cookie to restore the session after reload.",
    whereUsed:
      "The decision of where to store access/refresh tokens is made at the start of any project with authentication — especially critical for fintech, healthcare, and other apps with highly sensitive user data.",
    pitfalls: [
      "Storing access/refresh tokens in localStorage 'because it's simpler with fetch/axios' without assessing the project's real XSS risk.",
      "Relying only on an HttpOnly cookie and forgetting separate CSRF protection (SameSite/CSRF token) — these are different threats requiring different measures.",
    ],
  },
  "auth-csp": {
    title: "Content Security Policy (CSP)",
    shortExplanation:
      "CSP is an HTTP header where the server explicitly lists which sources the page is allowed to load scripts, styles, images, and other resources from — the browser blocks anything that doesn't match the policy, even if malicious code somehow ends up on the page.",
    detailedExplanation:
      "CSP works as 'defense in depth' — a second line of defense that limits the damage even if an XSS vulnerability does fire: for example, a script-src 'self' directive allows only scripts loaded from the same origin as the page itself, and blocks any inline script or script from an external domain that an attacker might inject. A strict policy without 'unsafe-inline' forces you to rewrite code relying on inline event handlers (onclick=\"...\" right in the HTML) or eval-like constructs — this inconvenience pays off because even a successful XSS injection (say, via unvalidated user input rendered into innerHTML) can't run its script if it violates the policy. connect-src restricts which domains the page is allowed to make network requests to (fetch/XHR/WebSocket) — further limiting where a script could 'exfiltrate' stolen data even if it did manage to run. CSP is configured via the Content-Security-Policy HTTP header (preferred) or a <meta> tag (less flexible, some directives don't work via meta).",
    whereUsed:
      "Public apps handling user content (comments, rich text), fintech, and any app with elevated security requirements needing a second line of defense beyond input sanitization.",
    pitfalls: [
      "Configuring CSP with 'unsafe-inline' and 'unsafe-eval' 'for convenience' — this negates most of the XSS protection CSP is meant to provide.",
      "Treating CSP as a replacement for sanitizing user input — it's an additional layer of defense, not a substitute for basic data-handling hygiene.",
    ],
  },
  "auth-clickjacking-open-redirect": {
    title: "Clickjacking & Open Redirect",
    shortExplanation:
      "Clickjacking is an attack where an attacker's site hides your site in an invisible iframe and tricks the user into clicking on it, believing they're interacting with something else; open redirect is a vulnerability where an app blindly redirects the user to a URL passed in a parameter, without verifying it's a trusted address.",
    detailedExplanation:
      "In clickjacking, an attacker embeds someone else's site (say, a bank app's 'Confirm transfer' page) in an invisible (opacity: 0) iframe on top of an enticing page of their own (a game, a contest), positioning the confirm button exactly where the user is likely to click on the visible layer — the user thinks they're clicking 'Play', but actually clicks an invisible 'Confirm' button on the other site, where they're already authenticated via cookie. The defense is the X-Frame-Options: DENY (or SAMEORIGIN) header, or the more flexible CSP frame-ancestors directive, which stop the browser from embedding the page in an iframe from a different origin at all. Open redirect happens when an app redirects to a URL from a query parameter without validation (e.g. /login?redirect=https://evil.com) — an attacker sends users a link that looks legitimate on the real app domain, the user trusts the domain in the address bar when navigating, enters their login on the genuine login page, and after a successful login is silently redirected to a phishing look-alike page, which now raises less suspicion after the 'real' domain appeared in the navigation history. The defense is to validate the redirect parameter against an allowlist of the app's own paths (relative paths within its own domain), rather than accepting an arbitrary external URL.",
    whereUsed:
      "X-Frame-Options/frame-ancestors — mandatory for any page with authentication forms or financial actions. Redirect-parameter validation — on any login/onboarding page with a 'return to where you came from' parameter.",
    pitfalls: [
      "Not setting X-Frame-Options/frame-ancestors on pages with sensitive actions (payment confirmation, password change) — leaves them vulnerable to clickjacking.",
      "Accepting the redirect parameter as an absolute external URL with no allowlist — a classic vector for phishing via a 'trusted' app domain.",
    ],
  },
};
