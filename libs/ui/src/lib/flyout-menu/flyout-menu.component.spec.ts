import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyoutMenuComponent } from './flyout-menu.component';

describe('FlyoutMenuComponent', () => {
  let component: FlyoutMenuComponent;
  let fixture: ComponentFixture<FlyoutMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlyoutMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlyoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
