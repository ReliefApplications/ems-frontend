import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteControlComponent } from './palette-control.component';

describe('PaletteControlComponent', () => {
  let component: PaletteControlComponent;
  let fixture: ComponentFixture<PaletteControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaletteControlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
