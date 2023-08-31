import { SafeSummaryCardSettingsComponent } from '../../components/widgets/summary-card-settings/summary-card-settings.component';
import { Widget, WidgetSettings } from './widget.model';

/** Summary card widget */
export class SummaryCardWidget extends Widget {
  public override settings!: SummaryCardWidgetSettings;

  /** Summary card widget */
  constructor() {
    super(
      'summaryCard',
      'Summary card',
      '/assets/summary-card.svg',
      '#99CBEF',
      { title: 'Summary Card' },
      3,
      3,
      1,
      'summaryCard',
      SafeSummaryCardSettingsComponent
    );
  }
}

/**
 * Summary card widget settings
 */
export interface SummaryCardWidgetSettings extends WidgetSettings {
  card: CardSettings;
  widgetDisplay: {
    searchable?: boolean;
    sortable?: boolean;
    usePagination?: boolean;
    showBorder?: boolean;
    style?: string;
  };
  contextFilters?: any;
}

/** Card settings */
export interface CardSettings {
  title?: string;
  resource?: string | null;
  layout?: string | null;
  aggregation?: string | null;
  html?: string | null;
  showDataSourceLink?: boolean;
  useStyles?: boolean;
  wholeCardStyles?: boolean;
}
