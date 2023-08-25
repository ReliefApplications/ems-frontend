// @dynamic
export default class Utils {
    /** This returns a range of numbers. Starts from 0 if 'startFrom' is not set */
    public static getRange(startFrom: number, until: number) {
        return Array.from({ length: (until + 1 - startFrom) }, (_, k) => k + startFrom);
    }
}