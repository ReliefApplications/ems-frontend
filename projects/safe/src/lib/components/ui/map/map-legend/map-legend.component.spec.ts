import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMapLegendComponent } from './map-legend.component';

describe('SafeMapLegendComponent', () => {
  let component: SafeMapLegendComponent;
  let fixture: ComponentFixture<SafeMapLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeMapLegendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeMapLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
