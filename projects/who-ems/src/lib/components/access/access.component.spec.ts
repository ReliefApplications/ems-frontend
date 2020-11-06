import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoAccessComponent } from './access.component';

describe('WhoAccessComponent', () => {
  let component: WhoAccessComponent;
  let fixture: ComponentFixture<WhoAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
