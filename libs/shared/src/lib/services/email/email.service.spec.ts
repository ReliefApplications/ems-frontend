import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dialog, DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';

import { EmailService } from './email.service';
import { PreviewTemplateModalComponent } from '../../components/templates/components/preview-template-modal/preview-template-modal.component';

// Lazily loaded by previewCustomTemplate; only its identity matters here
jest.mock(
  '../../components/templates/components/preview-template-modal/preview-template-modal.component',
  () => ({ PreviewTemplateModalComponent: class {} })
);

describe('EmailService', () => {
  let service: EmailService;
  let dialog: Dialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        { provide: Apollo, useValue: {} },
        TranslateService,
      ],
      imports: [
        HttpClientTestingModule,
        DialogCdkModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(EmailService);
    dialog = TestBed.inject(Dialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('previewCustomTemplate', () => {
    const emailContent = { name: 'Template', subject: 'Hello' };
    const distributionListInfo = { id: 'dl-1', to: { inputEmails: [] } };
    const dataQuery = { queryName: 'allRecords', fields: [{ name: 'name' }] };

    let open: jest.SpyInstance;

    beforeEach(() => {
      open = jest.spyOn(dialog, 'open').mockReturnValue({} as any);
    });

    it('forwards the send separate email settings to the preview modal', async () => {
      await service.previewCustomTemplate(
        emailContent,
        distributionListInfo,
        undefined,
        dataQuery,
        true,
        [{ name: 'email' }]
      );

      expect(open).toHaveBeenCalledTimes(1);
      expect(open).toHaveBeenCalledWith(
        PreviewTemplateModalComponent,
        expect.objectContaining({
          data: {
            emailContent,
            distributionListInfo,
            navigateSettings: undefined,
            dataQuery,
            sendSeparateEmail: true,
            separateEmailFields: [{ name: 'email' }],
          },
        })
      );
    });

    it('leaves the send separate email settings undefined when not provided', async () => {
      await service.previewCustomTemplate(
        emailContent,
        distributionListInfo,
        { pageUrl: 'page' },
        dataQuery
      );

      expect(open.mock.calls[0][1].data).toEqual({
        emailContent,
        distributionListInfo,
        navigateSettings: { pageUrl: 'page' },
        dataQuery,
        sendSeparateEmail: undefined,
        separateEmailFields: undefined,
      });
    });
  });
});
