import { expect, test } from '@playwright/test';

test.only('Add Second Highest Price Product to Cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/v1/');
  
  const usernameField = page.locator("//input[@data-test='username']");
  const passwordField = page.locator("//input[@data-test='password']");
  
  await usernameField.fill('standard_user');
  await passwordField.fill('secret_sauce');
  
  const loginButton = page.locator("//input[@id='login-button']");
  await loginButton.click();
  await page.waitForLoadState('networkidle');

  const ProductItems = page.locator('//*[@class="inventory_item"]')
  const productCounts = await page.locator('//*[@class="inventory_item"]').count();

  const products: Array<{name: string | null, price: number, index: number }> = [];

  for (let i = 0; i < productCounts; i++) {
    const ProductItem = ProductItems.nth(i)
    const pricesWithSign = await ProductItem.locator('//*[@class="inventory_item_price"]').textContent()
    
    const price = parseFloat(pricesWithSign!.replace('$',''))

    products.push({name: null, price: price, index: i})
}
console.log(`before sorting product price is ${products}`);
products.sort((a,b)=>b.price - a.price)
console.log(`after sorting product price is ${products}`);


const secondHighestPrice = products[1].price
const thirdHighestPrice = products[2].price

console.log(`thirdHighestPrice ${secondHighestPrice}`);
console.log(`thirdHighestPrice ${thirdHighestPrice}`);


const addToCartButton1 = page.locator(`//*[@class = 'inventory_item_price' and contains(.,'${secondHighestPrice}')]/following-sibling::button`).first()
const addToCartButton2 = page.locator(`//*[@class = 'inventory_item_price' and contains(.,'${thirdHighestPrice}')]/following-sibling::button`).first()

await addToCartButton1.click()
await addToCartButton2.click()


const cartButton = page.locator("//div[@id='shopping_cart_container']");
await cartButton.click();
await page.waitForLoadState('networkidle');

await page.waitForTimeout(5000)
  
  await page.close();
});