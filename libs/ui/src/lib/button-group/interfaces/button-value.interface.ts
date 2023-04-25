import { ButtonIconPosition } from '../../button/enums/button-icon-position.enum';
import { Size } from '../../shared/size.enum';
import { Variant } from '../../shared/variant.enum';

/**
 * All needed information to display a button structure.
 */
export interface ButtonValue {
  icon?: string;
  iconPosition?: ButtonIconPosition;
  size?: Size;
  variant?: Variant;
  isIcon?: boolean;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  selected?: boolean;
}
