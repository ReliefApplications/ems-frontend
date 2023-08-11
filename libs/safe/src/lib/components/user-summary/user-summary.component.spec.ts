import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeUserSummaryComponent } from './user-summary.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SpinnerModule, TabsModule } from '@oort-front/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UserSummaryComponent', () => {
  let component: SafeUserSummaryComponent;
  let fixture: ComponentFixture<SafeUserSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TranslateService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
      declarations: [SafeUserSummaryComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TabsModule,
        BrowserAnimationsModule,
        SpinnerModule,
        TranslateModule.forRoot({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeUserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
