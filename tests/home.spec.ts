import { test, expect } from '@playwright/test';
import { u } from 'framer-motion/client';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Asmlingo/);
});

test('has lessons', async ({ page }) => {
  await page.goto('/');

  // Click the get started link.
  const unit1 = await page.getByText("Unit 1: Data Transfer Instructions");
  await expect(unit1).toBeVisible();

  const lesson1 = await page.getByText(/^Copying values between registers$/);
  await expect(lesson1).toBeVisible();
});

test('execute lesson', async ({ page }) => {
  await page.goto('/');

  // Click the get started link.
  const lesson1 = await page.getByRole("button", { name: /^Copying values between registers$/ });
  await lesson1.click();

  // Check if the lesson is loaded.
  await expect(page).toHaveURL("/lesson/1");
  const challenteCommand = await page.getByText("Fill the gap:");
  await expect(challenteCommand).toBeVisible();

  const correctChoice = await page.getByRole("radio", { name: "r11" });
  await correctChoice.click();

  const verifyButton = await page.getByRole("button", { name: "Verify" });
  await verifyButton.click();

  // TODO: Use accessible status role
  const status = await page.getByText("Amazing!");
  await expect(status).toBeVisible();

  const nextButton = await page.getByRole("button", { name: "Continue" });
  await nextButton.click();

  await page.waitForTimeout(1000);

  const status2 = await page.getByText("Amazing!");
  await expect(status2).not.toBeVisible();

  const wrongChoice = await page.getByRole("radio", { name: "r10" });
  await wrongChoice.click();

  const verifyButton2 = await page.getByRole("button", { name: "Verify" });
  await verifyButton2.click();

  // TODO: Use accessible status role
  const status3 = await page.getByText("Oops!");
  await expect(status3).toBeVisible();
});
