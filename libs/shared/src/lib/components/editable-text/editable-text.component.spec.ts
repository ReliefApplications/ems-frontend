import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableTextComponent } from './editable-text.component';

describe('EditableTextComponent', () => {
  let component: EditableTextComponent;
  let fixture: ComponentFixture<sharedEditableTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditableTextComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
