import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoTabSortComponent } from './tab-sort.component';

describe('WhoTabSortComponent', () => {
  let component: WhoTabSortComponent;
  let fixture: ComponentFixture<WhoTabSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoTabSortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoTabSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
