import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import productData from '../../productData.json';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/cartPage';
let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;

test.describe('Login Test', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);      
    });

    test('Add Products from External File and Verify in Cart', async ({ page }) => {
        await loginPage.goto();
        await loginPage.login(productData.credentials.valid.username, productData.credentials.valid.password);
        await expect(page).toHaveTitle('Swag Labs');

        let addedPrice: string[] = [];
        for (const product of productData.products) {
            await inventoryPage.clickAddToCartButton(product.name);
            const price = await inventoryPage.getProductPrice(product.name);
            const finalPrice = price.substring(1);
            addedPrice.push(finalPrice);
        }
        await inventoryPage.clickCartButton();
        await page.waitForLoadState('networkidle');
        for (let i = 0; i < productData.products.length; i++) {
            const cartItemName = await cartPage.getCartItemName(i);
            const cartItemPrice = await cartPage.getCartItemPrice(i);
            expect(cartItemName).toBe(productData.products[i].name);
            expect(cartItemPrice).toBe(addedPrice[i]);
            expect(await cartPage.getCartItemCount()).toBe(productData.products.length);
        }
    });
});