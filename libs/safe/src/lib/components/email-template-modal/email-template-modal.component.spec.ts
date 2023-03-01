import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateModalComponent } from './email-template-modal.component';

describe('EmailTemplateModalComponent', () => {
  let component: EmailTemplateModalComponent;
  let fixture: ComponentFixture<EmailTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailTemplateModalComponent],
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
