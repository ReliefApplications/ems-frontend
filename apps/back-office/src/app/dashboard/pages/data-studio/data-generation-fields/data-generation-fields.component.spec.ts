import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGenerationFieldsComponent } from './data-generation-fields.component';

describe('DataGenerationFieldsComponent', () => {
  let component: DataGenerationFieldsComponent;
  let fixture: ComponentFixture<DataGenerationFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataGenerationFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGenerationFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
