/**
 * Utils class
 */
export default class Utils {
  /**
   * This returns a range of numbers. Starts from 0 if 'startFrom' is not set
   *
   * @param startFrom startfrom value
   * @param until until value
   * @returns resolved classes
   */
  public static getRange(startFrom: number, until: number) {
    return Array.from(
      { length: until + 1 - startFrom },
      (_, k) => k + startFrom
    );
  }
}
