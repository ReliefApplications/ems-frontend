import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWidgetGridComponent } from './widget-grid.component';

describe('WhoWidgetGridComponent', () => {
  let component: WhoWidgetGridComponent;
  let fixture: ComponentFixture<WhoWidgetGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoWidgetGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoWidgetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
