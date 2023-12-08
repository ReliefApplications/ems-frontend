import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerDatasourceComponent } from './layer-datasource.component';

describe('LayerDatasourceComponent', () => {
  let component: LayerDatasourceComponent;
  let fixture: ComponentFixture<LayerDatasourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayerDatasourceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
