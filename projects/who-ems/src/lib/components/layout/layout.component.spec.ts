import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoLayoutComponent } from './layout.component';

describe('WhoLayoutComponent', () => {
  let component: WhoLayoutComponent;
  let fixture: ComponentFixture<WhoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
