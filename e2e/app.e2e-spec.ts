import { NgShopFirebasePage } from './app.po';

describe('ng-shop-firebase App', () => {
  let page: NgShopFirebasePage;

  beforeEach(() => {
    page = new NgShopFirebasePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('dms works!');
  });
});
