import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFilterEditorComponent } from './date-filter-editor.component';

describe('DateFilterEditorComponent', () => {
  let component: DateFilterEditorComponent;
  let fixture: ComponentFixture<DateFilterEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateFilterEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFilterEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
