import {
  Component,
  Input,
  OnChanges,
  OnInit,
  HostListener,
  ViewChild,
} from '@angular/core';
import { get } from 'lodash';
import { CardT } from '../summary-card.component';
import { SummaryCardItemContentComponent } from '../summary-card-item-content/summary-card-item-content.component';
import { Apollo } from 'apollo-angular';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { EditRecordMutationResponse } from '../../../../models/record.model';
import { EDIT_RECORD } from '../graphql/mutation';

/**
 * Single Item component of Summary card widget.
 */
@Component({
  selector: 'shared-summary-card-item',
  templateUrl: './summary-card-item.component.html',
  styleUrls: ['./summary-card-item.component.scss'],
})
export class SummaryCardItemComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** Card configuration */
  @Input() card!: CardT;
  /** Available fields */
  public fields: any[] = [];
  /** Mapping fields / values */
  public fieldsValue: any = null;
  /** Loaded styles */
  public styles: any[] = [];

  @ViewChild('cardContent') childComponent!: SummaryCardItemContentComponent;

  /** @returns should widget use padding, based on widget settings */
  get usePadding() {
    return get(this.card, 'usePadding') ?? true;
  }

  /**
   * Constructor for shared-editor component
   *
   * @param apollo Apollo instance
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private snackBar: SnackbarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.checkEditRecordButtonContent();
    this.setContent();
  }

  ngOnChanges() {
    this.setContent();
  }

  /**
   * Listen to click events from host element, if record editor is clicked, open record editor modal
   *
   * @param event Click event from host element
   */
  @HostListener('click', ['$event'])
  onContentClick(event: any) {
    const cardContent = this.childComponent.el.nativeElement;
    const recordEditorButton = cardContent.querySelector('#record-editor');
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
    if (editRecordTest.test(this.card.html ?? '')) {
      if (!this.card.record?.canUpdate) {
        if (!editRecordIsHidden.test(this.card.html ?? '')) {
          this.card.html = (this.card.html as string).replace(
            'style="border: 0px; padding: 0px;"',
            'style="border: 0px; padding: 0px; visibility: hidden"'
          );
        }
      } else {
        if (editRecordIsHidden.test(this.card.html ?? '')) {
          this.card.html = (this.card.html as string).replace(
            'style="border: 0px; padding: 0px; visibility: hidden"',
            'style="border: 0px; padding: 0px;"'
          );
        }
      }
    }
  }

  /** Sets the content of the card */
  private async setContent() {
    this.fields = this.card.metadata || [];
    if (!this.card.resource) return;
    if (this.card.aggregation) {
      this.fieldsValue = this.card.cardAggregationData;
      this.setContentFromAggregation();
    } else this.setContentFromLayout();
  }

  /**
   * Set content of the card item, querying associated record.
   */
  private async setContentFromLayout(): Promise<void> {
    await this.getStyles();
    this.fieldsValue = { ...this.card.record };
    this.fields = this.card.metadata || [];
  }

  /** Sets layout style */
  private async getStyles(): Promise<void> {
    // this.layout = this.card.layout;
    this.styles = get(this.card.layout, 'query.style', []);
    // this.styles = get(this.card, 'meta.style', []);
  }

  /**
   * Queries the data for each of the static cards.
   */
  // private async getCardData() {
  //   // gets metadata
  //   const metaRes = await firstValueFrom(
  //     this.apollo.query<GetResourceMetadataQueryResponse>({
  //       query: GET_RESOURCE_METADATA,
  //       variables: {
  //         id: this.card.resource,
  //       },
  //     })
  //   );
  //   const queryName = get(metaRes, 'data.resource.queryName');

  //   const builtQuery = this.queryBuilder.buildQuery({
  //     query: this.layout.query,
  //   });
  //   const layoutFields = this.layout.query.fields;
  //   this.fields = get(metaRes, 'data.resource.metadata', []).map((f: any) => {
  //     const layoutField = layoutFields.find((lf: any) => lf.name === f.name);
  //     if (layoutField) {
  //       return { ...layoutField, ...f };
  //     }
  //     return f;
  //   });
  //   if (builtQuery) {
  //     this.apollo
  //       .query<any>({
  //         query: builtQuery,
  //         variables: {
  //           first: 1,
  //           filter: {
  //             // get only the record we need
  //             logic: 'and',
  //             filters: [
  //               {
  //                 field: 'id',
  //                 operator: 'eq',
  //                 value: this.card.record,
  //               },
  //             ],
  //           },
  //         },
  //       })
  //       .subscribe((res) => {
  //         const record: any = get(res.data, `${queryName}.edges[0].node`, null);
  //         this.fieldsValue = { ...record };
  //       });
  //   }
  // }

  /**
   * Set content of the card item from aggregation data.
   */
  private setContentFromAggregation(): void {
    this.styles = [];
    if (!this.fieldsValue) return;
    // @TODO: get the fields' types from the aggregation data
    this.fields = Object.keys(this.fieldsValue).map((key) => ({
      name: key,
      editor: 'text',
    }));
  }

  /**
   * Opens the form corresponding to selected summary card in order to update it
   */
  private async openEditRecordModal() {
    if (this.card.record && this.card.record.canUpdate && this.card.layout) {
      const { FormModalComponent } = await import(
        '../../../../components/form-modal/form-modal.component'
      );
      const dialogRef = this.dialog.open(FormModalComponent, {
        disableClose: true,
        data: {
          recordId: this.card.record.id,
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
                  id: this.card.record?.id,
                  data: value,
                  template: this.card.record?.form?.id ?? null,
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
