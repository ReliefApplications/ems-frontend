import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { EditContextModalComponent } from './edit-context-modal.component';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('EditContextModalComponent', () => {
  let component: EditContextModalComponent;
  let fixture: ComponentFixture<EditContextModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditContextModalComponent,
        ApolloTestingModule,
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
          provide: DIALOG_DATA,
          useValue: {},
        },
        {
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditContextModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
