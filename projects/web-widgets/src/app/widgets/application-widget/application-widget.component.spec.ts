import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationWidgetComponent } from './application-widget.component';

describe('ApplicationWidgetComponent', () => {
  let component: ApplicationWidgetComponent;
  let fixture: ComponentFixture<ApplicationWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
