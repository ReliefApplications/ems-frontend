import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMainComponent } from './tab-main.component';

describe('TabMainComponent', () => {
  let component: TabMainComponent;
  let fixture: ComponentFixture<TabMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
