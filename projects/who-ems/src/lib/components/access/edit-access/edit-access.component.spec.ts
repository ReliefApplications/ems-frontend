import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoEditAccessComponent } from './edit-access.component';

describe('WhoEditAccessComponent', () => {
  let component: WhoEditAccessComponent;
  let fixture: ComponentFixture<WhoEditAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoEditAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoEditAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
