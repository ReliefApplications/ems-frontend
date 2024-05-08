import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStageComponent } from './user-stage.component';

describe('LabelStageComponent', () => {
  let component: UserStageComponent;
  let fixture: ComponentFixture<UserStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
