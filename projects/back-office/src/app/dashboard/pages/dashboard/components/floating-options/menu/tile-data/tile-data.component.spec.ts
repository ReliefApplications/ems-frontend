import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileDataComponent } from './tile-data.component';

describe('TileDataComponent', () => {
  let component: TileDataComponent;
  let fixture: ComponentFixture<TileDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
