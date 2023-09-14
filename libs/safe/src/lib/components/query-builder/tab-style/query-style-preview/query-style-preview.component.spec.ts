import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeQueryStylePreviewComponent } from './query-style-preview.component';

describe('SafeQueryStylePreviewComponent', () => {
  let component: SafeQueryStylePreviewComponent;
  let fixture: ComponentFixture<SafeQueryStylePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeQueryStylePreviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeQueryStylePreviewComponent);
    component = fixture.componentInstance;
    component.style = {
      background: {
        color: '',
      },
      text: {
        color: '',
        bold: false,
        underline: false,
        italic: false,
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
