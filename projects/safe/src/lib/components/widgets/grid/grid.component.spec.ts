import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGridWidgetComponent } from './grid.component';

describe('SafeGridWidgetComponent', () => {
  let component: SafeGridWidgetComponent;
  let fixture: ComponentFixture<SafeGridWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeGridWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
