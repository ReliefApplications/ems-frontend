import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog, DialogRef , DIALOG_DATA } from '@angular/cdk/dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { AddLayoutModalComponent } from './add-layout-modal.component';

describe('AddLayoutModalComponent', () => {
  let component: AddLayoutModalComponent;
  let fixture: ComponentFixture<AddLayoutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        TranslateService,
      ],
      declarations: [AddLayoutModalComponent],
      imports: [
        DialogModule,
        MatSnackBarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLayoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
