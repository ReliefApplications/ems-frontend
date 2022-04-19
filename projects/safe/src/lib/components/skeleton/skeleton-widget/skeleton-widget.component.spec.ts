import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSkeletonWidgetComponent as SkeletonWidgetComponent } from './skeleton-widget.component';

describe('SkeletonWidgetComponent', () => {
  let component: SkeletonWidgetComponent;
  let fixture: ComponentFixture<SkeletonWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkeletonWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
