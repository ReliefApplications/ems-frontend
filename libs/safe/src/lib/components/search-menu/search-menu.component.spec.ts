import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SafeSearchMenuComponent } from './search-menu.component';
import { IconModule } from '@oort-front/ui';
import { FormsModule } from '@angular/forms';

describe('SafeSearchMenuComponent', () => {
  let component: SafeSearchMenuComponent;
  let fixture: ComponentFixture<SafeSearchMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSearchMenuComponent],
      imports: [TranslateModule.forRoot(), IconModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSearchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
