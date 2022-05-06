import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeRecordModalComponent } from './record-modal.component';
import { DateTimeProvider, OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { environment } from 'projects/back-office/src/environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SafeRecordModalComponent', () => {
  let component: SafeRecordModalComponent;
  let fixture: ComponentFixture<SafeRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: environment },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
      ],
      declarations: [SafeRecordModalComponent],
      imports: [
        MatDialogModule,
        HttpClientModule,
        MatSnackBarModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
