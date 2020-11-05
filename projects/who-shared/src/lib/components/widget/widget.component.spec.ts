import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWidgetComponent } from './widget.component';

describe('WhoWidgetComponent', () => {
  let component: WhoWidgetComponent;
  let fixture: ComponentFixture<WhoWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
