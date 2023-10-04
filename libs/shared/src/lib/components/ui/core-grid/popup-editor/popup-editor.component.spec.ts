import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEditorComponent } from './popup-editor.component';

describe('PopupEditorComponent', () => {
  let component: PopupEditorComponent;
  let fixture: ComponentFixture<PopupEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
