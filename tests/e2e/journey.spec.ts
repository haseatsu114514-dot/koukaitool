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
  await expect(page.getByText("あなたのアイテム", { exact: true })).toBeVisible(); await expect(page.getByRole("heading", { name: "貯金箱", exact: true })).toBeVisible(); await expect(page.getByText("コツコツ積み上げられる")).toBeVisible();
  expect(page.url()).not.toContain("2000"); expect(await page.evaluate(() => JSON.stringify(sessionStorage))).not.toContain("2000");
  await page.reload(); await expect(page.getByRole("heading", { level: 1 })).toHaveText("ほめ待ちグリズリー");
  const download = page.waitForEvent("download"); await page.getByRole("button", { name: "結果画像を保存" }).click(); expect((await download).suggestedFilename()).toBe("stella-file-grizzly.png");
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
