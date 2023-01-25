import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayerDatasourceComponent } from './layer-datasource.component';

describe('SafeLayerDatasourceComponent', () => {
  let component: SafeLayerDatasourceComponent;
  let fixture: ComponentFixture<SafeLayerDatasourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayerDatasourceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayerDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
