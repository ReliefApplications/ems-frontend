import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeApplicationSummaryComponent } from './application-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, IconModule, MenuModule } from '@oort-front/ui';
import { SafeDateModule } from '../../../../pipes/date/date.module';

describe('SafeApplicationSummaryComponent', () => {
  let component: SafeApplicationSummaryComponent;
  let fixture: ComponentFixture<SafeApplicationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeApplicationSummaryComponent],
      imports: [
        TranslateModule.forRoot(),
        MenuModule,
        IconModule,
        SafeDateModule,
        ButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationSummaryComponent);
    component = fixture.componentInstance;
    component.application = {
      name: 'Dummy Application',
      createdAt: new Date(),
      status: undefined,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
