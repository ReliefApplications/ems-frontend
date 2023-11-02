import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { ApplicationService } from '../../../../services/application/application.service';
import { Application } from '../../../../models/application.model';
import { ContentType, Page } from '../../../../models/page.model';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { GET_PAGE_BY_ID } from './graphql/queries';
import { Apollo } from 'apollo-angular';
import { PageQueryResponse } from '../../../../models/page.model';
import { ReferenceDataService } from '../../../../services/reference-data/reference-data.service';

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
  /** Widget reactive form group */
  @Input() formGroup!: UntypedFormGroup;
  /** Show select page id and checkbox for record id */
  public showSelectPage = false;
  /** Selected resource fields */
  public resourceData: any[] = [];
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

  /**
   * Constructor of the grid component
   *
   * @param applicationService Application service
   * @param apollo Apollo service
   * @param referenceDataService Reference data service
   */
  constructor(
    public applicationService: ApplicationService,
    private apollo: Apollo,
    private referenceDataService: ReferenceDataService
  ) {
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
    const navigateSettings = this.formGroup.controls.actions.get(
      'navigateSettings'
    ) as FormGroup;
    navigateSettings.controls.pageUrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: any) => {
        //get page id
        const pageId = this.pages.filter(
          (page: any) => page.urlParams === val
        )[0].id;
        this.apollo
          .query<PageQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: pageId,
            },
          })
          .subscribe(({ data }) => {
            console.log(data);
            if (data.page.id && data.page.context) {
              const refData = data.page.context as any;
              this.referenceDataService.loadReferenceData(refData.refData).then((refData: any) => {
                this.referenceDataService.fetchItems(refData).then((items) => {
                  console.log(items);
                  // need to get valueField
                  // items.forEach((item: any) => {
                  //   this.resourceData.push({"displayField": item[refData.displayField], "value": item[]})
                  // })
                });
              });
            }
          });
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
}
