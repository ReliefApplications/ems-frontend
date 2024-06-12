import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { ButtonModule } from '../button/button.module';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { TooltipModule } from '../tooltip/tooltip.module';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
      providers: [
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        { provide: DialogRef, useValue: { removePanelClass: () => {} } },
      ],
      imports: [
        ButtonModule,
        TooltipModule,
        TranslateTestingModule.withTranslations('en', {
          common: {
            close: 'Close',
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
