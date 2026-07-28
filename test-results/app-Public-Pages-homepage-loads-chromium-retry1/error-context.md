# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Public Pages >> homepage loads
- Location: tests\e2e\app.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Public Pages", () => {
  4  |   test("homepage loads", async ({ page }) => {
> 5  |     await page.goto("/");
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  6  |     await expect(page).toHaveURL("/");
  7  |   });
  8  | 
  9  |   test("login page loads", async ({ page }) => {
  10 |     await page.goto("/login");
  11 |     await expect(page).toHaveURL(/login/);
  12 |     await expect(page.getByRole("heading", { name: "LOGIN" })).toBeVisible();
  13 |     await expect(page.getByText("Enter your email and password")).toBeVisible();
  14 |     await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
  15 |     await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
  16 |   });
  17 | 
  18 |   test("login page has forgot password and sign up links", async ({ page }) => {
  19 |     await page.goto("/login");
  20 |     await expect(page.getByText("Forgot Password?")).toBeVisible();
  21 |     await expect(page.getByText("Sign Up")).toBeVisible();
  22 |   });
  23 | 
  24 |   test("register page loads", async ({ page }) => {
  25 |     await page.goto("/register");
  26 |     await expect(page).toHaveURL(/register/);
  27 |   });
  28 | 
  29 |   test("forgot password page loads", async ({ page }) => {
  30 |     await page.goto("/forgot-password");
  31 |     await expect(page).toHaveURL(/forgot-password/);
  32 |   });
  33 | });
  34 | 
  35 | test.describe("Protected Pages Redirect", () => {
  36 |   test("venues page redirects to login when unauthenticated", async ({ page }) => {
  37 |     await page.goto("/users/venues");
  38 |     await expect(page).toHaveURL(/login/);
  39 |   });
  40 | 
  41 |   test("booking page redirects to login when unauthenticated", async ({ page }) => {
  42 |     await page.goto("/users/booking");
  43 |     await expect(page).toHaveURL(/login/);
  44 |   });
  45 | 
  46 |   test("dashboard page redirects to login when unauthenticated", async ({ page }) => {
  47 |     await page.goto("/users/dashboard");
  48 |     await expect(page).toHaveURL(/login/);
  49 |   });
  50 | 
  51 |   test("profile page redirects to login when unauthenticated", async ({ page }) => {
  52 |     await page.goto("/users/profile");
  53 |     await expect(page).toHaveURL(/login/);
  54 |   });
  55 | 
  56 |   test("teams page redirects to login when unauthenticated", async ({ page }) => {
  57 |     await page.goto("/users/teams");
  58 |     await expect(page).toHaveURL(/login/);
  59 |   });
  60 | 
  61 |   test("my-teams page redirects to login when unauthenticated", async ({ page }) => {
  62 |     await page.goto("/users/my-teams");
  63 |     await expect(page).toHaveURL(/login/);
  64 |   });
  65 | 
  66 |   test("owner dashboard redirects to login when unauthenticated", async ({ page }) => {
  67 |     await page.goto("/owner");
  68 |     await expect(page).toHaveURL(/login/);
  69 |   });
  70 | 
  71 |   test("admin page redirects to login when unauthenticated", async ({ page }) => {
  72 |     await page.goto("/admin");
  73 |     await expect(page).toHaveURL(/login/);
  74 |   });
  75 | });
  76 | 
```