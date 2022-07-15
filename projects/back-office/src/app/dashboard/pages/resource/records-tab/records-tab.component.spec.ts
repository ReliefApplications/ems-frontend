import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsTabComponent } from './records-tab.component';

describe('RecordsTabComponent', () => {
  let component: RecordsTabComponent;
  let fixture: ComponentFixture<RecordsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
