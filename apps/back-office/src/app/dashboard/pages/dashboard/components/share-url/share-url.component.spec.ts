import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ShareUrlComponent } from './share-url.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ButtonModule } from '@oort-front/ui';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ShareUrlComponent', () => {
  let component: ShareUrlComponent;
  let fixture: ComponentFixture<ShareUrlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShareUrlComponent],
      imports: [
        ButtonModule,
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
          provide: DialogRef, 
          useValue: {
            updateSize: jest.fn(),
          }
        },
        {
          provide: DIALOG_DATA,
          useValue: {}
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
