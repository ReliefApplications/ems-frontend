import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabClorophletComponent } from './tab-clorophlet.component';

describe('TabClorophletComponent', () => {
  let component: TabClorophletComponent;
  let fixture: ComponentFixture<TabClorophletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabClorophletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabClorophletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
