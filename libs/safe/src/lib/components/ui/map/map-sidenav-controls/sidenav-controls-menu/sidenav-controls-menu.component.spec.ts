import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayersMenuComponent } from './layers-menu.component';

describe('SafeLayersMenuComponent', () => {
  let component: SafeLayersMenuComponent;
  let fixture: ComponentFixture<SafeLayersMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayersMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeLayersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
