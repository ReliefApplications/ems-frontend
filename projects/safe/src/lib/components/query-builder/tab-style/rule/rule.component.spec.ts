import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRuleComponent } from './rule.component';

describe('SafeRuleComponent', () => {
  let component: SafeRuleComponent;
  let fixture: ComponentFixture<SafeRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
