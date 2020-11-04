import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoSharedComponent } from './who-shared.component';

describe('WhoSharedComponent', () => {
  let component: WhoSharedComponent;
  let fixture: ComponentFixture<WhoSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoSharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
