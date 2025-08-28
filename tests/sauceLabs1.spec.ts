import { expect, test } from '@playwright/test';

test('Add Second Highest Price Product to Cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/');
  
  const usernameField = page.locator("//input[@data-test='username']");
  const passwordField = page.locator("//input[@data-test='password']");
  
  await usernameField.fill('standard_user');
  await passwordField.fill('secret_sauce');
  
  const loginButton = page.locator("//input[@id='login-button']");
  await loginButton.click();
  await page.waitForLoadState('networkidle');

  // Get all product prices and names dynamically
  const productElements = page.locator("//div[@class='inventory_item']");
  const productCount = await productElements.count();
  
  const products: Array<{name: string | null, price: number, index: number}> = [];
  for (let i = 0; i < productCount; i++) {
    const productElement = productElements.nth(i);
    const productName = await productElement.locator("//div[@class='inventory_item_name']").textContent();
    const priceText = await productElement.locator("//div[@class='inventory_item_price']").textContent();
    const price = parseFloat(priceText?.replace('$', '') || '0');
    
    products.push({
      name: productName,
      price: price,
      index: i
    });
  }
  
  // Sort products by price in descending order
  products.sort((a, b) => b.price - a.price);
  
  // Get the second and third highest price products
  const secondHighestProduct = products[1];
  const thirdHighestProduct = products[2];
  console.log(`Second highest price product: ${secondHighestProduct.name} at $${secondHighestProduct.price}`);
  console.log(`Third highest price product: ${thirdHighestProduct.name} at $${thirdHighestProduct.price}`);
  
  // Add the second highest price product to cart
  const addToCartButton1 = page.locator(`//div[@class='inventory_item']`).nth(secondHighestProduct.index).locator("//div[@class='pricebar']/button[text()='ADD TO CART']");
  const removeButton1 = page.locator(`//div[@class='inventory_item']`).nth(secondHighestProduct.index).locator("//div[@class='pricebar']/button[text()='REMOVE']");
  
  await expect(addToCartButton1).toBeVisible();
  await addToCartButton1.click();
  await expect(removeButton1).toBeVisible();
  
  // Add the third highest price product to cart
  const addToCartButton2 = page.locator(`//div[@class='inventory_item']`).nth(thirdHighestProduct.index).locator("//div[@class='pricebar']/button[text()='ADD TO CART']");
  const removeButton2 = page.locator(`//div[@class='inventory_item']`).nth(thirdHighestProduct.index).locator("//div[@class='pricebar']/button[text()='REMOVE']");
  
  await expect(addToCartButton2).toBeVisible();
  await addToCartButton2.click();
  await expect(removeButton2).toBeVisible();
  
  const cartButton = page.locator("//div[@id='shopping_cart_container']");
  await cartButton.click();
  await page.waitForLoadState('networkidle');
  
  const cartItems = page.locator("//div[@class='cart_item']");
  const cartItemCount = await cartItems.count();
  
  // Verify two items are in cart
  expect(cartItemCount).toBe(2);
  
  // Verify both products are in cart
  const cartItemNames = await cartItems.locator("//div[@class='inventory_item_name']").allTextContents();
  const cartItemPrices = await cartItems.locator("//div[@class='inventory_item_price']").allTextContents();
  
  expect(cartItemNames).toContain(secondHighestProduct.name);
  expect(cartItemNames).toContain(thirdHighestProduct.name);
  expect(cartItemPrices).toContain(secondHighestProduct.price.toString());
  expect(cartItemPrices).toContain(thirdHighestProduct.price.toString());
  
  await page.waitForTimeout(2000);
  await page.close();
});