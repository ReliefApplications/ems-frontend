import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapQuestionStateRuleComponent } from './map-question-state-rule.component';

describe('MapQuestionStateRuleComponent', () => {
  let component: MapQuestionStateRuleComponent;
  let fixture: ComponentFixture<MapQuestionStateRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapQuestionStateRuleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapQuestionStateRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
