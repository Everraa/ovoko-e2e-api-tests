import { AddedToCartModal } from '@pages/components/modals/added-to-cart.modal';
import { CurrencySelectionModal } from '@pages/components/modals/currency-selection.modal';
import { CartPage } from '@pages/ebay/cart.page';
import { CheckoutPage } from '@pages/ebay/checkout.page';
import { HomePage } from '@pages/ebay/home.page';
import { ProductPage } from '@pages/ebay/product.page';
import { SearchResultsPage } from '@pages/ebay/search-results.page';
import { PageObjectCache } from '@pages/page-object-cache';

export class PageObjectManager extends PageObjectCache {
  get homePage() {
    return this.getPageObject(HomePage);
  }

  get searchResultsPage() {
    return this.getPageObject(SearchResultsPage);
  }

  get productPage() {
    return this.getPageObject(ProductPage);
  }

  get cartPage() {
    return this.getPageObject(CartPage);
  }

  get checkoutPage() {
    return this.getPageObject(CheckoutPage);
  }

  get addedToCartModal() {
    return this.getPageObject(AddedToCartModal);
  }

  get currencySelectionModal() {
    return this.getPageObject(CurrencySelectionModal);
  }
}
