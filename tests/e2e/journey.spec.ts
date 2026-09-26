import { test, expect } from "@playwright/test";
test("birthday validation → result → share image → catalog", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("./");
  await page.getByRole("button", { name: "診断する", exact: true }).click(); await expect(page.locator(".form-error")).toContainText("すべて入力");
  await page.getByLabel("年", { exact: true }).fill("2001"); await page.getByRole("combobox", { name: "月", exact: true }).selectOption("2"); await page.getByRole("combobox", { name: "日", exact: true }).selectOption("29");
  await page.getByRole("button", { name: "診断する", exact: true }).click(); await expect(page.locator(".form-error")).toContainText("この月にはない");
  await page.getByLabel("年", { exact: true }).fill("2000"); await page.getByRole("combobox", { name: "月", exact: true }).selectOption("1"); await page.getByRole("combobox", { name: "日", exact: true }).selectOption("7");
  await page.getByRole("button", { name: "診断する", exact: true }).click();
  await expect(page.locator(".book-reveal")).toBeVisible(); await expect(page.locator(".book-reveal")).toBeHidden({ timeout: 8000 });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ほめ待ちグリズリー");
  await expect(page.getByRole("heading", { name: "あなたのアイテム", exact: true })).toBeVisible(); await expect(page.getByRole("heading", { name: "スケジュール帳", exact: true })).toBeVisible(); await expect(page.getByText("先を見越して、しっかり計画できる")).toBeVisible();
  await expect(page.getByText("アイテムは10通り", { exact: false })).toBeVisible();
  // The official LINE invitation appears twice after a diagnosis (URL comes from NEXT_PUBLIC_LINE_URL in playwright.config).
  await expect(page.getByRole("link", { name: "LINEで友だち追加" })).toHaveCount(2); await expect(page.getByRole("link", { name: "LINEで友だち追加" }).first()).toHaveAttribute("href", "https://lin.ee/e2e-example");
  await expect(page.getByText("グループ", { exact: false }).first()).toBeVisible(); await expect(page.getByText("エレメント", { exact: false })).toHaveCount(0);
  expect(page.url()).not.toContain("2000"); expect(await page.evaluate(() => JSON.stringify(sessionStorage))).not.toContain("2000");
  await page.reload(); await expect(page.getByRole("heading", { level: 1 })).toHaveText("ほめ待ちグリズリー");
  const download = page.waitForEvent("download"); await page.getByRole("button", { name: "結果画像を保存" }).first().click(); expect((await download).suggestedFilename()).toBe("stella-file-grizzly.png");
  await expect(page.getByRole("heading", { name: "結果をシェアしよう" })).toBeVisible();
  await page.getByRole("link", { name: "ほかのタイプも見る" }).click(); await expect(page.locator(".type-card")).toHaveCount(10);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test("direct result access and all ten permanent profile routes", async ({ page }) => {
  await page.goto("./result/"); await expect(page.getByRole("link", { name: "診断をはじめる" })).toBeVisible();
  await page.goto("./types/"); const links = await page.locator(".type-card").evaluateAll(nodes => nodes.map(n => (n as HTMLAnchorElement).href));
  for (const href of links) {
    await page.goto(href); await expect(page.locator("h1")).not.toBeEmpty();
    expect(await page.locator(".profile-art img").evaluate(img => (img as HTMLImageElement).naturalWidth)).toBe(320);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
test("a shared type page leads visitors to their own diagnosis", async ({ page }) => {
  await page.goto("./types/fox/");
  // Public page: no "your result" wording, a diagnosis CTA near the top, and a per-type OG card.
  await expect(page.getByRole("button", { name: "結果画像を保存" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "あなたのアイテム" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "LINEで友だち追加" })).toHaveCount(0);
  await expect(page.locator(".profile-cta").getByRole("link", { name: "生年月日で診断する" })).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\/fox\.jpg$/);
  await page.locator(".profile-cta").getByRole("link", { name: "生年月日で診断する" }).click();
  await expect(page.getByLabel("年", { exact: true })).toBeVisible();
});
