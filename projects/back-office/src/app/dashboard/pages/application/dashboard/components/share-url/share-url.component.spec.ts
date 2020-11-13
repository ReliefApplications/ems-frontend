import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareUrlComponent } from './share-url.component';

describe('ShareUrlComponent', () => {
  let component: ShareUrlComponent;
  let fixture: ComponentFixture<ShareUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
