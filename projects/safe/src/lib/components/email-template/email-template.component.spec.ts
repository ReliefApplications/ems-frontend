import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEmailTemplateComponent } from './email-template.component';

describe('SafeEmailTemplateComponent', () => {
  let component: SafeEmailTemplateComponent;
  let fixture: ComponentFixture<SafeEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeEmailTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
