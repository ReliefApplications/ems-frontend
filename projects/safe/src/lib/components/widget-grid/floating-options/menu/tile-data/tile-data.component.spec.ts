import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule, TranslateService, TranslateFakeLoader, TranslateLoader } from '@ngx-translate/core';

import { SafeTileDataComponent } from './tile-data.component';

describe('SafeTileDataComponent', () => {
  let component: SafeTileDataComponent;
  let fixture: ComponentFixture<SafeTileDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        providers: [
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} },
          TranslateService
        ],
        declarations: [SafeTileDataComponent],
        imports: [
          MatDialogModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          }),
        ]
      }).compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
