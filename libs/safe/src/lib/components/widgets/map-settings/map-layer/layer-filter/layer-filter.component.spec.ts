import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerFilterComponent } from './layer-filter.component';

describe('LayerFilterComponent', () => {
  let component: LayerFilterComponent;
  let fixture: ComponentFixture<LayerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
