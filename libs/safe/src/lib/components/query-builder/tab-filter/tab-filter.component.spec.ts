import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { SafeTabFilterComponent } from './tab-filter.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { GET_QUERY_TYPES } from '../graphql/queries';
import { SafeFilterModule } from '../../filter/filter.module';

describe('SafeTabFilterComponent', () => {
  let component: SafeTabFilterComponent;
  let fixture: ComponentFixture<SafeTabFilterComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, { provide: 'environment', useValue: {} }],
      declarations: [SafeTabFilterComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        SafeFilterModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabFilterComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      filters: new UntypedFormControl([]),
      logic: new UntypedFormControl(),
    });
    fixture.detectChanges();

    const op = controller.expectOne(GET_QUERY_TYPES);

    op.flush({
      data: {
        __schema: {
          types: [],
          queryType: { name: '', kind: '', fields: [] },
        },
      },
    });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
