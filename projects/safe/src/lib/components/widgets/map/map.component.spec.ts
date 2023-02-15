import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMapWidgetComponent } from './map.component';

describe('SafeMapWidgetComponent', () => {
  let component: SafeMapWidgetComponent;
  let fixture: ComponentFixture<SafeMapWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeMapWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeMapWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
