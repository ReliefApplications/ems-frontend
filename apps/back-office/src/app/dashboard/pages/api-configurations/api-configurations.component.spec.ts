import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ApiConfigurationsComponent } from './api-configurations.component';
import { DialogModule } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { PureAbility } from '@casl/ability';
import {
  ChipModule,
  MenuModule,
  SpinnerModule,
  SelectMenuModule,
  TableModule,
  DialogModule as DialgModule,
  FormWrapperModule,
  PaginatorModule,
  ErrorMessageModule,
  IconModule,
  ButtonModule
} from '@oort-front/ui';
import { SafeSkeletonTableModule } from '@oort-front/safe';
import { FormsModule } from '@angular/forms';

describe('ApiConfigurationsComponent', () => {
  let component: ApiConfigurationsComponent;
  let fixture: ComponentFixture<ApiConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiConfigurationsComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        IconModule,
        ButtonModule,
        AbilityModule,
        ChipModule,
        MenuModule,
        SpinnerModule,
        SelectMenuModule,
        TableModule,
        FormWrapperModule,
        PaginatorModule,
        ErrorMessageModule,
        DialgModule,
        SafeSkeletonTableModule,
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [TranslateService, PureAbility]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
