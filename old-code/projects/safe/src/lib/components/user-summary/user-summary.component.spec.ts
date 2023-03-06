import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeUserSummaryComponent } from './user-summary.component';

describe('UserSummaryComponent', () => {
  let component: SafeUserSummaryComponent;
  let fixture: ComponentFixture<SafeUserSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeUserSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeUserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
