import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CronExpressionControlComponent } from './cron-expression-control.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeReadableCronModule } from '../../pipes/readable-cron/readable-cron.module';
import {
  TooltipModule,
  FormWrapperModule,
  IconModule,
  ErrorMessageModule,
  DialogModule,
} from '@oort-front/ui';

describe('CronExpressionControlComponent', () => {
  let component: CronExpressionControlComponent;
  let fixture: ComponentFixture<CronExpressionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronExpressionControlComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot(),
        SafeReadableCronModule,
        IconModule,
        TooltipModule,
        FormWrapperModule,
        ErrorMessageModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CronExpressionControlComponent);
    component = fixture.componentInstance;
    component.ngControl = { errors: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
