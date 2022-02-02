import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeRuleListComponent } from './rule-list.component';

describe('SafeRuleListComponent', () => {
  let component: SafeRuleListComponent;
  let fixture: ComponentFixture<SafeRuleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeRuleListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
