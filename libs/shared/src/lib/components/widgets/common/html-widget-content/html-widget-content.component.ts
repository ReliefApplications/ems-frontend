import { Dialog } from '@angular/cdk/dialog';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

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

  /**
   * HtmlWidgetContentComponent constructor using dialog for linked record edition
   *
   * @param el Host element
   * @param dialog Angular - CDK Dialog API
   */
  constructor(private el: ElementRef, private dialog: Dialog) {
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
    const { FormModalComponent } = await import(
      '../../../../components/form-modal/form-modal.component'
    );
    const dialogRef = this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        // recordId: this.card.record?.id,
        // template: this.settings.template || null,
        recordId: null,
        template: null,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        /** Save new modifiedAt */
        const modifiedAt = value.data['modifiedAt'];
        const date = new Date(parseInt(modifiedAt));
        const isoDateString = date.toISOString();
        const keys = Object.keys(value.data.data);
        const cardRecord = {} as any;
        // const cardRecord = { ...this.card.record } as any;
        const valueData = { ...value.data.data } as any;
        /** Save new fields modified */
        for (const key of keys) {
          cardRecord[key] = valueData[key];
        }
        cardRecord['modifiedAt'] = isoDateString;
        // this.card.record = cardRecord;
        // this.setContent();
      }
    });
  }
}
