import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, SnackbarService, TooltipModule } from '@oort-front/ui';
import { FileExplorerDocumentPropertiesComponent } from '../file-explorer-document-properties/file-explorer-document-properties.component';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { DocumentManagementService } from '../../../services/document-management/document-management.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

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
export class FileExplorerDocumentToolbarComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Document properties to be displayed */
  @Input() document!: FileExplorerDocumentPropertiesComponent['document'];
  /** Loading indicator */
  public loading = true;
  /** Access level, see document management service for more explanations */
  public accessLevel = -1;
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
  /** Auth service */
  private auth = inject(AuthService);

  ngOnInit() {
    this.getPermissions();
  }

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

  /**
   * Get permissions for the document.
   */
  private async getPermissions() {
    this.documentManagementService
      .getDocumentPermissions(await this.driveId(), this.document?.id as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ value }) => {
        this.accessLevel = value;
        this.loading = false;
      });
  }

  /**
   * Open mail client to request access to the document.
   */
  public onRequestAccess() {
    if (!this.document) return;

    const createdBy = this.document.createdbyuser || '';
    const modifiedBy = this.document.modifiedbyuser || '';
    const createdByMail = this.document.createdbyuseremail || '';
    const modifiedByMail = this.document.modifiedbyuseremail || '';
    const fileName = this.document.filename || '';
    const documentId = this.document.id || '';
    const currentUser = this.auth.userValue?.name;

    const recipients =
      createdByMail === modifiedByMail
        ? createdByMail
        : `${createdByMail};${modifiedByMail}`;

    const subject = encodeURIComponent(`Request access to ${fileName}`);
    const body = encodeURIComponent(
      `Dear ${createdBy}${
        createdByMail !== modifiedByMail ? ', ' + modifiedBy : ''
      },\n\n` +
        `Can you please give me access to ${fileName}, which was created or modified by you?\n\n` +
        `(Insert reason you're requesting access)\n\n` +
        `Click this link to approve:\n${
          this.environment.csDocUrl
        }/index.html?documentid=${documentId}&usersearch=${encodeURIComponent(
          this.auth.userValue?.username || ''
        )}\n\n` +
        `Or reply to this e-mail if you choose to not grant permissions.\n\n` +
        `Thank you for your consideration.\n\n${currentUser}`
    );

    window.open(`mailto:${recipients}?subject=${subject}&body=${body}`);
  }
}
