import { NoolWebappPage } from './app.po';

describe('nool-webapp App', function() {
  let page: NoolWebappPage;

  beforeEach(() => {
    page = new NoolWebappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
