import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeApplicationDropdownComponent } from './application-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_APPLICATIONS } from './graphql/queries';
import { FormWrapperModule, SelectMenuModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SafeApplicationDropdownComponent', () => {
  let component: SafeApplicationDropdownComponent;
  let fixture: ComponentFixture<SafeApplicationDropdownComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeApplicationDropdownComponent],
      imports: [
        TranslateModule.forRoot(),
        ApolloTestingModule,
        SelectMenuModule,
        FormWrapperModule,
        ReactiveFormsModule,
        FormsModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_APPLICATIONS);

    op.flush({
      data: {
        applications: {
          edges: [],
          totalCount: '',
          pageInfo: {
            hasNextPage: '',
            endCursor: '',
          },
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
