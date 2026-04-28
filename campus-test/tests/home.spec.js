const { test, expect } = require('@playwright/test');

test('CampusPulse homepage test', async ({ page }) => {
  await page.goto('https://campuspulse-bice.vercel.app/');

  await page.screenshot({
    path: 'homepage.png',
    fullPage: true
  });

  await expect(page).toHaveURL(/campuspulse-bice/);
});