import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogListComponent } from './activity-log-list.component';

describe('ActivityLogListComponent', () => {
  let component: ActivityLogListComponent;
  let fixture: ComponentFixture<ActivityLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
