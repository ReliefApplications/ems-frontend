import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullJobsComponent } from './pull-jobs.component';

describe('PullJobsComponent', () => {
  let component: PullJobsComponent;
  let fixture: ComponentFixture<PullJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PullJobsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
