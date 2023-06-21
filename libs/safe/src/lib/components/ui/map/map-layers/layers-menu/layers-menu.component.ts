import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  CheckboxModule,
  RadioModule,
} from '@oort-front/ui';
import { MapComponent } from '../../map.component';
import * as L from 'leaflet';
import { LayersMenuItemComponent } from '../layers-menu-item/layers-menu-item.component';
import { LayersMenuBasemapComponent } from '../layers-menu-basemap/layers-menu-basemap.component';

//======================TEST DATA

/*const osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
});

const osmBw = L.tileLayer(
  'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
  { attribution: '© OpenStreetMap contributors' }
);

const thunderAttr = {
  attribution: '© OpenStreetMap contributors. Tiles courtesy of Andy Allan',
};
const transport = L.tileLayer(
  '//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
  thunderAttr
);

const cycle = L.tileLayer(
  '//{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
  thunderAttr
);
const baseTree = [
  {
    label: 'BaseLayers',
    noShow: true,
    children: [
      {
        label: 'OpenStreeMap',
        layer: osm,
        children: [{ label: 'B&W', layer: osmBw, name: 'OpenStreeMap B&W' }],
      },
      {
        label: 'Thunder',
        children: [
          { label: 'Cycle', layer: cycle },
          { label: 'Transport', layer: transport },
        ],
      },
    ],
  },
];*/

/**
 *test data
 */
const overlayTree = [
  {
    label: 'Airports',
    selectAllCheckbox: true,
    children: [
      /* start aiports from http://www.partow.net/miscellaneous/airportdatabase/#Download */
      {
        label: 'GERMANY',
        selectAllCheckbox: true,
        children: [
          { label: 'AACHEN - AAH', layer: L.marker([50.823, 6.187]) },
          { label: 'ALTENBURG - AOC', layer: L.marker([50.982, 12.506]) },
          { label: 'ARNSBERG - ZCA', layer: L.marker([51.483, 7.899]) },
          { label: 'AUGSBURG - AGB', layer: L.marker([48.425, 10.932]) },
          { label: 'BADEN-BADEN - ZCC', layer: L.marker([48.791, 8.187]) },
          { label: 'BAUTZEN - BBJ', layer: L.marker([51.193, 14.52]) },
          { label: 'BAYREUTH - BYU', layer: L.marker([49.984, 11.638]) },
          { label: 'BERLIN - SXF', layer: L.marker([52.38, 13.523]) },
          { label: 'BERLIN - THF', layer: L.marker([52.473, 13.404]) },
          { label: 'BERLIN - TXL', layer: L.marker([52.559, 13.287]) },
          { label: 'BORKUM - BMK', layer: L.marker([53.595, 6.709]) },
          { label: 'BRAUNSCHWEIG - BWE', layer: L.marker([52.319, 10.556]) },
          { label: 'BREMEN - BRE', layer: L.marker([53.047, 8.787]) },
          { label: 'BREMERHAVEN - BRV', layer: L.marker([53.503, 8.573]) },
          { label: 'BRUEGGEN - BGN', layer: L.marker([51.2, 6.132]) },
          { label: 'CELLE - ZCN', layer: L.marker([52.591, 10.022]) },
          { label: 'COLOGNE - CGN', layer: L.marker([50.866, 7.143]) },
          { label: 'DONAUESCHINGEN - ZQL', layer: L.marker([47.973, 8.522]) },
          { label: 'DORTMUND - DTM', layer: L.marker([51.518, 7.612]) },
          { label: 'DRESDEN - DRS', layer: L.marker([51.133, 13.767]) },
          { label: 'DUESSELDORF - DUS', layer: L.marker([51.289, 6.767]) },
          { label: 'EMDEN - EME', layer: L.marker([53.391, 7.227]) },
          { label: 'ERFURT - ERF', layer: L.marker([50.98, 10.958]) },
          { label: 'ESSEN - ESS', layer: L.marker([51.401, 6.936]) },
          { label: 'FRANKFURT - FRA', layer: L.marker([50.026, 8.543]) },
          { label: 'FRIEDRICHSHAFEN - FDH', layer: L.marker([47.671, 9.511]) },
          {
            label: 'FUERSTENFELDBRUCK - FEL',
            layer: L.marker([48.206, 11.267]),
          },
          { label: 'GEILENKIRCHEN - GKE', layer: L.marker([50.961, 6.042]) },
          { label: 'GIEBELSTADT - GHF', layer: L.marker([49.648, 9.966]) },
          { label: 'GUETERSLOH - GUT', layer: L.marker([51.923, 8.306]) },
          { label: 'HAHN - HHN', layer: L.marker([49.95, 7.264]) },
          { label: 'HAMBURG - HAM', layer: L.marker([53.63, 9.988]) },
          { label: 'HAMBURG - XFW', layer: L.marker([53.535, 9.835]) },
          { label: 'HANAU - ZNF', layer: L.marker([50.169, 8.961]) },
          { label: 'HANNOVER - HAJ', layer: L.marker([52.461, 9.685]) },
          { label: 'HEIDELBERG - QHD', layer: L.marker([49.393, 8.652]) },
          { label: 'HOF - HOQ', layer: L.marker([50.289, 11.855]) },
          { label: 'KASSEL - KSF', layer: L.marker([51.408, 9.378]) },
          { label: 'KIEL - KEL', layer: L.marker([54.379, 10.145]) },
          { label: 'KOBLENZ - ZNV', layer: L.marker([50.325, 7.531]) },
          { label: 'LAAGE - RLG', layer: L.marker([53.918, 12.279]) },
          { label: 'LAARBRUCH - LRC', layer: L.marker([51.602, 6.143]) },
          { label: 'LEIPZIG - LEJ', layer: L.marker([51.424, 12.236]) },
          { label: 'LEMWERDER - LEM', layer: L.marker([53.143, 8.623]) },
          { label: 'LUEBECK - LBC', layer: L.marker([53.805, 10.719]) },
          { label: 'MANNHEIM - MHG', layer: L.marker([49.473, 8.514]) },
          { label: 'MOENCHENGLADBACH - MGL', layer: L.marker([51.23, 6.504]) },
          {
            label: 'MUENSTER/OSNABRUECK - FMO',
            layer: L.marker([52.134, 7.685]),
          },
          { label: 'MUNICH - MUC', layer: L.marker([48.354, 11.786]) },
          { label: 'NORDERNEY - NRD', layer: L.marker([53.707, 7.23]) },
          { label: 'NUERNBERG - NUE', layer: L.marker([49.499, 11.078]) },
          {
            label: 'OBERPFAFFENHOFEN - OBF',
            layer: L.marker([48.081, 11.283]),
          },
          { label: 'PADERBORN - PAD', layer: L.marker([51.614, 8.616]) },
          { label: 'PARCHIM - SZW', layer: L.marker([53.427, 11.783]) },
          { label: 'RAMSTEIN - RMS', layer: L.marker([49.438, 7.601]) },
          { label: 'SAARBRUECKEN - SCN', layer: L.marker([49.214, 7.109]) },
          { label: 'SPANGDAHLEM - SPM', layer: L.marker([49.973, 6.692]) },
          { label: 'SPEYER - ZQC', layer: L.marker([49.302, 8.451]) },
          { label: 'STUTTGART - STR', layer: L.marker([48.69, 9.222]) },
          { label: 'TRIER - ZQF', layer: L.marker([49.863, 6.789]) },
          { label: 'WESTERLAND - GWT', layer: L.marker([54.913, 8.34]) },
          { label: 'WILHELMSHAVEN - WVN', layer: L.marker([53.505, 8.053]) },
        ],
      },
      {
        label: 'SPAIN',
        selectAllCheckbox: true,
        children: [
          { label: 'ALICANTE - ALC', layer: L.marker([38.282, -0.558]) },
          { label: 'ALMERIA - LEI', layer: L.marker([36.844, -2.37]) },
          { label: 'AVILES - OVD', layer: L.marker([43.563, -6.034]) },
          { label: 'BADAJOZ - BJZ', layer: L.marker([38.891, -6.821]) },
          { label: 'BARCELONA - BCN', layer: L.marker([41.297, 2.078]) },
          { label: 'BILBAO - BIO', layer: L.marker([43.301, -2.911]) },
          { label: 'CORDOBA - ODB', layer: L.marker([37.842, -4.849]) },
          { label: 'GERONA - GRO', layer: L.marker([41.901, 2.76]) },
          { label: 'GRANADA - GRX', layer: L.marker([37.133, -3.636]) },
          { label: 'GRANADA - GRX', layer: L.marker([37.189, -3.777]) },
          { label: 'IBIZA - IBZ', layer: L.marker([38.873, 1.373]) },
          { label: 'JEREZ - XRY', layer: L.marker([36.744, -6.06]) },
          { label: 'LA CORUNA - LCG', layer: L.marker([43.302, -8.377]) },
          { label: 'MADRID - MAD', layer: L.marker([40.472, -3.561]) },
          { label: 'MADRID - TOJ', layer: L.marker([40.487, -3.458]) },
          { label: 'MALAGA - AGP', layer: L.marker([36.674, -4.499]) },
          { label: 'MENORCA - MAH', layer: L.marker([39.863, 4.219]) },
          { label: 'MURCIA - MJV', layer: L.marker([37.775, -0.812]) },
          { label: 'PALMA DE MALLORCA - PMI', layer: L.marker([39.55, 2.733]) },
          { label: 'PAMPLONA - PNA', layer: L.marker([42.77, -1.646]) },
          { label: 'REUS - REU', layer: L.marker([41.147, 1.167]) },
          { label: 'SALAMANCA - SLM', layer: L.marker([40.952, -5.502]) },
          { label: 'SAN SEBASTIAN - EAS', layer: L.marker([43.356, -1.791]) },
          {
            label: 'SANTA CRUZ DE LA PALMA - SPC',
            layer: L.marker([28.626, -17.756]),
          },
          { label: 'SANTANDER - SDR', layer: L.marker([43.427, -3.82]) },
          { label: 'SANTIAGO - SCQ', layer: L.marker([42.896, -8.415]) },
          { label: 'SEO DE URGEL - LEU', layer: L.marker([42.339, 1.409]) },
          { label: 'SEVILLA - OZP', layer: L.marker([37.175, -5.616]) },
          { label: 'SEVILLA - SVQ', layer: L.marker([37.418, -5.893]) },
          { label: 'VALENCIA - VLC', layer: L.marker([39.489, -0.481]) },
          { label: 'VALLADOLID - VLL', layer: L.marker([41.706, -4.852]) },
          { label: 'VIGO - VGO', layer: L.marker([42.232, -8.627]) },
          { label: 'VITORIA - VIT', layer: L.marker([42.883, -2.724]) },
          { label: 'ZARAGOZA - ZAZ', layer: L.marker([41.666, -1.041]) },
        ],
      },
      {
        label: 'FRANCE',
        selectAllCheckbox: true,
        children: [
          { label: 'AGEN - AGF', layer: L.marker([44.175, 0.591]) },
          { label: 'AIX-LES-MILLES - QXB', layer: L.marker([43.505, 5.368]) },
          { label: 'ALBI - LBI', layer: L.marker([43.914, 2.113]) },
          { label: 'ANGOULEME - ANG', layer: L.marker([45.729, 0.221]) },
          { label: 'ANNECY - NCY', layer: L.marker([45.929, 6.099]) },
          { label: 'ANNEMASSE - QNJ', layer: L.marker([46.192, 6.268]) },
          { label: 'ARCACHON - XAC', layer: L.marker([44.596, -1.111]) },
          {
            label: 'AUBENAS-VALS-LANAS - OBS',
            layer: L.marker([44.544, 4.372]),
          },
          { label: 'AURILLAC - AUR', layer: L.marker([44.891, 2.422]) },
          { label: 'AUXERRE - AUF', layer: L.marker([47.85, 3.497]) },
          { label: 'AVIGNON - AVN', layer: L.marker([43.907, 4.902]) },
          { label: 'BEAUVAIS - BVA', layer: L.marker([49.454, 2.113]) },
          { label: 'BERGERAC - EGC', layer: L.marker([44.825, 0.519]) },
          { label: 'BEZIERS - BZR', layer: L.marker([43.324, 3.356]) },
          {
            label: 'BIARRITZ-BAYONNE - BIQ',
            layer: L.marker([43.468, -1.523]),
          },
          { label: 'BORDEAUX - BOD', layer: L.marker([44.828, -0.716]) },
          { label: 'BOURG - XBK', layer: L.marker([46.201, 5.292]) },
          { label: 'BOURGES - BOU', layer: L.marker([47.058, 2.37]) },
          { label: 'BREST - BES', layer: L.marker([48.448, -4.418]) },
          { label: 'BRIVE - BVE', layer: L.marker([45.151, 1.469]) },
          { label: 'CAEN - CFR', layer: L.marker([49.173, -0.45]) },
          { label: 'CALAIS - CQF', layer: L.marker([50.962, 1.955]) },
          { label: 'CANNES - CEQ', layer: L.marker([43.542, 6.953]) },
          { label: 'CARCASSONNE - CCF', layer: L.marker([43.216, 2.306]) },
          { label: 'CASTRES - DCM', layer: L.marker([43.556, 2.289]) },
          { label: 'CHALON - XCD', layer: L.marker([46.826, 4.817]) },
          { label: 'CHAMBERY - CMF', layer: L.marker([45.638, 5.88]) },
          { label: 'CHATEAUROUX - CHR', layer: L.marker([46.862, 1.731]) },
          { label: 'CHERBOURG - CER', layer: L.marker([49.65, -1.47]) },
          { label: 'CHOLET - CET', layer: L.marker([47.082, -0.877]) },
          { label: 'CLERMONT FERRAND - CFE', layer: L.marker([45.786, 3.169]) },
          { label: 'COGNAC - CNG', layer: L.marker([45.658, -0.318]) },
          { label: 'COLMAR - CMR', layer: L.marker([48.11, 7.359]) },
          { label: 'CREIL - CSF', layer: L.marker([49.253, 2.519]) },
          { label: 'DEAUVILLE - DOL', layer: L.marker([49.365, 0.154]) },
          { label: 'DIJON - DIJ', layer: L.marker([47.269, 5.09]) },
          { label: 'DINARD - DNR', layer: L.marker([48.588, -2.08]) },
          { label: 'DOLE - DLE', layer: L.marker([47.039, 5.427]) },
          { label: 'EPINAL - EPL', layer: L.marker([48.325, 6.07]) },
          { label: 'GRENOBLE - GNB', layer: L.marker([45.363, 5.329]) },
          { label: 'HYERES - TLN', layer: L.marker([43.097, 6.146]) },
          {
            label: 'LA ROCHE-SUR-YON - EDM',
            layer: L.marker([46.702, -1.379]),
          },
          { label: 'LA ROCHELLE - LRH', layer: L.marker([43.449, 1.263]) },
          { label: 'LANNION - LAI', layer: L.marker([48.754, -3.471]) },
          { label: 'LAVAL - LVA', layer: L.marker([48.031, -0.743]) },
          { label: 'LE CASTELLET - CTT', layer: L.marker([43.252, 5.785]) },
          { label: 'LE HAVRE - LEH', layer: L.marker([49.534, 0.088]) },
          { label: 'LE MANS - LME', layer: L.marker([47.949, 0.202]) },
          { label: 'LE PUY - LPY', layer: L.marker([45.079, 3.765]) },
          { label: 'LE TOURQUET - LTQ', layer: L.marker([50.515, 1.627]) },
          { label: 'LILLE - LIL', layer: L.marker([50.562, 3.089]) },
          { label: 'LIMOGES - LIG', layer: L.marker([45.863, 1.179]) },
          { label: 'LORIENT - LRT', layer: L.marker([47.761, -3.44]) },
          { label: 'LYON - LYN', layer: L.marker([45.728, 4.945]) },
          { label: 'LYON - LYS', layer: L.marker([45.726, 5.091]) },
          { label: 'MACON - QNX', layer: L.marker([46.295, 4.796]) },
          { label: 'MARSEILLE - MRS', layer: L.marker([43.436, 5.214]) },
          { label: 'MENDE - MEN', layer: L.marker([44.502, 3.533]) },
          { label: 'METZ - ETZ', layer: L.marker([48.982, 6.254]) },
          { label: 'METZ - MZM', layer: L.marker([49.072, 6.132]) },
          { label: 'MONTLUCON-GUERET - MCU', layer: L.marker([46.224, 2.363]) },
          { label: 'MONTLUCON - MCU', layer: L.marker([46.352, 2.57]) },
          { label: 'MONTPELLIER - MPL', layer: L.marker([43.576, 3.963]) },
          { label: 'MORLAIX - MXN', layer: L.marker([48.603, -3.816]) },
          { label: 'MOULINS - XMU', layer: L.marker([46.534, 3.424]) },
          { label: 'MULHOUSE - MLH', layer: L.marker([47.589, 7.53]) },
          { label: 'NANCY - ENC', layer: L.marker([48.692, 6.23]) },
          { label: 'NANTES - NTE', layer: L.marker([47.153, -1.611]) },
          { label: 'NEVERS - NVS', layer: L.marker([47.001, 3.114]) },
          { label: 'NICE - NCE', layer: L.marker([43.661, 7.218]) },
          { label: 'NIMES - FNI', layer: L.marker([43.757, 4.416]) },
          { label: 'NIORT - NIT', layer: L.marker([46.311, -0.401]) },
          { label: 'ORLEANS - ORE', layer: L.marker([47.988, 1.761]) },
          { label: 'PARIS - CDG', layer: L.marker([49.013, 2.55]) },
          { label: 'PARIS - LBG', layer: L.marker([48.969, 2.441]) },
          { label: 'PARIS - ORY', layer: L.marker([48.725, 2.359]) },
          { label: 'PAU - PUF', layer: L.marker([43.38, -0.419]) },
          { label: 'PERIGUEUX - PGX', layer: L.marker([45.198, 0.816]) },
          { label: 'PERPIGNAN - PGF', layer: L.marker([42.74, 2.871]) },
          { label: 'POITIERS - PIS', layer: L.marker([46.588, 0.307]) },
          { label: 'PONTOISE - POX', layer: L.marker([49.096, 2.041]) },
          { label: 'QUIMPER - UIP', layer: L.marker([47.975, -4.168]) },
          { label: 'REIMS - RHE', layer: L.marker([49.31, 4.05]) },
          { label: 'RENNES - RNS', layer: L.marker([48.069, -1.735]) },
          { label: 'ROANNE - RNE', layer: L.marker([46.058, 4.001]) },
          { label: 'ROCHEFORT - RCO', layer: L.marker([45.888, -0.983]) },
          { label: 'RODEZ - RDZ', layer: L.marker([44.408, 2.482]) },
          { label: 'ROUEN - URO', layer: L.marker([49.384, 1.175]) },
          { label: 'ROYAN - RYN', layer: L.marker([45.628, -0.973]) },
          {
            label: 'ST.-BRIEUC ARMOR - SBK',
            layer: L.marker([48.538, -2.854]),
          },
          { label: 'ST.-ETIENNE - EBU', layer: L.marker([45.54, 4.296]) },
          { label: 'ST.-NAZAIRE - SNR', layer: L.marker([47.312, -2.149]) },
          { label: 'STRASSBOURG - SXB', layer: L.marker([48.538, 7.628]) },
          { label: 'TARBES - LDE', layer: L.marker([43.179, -0.006]) },
          { label: 'TOULOUSE - TLS', layer: L.marker([43.629, 1.364]) },
          { label: 'TOURS - TUF', layer: L.marker([47.432, 0.728]) },
          {
            label: 'TOUSSOUS-LE-NOBLE - TNF',
            layer: L.marker([48.752, 2.106]),
          },
          { label: 'TROYES - QYR', layer: L.marker([48.323, 4.018]) },
          { label: 'VALENCE - VAF', layer: L.marker([44.921, 4.97]) },
          { label: 'VANNES - VNE', layer: L.marker([47.723, -2.718]) },
          { label: 'VICHY - VHY', layer: L.marker([46.169, 3.404]) },
          { label: 'VILEFRANCE - XVF', layer: L.marker([45.916, 4.641]) },
        ],
      },
    ],
  },
];

//=====================END OF TEST DATA

/**
 * component for the right sidenav
 */
@Component({
  selector: 'safe-layers-menu',
  standalone: true,
  templateUrl: './layers-menu.component.html',
  styleUrls: ['./layers-menu.component.scss'],
  imports: [
    ButtonModule,
    CommonModule,
    DividerModule,
    TranslateModule,
    CheckboxModule,
    RadioModule,
    LayersMenuItemComponent,
    LayersMenuBasemapComponent,
  ],
})
export class SafeLayersMenuComponent implements OnInit {
  @Input() layersMenuExpanded = false;
  @Input() bookmarksMenuExpanded = false;
  @Input() layersTree!: L.Control.Layers.TreeObject[];
  @Input() basemaps!: L.Control.Layers.TreeObject[];
  @Input() mapComponent!: MapComponent;
  @Output() cancel = new EventEmitter();

  public map!: L.Map;

  ngOnInit(): void {
    //TESTING PURPOSE
    this.layersTree = overlayTree;
    //END OF TESTING

    this.map = this.mapComponent.map;
  }

  /** Opens the layers menu */
  openLayersMenu() {
    this.layersMenuExpanded = true;
    this.bookmarksMenuExpanded = false;
  }

  /** Opens the bookmarks menu */
  openBookmarksMenu() {
    this.bookmarksMenuExpanded = true;
    this.layersMenuExpanded = false;
  }

  /** unchecks all basemaps */
  updateBasemaps() {
    console.log('should update the basemaps now');
  }
  /**
   * returns an array of flattened basemaps
   *
   * @param basemapsTree the nested array of basemaps
   * @param [layers=[]] the array of flattened basemaps
   * @returns the array of flattened basemaps
   */
  getAllBasemaps(
    basemapsTree: L.Control.Layers.TreeObject[],
    layers: L.Layer[] = []
  ) {
    for (const basemap of basemapsTree) {
      if (basemap.layer && basemap.layer) {
        layers.push(basemap.layer);
      }
      if (basemap.children) {
        this.getAllBasemaps(basemap.children, layers);
      }
    }
    return layers;
  }

  /**
   * Closes the sidenav
   */
  closeMenu(): void {
    this.cancel.emit(true);
  }
}
