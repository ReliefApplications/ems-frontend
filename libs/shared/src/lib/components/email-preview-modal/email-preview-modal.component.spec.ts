import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { EmailPreviewModalComponent } from './email-preview-modal.component';

describe('EmailPreviewModalComponent', () => {
  let component: EmailPreviewModalComponent;
  let fixture: ComponentFixture<EmailPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
        UntypedFormBuilder,
      ],
      declarations: [EmailPreviewModalComponent],
      imports: [DialogCdkModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
