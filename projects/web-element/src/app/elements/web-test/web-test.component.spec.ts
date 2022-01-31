import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebTestComponent } from './web-test.component';

describe('WebTestComponent', () => {
  let component: WebTestComponent;
  let fixture: ComponentFixture<WebTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
