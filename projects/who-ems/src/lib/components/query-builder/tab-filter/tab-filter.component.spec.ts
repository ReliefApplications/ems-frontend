import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoTabFilterComponent } from './tab-filter.component';

describe('WhoTabFilterComponent', () => {
  let component: WhoTabFilterComponent;
  let fixture: ComponentFixture<WhoTabFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoTabFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoTabFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
