import { Component, Input, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ApplicationService } from 'libs/shared/src/lib/services/application/application.service';
import { Application } from 'libs/shared/src/lib/models/application.model';
import { ContentType, Page } from 'libs/shared/src/lib/models/page.model';

/**
 * Actions tab of grid widget configuration modal.
 */
@Component({
  selector: 'shared-tab-actions',
  templateUrl: './tab-actions.component.html',
  styleUrls: ['./tab-actions.component.scss'],
})
export class TabActionsComponent implements OnInit{
  @Input() formGroup!: UntypedFormGroup;

  public show: boolean = false;

  public pages: any[] = [];

  /** Current environment */
  private environment: any;

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
      name: 'showRecordDashboard',
      text: 'components.widget.settings.grid.actions.showRecordDashboard',
      tooltip: 'components.widget.settings.grid.hint.actions.showRecordDashboard',
    },
  ];

  constructor(
    public applicationService: ApplicationService,
    @Inject('environment') environment: any
  ){
    this.environment = environment;
  }

  ngOnInit(): void {
    this.show = this.formGroup.controls.actions.get('showRecordDashboard')?.value;
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    this.pages = this.getPages(application);
    this.formGroup.controls.actions.get('showRecordDashboard')?.valueChanges.subscribe((val: boolean) => {
      this.show = val;
    })
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
        url: this.getPageUrl(application, page),
        placeholder: `{{page(${page.id})}}`,
      })) || []
    );
  }

  /**
   * Get page url
   *
   * @param application application
   * @param page page to get url from
   * @returns url of the page
   */
  private getPageUrl(application: Application, page: Page): string {
    if (this.environment.module === 'backoffice') {
      return page.type === ContentType.form
        ? `${this.environment.backOfficeUri}/applications/${application.id}/${page.type}/${page.id}`
        : `${this.environment.backOfficeUri}/applications/${application.id}/${page.type}/${page.content}`;
    } else {
      return page.type === ContentType.form
        ? `${this.environment.frontOfficeUri}/${application.id}/${page.type}/${page.id}`
        : `${this.environment.frontOfficeUri}/${application.id}/${page.type}/${page.content}`;
    }
  }
}
