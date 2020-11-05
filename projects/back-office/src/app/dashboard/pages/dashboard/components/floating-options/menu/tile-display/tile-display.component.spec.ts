import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileDisplayComponent } from './tile-display.component';

describe('TileDisplayComponent', () => {
  let component: TileDisplayComponent;
  let fixture: ComponentFixture<TileDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
