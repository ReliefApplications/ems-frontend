import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChannelModalComponent } from './channel-modal.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('ChannelModalComponent', () => {
  let component: ChannelModalComponent;
  let fixture: ComponentFixture<ChannelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChannelModalComponent,
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
          useValue: {
            channel: {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
