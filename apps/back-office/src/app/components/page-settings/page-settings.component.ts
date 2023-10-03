import { Component, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TabsModule,
  DialogModule,
  ButtonModule,
  TooltipModule,
  SelectMenuModule,
  FormWrapperModule,
  IconModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { PageIconComponent } from '../page-icon/page-icon.component';
import {
  ApplicationService,
  ContentType,
  Page,
  Step,
  UnsubscribeComponent,
  WorkflowService,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs';

/** Preferences Dialog Data */
interface DialogData {
  type: 'page' | 'step';
  contentType: ContentType;
  page?: Page;
  step?: Step;
  icon?: string;
}

/**
 * Application page and step settings component.
 */
@Component({
  selector: 'app-page-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    DialogModule,
    IconModule,
    ButtonModule,
    TooltipModule,
    SelectMenuModule,
    FormWrapperModule,
    TranslateModule,
    PageIconComponent,
  ],
  templateUrl: './page-settings.component.html',
  styleUrls: ['./page-settings.component.scss'],
})
export class PageSettingsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Reactive Form */
  public settingsForm!: ReturnType<typeof this.createSettingsForm>;
  /** To track which settings updates */
  public updated = {
    icon: { changed: false, value: '' },
  };
  /** Step object */
  private step?: Step;
  /** Page object */
  private page?: Page;

  /**
   * Common settings of pages / steps.
   *
   * @param data Data that will be passed to the dialog
   * @param fb This is the service that will be used to build forms.
   * @param workflowService Shared workflow service
   * @param applicationService Shared application service
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private workflowService: WorkflowService,
    private applicationService: ApplicationService
  ) {
    super();
    if (this.data) {
      this.page = this.data?.page;
      this.step = this.data?.step;
    }
  }

  ngOnInit(): void {
    this.settingsForm = this.createSettingsForm();
    this.settingsForm?.controls.icon.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.onChangeIcon(value);
        }
      });
  }

  /**
   * Create the settings form
   *
   * @returns Form group
   */
  private createSettingsForm() {
    return this.fb.group({
      // initializes icon field with data info
      icon: this.fb.control(this.data.icon || ''),
    });
  }

  /**
   * Save changes when icon is updated.
   *
   * @param icon new icon name
   */
  private onChangeIcon(icon: string): void {
    if (this.data.type === 'step' && this.data.step) {
      const callback = () => {
        this.step = {
          ...this.data.step,
          icon,
        };
        this.updated.icon = { changed: true, value: icon };
      };
      this.workflowService.updateStepIcon(this.step as Step, icon, callback);
    } else {
      const callback = () => {
        this.page = {
          ...this.data.page,
          icon,
        };
        this.updated.icon = { changed: true, value: icon };
      };

      this.data.page &&
        this.applicationService.changePageIcon(
          this.page as Page,
          icon,
          callback
        );
    }
  }
}
