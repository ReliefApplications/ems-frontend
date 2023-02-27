import { browser, by, element } from 'protractor';

/** Page Object class */
export class AppPage {
  /**
   * Navigate to home page of the app.
   *
   * @returns Navigation as promise.
   */
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  /**
   * Get home page heading element ref text.
   *
   * @returns Promise of page heading element ref text.
   */
  getTitleText(): Promise<string> {
    return element(
      by.css('app-root .content span')
    ).getText() as Promise<string>;
  }
}
