import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCoreComponent } from './grid-core.component';

describe('GridCoreComponent', () => {
  let component: GridCoreComponent;
  let fixture: ComponentFixture<GridCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridCoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
