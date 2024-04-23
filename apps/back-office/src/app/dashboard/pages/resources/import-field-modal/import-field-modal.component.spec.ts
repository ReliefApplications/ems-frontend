import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFieldModalComponent } from './import-field-modal.component';

describe('ImportFieldModalComponent', () => {
  let component: ImportFieldModalComponent;
  let fixture: ComponentFixture<ImportFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportFieldModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
