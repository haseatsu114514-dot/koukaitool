export const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
/** Public origin + base path (e.g. https://user.github.io/koukaitool/) for absolute OG URLs. Set NEXT_PUBLIC_SITE_URL in production builds. */
export const siteUrl = new URL(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${assetPath("/")}`);
