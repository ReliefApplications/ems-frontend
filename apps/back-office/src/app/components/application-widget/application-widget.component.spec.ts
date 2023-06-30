import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationWidgetComponent } from './application-widget.component';

describe('TabsComponent', () => {
  let component: ApplicationWidgetComponent;
  let fixture: ComponentFixture<ApplicationWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
