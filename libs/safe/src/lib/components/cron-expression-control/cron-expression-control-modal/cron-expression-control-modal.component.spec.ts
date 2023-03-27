import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronExpressionControlModalComponent } from './cron-expression-control-modal.component';

describe('CronExpressionControlModalComponent', () => {
  let component: CronExpressionControlModalComponent;
  let fixture: ComponentFixture<CronExpressionControlModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronExpressionControlModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CronExpressionControlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
