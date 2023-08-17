import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabMainComponent } from './tab-main.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import {
  GraphQLSelectModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('TabMainComponent', () => {
  let component: TabMainComponent;
  let fixture: ComponentFixture<TabMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabMainComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        TooltipModule,
        GraphQLSelectModule,
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMainComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({
      title: new UntypedFormControl(),
      resource: new UntypedFormControl(),
      template: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
