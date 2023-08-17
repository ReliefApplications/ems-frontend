import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabMainComponent } from './tab-main.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  DialogModule,
  GraphQLSelectModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
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
        DialogModule,
        TranslateModule.forRoot(),
        SelectMenuModule,
        GraphQLSelectModule,
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
      chart: new UntypedFormGroup({ type: new UntypedFormControl() }),
      resource: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
