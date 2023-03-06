import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronExpressionControlComponent } from './cron-expression-control.component';

describe('CronExpressionControlComponent', () => {
  let component: CronExpressionControlComponent;
  let fixture: ComponentFixture<CronExpressionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronExpressionControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CronExpressionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
