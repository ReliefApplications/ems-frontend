import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';

describe('CalculatedFieldsTabComponent', () => {
  let component: CalculatedFieldsTabComponent;
  let fixture: ComponentFixture<CalculatedFieldsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatedFieldsTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatedFieldsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
