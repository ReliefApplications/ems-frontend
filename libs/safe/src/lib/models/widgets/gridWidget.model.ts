import { SafeGridSettingsComponent } from '../../components/widgets/grid-settings/grid-settings.component';
import { Aggregation } from '../aggregation.model';
import { Layout } from '../layout.model';
import { Widget, WidgetSettings } from './widget.model';

/**
 * Grid widget
 */
export class GridWidget extends Widget {
  public override settings!: GridWidgetSettings;

  /** Grid widget */
  constructor() {
    super(
      'grid',
      'Grid',
      '/assets/grid.svg',
      '#AC8CD5',
      {
        title: 'Grid widget',
        sortable: false,
        from: 'resource',
        pageable: false,
        source: null,
        fields: [],
        toolbar: false,
        canAdd: false,
      } as GridWidgetSettings,
      8,
      4,
      2,
      'grid',
      SafeGridSettingsComponent
    );
  }
}

/**
 * Grid widget settings
 */
export interface GridWidgetSettings extends WidgetSettings {
  sortable?: boolean;
  from?: 'resource';
  pageable?: boolean;
  source?: null;
  fields?: [];
  toolbar?: boolean;
  canAdd?: boolean;
  resource?: any | null;
  template?: any | null;
  layouts?: Layout[];
  aggregations?: Aggregation[];
  actions?: {
    delete?: boolean;
    history?: boolean;
    convert?: boolean;
    update?: boolean;
    inlineEdition?: boolean;
    addRecord?: boolean;
    export?: boolean;
    showDetails?: boolean;
  };
  floatingButtons?: FloatingButton[];
  contextFilters?: string;
}

/** Floating buttons for the grids */
interface FloatingButton {
  show?: boolean;
  name?: string;
  selectAll?: boolean;
  selectPage?: boolean;
  goToNextStep?: boolean;
  goToPreviousStep?: boolean;
  prefillForm?: boolean;
  prefillTargetForm?: boolean;
  closeWorkflow?: boolean;
  confirmationText?: string;
  autoSave?: boolean;
  modifySelectedRows?: boolean;
  modifications?: Modification[];
  attachToRecord?: boolean;
  targetResource?: any; // Replace with the actual type if known
  targetForm?: any; // Replace with the actual type if known
  targetFormField?: any; // Replace with the actual type if known
  targetFormQuery?: any; // Replace with the actual type if known
  notify?: boolean;
  notificationChannel?: string;
  notificationMessage?: string;
  publish?: boolean;
  publicationChannel?: string;
  sendMail?: boolean;
  distributionList?: any; // Replace with the actual type if known
  templates?: any[]; // Replace with the actual type if known
  export?: boolean;
  bodyFields?: any[]; // Replace with the actual type if known
}

/** Modifications of floating buttons */
interface Modification {
  field: string;
  value: any; // Replace with the actual type if known
}
