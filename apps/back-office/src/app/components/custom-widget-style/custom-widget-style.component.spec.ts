import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWidgetStyleComponent } from './custom-widget-style.component';

describe('CustomWidgetStyleComponent', () => {
  let component: CustomWidgetStyleComponent;
  let fixture: ComponentFixture<CustomWidgetStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomWidgetStyleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomWidgetStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
