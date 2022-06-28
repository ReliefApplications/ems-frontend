import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullJobModalComponent } from './pull-job-modal.component';

describe('PullJobModalComponent', () => {
  let component: PullJobModalComponent;
  let fixture: ComponentFixture<PullJobModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PullJobModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
