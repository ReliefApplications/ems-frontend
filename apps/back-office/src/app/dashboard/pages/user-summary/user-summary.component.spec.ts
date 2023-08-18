import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserSummaryComponent } from './user-summary.component';
import { SafeUserSummaryModule } from '@oort-front/safe';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserSummaryComponent', () => {
  let component: UserSummaryComponent;
  let fixture: ComponentFixture<UserSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSummaryComponent],
      imports: [
        SafeUserSummaryModule,
        ApolloTestingModule,
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
    fixture = TestBed.createComponent(UserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
