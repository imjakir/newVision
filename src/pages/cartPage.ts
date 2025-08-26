import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartContainer: Locator;
    readonly cartItemPrice: Locator;
    readonly productName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartContainer = page.locator("//div[@class='cart_item']");
        this.cartItemPrice = page.locator("//div[@class='inventory_item_price']");
        this.productName = page.locator("//div[@class='inventory_item_name']");
    }

    async getCartItemName(index: number) {
        return await this.productName.nth(index).innerText();
    }

    async getCartItemPrice(index: number) {
        return await this.cartItemPrice.nth(index).innerText();
    }

    async getCartItemCount() {
        return await this.cartContainer.count();
    }
}