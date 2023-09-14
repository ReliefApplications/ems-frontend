import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicateApplicationModalComponent } from './duplicate-application-modal.component';
import {
  TranslateService,
  TranslateLoader,
  TranslateModule,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { DialogRef, DialogModule, DIALOG_DATA } from '@angular/cdk/dialog';

describe('DuplicateApplicationModalComponent', () => {
  let component: DuplicateApplicationModalComponent;
  let fixture: ComponentFixture<DuplicateApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogModule,
        ApolloTestingModule,
        DuplicateApplicationModalComponent,
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
            removePanelClass: jest.fn(),
          },
        },
        { provide: DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
