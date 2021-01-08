import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoExpandedWidgetComponent } from './expanded-widget.component';

describe('WhoExpandedWidgetComponent', () => {
  let component: WhoExpandedWidgetComponent;
  let fixture: ComponentFixture<WhoExpandedWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoExpandedWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoExpandedWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
