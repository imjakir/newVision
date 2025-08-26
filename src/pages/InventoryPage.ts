import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly cartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartButton = page.locator("//div[@id='shopping_cart_container']");
    }

    async clickAddToCartButton(productName: string) {
        await this.page.locator(`//div[text()='${productName}']/ancestor::div[contains(@class, 'inventory_item')]//div[@class='pricebar']/button[text()='ADD TO CART']`).click();
    }

    async getProductPrice(productName: string) {
        return await this.page.locator(`//div[text()='${productName}']/ancestor::div[contains(@class, 'inventory_item')]//div[@class='pricebar']/div[@class='inventory_item_price']`).innerText();
    }

    async clickCartButton() {
        await this.cartButton.click();
    }

}