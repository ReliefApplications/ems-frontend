import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddApiConfigurationComponent } from './add-api-configuration.component';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { ButtonModule, ErrorMessageModule, DialogModule } from '@oort-front/ui';
//ISSUE
describe('AddApiConfigurationComponent', () => {
  let component: AddApiConfigurationComponent;
  let fixture: ComponentFixture<AddApiConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddApiConfigurationComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        ErrorMessageModule,
        DialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        TranslateService,
        UntypedFormBuilder,
        {
          provide: DialogRef, 
          useValue: {
            updateSize: jest.fn(),
          }
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApiConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
