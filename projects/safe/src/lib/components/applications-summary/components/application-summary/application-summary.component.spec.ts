import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeApplicationSummaryComponent } from './application-summary.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';

describe('SafeApplicationSummaryComponent', () => {
  let component: SafeApplicationSummaryComponent;
  let fixture: ComponentFixture<SafeApplicationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeApplicationSummaryComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        MatMenuModule,
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
