import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonRendererComponent } from './polygon-renderer.component';

describe('PolygonRendererComponent', () => {
  let component: PolygonRendererComponent;
  let fixture: ComponentFixture<PolygonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolygonRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PolygonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
