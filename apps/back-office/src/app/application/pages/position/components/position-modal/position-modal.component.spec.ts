import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef,DIALOG_DATA } from '@angular/cdk/dialog';
import { PositionModalComponent } from './position-modal.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('PositionModalComponent', () => {
  let component: PositionModalComponent;
  let fixture: ComponentFixture<PositionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PositionModalComponent,
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
          },
        },
        {
          provide: DIALOG_DATA,
          useValue: {}
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
