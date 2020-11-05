import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoGridComponent } from './grid.component';

describe('WhoGridComponent', () => {
  let component: WhoGridComponent;
  let fixture: ComponentFixture<WhoGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
