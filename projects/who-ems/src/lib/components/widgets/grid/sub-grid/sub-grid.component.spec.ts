import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoSubGridComponent } from './sub-grid.component';

describe('WhoSubGridComponent', () => {
  let component: WhoSubGridComponent;
  let fixture: ComponentFixture<WhoSubGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoSubGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoSubGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
