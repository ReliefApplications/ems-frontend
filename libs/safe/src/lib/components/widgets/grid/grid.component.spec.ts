import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { SafeGridWidgetComponent } from './grid.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormBuilder } from '@angular/forms';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES, GET_USER_ROLES_PERMISSIONS } from './graphql/queries';
import { AppAbility } from '../../../services/auth/auth.service';
import { SafeCoreGridModule } from '../../ui/core-grid/core-grid.module';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeGridWidgetComponent', () => {
  let component: SafeGridWidgetComponent;
  let fixture: ComponentFixture<SafeGridWidgetComponent>;
  let controller: ApolloTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        UntypedFormBuilder,
        AppAbility,
      ],
      declarations: [SafeGridWidgetComponent],
      imports: [
        OAuthModule.forRoot(),
        DialogCdkModule,
        RouterTestingModule,
        HttpClientModule,
        SafeCoreGridModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridWidgetComponent);
    component = fixture.componentInstance;
    component.settings = {
      resource: {},
      layout: {},
      query: {},
    };
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

    const op2 = controller.expectOne(GET_USER_ROLES_PERMISSIONS);

    op2.flush({ data: { resource: { canCreateRecords: '' } } });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
