import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateModalComponent } from './email-template-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('EmailTemplateModalComponent', () => {
  let component: EmailTemplateModalComponent;
  let fixture: ComponentFixture<EmailTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { templates: [] } },
        TranslateService,
      ],
      imports: [EmailTemplateModalComponent, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
