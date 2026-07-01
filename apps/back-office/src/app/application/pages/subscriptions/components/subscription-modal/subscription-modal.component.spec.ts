import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionModalComponent } from './subscription-modal.component';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  SpinnerModule,
  DividerModule,
  MenuModule,
  TooltipModule,
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  AutocompleteModule,
  GraphQLSelectModule,
  IconModule,
} from '@oort-front/ui';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';

describe('SubscriptionModalComponent', () => {
  let component: SubscriptionModalComponent;
  let fixture: ComponentFixture<SubscriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SubscriptionModalComponent,
        ApolloTestingModule,
        SpinnerModule,
        DividerModule,
        MenuModule,
        TooltipModule,
        ButtonModule,
        SelectMenuModule,
        FormWrapperModule,
        AutocompleteModule,
        GraphQLSelectModule,
        FormsModule,
        ReactiveFormsModule,
        IconModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        UntypedFormBuilder,
        TranslateService,
        {
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
          },
        },
        {
          provide: DIALOG_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionModalComponent);
    component = fixture.componentInstance;
    component.data = {
      channels: [],
      subscription: {
        routingKey: '',
        title: '',
        convertTo: {
          name: '',
        },
        channel: {},
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
