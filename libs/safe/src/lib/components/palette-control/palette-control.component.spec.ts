import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafePaletteControlComponent } from './palette-control.component';

describe('SafePaletteControlComponent', () => {
  let component: SafePaletteControlComponent;
  let fixture: ComponentFixture<SafePaletteControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafePaletteControlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePaletteControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
