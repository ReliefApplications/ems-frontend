import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ApplicationsComponent } from './applications.component';
import { DialogModule } from '@oort-front/ui';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { PureAbility } from '@casl/ability';
import {
  ButtonModule,
  MenuModule,
  DividerModule,
  SpinnerModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TableModule,
  ChipModule,
  PaginatorModule,
  DateModule,
} from '@oort-front/ui';
import {
  AccessModule,
  ApplicationsSummaryModule,
  SkeletonTableModule,
  DateModule,
} from '@oort-front/shared';
import { FilterComponent } from './components/filter/filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ApplicationsComponent', () => {
  let component: ApplicationsComponent;
  let fixture: ComponentFixture<ApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationsComponent, FilterComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        AbilityModule,
        ButtonModule,
        MenuModule,
        DividerModule,
        SpinnerModule,
        FormWrapperModule,
        IconModule,
        SelectMenuModule,
        TableModule,
        ChipModule,
        PaginatorModule,
        DateModule,
        AccessModule,
        ApplicationsSummaryModule,
        SkeletonTableModule,
        DateModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [TranslateService, PureAbility],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
