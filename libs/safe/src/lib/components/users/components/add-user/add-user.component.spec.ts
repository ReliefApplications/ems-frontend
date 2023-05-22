import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { Dialog, DialogRef , DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeAddUserComponent } from './add-user.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';

describe('SafeAddUserComponent', () => {
  let component: SafeAddUserComponent;
  let fixture: ComponentFixture<SafeAddUserComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: { users: [] } },
        TranslateService,
      ],
      declarations: [SafeAddUserComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        MatAutocompleteModule,
        ApolloTestingModule,
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
