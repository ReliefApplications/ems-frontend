import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFormModalComponent } from './add-form-modal.component';
import { DialogRef, DialogModule } from '@angular/cdk/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateService,
  TranslateLoader,
  TranslateModule,
  TranslateFakeLoader,
} from '@ngx-translate/core';

describe('AddFormModalComponent', () => {
  let component: AddFormModalComponent;
  let fixture: ComponentFixture<AddFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddFormModalComponent,
        DialogModule,
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
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
