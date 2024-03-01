import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { createFormWidgetFormGroup } from './form-settings.forms';
import { Form, FormQueryResponse } from '../../../models/form.model';
import { GET_SHORT_FORM_BY_ID } from './graphql/queries';
import { Apollo } from 'apollo-angular';
import { WidgetSettings } from '../../../models/dashboard.model';

/**
 * Settings of Form widget.
 * Open in a modal.
 */
@Component({
  selector: 'shared-form-settings',
  templateUrl: './form-settings.component.html',
  styleUrls: ['./form-settings.component.scss'],
})
export class FormSettingsComponent
  extends UnsubscribeComponent
  implements OnInit, WidgetSettings<typeof createFormWidgetFormGroup>
{
  /** Widget definition */
  @Input() widget: any;
  /** Emit the applied change */
  @Output() formChange: EventEmitter<
    ReturnType<typeof createFormWidgetFormGroup>
  > = new EventEmitter();
  /** Widget form group */
  public widgetFormGroup!: ReturnType<typeof createFormWidgetFormGroup>;
  /** Form */
  public form: Form | null = null;

  /**
   * Settings of Form widget.
   *
   * @param apollo The apollo client
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }

    // Subscribe to form changes
    this.widgetFormGroup
      .get('form')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          if (value !== this.form?.id) {
            this.getFormById();
          }
        } else {
          this.form = null;
        }
      });

    this.widgetFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.formChange.emit(this.widgetFormGroup);
      });
  }

  /**
   * Gets query form details
   */
  private getFormById(): void {
    if (this.widgetFormGroup.get('form')?.value) {
      this.apollo
        .query<FormQueryResponse>({
          query: GET_SHORT_FORM_BY_ID,
          variables: {
            id: this.widgetFormGroup.get('resource')?.value,
          },
        })
        .subscribe((data: any) => {
          if (data) {
            this.form = data.form;
          } else {
            this.form = null;
          }
        });
    } else {
      this.form = null;
    }
  }

  /**
   * Build the settings form, using the widget saved parameters
   */
  public buildSettingsForm() {
    this.widgetFormGroup = createFormWidgetFormGroup(
      this.widget.id,
      this.widget.settings
    );
  }
}
