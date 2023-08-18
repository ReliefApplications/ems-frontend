import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';
import { DialogModule } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { SafeEmptyModule } from '@oort-front/safe';
import { ButtonModule } from '@oort-front/ui';

describe('CalculatedFieldsTabComponent', () => {
  let component: CalculatedFieldsTabComponent;
  let fixture: ComponentFixture<CalculatedFieldsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatedFieldsTabComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        SafeEmptyModule,
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
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatedFieldsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
