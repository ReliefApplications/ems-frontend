import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivedFieldsTabComponent } from './derived-fields-tab.component';

describe('DerivedFieldsTabComponent', () => {
  let component: DerivedFieldsTabComponent;
  let fixture: ComponentFixture<DerivedFieldsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DerivedFieldsTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedFieldsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
