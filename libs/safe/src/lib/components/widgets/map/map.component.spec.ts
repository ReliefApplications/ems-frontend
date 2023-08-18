import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { SafeMapComponent } from './map.component';
import 'leaflet';
import 'L.esri';

describe('SafeMapComponent', () => {
  let component: SafeMapComponent;
  let fixture: ComponentFixture<SafeMapComponent>;
  let controller: ApolloTestingController;
  jest.mock('L.esri', () => ({
    ...jest.requireActual('L.esri'),
    Vector: { vectorBasemapLayer: jest.fn() },
  }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: {} }, //TODOTEST: find a way to include leaflet, this does not work
      ],
      declarations: [SafeMapComponent],
      imports: [TranslateModule.forRoot(), ApolloTestingModule],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMapComponent);
    component = fixture.componentInstance;
    component.settings = {
      centerLong: 0,
      centerLat: 0,
    };
    fixture.detectChanges();

    const op = controller.expectOne('GetQueryTypes');

    op.flush({
      data: {
        __schema: {
          types: [],
          queryType: {
            fields: [],
          },
        },
      },
    });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
