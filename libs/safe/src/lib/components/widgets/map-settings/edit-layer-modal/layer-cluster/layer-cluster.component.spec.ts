import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerClusterComponent } from './layer-cluster.component';

describe('LayerClusterComponent', () => {
  let component: LayerClusterComponent;
  let fixture: ComponentFixture<LayerClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerClusterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
