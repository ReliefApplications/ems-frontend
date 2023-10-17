import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
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
  ToggleModule,
  AlertModule,
} from '@oort-front/ui';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslateModule } from '@ngx-translate/core';
import { ViewIconSelectorComponent } from '../view-icon-selector/view-icon-selector.component';
import {
  AccessModule,
  ApplicationService,
  Page,
  Step,
  UnsubscribeComponent,
  WorkflowService,
  AccessData,
  SearchMenuModule,
  AuthService,
  Application,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs';
import { isNil } from 'lodash';
import { AbilityModule } from '@casl/angular';

/** Settings Dialog Data */
interface DialogData {
  type: 'page' | 'step';
  applicationId: string;
  page?: Page;
  step?: Step;
  icon?: string;
  visible?: boolean;
  accessData: AccessData;
  canUpdate: boolean;
}

/**
 * Application page and step settings component.
 * Available settings: icon, access, visibility and duplicate page.
 */
@Component({
  selector: 'app-view-settings',
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
    ViewIconSelectorComponent,
    AccessModule,
    ToggleModule,
    OverlayModule,
    SearchMenuModule,
    AlertModule,
    AbilityModule,
  ],
  templateUrl: './view-settings-modal.component.html',
  styleUrls: ['./view-settings-modal.component.scss'],
})
export class ViewSettingsModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Reactive Form */
  public settingsForm!: ReturnType<typeof this.createSettingsForm>;
  /** Event to parent subscribe and update its own object after changes */
  public onUpdate = new EventEmitter();
  /** Show duplicate menu */
  public showDuplicateMenu = false;
  /** List of available applications */
  public applications: Application[] = [];
  /** Step object */
  private step?: Step;
  /** Page object */
  private page?: Page;

  /**
   * Common settings of pages / steps.
   *
   * @param dialogRef Dialog ref
   * @param data Data that will be passed to the dialog
   * @param fb This is the service that will be used to build forms.
   * @param workflowService Shared workflow service
   * @param applicationService Shared application service
   * @param authService Shared authentication service
   */
  constructor(
    public dialogRef: DialogRef<ViewSettingsModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private workflowService: WorkflowService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {
    super();
    if (this.data) {
      this.page = this.data?.page;
      this.step = this.data?.step;
    }
  }

  ngOnInit(): void {
    this.settingsForm = this.createSettingsForm();
    if (!this.data.canUpdate) {
      this.settingsForm.disable();
    }

    // Listen to icon updates
    this.settingsForm?.controls.icon.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string | null) => {
        if (value) {
          this.onUpdateIcon(value);
        }
      });

    // Listen to visibility updates (only for pages)
    if (this.data.type === 'page') {
      this.settingsForm?.controls.visible.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: boolean | null) => {
          if (!isNil(value)) {
            this.onUpdateVisibility(value);
          }
        });
    }
  }

  /**
   * Save changes when access is updated.
   *
   * @param event new permissions object
   */
  public onUpdateAccess(event: any): void {
    if (this.data.type === 'step' && this.step) {
      const callback = (permissions: any) => {
        // Updates parent component
        const updates = { permissions };
        this.onUpdate.emit(updates);
      };
      this.workflowService.updateStepPermissions(
        this.step as Step,
        event,
        callback
      );
    } else {
      const callback = (permissions: any) => {
        this.page = {
          ...this.page,
          canDelete: permissions.canDelete,
          canUpdate: permissions.canUpdate,
          canSee: permissions.canSee,
        };
        // Updates parent component
        const updates = { permissions };
        this.onUpdate.emit(updates);
      };
      this.page &&
        this.applicationService.updatePagePermissions(
          this.page as Page,
          event,
          callback
        );
    }
  }

  /**
   * Duplicate page, in a new (or same) application
   *
   * @param event duplication event
   */
  public onDuplicate(event: any): void {
    const callback = () => {
      this.dialogRef.close();
    };
    this.applicationService.duplicatePage(
      event.id,
      {
        pageId: this.page?.id,
        stepId: this.step?.id,
      },
      callback
    );
  }

  /**
   * Toggle visibility of application menu.
   * Get applications to use duplicate setting.
   */
  public onAppSelection(): void {
    this.showDuplicateMenu = !this.showDuplicateMenu;
    const authSubscription = this.authService.user$.subscribe(
      (user: any | null) => {
        if (user) {
          this.applications = user.applications;
        }
      }
    );
    authSubscription.unsubscribe();
  }

  /**
   * Create the settings form
   *
   * @returns Form group
   */
  private createSettingsForm() {
    return this.fb.group({
      // initializes icon field with data info
      icon: this.fb.control(this.data.icon ?? ''),
      visible: this.fb.control(this.data.visible ?? true),
    });
  }

  /**
   * Save changes when icon is updated.
   *
   * @param icon new icon name
   */
  private onUpdateIcon(icon: string): void {
    if (this.data.type === 'step' && this.step) {
      const callback = () => {
        this.step = {
          ...this.step,
          icon,
        };
        // Updates parent component
        const updates = { icon };
        this.onUpdate.emit(updates);
      };
      this.workflowService.updateStepIcon(this.step as Step, icon, callback);
    } else {
      const callback = () => {
        this.page = {
          ...this.page,
          icon,
        };
        // Updates parent component
        const updates = { icon };
        this.onUpdate.emit(updates);
      };
      this.page &&
        this.applicationService.changePageIcon(
          this.page as Page,
          icon,
          callback
        );
    }
  }

  /**
   * Save page visibility on change.
   *
   * @param visible boolean
   */
  private onUpdateVisibility(visible: boolean): void {
    const callback = () => {
      this.page = {
        ...this.page,
        visible,
      };
      // Updates parent component
      const updates = { visible };
      this.onUpdate.emit(updates);
    };
    this.applicationService.togglePageVisibility(
      {
        id: this.page?.id,
        visible,
      },
      callback
    );
  }
}
