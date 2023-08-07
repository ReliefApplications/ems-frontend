import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarComponent } from './snackbar.component';
import { SnackbarModule } from './snackbar.module';
import { SNACKBAR_DATA, SnackBarData } from './snackbar.token';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { BehaviorSubject } from 'rxjs';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackbarComponent],
      imports: [SnackbarModule, TranslateTestingModule],
      providers: [
        {
          provide: SNACKBAR_DATA,
          useValue: new BehaviorSubject<SnackBarData>({} as SnackBarData),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
