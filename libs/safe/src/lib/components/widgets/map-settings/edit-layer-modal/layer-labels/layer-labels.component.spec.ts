import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerLabelsComponent } from './layer-labels.component';

describe('LayerLabelsComponent', () => {
  let component: LayerLabelsComponent;
  let fixture: ComponentFixture<LayerLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerLabelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
