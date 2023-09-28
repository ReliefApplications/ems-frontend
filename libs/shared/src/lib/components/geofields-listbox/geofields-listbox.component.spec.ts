import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofieldsListboxComponent } from './geofields-listbox.component';

describe('GeofieldsListboxComponent', () => {
  let component: GeofieldsListboxComponent;
  let fixture: ComponentFixture<GeofieldsListboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeofieldsListboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GeofieldsListboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
