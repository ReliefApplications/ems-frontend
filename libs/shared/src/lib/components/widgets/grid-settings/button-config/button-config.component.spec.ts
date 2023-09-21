import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonConfigComponent } from './button-config.component';

describe('ButtonConfigComponent', () => {
  let component: ButtonConfigComponent;
  let fixture: ComponentFixture<ButtonConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonConfigComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
