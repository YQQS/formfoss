import { FormfossPage } from './app.po';

describe('formfoss App', () => {
  let page: FormfossPage;

  beforeEach(() => {
    page = new FormfossPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
