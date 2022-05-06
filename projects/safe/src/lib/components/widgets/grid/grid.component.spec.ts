import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'projects/back-office/src/environments/environment';
import { SafeGridWidgetComponent } from './grid.component';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService, TranslateFakeLoader, TranslateLoader } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';


describe('SafeGridWidgetComponent', () => {
  let component: SafeGridWidgetComponent;
  let fixture: ComponentFixture<SafeGridWidgetComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: 'environment', useValue: environment },
          OAuthService,
          UrlHelperService,
          OAuthLogger,
          DateTimeProvider,
          TranslateService,
          FormBuilder
        ],
        declarations: [SafeGridWidgetComponent],
        imports: [
          MatDialogModule,
          MatSnackBarModule,
          RouterTestingModule,
          HttpClientModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          }),
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridWidgetComponent);
    component = fixture.componentInstance;
    component.settings = {
      resource: {},
      layout: {},
      query: {}
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
