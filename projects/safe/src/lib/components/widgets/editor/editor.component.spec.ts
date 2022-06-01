import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEditorComponent } from './editor.component';

describe('SafeEditorComponent', () => {
  let component: SafeEditorComponent;
  let fixture: ComponentFixture<SafeEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SafeEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
