import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RoleSummaryComponent } from './role-summary.component';
import { SafeRoleSummaryModule } from '@oort-front/safe';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { RoleSummaryRoutingModule } from './role-summary-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RoleSummaryComponent', () => {
  let component: RoleSummaryComponent;
  let fixture: ComponentFixture<RoleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleSummaryComponent],
      imports: [
        SafeRoleSummaryModule,
        ApolloTestingModule,
        RoleSummaryRoutingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        TranslateService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
