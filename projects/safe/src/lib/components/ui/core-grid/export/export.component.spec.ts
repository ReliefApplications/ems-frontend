import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeExportComponent } from './export.component';

describe('SafeExportComponent', () => {
  let component: SafeExportComponent;
  let fixture: ComponentFixture<SafeExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeExportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
