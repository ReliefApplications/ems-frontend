import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationSummaryComponent } from './application-summary.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { MenuModule } from '@oort-front/ui';

describe('ApplicationSummaryComponent', () => {
  let component: ApplicationSummaryComponent;
  let fixture: ComponentFixture<ApplicationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [ApplicationSummaryComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        MenuModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationSummaryComponent);
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
