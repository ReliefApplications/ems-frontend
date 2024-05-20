import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDataVariablesMappingComponent } from './reference-data-variables-mapping.component';

describe('ReferenceDataVariablesMappingComponent', () => {
  let component: ReferenceDataVariablesMappingComponent;
  let fixture: ComponentFixture<ReferenceDataVariablesMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceDataVariablesMappingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferenceDataVariablesMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
