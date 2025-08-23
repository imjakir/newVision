import { expect, test } from '@playwright/test';
import productData from '../productData.json';

test('Add Products from External File and Verify in Cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/');
  
  const usernameField = page.locator("//input[@data-test='username']");
  const passwordField = page.locator("//input[@data-test='password']");
  
  await usernameField.fill(productData.credentials.valid.username);
  await passwordField.fill(productData.credentials.valid.password);
  
  const loginButton = page.locator("//input[@id='login-button']");
  await loginButton.click();
  await page.waitForLoadState('networkidle');

  let addedPrice: string[] = [];
  for (const product of productData.products) {
    const addToCartButton = page.locator(`//div[text()='${product.name}']/ancestor::div[contains(@class, 'inventory_item')]//div[@class='pricebar']/button[text()='ADD TO CART']`);
    const removeButton = page.locator(`//div[text()='${product.name}']/ancestor::div[contains(@class, 'inventory_item')]//div[@class='pricebar']/button[text()='REMOVE']`);
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    await expect(removeButton).toBeVisible();
    const priceTextWithDollarSign = await page.locator(`//div[contains(text(), '${product.name}')]/ancestor::div[@class='inventory_item']/div[@class='pricebar']/div[@class='inventory_item_price']`).innerText();
    const finalPrice = priceTextWithDollarSign.substring(1);
    addedPrice.push(finalPrice);
  }
  
  const cartButton = page.locator("//div[@id='shopping_cart_container']");
  await cartButton.click();
  await page.waitForLoadState('networkidle');
  
  const cartItems = page.locator("//div[@class='cart_item']");
  const cartItemCount = await cartItems.count();
  
  expect(cartItemCount).toBe(productData.products.length);
  
  for (let i = 0; i < productData.products.length; i++) {
    const cartItemName = await cartItems.nth(i).locator("//div[@class='inventory_item_name']").textContent();
    expect(cartItemName).toBe(productData.products[i].name);
    const cartItemPrice = await cartItems.nth(i).locator("//div[@class='inventory_item_price']").textContent();
    expect(cartItemPrice).toBe(addedPrice[i]);
  }
  await page.waitForTimeout(2000);
  await page.close();
});