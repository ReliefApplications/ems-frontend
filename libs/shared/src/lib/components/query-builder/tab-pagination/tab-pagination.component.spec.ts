import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPaginationComponent } from './tab-pagination.component';

describe('TabPaginationComponent', () => {
  let component: TabPaginationComponent;
  let fixture: ComponentFixture<sharedTabPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabPaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
