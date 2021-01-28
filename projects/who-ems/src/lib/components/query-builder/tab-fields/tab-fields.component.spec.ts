import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoTabFieldsComponent } from './tab-fields.component';

describe('WhoTabFieldsComponent', () => {
  let component: WhoTabFieldsComponent;
  let fixture: ComponentFixture<WhoTabFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoTabFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoTabFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
