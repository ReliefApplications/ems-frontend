import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeDateFilterMenuComponent } from './date-filter-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { PopupModule } from '@progress/kendo-angular-popup';
import {
  ScrollSyncService,
  SinglePopupService,
} from '@progress/kendo-angular-grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { Renderer2 } from '@angular/core';
import { L10N_PREFIX, LocalizationService } from '@progress/kendo-angular-l10n';

describe('SafeDateFilterMenuComponent', () => {
  let component: SafeDateFilterMenuComponent;
  let fixture: ComponentFixture<SafeDateFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        SinglePopupService,
        Renderer2,
        ScrollSyncService,
        LocalizationService,
        { provide: L10N_PREFIX, useValue: '' }, //There probably is a module for all these services, do not know which
      ],
      declarations: [SafeDateFilterMenuComponent],
      imports: [
        TranslateModule.forRoot(),
        PopupModule,
        DropDownsModule,
        FormsModule,
        ReactiveFormsModule,
        DateInputsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeDateFilterMenuComponent);
    component = fixture.componentInstance;
    component.filter = { filters: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
