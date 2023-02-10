import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerComponent } from './layer.component';

describe('LayerComponent', () => {
  let component: LayerComponent;
  let fixture: ComponentFixture<LayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
