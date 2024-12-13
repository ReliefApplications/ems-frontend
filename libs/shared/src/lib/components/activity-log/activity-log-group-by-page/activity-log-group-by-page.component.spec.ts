import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogGroupByPageComponent } from './activity-log-group-by-page.component';

describe('ActivityLogGroupByPageComponent', () => {
  let component: ActivityLogGroupByPageComponent;
  let fixture: ComponentFixture<ActivityLogGroupByPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogGroupByPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLogGroupByPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
