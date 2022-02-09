import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeConvertModalComponent } from './convert-modal.component';

describe('SafeConvertModalComponent', () => {
  let component: SafeConvertModalComponent;
  let fixture: ComponentFixture<SafeConvertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeConvertModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeConvertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
