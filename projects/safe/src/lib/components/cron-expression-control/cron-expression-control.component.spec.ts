import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeCronExpressionControlComponent } from './cron-expression-control.component';

describe('SafeCronExpressionControlComponent', () => {
  let component: SafeCronExpressionControlComponent;
  let fixture: ComponentFixture<SafeCronExpressionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeCronExpressionControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeCronExpressionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
