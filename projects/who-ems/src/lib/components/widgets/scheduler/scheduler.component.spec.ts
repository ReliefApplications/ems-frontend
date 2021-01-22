import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoSchedulerComponent } from './scheduler.component';

describe('WhoSchedulerComponent', () => {
  let component: WhoSchedulerComponent;
  let fixture: ComponentFixture<WhoSchedulerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
