import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorQuestionComponent } from './editor-question.component';

describe('EditorQuestionComponent', () => {
  let component: EditorQuestionComponent;
  let fixture: ComponentFixture<EditorQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditorQuestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
