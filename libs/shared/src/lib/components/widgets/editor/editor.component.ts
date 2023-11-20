import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import {
  GET_LAYOUT,
  GET_RESOURCE_METADATA,
} from '../summary-card/graphql/queries';
import { clone, get } from 'lodash';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { DataTemplateService } from '../../../services/data-template/data-template.service';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { GridService } from '../../../services/grid/grid.service';
import { HtmlWidgetContentComponent } from '../common/html-widget-content/html-widget-content.component';
import { EDIT_RECORD } from './graphql/mutation';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { EditRecordMutationResponse } from '../../../models/record.model';

/**
 * Text widget component using KendoUI
 */
@Component({
  selector: 'shared-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent extends UnsubscribeComponent implements OnInit {
  /** Widget settings */
  @Input() settings: any;
  /** Should show padding */
  @Input() usePadding = true;

  private layout: any;
  private fields: any[] = [];
  private fieldsValue: any;
  private styles: any[] = [];
  private wholeCardStyles = false;

  public formattedHtml: SafeHtml = '';
  public formattedStyle?: string;

  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  @ViewChild('htmlContent') childComponent!: HtmlWidgetContentComponent;

  /**
   * Constructor for shared-editor component
   *
   * @param apollo Apollo instance
   * @param queryBuilder Query builder service
   * @param dataTemplateService Shared data template service, used to render content from template
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param gridService Shared grid service
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private dataTemplateService: DataTemplateService,
    private dialog: Dialog,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private gridService: GridService
  ) {
    super();
  }

  /** Sanitizes the text. */
  ngOnInit(): void {
    this.checkEditRecordButtonContent();
    this.setContentFromLayout();
  }

  /**
   * Listen to click events from host element, if record editor is clicked, open record editor modal
   *
   * @param event Click event from host element
   */
  @HostListener('click', ['$event'])
  onContentClick(event: any) {
    const htmlWidgetContent = this.childComponent.el.nativeElement;
    const recordEditorButton =
      htmlWidgetContent.querySelector('#record-editor');
    if (recordEditorButton.contains(event.target)) {
      this.openEditRecordModal();
    }
  }

  /**
   * Check if there is an edit record button set in the widget content and updates it's access accordingly
   */
  private checkEditRecordButtonContent() {
    const editRecordTest = new RegExp(/<button id="record-editor"/gim);
    const editRecordIsHidden = new RegExp(
      /style="border: 0px; padding: 0px; visibility: hidden"/gim
    );
    // If edit record button is set for this widget, but current user it's not allowed to edit, hide it
    if (editRecordTest.test(this.settings.text)) {
      if (!this.settings.record?.canUpdate) {
        if (!editRecordIsHidden.test(this.settings.text)) {
          this.settings.text = (this.settings.text as string).replace(
            'style="border: 0px; padding: 0px;"',
            'style="border: 0px; padding: 0px; visibility: hidden"'
          );
        }
      } else {
        if (editRecordIsHidden.test(this.settings.text)) {
          this.settings.text = (this.settings.text as string).replace(
            'style="border: 0px; padding: 0px; visibility: hidden"',
            'style="border: 0px; padding: 0px;"'
          );
        }
      }
    }
  }

  /**
   * Sets content of the text widget, querying associated record if any.
   */
  private async setContentFromLayout(): Promise<void> {
    if (this.settings.record) {
      await this.getLayout();
      await this.getData();
      this.formattedStyle = this.dataTemplateService.renderStyle(
        this.settings.wholeCardStyles || false,
        this.fieldsValue,
        this.styles
      );
      this.formattedHtml = this.dataTemplateService.renderHtml(
        this.settings.text,
        this.fieldsValue,
        this.fields,
        this.styles
      );
    } else {
      this.formattedHtml = this.dataTemplateService.renderHtml(
        this.settings.text
      );
    }
  }

  /** Sets layout */
  private async getLayout(): Promise<void> {
    const apolloRes = await firstValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_LAYOUT,
        variables: {
          id: this.settings.layout,
          resource: this.settings.resource,
        },
      })
    );

    if (get(apolloRes, 'data')) {
      this.layout = apolloRes.data.resource.layouts?.edges[0]?.node;
      if (this.settings.useStyles) {
        this.styles = this.layout?.query.style;
      }
    }
  }

  /**
   * Queries the data.
   */
  private async getData() {
    const metaRes = await firstValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_RESOURCE_METADATA,
        variables: {
          id: this.settings.resource,
        },
      })
    );
    const queryName = get(metaRes, 'data.resource.queryName');

    const builtQuery = this.queryBuilder.buildQuery({
      query: this.layout.query,
    });
    const layoutFields = this.layout.query.fields;
    this.fields = get(metaRes, 'data.resource.metadata', []).map((f: any) => {
      const layoutField = layoutFields.find((lf: any) => lf.name === f.name);
      if (layoutField) {
        return { ...layoutField, ...f };
      }
      return f;
    });

    if (builtQuery) {
      const res = await firstValueFrom(
        this.apollo.query<any>({
          query: builtQuery,
          variables: {
            first: 1,
            filter: {
              // get only the record we need
              logic: 'and',
              filters: [
                {
                  field: 'id',
                  operator: 'eq',
                  value: this.settings.record.id,
                },
              ],
            },
          },
        })
      );
      const record: any = get(res.data, `${queryName}.edges[0].node`, null);
      this.fieldsValue = { ...record };
      const metaQuery = this.queryBuilder.buildMetaQuery(this.layout.query);
      if (metaQuery) {
        const metaData = await firstValueFrom(metaQuery);
        for (const field in metaData.data) {
          if (Object.prototype.hasOwnProperty.call(metaData.data, field)) {
            const metaFields = Object.assign({}, metaData.data[field]);
            try {
              await this.gridService.populateMetaFields(metaFields);
              this.fields = this.fields.map((field) => {
                //add shape for columns and matrices
                const metaData = metaFields[field.name];
                if (metaData && (metaData.columns || metaData.rows)) {
                  return {
                    ...field,
                    columns: metaData.columns,
                    rows: metaData.rows,
                  };
                }
                return field;
              });
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    }
  }

  /**
   * Pass click event to data template service
   *
   * @param event Click event
   */
  public onClick(event: any) {
    this.dataTemplateService.onClick(event, this.fieldsValue);
  }

  /**
   * Open the dataSource modal.
   */
  public async openDataSource(): Promise<void> {
    if (this.layout?.query) {
      const { ResourceGridModalComponent } = await import(
        '../../search-resource-grid-modal/search-resource-grid-modal.component'
      );
      this.dialog.open(ResourceGridModalComponent, {
        data: {
          gridSettings: clone(this.layout.query),
        },
      });
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'components.widget.summaryCard.errors.invalidSource'
        ),
        { error: true }
      );
    }
  }

  /**
   * Opens the form corresponding to selected summary card in order to update it
   */
  private async openEditRecordModal() {
    if (
      this.settings.record &&
      this.settings.record.canUpdate &&
      this.settings.layout
    ) {
      const { FormModalComponent } = await import(
        '../../../components/form-modal/form-modal.component'
      );
      const dialogRef = this.dialog.open(FormModalComponent, {
        disableClose: true,
        data: {
          recordId: this.settings.record.id,
          // template: this.settings.template || null,
          template: null,
        },
        autoFocus: false,
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            /** Save edited record */
            this.apollo
              .mutate<EditRecordMutationResponse>({
                mutation: EDIT_RECORD,
                variables: {
                  id: this.settings.record.id,
                  data: value,
                  template: this.settings.record?.form?.id ?? null,
                },
              })
              .subscribe({
                error: (err) => {
                  this.snackBar.openSnackBar(err[0].message, { error: true });
                },
              });
          }
        });
    }
  }
}
