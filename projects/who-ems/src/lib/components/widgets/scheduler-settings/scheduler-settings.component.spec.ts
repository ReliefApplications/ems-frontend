import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WhoSchedulerSettingsComponent } from './scheduler-settings.component';

describe('WhoSchedulerSettingsComponent', () => {
  let component: WhoSchedulerSettingsComponent;
  let fixture: ComponentFixture<WhoSchedulerSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoSchedulerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoSchedulerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
