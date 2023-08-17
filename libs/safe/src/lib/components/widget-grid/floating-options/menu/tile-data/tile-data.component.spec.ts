import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { SafeTileDataComponent } from './tile-data.component';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { Component, EventEmitter } from '@angular/core';

/** Mocked component */
@Component({})
class MockedComponent {
  change = new EventEmitter();
}

describe('SafeTileDataComponent', () => {
  let component: SafeTileDataComponent;
  let fixture: ComponentFixture<SafeTileDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { addPanelClass: jest.fn() } },
        {
          provide: DIALOG_DATA,
          useValue: {
            tile: {},
            template: MockedComponent,
          },
        },
        { provide: 'environment', useValue: {} },
      ],
      declarations: [SafeTileDataComponent],
      imports: [
        DialogCdkModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        ButtonModule,
        DialogModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
