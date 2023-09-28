import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlWidgetContentComponent } from './html-widget-content.component';

describe('HtmlWidgetContentComponent', () => {
  let component: HtmlWidgetContentComponent;
  let fixture: ComponentFixture<HtmlWidgetContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HtmlWidgetContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HtmlWidgetContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
