import { GlobalOptions } from '../../types';
import { LINK_DATA } from './assets/link-data';

/**
 * Gets the data to autocomplete from LINK table
 *
 * @param params linkId and field to autocomplete
 * @returns link data for that field
 */
const getLinkField = (params: any[]) => {
  const linkId = params[0];
  const field = params[1];
  const link: { [key: string]: string } | undefined = LINK_DATA.find(
    (link) => link.linkId === linkId
  );

  if (!link) return null;

  return link[field];
};

/**
 *  Generator for the custom function getLinkField.
 *
 * @param _ Global options
 * @returns The custom function getLinkField
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getLinkField;
