import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSchedulerComponent } from './scheduler.component';

describe('SafeSchedulerComponent', () => {
  let component: SafeSchedulerComponent;
  let fixture: ComponentFixture<SafeSchedulerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SafeSchedulerComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
