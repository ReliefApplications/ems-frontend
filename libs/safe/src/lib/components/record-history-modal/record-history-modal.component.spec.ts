import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { RecordHistoryModalComponent } from './record-history-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HistoryModalComponent', () => {
  let component: RecordHistoryModalComponent;
  let fixture: ComponentFixture<RecordHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: DialogRef,
          useValue: { removePanelClass: jest.fn(), addPanelClass: jest.fn() },
        },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
      ],
      imports: [
        DialogCdkModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ApolloTestingModule,
        RecordHistoryModalComponent,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
