import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerGroupComponent } from './layer-group.component';

describe('LayerGroupComponent', () => {
  let component: LayerGroupComponent;
  let fixture: ComponentFixture<LayerGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LayerGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
