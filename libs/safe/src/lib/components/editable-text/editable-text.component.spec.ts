import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeEditableTextComponent } from './editable-text.component';

describe('SafeEditableTextComponent', () => {
  let component: SafeEditableTextComponent;
  let fixture: ComponentFixture<SafeEditableTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeEditableTextComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditableTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
