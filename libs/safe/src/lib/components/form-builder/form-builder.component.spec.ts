import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeFormBuilderComponent } from './form-builder.component';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SafeFormBuilderComponent', () => {
  let component: SafeFormBuilderComponent;
  let fixture: ComponentFixture<SafeFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TranslateService,
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
      ],
      declarations: [SafeFormBuilderComponent],
      imports: [
        DialogCdkModule,
        ApolloTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormBuilderComponent);
    component = fixture.componentInstance;
    component.form = {
      structure: 'Dummy Form',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
