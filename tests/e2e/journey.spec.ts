import { test, expect } from "@playwright/test";
test("birthday validation → result → share image → catalog", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("./");
  // Home: the form first, then all ten types with one あるある each.
  await expect(page.locator(".type-card")).toHaveCount(10); await expect(page.locator(".type-card-aruaru").first()).toBeVisible();
  await page.getByRole("button", { name: "診断する", exact: true }).click(); await expect(page.locator(".form-error")).toContainText("すべて入力");
  await page.getByLabel("年", { exact: true }).fill("2001"); await page.getByRole("combobox", { name: "月", exact: true }).selectOption("2"); await page.getByRole("combobox", { name: "日", exact: true }).selectOption("29");
  await page.getByRole("button", { name: "診断する", exact: true }).click(); await expect(page.locator(".form-error")).toContainText("この月にはない");
  await page.getByLabel("年", { exact: true }).fill("2000"); await page.getByRole("combobox", { name: "月", exact: true }).selectOption("1"); await page.getByRole("combobox", { name: "日", exact: true }).selectOption("7");
  await page.getByRole("button", { name: "診断する", exact: true }).click();
  await expect(page.locator(".book-reveal")).toBeVisible(); await expect(page.locator(".book-reveal")).toBeHidden({ timeout: 8000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ほめ待ちグリズリー");
  await expect(page.getByRole("heading", { name: "あなたのアイテム", exact: true })).toBeVisible(); await expect(page.getByRole("heading", { name: "スケジュール帳", exact: true })).toBeVisible(); await expect(page.getByText("先を見越して、しっかり計画できる")).toBeVisible();
  await expect(page.getByText("星から受け取ったギフト", { exact: false })).toBeVisible();
  // The item is not drawn over the character; a hint under the title points down to its chapter.
  await expect(page.locator(".profile-art a")).toHaveCount(0); await expect(page.locator(".item-hint")).toHaveAttribute("href", "#item");
  // The official LINE invitation sits once, below the explanation. Grizzly has its own URL in playwright.config (NEXT_PUBLIC_LINE_URLS); other types fall back to NEXT_PUBLIC_LINE_URL.
  await expect(page.getByRole("link", { name: "LINEで続きを読む" })).toHaveCount(1); await expect(page.getByRole("link", { name: "LINEで続きを読む" })).toHaveAttribute("href", "https://lin.ee/e2e-grizzly");
  // With LINE set up, 最高・いい are shown and そこそこ・天敵 wait on LINE.
  await expect(page.locator(".compat-best")).toContainText("ほっとけないアルパカ"); await expect(page.locator(".compat-lock")).toHaveCount(2); await expect(page.locator(".compat-foe")).not.toContainText("ドーベルマン");
  await expect(page.getByText("グループ", { exact: false }).first()).toBeVisible(); await expect(page.getByText("エレメント", { exact: false })).toHaveCount(0);
  expect(page.url()).not.toContain("2000"); expect(await page.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage))).not.toContain("2000");
  // Friend check: shows the friend's type and the pair, without replacing the visitor's own result.
  const friend = page.locator(".friend-check");
  await friend.getByLabel("年", { exact: true }).fill("1992"); await friend.getByRole("combobox", { name: "月", exact: true }).selectOption("8"); await friend.getByRole("combobox", { name: "日", exact: true }).selectOption("11");
  await friend.getByRole("button", { name: "相性を調べる" }).click();
  await expect(friend.locator(".friend-result")).toContainText("ほっとけないアルパカ"); await expect(friend.locator(".friend-result")).toContainText("最高の相性");
  await friend.getByRole("button", { name: "別の友だちを調べる" }).click();
  await friend.getByLabel("年", { exact: true }).fill("1992"); await friend.getByRole("combobox", { name: "月", exact: true }).selectOption("8"); await friend.getByRole("combobox", { name: "日", exact: true }).selectOption("12");
  await friend.getByRole("button", { name: "相性を調べる" }).click();
  await expect(friend.locator(".friend-result")).toContainText("正々堂々ドーベルマン"); await expect(friend.locator(".friend-lock")).toBeVisible();
  // The result is kept in this browser: it survives a reload and a fresh visit to マイファイル.
  await page.reload(); await expect(page.getByRole("heading", { level: 1 })).toHaveText("ほめ待ちグリズリー");
  await page.goto("./"); await page.goto("./result/"); await expect(page.getByRole("heading", { level: 1 })).toHaveText("ほめ待ちグリズリー");
  const download = page.waitForEvent("download"); await page.getByRole("button", { name: "画像を保存" }).first().click(); expect((await download).suggestedFilename()).toBe("stella-file-grizzly.png");
  await expect(page.getByRole("heading", { name: "結果をシェアしよう" })).toBeVisible();
  // "この結果を消す" removes it after confirmation.
  page.once("dialog", dialog => dialog.accept()); await page.getByRole("button", { name: "この結果を消す" }).click();
  await expect(page).toHaveURL(/\/$/); await page.goto("./result/"); await expect(page.getByRole("link", { name: "診断をはじめる" })).toBeVisible();
  await page.goto("./types/"); await expect(page.locator(".type-card")).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test("direct result access and all ten permanent profile routes", async ({ page }) => {
  await page.goto("./result/"); await expect(page.getByRole("link", { name: "診断をはじめる" })).toBeVisible();
  await page.goto("./types/"); const links = await page.locator(".type-card").evaluateAll(nodes => nodes.map(n => (n as HTMLAnchorElement).href));
  for (const href of links) {
    await page.goto(href); await expect(page.locator("h1")).not.toBeEmpty();
    const image = page.locator(".profile-art img");
    await expect(image).toHaveAttribute("src", /\/characters\/[a-z]+-soft\.webp$/);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
    const size = await image.evaluate(img => ({ width: (img as HTMLImageElement).naturalWidth, height: (img as HTMLImageElement).naturalHeight }));
    expect(size.height).toBe(size.width);
    await expect(image).toHaveAttribute("width", String(size.width)); await expect(image).toHaveAttribute("height", String(size.height));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
test("a shared type page leads visitors to their own diagnosis", async ({ page }) => {
  await page.goto("./types/fox/");
  // Public page: no "your result" wording, a diagnosis CTA near the top, and a per-type OG card.
  await expect(page.getByRole("button", { name: "画像を保存" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "あなたのアイテム" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "LINEで続きを読む" })).toHaveCount(0);
  await expect(page.locator(".compat-lock")).toHaveCount(2); await expect(page.getByText("自分のタイプなら診断後にLINEで見られます", { exact: false })).toHaveCount(1);
  await expect(page.locator(".profile-cta").getByRole("link", { name: "生年月日で診断する" })).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\/fox\.jpg$/);
  await page.locator(".profile-cta").getByRole("link", { name: "生年月日で診断する" }).click();
  await expect(page.getByLabel("年", { exact: true })).toBeVisible();
});
test("love page: intro → birth date → love result → official LINE", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("./love/");
  // A landing page with its own frame: no app header or tab bar, the form in the hero, all ten characters, its own OG card.
  await expect(page.locator(".site-header")).toHaveCount(0); await expect(page.locator(".tab-bar")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("恋の正解");
  await expect(page.locator(".lv-type")).toHaveCount(10);
  // The first page only leads to the diagnosis: no word of the official LINE, no Q&A.
  expect(await page.locator(".love").innerText()).not.toContain("LINE"); await expect(page.locator("details")).toHaveCount(0);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\/love\.jpg$/);
  await page.getByRole("button", { name: "恋愛運を診断する" }).click(); await expect(page.locator(".form-error")).toContainText("すべて入力");
  // Every other part leads back to the form: here, the closing call at the bottom.
  await page.locator(".lv-final .lv-cta").click(); await expect(page.getByRole("combobox", { name: "年", exact: true })).toBeInViewport();
  // The year is picked from a list too, newest first.
  await expect(page.getByRole("combobox", { name: "年", exact: true }).locator("option").nth(1)).toHaveText(`${new Date(Date.now() + 9 * 3600_000).getUTCFullYear()}年`);
  await page.getByRole("combobox", { name: "年", exact: true }).selectOption("2000"); await page.getByRole("combobox", { name: "月", exact: true }).selectOption("1"); await page.getByRole("combobox", { name: "日", exact: true }).selectOption("7");
  await page.getByRole("button", { name: "恋愛運を診断する" }).click();
  await expect(page.locator(".book-reveal")).toBeVisible(); await expect(page.locator(".book-reveal")).toBeHidden({ timeout: 8000 });
  // The result opens on the same page: キャラ, four tendencies, what works and the usual misstep, and the ギフト.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ほめ待ちグリズリー");
  await expect(page.locator(".lv-traits li")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "うまくいく法則", exact: true })).toBeVisible(); await expect(page.getByRole("heading", { name: "やりがちなNG", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "あなたのギフト", exact: true })).toBeVisible();
  // The gift is named as a talent; its object is only the motif.
  await expect(page.getByRole("heading", { name: "積み重ねる才能", exact: true })).toBeVisible(); await expect(page.locator(".lv-gift-motif")).toHaveText("モチーフ：レンガ");
  // All three compatibility levels are shown openly; a locked row after them points down to the invitation.
  // Every LINE button (the call in the middle, the invitation, the bar) uses the love page's own friend-add URL.
  await expect(page.locator(".is-best")).toContainText("ほっとけないアルパカ"); await expect(page.locator(".is-foe")).toContainText("正々堂々ドーベルマン"); await expect(page.locator(".is-foe")).toContainText("ひと工夫で深まる相性");
  await expect(page.locator(".is-locked")).toHaveAttribute("href", "#line");
  // Just above the button, who will read for her: the supervising fortune teller's record in plain text.
  await expect(page.locator(".lv-line .lv-reader")).toContainText("1,000件以上");
  await expect(page.locator(".lv-mid .lv-line-button")).toHaveAttribute("href", "https://lin.ee/e2e-love"); await expect(page.locator(".lv-line .lv-line-button")).toHaveAttribute("href", "https://lin.ee/e2e-love"); await expect(page.locator(".lv-bar .lv-line-button")).toHaveAttribute("href", "https://lin.ee/e2e-love");
  // Nothing is kept: no birth date in the URL, nothing in storage.
  expect(page.url()).not.toContain("2000"); expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  // No way out but LINE: every link is in-page, the LINE friend add, or the privacy page.
  const hrefs = await page.locator(".love a").evaluateAll(links => links.map(a => a.getAttribute("href") || ""));
  expect(hrefs.filter(href => !href.startsWith("#") && href !== "https://lin.ee/e2e-love" && !href.endsWith("/privacy/"))).toEqual([]);
  // The result ends at the invitation: no way back to the form.
  await expect(page.getByRole("button", { name: "生年月日を入れ直す" })).toHaveCount(0); await expect(page.locator("#diagnose")).toHaveCount(0);
  expect(errors).toEqual([]);
});
