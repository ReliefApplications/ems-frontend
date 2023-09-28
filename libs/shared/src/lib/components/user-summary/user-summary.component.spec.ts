import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSummaryComponent } from './user-summary.component';

describe('UserSummaryComponent', () => {
  let component: UserSummaryComponent;
  let fixture: ComponentFixture<sharedUserSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
