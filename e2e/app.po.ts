import { browser, element, by } from 'protractor';

export class NgShopFirebasePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('dms-root h1')).getText();
  }
}
