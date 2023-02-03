import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedPointsPopupComponent } from './grouped-points-popup.component';

describe('GroupedPointsPopupComponent', () => {
  let component: GroupedPointsPopupComponent;
  let fixture: ComponentFixture<GroupedPointsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupedPointsPopupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedPointsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
