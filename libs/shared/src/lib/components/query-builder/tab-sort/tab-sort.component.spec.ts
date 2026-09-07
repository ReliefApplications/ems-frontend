import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { TabSortComponent } from './tab-sort.component';
import { createSortRowForm } from '../query-builder-forms';

describe('TabSortComponent', () => {
  let component: TabSortComponent;
  let fixture: ComponentFixture<TabSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [TabSortComponent],
      imports: [
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
    fixture = TestBed.createComponent(TabSortComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      sort: new UntypedFormArray([createSortRowForm(null)]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with a single empty sort row', () => {
    expect(component.sortRows.length).toBe(1);
    expect(component.sortRows.value).toEqual([{ field: '', order: 'asc' }]);
  });

  it('adds a new empty row', () => {
    component.addRow();
    expect(component.sortRows.length).toBe(2);
  });

  it('clears the last remaining row instead of removing it', () => {
    component.sortRows.at(0).setValue({ field: 'lastname', order: 'desc' });
    component.removeRow(0);
    expect(component.sortRows.length).toBe(1);
    expect(component.sortRows.value).toEqual([{ field: '', order: 'asc' }]);
  });

  it('removes a row when more than one exists', () => {
    component.addRow();
    component.sortRows.at(1).setValue({ field: 'lastname', order: 'desc' });
    component.removeRow(0);
    expect(component.sortRows.length).toBe(1);
    expect(component.sortRows.value).toEqual([
      { field: 'lastname', order: 'desc' },
    ]);
  });

  it('reorders rows on drop, preserving values by priority', () => {
    component.sortRows.at(0).setValue({ field: 'priority_flag', order: 'asc' });
    component.addRow();
    component.sortRows.at(1).setValue({ field: 'lastname', order: 'desc' });
    const [firstControl, secondControl] = component.sortRows.controls;

    component.drop({ previousIndex: 0, currentIndex: 1 } as any);

    // The control instances themselves must move (not just their values),
    // so the *ngFor repeater picks up the new order and the bound controls
    // refresh on screen immediately.
    expect(component.sortRows.controls[0]).toBe(secondControl);
    expect(component.sortRows.controls[1]).toBe(firstControl);
    expect(component.sortRows.value).toEqual([
      { field: 'lastname', order: 'desc' },
      { field: 'priority_flag', order: 'asc' },
    ]);
  });
});
