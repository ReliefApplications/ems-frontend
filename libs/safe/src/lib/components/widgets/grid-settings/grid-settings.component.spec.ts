import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SafeGridSettingsComponent } from './grid-settings.component';
import { GET_CHANNELS, GET_QUERY_TYPES } from './graphql/queries';
import {
  AutocompleteModule,
  IconModule,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { AppAbility } from '../../../services/auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeGridSettingsComponent', () => {
  let component: SafeGridSettingsComponent;
  let fixture: ComponentFixture<SafeGridSettingsComponent>;
  let controller: ApolloTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: {} },
        AppAbility,
      ],
      declarations: [SafeGridSettingsComponent],
      imports: [
        OAuthModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        TooltipModule,
        IconModule,
        TabsModule,
        TranslateModule.forRoot(),
        AutocompleteModule,
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridSettingsComponent);
    component = fixture.componentInstance;
    component.tile = { settings: {} };
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

    const op2 = controller.expectOne(GET_CHANNELS);

    op2.flush({
      data: { channels: [] },
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
