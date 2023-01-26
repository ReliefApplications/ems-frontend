import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayerLabelsComponent } from './layer-labels.component';

describe('SafeLayerLabelsComponent', () => {
  let component: SafeLayerLabelsComponent;
  let fixture: ComponentFixture<SafeLayerLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayerLabelsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayerLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
