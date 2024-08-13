import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMapQuestionStateComponent } from './tab-map-question-state.component';

describe('TabMapQuestionStateComponent', () => {
  let component: TabMapQuestionStateComponent;
  let fixture: ComponentFixture<TabMapQuestionStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabMapQuestionStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabMapQuestionStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
