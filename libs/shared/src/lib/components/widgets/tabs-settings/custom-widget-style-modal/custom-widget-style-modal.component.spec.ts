import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWidgetStyleModalComponent } from './custom-widget-style-modal.component';

describe('CustomWidgetStyleModalComponent', () => {
  let component: CustomWidgetStyleModalComponent;
  let fixture: ComponentFixture<CustomWidgetStyleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomWidgetStyleModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomWidgetStyleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
