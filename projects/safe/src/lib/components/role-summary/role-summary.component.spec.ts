import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRoleSummaryComponent } from './role-summary.component';

describe('SafeRoleSummaryComponent', () => {
  let component: SafeRoleSummaryComponent;
  let fixture: ComponentFixture<SafeRoleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeRoleSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRoleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
