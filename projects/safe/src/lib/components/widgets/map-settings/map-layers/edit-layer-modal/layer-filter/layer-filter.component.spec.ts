import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayerFilterComponent } from './layer-filter.component';

describe('SafeLayerFilterComponent', () => {
  let component: SafeLayerFilterComponent;
  let fixture: ComponentFixture<SafeLayerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayerFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
