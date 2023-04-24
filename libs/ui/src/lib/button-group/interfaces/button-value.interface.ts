import { ButtonIconPosition } from '../../button/enums/button-icon-position.enum';

/**
 * All needed information to display a button structure.
 */
export interface ButtonValue {
  icon: string;
  iconPosition: ButtonIconPosition;
  label: string;
  selected?: boolean;
}
