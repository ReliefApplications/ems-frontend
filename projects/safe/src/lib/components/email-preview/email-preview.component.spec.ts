import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEmailPreviewComponent } from './email-preview.component';

describe('SafeEmailPreviewComponent', () => {
  let component: SafeEmailPreviewComponent;
  let fixture: ComponentFixture<SafeEmailPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeEmailPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEmailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
