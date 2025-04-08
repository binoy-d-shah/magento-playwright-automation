import { Page, Locator } from '@playwright/test';

export class ProductSearchPage {
    private page: Page;
    private productNames: Locator;
    private noResultsMessage: Locator;
    private sortDropdown: Locator;
    private productPrices: Locator;
    private firstProduct: Locator;
    private productTitle: Locator;
    private searchResultsGrid: Locator;
    private sortAscButton: Locator;
    private sortDescButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productNames = page.locator('.product-item-link');
        this.noResultsMessage = page.locator('.message.notice');
        this.sortDropdown = page.locator('#sorter').first();
        this.sortAscButton = page.locator('[data-value="asc"]').first();
        this.sortDescButton = page.locator('[data-value="desc"]').first();
        this.productPrices = page.locator('.price');
        this.firstProduct = page.locator('.product-item-link').first();
        this.productTitle = page.locator('h1.page-title span');
        this.searchResultsGrid = page.locator('.search.results');
    }

    async hasResults(): Promise<boolean> {
        return await this.searchResultsGrid.isVisible();
    }

    async getNoResultsMessage(): Promise<string> {
        return await this.noResultsMessage.innerText();
    }

    async sortBy(criteria: 'Price' | string, order): Promise<void> {
        
        // First, choose the sort field from dropdown
        await this.page.waitForTimeout(3000);
        await this.sortDropdown.selectOption(criteria.toLowerCase());

        // Wait for page content to refresh
        await this.page.waitForTimeout(3000);

        // Then click appropriate sort direction button
        if (order === 'asc') {
            await this.sortAscButton.click();
        } else if (order === 'desc'){
            await this.sortDescButton.click();
        }

        // Wait for page content to refresh
        await this.page.waitForTimeout(3000);
    }

    async getProductPrices(): Promise<number[]> {
        const prices = await this.productPrices.allInnerTexts();
        return prices.map(p => parseFloat(p.replace(/[^\d.]/g, ''))); // Strip currency symbol and convert
    }

    async getProductNames(): Promise<string[]> {
        const names = await this.productNames.allInnerTexts();
        return names.map(p => p.trim()); // Trim string
    }

    async clickOnFirstProduct(): Promise<void> {
        await this.firstProduct.click();
    }
}