import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CronExpressionControlModalComponent } from './cron-expression-control-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CronExpressionControlModalComponent', () => {
  let component: CronExpressionControlModalComponent;
  let fixture: ComponentFixture<CronExpressionControlModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
      ],
      imports: [
        CronExpressionControlModalComponent,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CronExpressionControlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
