import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, SnackbarService, TooltipModule } from '@oort-front/ui';
import { FileExplorerDocumentPropertiesComponent } from '../file-explorer-document-properties/file-explorer-document-properties.component';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { DocumentManagementService } from '../../../services/document-management/document-management.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * Document toolbar component for the file explorer.
 */
@Component({
  selector: 'shared-file-explorer-document-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ClipboardModule,
    TranslateModule,
    TooltipModule,
  ],
  templateUrl: './file-explorer-document-toolbar.component.html',
  styleUrls: ['./file-explorer-document-toolbar.component.scss'],
})
export class FileExplorerDocumentToolbarComponent {
  /** Document properties to be displayed */
  @Input() document!: FileExplorerDocumentPropertiesComponent['document'];
  /** Clipboard service for copying links */
  private clipboard = inject(Clipboard);
  /** Snackbar service for displaying messages */
  private snackBar = inject(SnackbarService);
  /** Document management service */
  private documentManagementService = inject(DocumentManagementService);
  /** Environment variables */
  private environment: any = inject('environment' as any);
  /** Translate service */
  private translate = inject(TranslateService);

  /**
   * Get drive id for the document.
   * If the document has a drive id, it will be returned.
   * If not, it will fetch the default drive id from the document management service.
   *
   * @returns Drive id
   */
  async driveId() {
    if (this.document?.driveid) {
      return this.document.driveid;
    }
    if (!this.documentManagementService.defaultDriveId) {
      await this.documentManagementService.getDriveId();
    }
    return this.documentManagementService.defaultDriveId;
  }

  /**
   * Download document file.
   */
  async onDownload() {
    this.documentManagementService.getFile({
      name: this.document?.filename as string,
      content: {
        driveId: await this.driveId(),
        itemId: this.document?.id as string,
      },
    });
  }

  /**
   * Copy link to the document file.
   * Opening the link in a new tab will download the file.
   */
  async onCopyLink() {
    const url = `${
      this.environment.csDocUrl
    }/download.html?driveid=${await this.driveId()}&itemid=${
      this.document?.id
    }`;
    this.clipboard.copy(url);
    this.snackBar.openSnackBar(
      this.translate.instant(
        'components.widget.fileExplorer.notifications.copyLink.success'
      )
    );
  }
}
