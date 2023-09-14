import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeAddUserComponent } from './add-user.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import {
  AutocompleteModule,
  ButtonModule,
  DialogModule,
  SelectMenuModule,
} from '@oort-front/ui';

describe('SafeAddUserComponent', () => {
  let component: SafeAddUserComponent;
  let fixture: ComponentFixture<SafeAddUserComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { users: [] } },
      ],
      declarations: [SafeAddUserComponent],
      imports: [
        DialogModule,
        ButtonModule,
        SelectMenuModule,
        TranslateModule.forRoot(),
        AutocompleteModule,
        ApolloTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne('GetUsers');

    op.flush({
      data: {
        users: [],
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
