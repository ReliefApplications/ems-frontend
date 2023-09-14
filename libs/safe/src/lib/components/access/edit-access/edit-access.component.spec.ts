import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SafeEditAccessComponent } from './edit-access.component';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_ROLES } from './graphql/queries';
import { ButtonModule, DialogModule, SelectMenuModule } from '@oort-front/ui';

describe('SafeEditAccessComponent', () => {
  let component: SafeEditAccessComponent;
  let fixture: ComponentFixture<SafeEditAccessComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
      ],
      declarations: [SafeEditAccessComponent],
      imports: [
        DialogCdkModule,
        SelectMenuModule,
        DialogModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_ROLES);

    op.flush({
      data: { roles: [] },
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
