import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersMenuItemComponent } from './layers-menu-item.component';

describe('LayersMenuItemComponent', () => {
  let component: LayersMenuItemComponent;
  let fixture: ComponentFixture<LayersMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayersMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayersMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
