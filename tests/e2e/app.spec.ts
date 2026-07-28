import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/login/);
    await expect(page.getByRole("heading", { name: "LOGIN" })).toBeVisible();
    await expect(page.getByText("Enter your email and password")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
  });

  test("login page has forgot password and sign up links", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Forgot Password?")).toBeVisible();
    await expect(page.getByText("Sign Up")).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveURL(/register/);
  });

  test("forgot password page loads", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page).toHaveURL(/forgot-password/);
  });
});

test.describe("Protected Pages Redirect", () => {
  test("venues page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/users/venues");
    await expect(page).toHaveURL(/login/);
  });

  test("booking page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/users/booking");
    await expect(page).toHaveURL(/login/);
  });

  test("dashboard page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/users/dashboard");
    await expect(page).toHaveURL(/login/);
  });

  test("profile page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/users/profile");
    await expect(page).toHaveURL(/login/);
  });

  test("teams page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/users/teams");
    await expect(page).toHaveURL(/login/);
  });

  test("my-teams page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/users/my-teams");
    await expect(page).toHaveURL(/login/);
  });

  test("owner dashboard redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/owner");
    await expect(page).toHaveURL(/login/);
  });

  test("admin page redirects to login when unauthenticated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/login/);
  });
});
