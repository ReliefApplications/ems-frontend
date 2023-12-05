import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDataSelectComponent } from './reference-data-select.component';

describe('ReferenceDataSelectComponent', () => {
  let component: ReferenceDataSelectComponent;
  let fixture: ComponentFixture<ReferenceDataSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceDataSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferenceDataSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
