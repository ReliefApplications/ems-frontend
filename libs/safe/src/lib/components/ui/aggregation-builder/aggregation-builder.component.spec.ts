import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
} from '@angular/forms';
import { SafeAggregationBuilderComponent } from './aggregation-builder.component';
import { HttpClientModule } from '@angular/common/http';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES } from './graphql/queries';
import { SafeTagboxModule } from '../tagbox/tagbox.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipelineModule } from './pipeline/pipeline.module';

describe('SafeAggregationBuilderComponent', () => {
  let component: SafeAggregationBuilderComponent;
  let fixture: ComponentFixture<SafeAggregationBuilderComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, { provide: 'environment', useValue: {} }],
      declarations: [SafeAggregationBuilderComponent],
      imports: [
        HttpClientModule,
        ApolloTestingModule,
        SafeTagboxModule,
        SafePipelineModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAggregationBuilderComponent);
    component = fixture.componentInstance;
    component.resource = {};
    component.aggregationForm = new FormGroup({
      pipeline: new UntypedFormArray([]),
    });
    fixture.detectChanges();

    const op1 = controller.expectOne(GET_QUERY_TYPES);

    op1.flush({
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
