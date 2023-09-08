import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef } from '@angular/cdk/dialog';
import { AddReferenceDataComponent } from './add-reference-data.component';
import { DialogModule } from '@oort-front/ui';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AddReferenceDataComponent', () => {
  let component: AddReferenceDataComponent;
  let fixture: ComponentFixture<AddReferenceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReferenceDataComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
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
          },
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReferenceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
