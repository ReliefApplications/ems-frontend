import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetFilterComponent } from './dataset-filter.component';

describe('DatasetFilterComponent', () => {
  let component: DatasetFilterComponent;
  let fixture: ComponentFixture<DatasetFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatasetFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
