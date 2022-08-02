import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeAddRoleRuleComponent } from './add-role-rule.component';

describe('SafeAddRoleRuleComponent', () => {
  let component: SafeAddRoleRuleComponent;
  let fixture: ComponentFixture<SafeAddRoleRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAddRoleRuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddRoleRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
