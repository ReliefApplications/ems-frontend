import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterSettingsModalComponent } from './filter-settings-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('FilterSettingsModalComponent', () => {
  let component: FilterSettingsModalComponent;
  let fixture: ComponentFixture<FilterSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
      ],
      imports: [FilterSettingsModalComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
