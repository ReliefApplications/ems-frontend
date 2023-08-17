import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeEditLayoutModalComponent } from './edit-layout-modal.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('SafeEditLayoutModalComponent', () => {
  let component: SafeEditLayoutModalComponent;
  let fixture: ComponentFixture<SafeEditLayoutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        TranslateService,
        { provide: DialogRef, useValue: { addPanelClass: jest.fn() } },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
      ],
      imports: [
        SafeEditLayoutModalComponent,
        DialogCdkModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditLayoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
