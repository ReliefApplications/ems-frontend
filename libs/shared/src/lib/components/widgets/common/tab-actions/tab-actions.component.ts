import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ApplicationService } from '../../../../services/application/application.service';
import { Application } from '../../../../models/application.model';
import { ContentType, Page } from '../../../../models/page.model';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

/**
 * Actions tab of grid widget configuration modal.
 */
@Component({
  selector: 'shared-tab-actions',
  templateUrl: './tab-actions.component.html',
  styleUrls: ['./tab-actions.component.scss'],
})
export class TabActionsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() formGroup!: UntypedFormGroup;
  /** To show the tooltip warning icon next to the tab name */
  public templateWarning = false;
  /** Show select page id and checkbox for record id */
  public showSelectPage = false;
  /** Available pages from the application */
  public pages: any[] = [];
  /** Grid actions */
  public actions = [
    {
      name: 'delete',
      text: 'components.widget.settings.grid.actions.delete',
      tooltip: 'components.widget.settings.grid.hint.actions.delete',
    },
    {
      name: 'history',
      text: 'components.widget.settings.grid.actions.show',
      tooltip: 'components.widget.settings.grid.hint.actions.show',
    },
    {
      name: 'convert',
      text: 'components.widget.settings.grid.actions.convert',
      tooltip: 'components.widget.settings.grid.hint.actions.convert',
    },
    {
      name: 'update',
      text: 'components.widget.settings.grid.actions.update',
      tooltip: 'components.widget.settings.grid.hint.actions.update',
    },
    {
      name: 'inlineEdition',
      text: 'components.widget.settings.grid.actions.inline',
      tooltip: 'components.widget.settings.grid.hint.actions.inline',
    },
    {
      name: 'addRecord',
      text: 'components.widget.settings.grid.actions.add',
      tooltip: 'components.widget.settings.grid.hint.actions.add',
      toolTipWarning: 'components.widget.settings.grid.warnings.add',
    },
    {
      name: 'export',
      text: 'components.widget.settings.grid.actions.export',
      tooltip: 'components.widget.settings.grid.hint.actions.export',
    },
    {
      name: 'showDetails',
      text: 'components.widget.settings.grid.actions.showDetails',
      tooltip: 'components.widget.settings.grid.hint.actions.showDetails',
    },
    {
      name: 'navigateToPage',
      text: 'components.widget.settings.grid.actions.navigateToPage',
      tooltip: 'components.widget.settings.grid.hint.actions.navigateToPage',
    },
  ];
  /** Alerts parent component on warning status changes */
  @Output() warnings = new EventEmitter();

  /**
   * Constructor of the grid component
   *
   * @param applicationService Application service
   */
  constructor(public applicationService: ApplicationService) {
    super();
  }

  ngOnInit(): void {
    this.showSelectPage =
      this.formGroup.controls.actions.get('navigateToPage')?.value;
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    this.pages = this.getPages(application);
    this.formGroup.controls.actions
      .get('navigateToPage')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => {
        this.showSelectPage = val;
      });

    // If addRecord actin enabled but missing template, show warning
    this.checkTemplateWarning();
    this.formGroup.controls.actions
      .get('addRecord')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkTemplateWarning();
      });
  }

  /**
   * Get available pages from app
   *
   * @param application application
   * @returns list of pages and their url
   */
  private getPages(application: Application | null) {
    return (
      application?.pages?.map((page: any) => ({
        id: page.id,
        name: page.name,
        urlParams: this.getPageUrlParams(application, page),
        placeholder: `{{page(${page.id})}}`,
      })) || []
    );
  }

  /**
   * Get page url params
   *
   * @param application application
   * @param page page to get url from
   * @returns url of the page
   */
  private getPageUrlParams(application: Application, page: Page): string {
    return page.type === ContentType.form
      ? `${application.id}/${page.type}/${page.id}`
      : `${application.id}/${page.type}/${page.content}`;
  }

  /**
   * Checks if If addRecord action is enabled but missing template to display warning
   */
  private checkTemplateWarning(): void {
    this.templateWarning =
      !(
        this.formGroup.get('template')?.value ||
        this.formGroup.get('card.template')?.value
      ) && this.formGroup.controls.actions.get('addRecord')?.value;
    if (this.templateWarning) {
      this.warnings.emit(true);
    } else {
      this.warnings.emit(false);
    }
  }
}
