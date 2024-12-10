import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogGroupByUserComponent } from './activity-log-group-by-user.component';

describe('ActivityLogGroupByUserComponent', () => {
  let component: ActivityLogGroupByUserComponent;
  let fixture: ComponentFixture<ActivityLogGroupByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogGroupByUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLogGroupByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
