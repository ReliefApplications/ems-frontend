import { SafeEditorSettingsComponent } from '../../components/widgets/editor-settings/editor-settings.component';
import { Widget, WidgetSettings } from './widget.model';

/**
 * Editor widget
 */
export class EditorWidget extends Widget {
  public override settings!: EditorWidgetSettings;

  /** Editor widget */
  constructor() {
    super(
      'text',
      'Text',
      '/assets/text.svg',
      '#2F383E',
      {
        title: 'Text widget',
        text: 'Enter a content',
      } as EditorWidgetSettings,
      3,
      3,
      1,
      'editor',
      SafeEditorSettingsComponent
    );
  }
}

/**
 * Editor widget settings
 */
export interface EditorWidgetSettings extends WidgetSettings {
  text?: string | null;
  resource?: string | null;
  layout?: string | null;
  record?: string | null;
  useStyles?: boolean;
  showDataSourceLink?: boolean;
  wholeCardStyles?: boolean;
}
