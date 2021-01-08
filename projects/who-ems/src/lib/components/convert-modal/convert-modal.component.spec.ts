import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoConvertModalComponent } from './convert-modal.component';

describe('WhoConvertModalComponent', () => {
  let component: WhoConvertModalComponent;
  let fixture: ComponentFixture<WhoConvertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoConvertModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoConvertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
