import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersMenuComponent } from './layers-menu.component';

describe('LayersMenuComponent', () => {
  let component: LayersMenuComponent;
  let fixture: ComponentFixture<LayersMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayersMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
