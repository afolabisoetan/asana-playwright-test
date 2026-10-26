import { test, expect } from '@playwright/test';
import testData from '../test-data.json'; // inputs the JSON which contains all 6 taskcards 

test('Verify all 6 Asana tasks in a single session', async ({ page }) => {
 // logs in only once at the start 
  await page.goto('https://create-asana-like-pr-39y5.bolt.host/'); // moves to webpage
  await page.locator('input[type="text"], input[name="username"]').fill('admin'); // locates and fills the input (textbox) for username
  await page.locator('input[type="password"], input[name="password"]').fill('password123'); // locates and fills the input (textbox) for passwords
  await page.click('button[type="submit"], button:has-text("Sign In")'); // clicks the sign in button (which is of type submit)

  // loop through all 6 test cases (defined in the JSON)
  for (const data of testData) {
    await page.getByRole('button', { name: data.project }).click(); // navigates to the correct page (ensures it only looks for buttons with that name instead of text)

    // verify the taskcard's visibility
    const taskCard = page.locator(`h3:has-text("${data.taskName}")`); // taskcard variable now contains the card's title (the text with the taskName)
    await expect(taskCard).toBeVisible(); // checks if visible

    // verify tags on said taskcard 
    for (const tag of data.tags) {
      await expect(taskCard.locator('xpath=..').locator(`span:has-text("${tag}")`)).toBeVisible(); // checks if the tags are visible (note: 'xpath=...' moves to parent container of the taskcard instead of just the text, which allows for the subsequent .locator('text=${tag}') so that the tag specifically can be checked)
    }
  }
});