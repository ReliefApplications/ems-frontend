import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeCoreGridComponent } from './core-grid.component';
import { UntypedFormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES } from './graphql/queries';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppAbility } from '../../../services/auth/auth.service';
import { SafeGridModule } from './grid/grid.module';

describe('SafeCoreGridComponent', () => {
  let component: SafeCoreGridComponent;
  let fixture: ComponentFixture<SafeCoreGridComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
        UntypedFormBuilder,
        QueryBuilderService,
        AppAbility,
      ],
      declarations: [SafeCoreGridComponent],
      imports: [
        OAuthModule.forRoot(),
        HttpClientModule,
        DialogCdkModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        SafeGridModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeCoreGridComponent);
    component = fixture.componentInstance;
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
