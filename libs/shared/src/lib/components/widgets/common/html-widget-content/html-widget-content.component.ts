import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { EditRecordMutationResponse } from '../../../../models/record.model';
import { Apollo } from 'apollo-angular';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { EDIT_RECORD } from './graphql/mutations';

/**
 * HTML Widget content component
 *
 * Allows to render HTML with custom styles without interfering with the rest of the application.
 */
@Component({
  selector: 'shared-html-widget-content',
  templateUrl: './html-widget-content.component.html',
  styleUrls: ['./html-widget-content.component.scss'],
  // todo: enable
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class HtmlWidgetContentComponent extends UnsubscribeComponent {
  @Input() html: SafeHtml = '';
  @Input() style?: string;
  @Input() dataSource!: { record: any; layout: any };

  /**
   * HtmlWidgetContentComponent constructor using dialog for linked record edition
   *
   * @param {ElementRef} el Host element
   * @param {Dialog} dialog Angular - CDK Dialog API
   * @param {Apollo} apollo Angular - Apollo provider
   * @param {SnackbarService} snackBar UI - Snackbar service for displaying floating messages
   * @param {TranslateService} translate NGX - Translate service
   */
  constructor(
    private el: ElementRef,
    private dialog: Dialog,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Listen to click events from host element, if record editor is clicked, open record editor modal
   *
   * @param event Click event from host element
   */
  @HostListener('click', ['$event'])
  onContentClick(event: any) {
    const recordEditorButton =
      this.el.nativeElement.querySelector('#record-editor');
    if (recordEditorButton.contains(event.target)) {
      this.openEditRecordModal();
    }
  }

  /**
   * Opens the form corresponding to selected summary card in order to update it
   */
  private async openEditRecordModal() {
    if (
      this.dataSource.record &&
      this.dataSource.record.canUpdate &&
      this.dataSource.layout
    ) {
      const { FormModalComponent } = await import(
        '../../../../components/form-modal/form-modal.component'
      );
      const dialogRef = this.dialog.open(FormModalComponent, {
        disableClose: true,
        data: {
          recordId: this.dataSource.record.id,
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
                  id: this.dataSource.record.id,
                  data: value,
                  template: this.dataSource.record?.form?.id ?? null,
                },
              })
              .subscribe({
                next: ({ errors }) => {
                  if (errors) {
                    this.snackBar.openSnackBar(errors[0].message, {
                      error: true,
                    });
                  } else {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'common.notifications.objectUpdated',
                        {
                          type: this.translate.instant('common.record.one'),
                          value: '',
                        }
                      )
                    );
                  }
                },
                error: (err) => {
                  this.snackBar.openSnackBar(err[0].message, { error: true });
                },
              });
          }
        });
    }
  }
}
