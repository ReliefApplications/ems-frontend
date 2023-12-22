import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDataGridComponent } from './reference-data-grid.component';

describe('ReferenceDataGridComponent', () => {
  let component: ReferenceDataGridComponent;
  let fixture: ComponentFixture<ReferenceDataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferenceDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
