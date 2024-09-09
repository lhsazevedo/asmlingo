import { test, expect, Page } from "@playwright/test";

test("should have title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Asmlingo/);
});

test("should list lessons", async ({ page }) => {
  await page.goto("/");

  const unit1 = await page.getByText("Unit 1: Basic register copy instructions");
  await expect(unit1).toBeVisible();

  const lesson1 = await page.getByText(/^Copying values between registers$/);
  await expect(lesson1).toBeVisible();
});

test("should disable locked lesson", async ({ page }) => {
  await page.goto("/");

  const lesson2 = await page.getByRole("button", { name: "Copying constant values to registers" });
  await expect(lesson2).toBeDefined();
  await expect(lesson2).toBeDisabled();

  await expect(page).toHaveURL("/");
  await expect(page).not.toHaveURL("/lesson/2");
});

const expectCorrectChoice = async (page: Page, choice: string) => {
  await page.getByText("Fill the gap:");
  await page.waitForTimeout(500);

  const correctChoice = await page.getByRole("radio", { name: choice });
  await correctChoice.click();

  const verifyButton = await page.getByRole("button", { name: "Verify" });
  await verifyButton.click();

  // TODO: Use accessible status role
  const status = await page.getByText("Amazing!");
  await expect(status).toBeVisible();

  const nextButton = await page.getByRole("button", { name: "Continue" });
  await nextButton.click();
}

const expectWrongChoice = async (page: Page, choice: string) => {
  await page.getByText("Fill the gap:");
  await page.waitForTimeout(500);

  const correctChoice = await page.getByRole("radio", { name: choice });
  await correctChoice.click();

  const verifyButton = await page.getByRole("button", { name: "Verify" });
  await verifyButton.click();

  // TODO: Use accessible status role
  const status = await page.getByText("Oops!");
  await expect(status).toBeVisible();

  const nextButton = await page.getByRole("button", { name: "Continue" });
  await nextButton.click();
}

test("should play entire lesson", async ({ page }) => {
  await page.goto("/");

  // Click the get started link.
  const lesson1 = await page.getByRole("button", {
    name: /^Copying values between registers$/,
  });
  await lesson1.click();

  // Check if the lesson is loaded.
  await expect(page).toHaveURL("/lesson/1");
  const challenteCommand = await page.getByText("Fill the gap:");
  await expect(challenteCommand).toBeVisible();

  await expectCorrectChoice(page, "r11");
  await expectCorrectChoice(page, "r11");
  await expectCorrectChoice(page, "mov");
  await expectCorrectChoice(page, "r8");
  await expectCorrectChoice(page, "r4");
  await expectCorrectChoice(page, "mov");
  await expectCorrectChoice(page, "r1");
  await expectCorrectChoice(page, "r11");
  await expectCorrectChoice(page, "r15");
  await expectCorrectChoice(page, "r15");

  // Navigate back to the home page.
  await expect(page).toHaveURL("/");
});

test("should review missed questions", async ({ page }) => {
  await page.goto("/");

  // Click the get started link.
  const lesson1 = await page.getByRole("button", {
    name: /^Copying values between registers$/,
  });
  await lesson1.click();

  // Check if the lesson is loaded.
  await expect(page).toHaveURL("/lesson/1");
  const challenteCommand = await page.getByText("Fill the gap:");
  await expect(challenteCommand).toBeVisible();

  await expectCorrectChoice(page, "r11");
  await expectWrongChoice(page, "r13");
  await expectCorrectChoice(page, "mov");
  await expectWrongChoice(page, "r15");
  await expectCorrectChoice(page, "r4");
  await expectWrongChoice(page, "bra");
  await expectCorrectChoice(page, "r1");
  await expectWrongChoice(page, "r2");
  await expectCorrectChoice(page, "r15");
  await expectWrongChoice(page, "vbr");

  // Review missed questions.
  await expectCorrectChoice(page, "r11");
  await expectCorrectChoice(page, "r8");
  await expectCorrectChoice(page, "mov");
  await expectCorrectChoice(page, "r11");
  await expectCorrectChoice(page, "r15");

  // Navigate back to the home page.
  await expect(page).toHaveURL("/");
});
