import { TabsSettingsComponent } from '../../components/widgets/tabs-settings/tabs-settings.component';
import { Widget } from './widget.model';

/**
 * Tabs widget
 */
export class TabsWidget extends Widget {
  /** Editor widget */
  constructor() {
    super(
      'tabs',
      'Tabs',
      '/assets/summary-card.svg',
      '#99CBEF',
      { title: 'Tabs' },
      8,
      4,
      2,
      'tabs',
      TabsSettingsComponent
    );
  }
}
