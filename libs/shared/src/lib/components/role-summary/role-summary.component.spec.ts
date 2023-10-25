import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSummaryComponent } from './role-summary.component';

describe('RoleSummaryComponent', () => {
  let component: RoleSummaryComponent;
  let fixture: ComponentFixture<RoleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
