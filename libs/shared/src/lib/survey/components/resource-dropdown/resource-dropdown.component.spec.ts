import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { ResourceDropdownComponent } from './resource-dropdown.component';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_RESOURCES } from './graphql/queries';

describe('ResourceDropdownComponent', () => {
  let component: ResourceDropdownComponent;
  let fixture: ComponentFixture<ResourceDropdownComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [ResourceDropdownComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_RESOURCES);

    op.flush({
      data: {
        resources: {
          edges: [],
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
