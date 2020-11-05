import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoMapComponent } from './map.component';

describe('WhoMapComponent', () => {
  let component: WhoMapComponent;
  let fixture: ComponentFixture<WhoMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
