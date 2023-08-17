import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeWidgetTabHostComponent } from './widget-tab-host.component';

describe('WidgetTabHostComponent', () => {
  let component: SafeWidgetTabHostComponent;
  let fixture: ComponentFixture<SafeWidgetTabHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeWidgetTabHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeWidgetTabHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
