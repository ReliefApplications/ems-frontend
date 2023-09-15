import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeResourceAvailableFieldsComponent } from './resource-available-fields.component';

describe('SafeResourceAvailableFieldsComponent', () => {
  let component: SafeResourceAvailableFieldsComponent;
  let fixture: ComponentFixture<SafeResourceAvailableFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeResourceAvailableFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeResourceAvailableFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
