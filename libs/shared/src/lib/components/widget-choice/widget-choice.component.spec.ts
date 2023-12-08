import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetChoiceComponent } from './widget-choice.component';

describe('WidgetChoiceComponent', () => {
  let component: WidgetChoiceComponent;
  let fixture: ComponentFixture<WidgetChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetChoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
