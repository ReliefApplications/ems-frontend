import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeQueryStyleComponent } from './query-style.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { SafeFilterModule } from '../../../filter/filter.module';
import { ButtonModule, RadioModule } from '@oort-front/ui';
import { InputsModule } from '@progress/kendo-angular-inputs';

describe('SafeQueryStyleComponent', () => {
  let component: SafeQueryStyleComponent;
  let fixture: ComponentFixture<SafeQueryStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [],
      declarations: [SafeQueryStyleComponent],
      imports: [
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        SafeFilterModule,
        ButtonModule,
        InputsModule,
        RadioModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeQueryStyleComponent);
    component = fixture.componentInstance;
    component.query = { fields: [] };
    component.form = new UntypedFormGroup({
      name: new UntypedFormControl(),
      background: new UntypedFormGroup({ color: new UntypedFormControl() }),
      text: new UntypedFormGroup({ color: new UntypedFormControl() }),
      fields: new UntypedFormArray([]),
      filter: new UntypedFormGroup({
        logic: new UntypedFormControl(),
        filters: new UntypedFormArray([]),
      }),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
