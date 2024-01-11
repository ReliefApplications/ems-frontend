# [2.4.0](https://github.com/ReliefApplications/ems-frontend/compare/v2.3.4...v2.4.0) (2024-01-10)


### Bug Fixes

* Remove currently useless download option from the map widget. ([#2266](https://github.com/ReliefApplications/ems-frontend/issues/2266)) ([3edd7bb](https://github.com/ReliefApplications/ems-frontend/commit/3edd7bb46030fdd0f592371533159b5ece7ad01a))
* summary card and text widgets checkbox inconclusive ([#2217](https://github.com/ReliefApplications/ems-frontend/issues/2217)) ([7dd457d](https://github.com/ReliefApplications/ems-frontend/commit/7dd457d7fbf70f4e5e1c79b98b3e38f47fea94e2))
* widgets would be reordered based on their index when mobile mode activated ([#2229](https://github.com/ReliefApplications/ems-frontend/issues/2229)) ([bcba2c8](https://github.com/ReliefApplications/ems-frontend/commit/bcba2c84a772417be7d9f21c840ee9adef4d46cd))


### Features

* allow dashboard filter to have default values ([#2263](https://github.com/ReliefApplications/ems-frontend/issues/2263)) ([b73e747](https://github.com/ReliefApplications/ems-frontend/commit/b73e747c6bb9b7f6f4fc5742c95b989f9e863f8f))
* use cursor pagination for users ([#2265](https://github.com/ReliefApplications/ems-frontend/issues/2265)) ([f44abde](https://github.com/ReliefApplications/ems-frontend/commit/f44abdeb0e814b3360a582c18f557168383446d5))

## [2.3.4](https://github.com/ReliefApplications/ems-frontend/compare/v2.3.3...v2.3.4) (2024-01-09)


### Bug Fixes

* application preview not working fine ([68829f8](https://github.com/ReliefApplications/ems-frontend/commit/68829f8ef3469ed31d7531a095be720067aaffde))
* assets from geocoder package not being available when using as web component ([c38009f](https://github.com/ReliefApplications/ems-frontend/commit/c38009f821ef209e0a0f540a86fd0f261123eedb))
* dashboard filter would not show value when using object values in dropdown fields ([#2239](https://github.com/ReliefApplications/ems-frontend/issues/2239)) ([3f01238](https://github.com/ReliefApplications/ems-frontend/commit/3f01238cfc5cdcbfc241d043b66221dd9f19a2b4))
* resources grid not appearing well in forms, in some cases ([236aebc](https://github.com/ReliefApplications/ems-frontend/commit/236aebca37f4fe684aadc343b2fb9d604ec35d03))

## [2.3.3](https://github.com/ReliefApplications/ems-frontend/compare/v2.3.2...v2.3.3) (2024-01-08)


### Bug Fixes

* changing fields in resources question would not reflect in the form builder ([#2247](https://github.com/ReliefApplications/ems-frontend/issues/2247)) ([30b9c09](https://github.com/ReliefApplications/ems-frontend/commit/30b9c09fe93b9ea02658d1f71575f079211b4892))
* check null values for map popup properties ([#2246](https://github.com/ReliefApplications/ems-frontend/issues/2246)) ([1aadbb6](https://github.com/ReliefApplications/ems-frontend/commit/1aadbb6158d671a0c43ae7b58ffbeed2400dc106))
* check null values in setEmptyQuestions ([#2248](https://github.com/ReliefApplications/ems-frontend/issues/2248)) ([0303574](https://github.com/ReliefApplications/ems-frontend/commit/03035747769220d94b9fe682e7356da6f79fa2f9))
* dashboard filter could create some white space issues & not work when collapsing sidenav ([#2228](https://github.com/ReliefApplications/ems-frontend/issues/2228)) ([4164c43](https://github.com/ReliefApplications/ems-frontend/commit/4164c43061a25f67d2e3f6c017a67134f9bd430b))
* font title not updating in charts when editing ([ab013db](https://github.com/ReliefApplications/ems-frontend/commit/ab013dbdaa466cecfd95611ac53a38a934d37611))
* incorrect date format in grid filter menu ([5ccaeb6](https://github.com/ReliefApplications/ems-frontend/commit/5ccaeb6914ac00b94fc23d2e4b9aa60047e3cd9a))
* incorrect display of icon in icon-picker ([498abd3](https://github.com/ReliefApplications/ems-frontend/commit/498abd3b9d3546f373ac9b526e94702076073f20))
* incorrect width drag / drop unique value renderer ([#2224](https://github.com/ReliefApplications/ems-frontend/issues/2224)) ([87b39ce](https://github.com/ReliefApplications/ems-frontend/commit/87b39ce34d7732be60dec54bdd48a984c0e30f3a))
* popup to edit fields from resources question not appearing on first click  ([#2231](https://github.com/ReliefApplications/ems-frontend/issues/2231)) ([ea8493b](https://github.com/ReliefApplications/ems-frontend/commit/ea8493bd1f53077dd264b24b0686e3723534e347))
* prevent widget grid not to resize when available width changes ([#2256](https://github.com/ReliefApplications/ems-frontend/issues/2256)) ([efa55f3](https://github.com/ReliefApplications/ems-frontend/commit/efa55f3e2d500fae8043a8736a27bae099fc9876))
* restore selected attribute in order to apply tab css content ([#2220](https://github.com/ReliefApplications/ems-frontend/issues/2220)) ([fd800c6](https://github.com/ReliefApplications/ems-frontend/commit/fd800c6724db54cd2f5099930fbdd4ca2afa83d9))
* summary cards not correctly updating after grid edition ([#2219](https://github.com/ReliefApplications/ems-frontend/issues/2219)) ([0727cca](https://github.com/ReliefApplications/ems-frontend/commit/0727cca5be44def937671561411a3e1f92286a4e))
* summary cards widgets using reference data would send duplicated queries ([#2238](https://github.com/ReliefApplications/ems-frontend/issues/2238)) ([0e3c08a](https://github.com/ReliefApplications/ems-frontend/commit/0e3c08a19eeb7519651e6ccc86e72feb0775bb4c))
* web widgets app not correctly reloading if using same id ([ff3f99d](https://github.com/ReliefApplications/ems-frontend/commit/ff3f99d0ea75ba177394edd578e9e2e00afef8ce))


### Performance Improvements

* add lint to web widgets app ([#2221](https://github.com/ReliefApplications/ems-frontend/issues/2221)) ([b8969ec](https://github.com/ReliefApplications/ems-frontend/commit/b8969ecc3fa180d16086e9fc10b3e7a9bf5a2b06))

## [2.3.2](https://github.com/ReliefApplications/ems-frontend/compare/v2.3.1...v2.3.2) (2023-12-21)


### Bug Fixes

* date filters should not use timestamps ([#2203](https://github.com/ReliefApplications/ems-frontend/issues/2203)) ([18c3d98](https://github.com/ReliefApplications/ems-frontend/commit/18c3d98ea00dba4a0ff5dc51dd8bf1df40ff49b0))
* expansion panels in map unique value renderer not working as expected ([#2215](https://github.com/ReliefApplications/ems-frontend/issues/2215)) ([92016df](https://github.com/ReliefApplications/ems-frontend/commit/92016dfc2066c81ffe2000e2a708114d333c8a84))
* file question not appearing in text / summary card widgets ([#2216](https://github.com/ReliefApplications/ems-frontend/issues/2216)) ([a534282](https://github.com/ReliefApplications/ems-frontend/commit/a534282bbec46532fb2e9ce9e686576c67748c08))

## [2.3.1](https://github.com/ReliefApplications/ems-frontend/compare/v2.3.0...v2.3.1) (2023-12-20)


### Bug Fixes

* change visibity when position set to none ([#2200](https://github.com/ReliefApplications/ems-frontend/issues/2200)) ([8ec6933](https://github.com/ReliefApplications/ems-frontend/commit/8ec6933614fdc983de02392bd3b94bb012be5d15))
* context incorrectly saved in some inherited dashboard templates ([#2202](https://github.com/ReliefApplications/ems-frontend/issues/2202)) ([a30bf10](https://github.com/ReliefApplications/ems-frontend/commit/a30bf10ddffc60f187054737d2b92bffb14c1e39))
* infinite scroll with ref data not working in summary cards ([eb86688](https://github.com/ReliefApplications/ems-frontend/commit/eb8668867a019babd4601edfbe45f3ac48ccdb8c))
* predefined filters in charts not applying ([#2193](https://github.com/ReliefApplications/ems-frontend/issues/2193)) ([e68d3c4](https://github.com/ReliefApplications/ems-frontend/commit/e68d3c462da8f582ec85e85db2e02aa05f90af51))

# [2.3.0](https://github.com/ReliefApplications/ems-frontend/compare/v2.2.2...v2.3.0) (2023-12-18)


### Bug Fixes

*  Make context filter work for text widget with aggregation ([#2191](https://github.com/ReliefApplications/ems-frontend/issues/2191)) ([453b59c](https://github.com/ReliefApplications/ems-frontend/commit/453b59c584e410d25bba5feb0f6b2602f77c5ea1))
* allow templating to use nested fields ([d4d10d4](https://github.com/ReliefApplications/ems-frontend/commit/d4d10d44850d40f431955420e8b37e32a5420d25))
* calc operators in templates would not work when using style ([#2154](https://github.com/ReliefApplications/ems-frontend/issues/2154)) ([3ae4f0e](https://github.com/ReliefApplications/ems-frontend/commit/3ae4f0eea4e2812567cb1ca1c5cdc3b9f795087a))
* data keys not available by default when loading text widget, without changing tabs ([d265357](https://github.com/ReliefApplications/ems-frontend/commit/d265357362b0deecaddd8b8e37605705c1cc2208))
* fields disappear when unselecting them in tagbox of aggregation builder ([#2163](https://github.com/ReliefApplications/ems-frontend/issues/2163)) ([65cd803](https://github.com/ReliefApplications/ems-frontend/commit/65cd803fd54cf0c3baa190cf58b4c58862ff61f8))
* get correct classes and tooltips for ref data fields in grid widgets ([#2192](https://github.com/ReliefApplications/ems-frontend/issues/2192)) ([c3a961c](https://github.com/ReliefApplications/ems-frontend/commit/c3a961c56165d934fadbe00ed816b7ea3c1e5b5f))
* grid actions in summary cards settings would appear when not needed  ([#2189](https://github.com/ReliefApplications/ems-frontend/issues/2189)) ([931ec30](https://github.com/ReliefApplications/ems-frontend/commit/931ec308e2a9b003fb98c6c9ce5a661bd7fb5e02))
* grids in forms could go out of the parent container ([#2186](https://github.com/ReliefApplications/ems-frontend/issues/2186)) ([7dee363](https://github.com/ReliefApplications/ems-frontend/commit/7dee363ed839d14ed59017c1df03becfffc7bf60))
* resolve a few template aggregation issues ([#2182](https://github.com/ReliefApplications/ems-frontend/issues/2182)) ([e1a6760](https://github.com/ReliefApplications/ems-frontend/commit/e1a67603e2a07d203a31bce55685d3476f8ba04b))
* some change detection would break the app in back-office ([#2181](https://github.com/ReliefApplications/ems-frontend/issues/2181)) ([8b25faa](https://github.com/ReliefApplications/ems-frontend/commit/8b25faa1232dfab7456cdc822958b0326ae61061))
* valueField not available for static ref data ([#2170](https://github.com/ReliefApplications/ems-frontend/issues/2170)) ([6a1b708](https://github.com/ReliefApplications/ems-frontend/commit/6a1b708423cbb64c0d10450c0e9f74f2dbbf822e))


### Features

* Add option to hide summary cards buttons ([#2159](https://github.com/ReliefApplications/ems-frontend/issues/2159)) ([69dac7d](https://github.com/ReliefApplications/ems-frontend/commit/69dac7dbe4410ee03ce3214556c67f796b5a31a1))
* add ref data aggregation support for layers ([#2158](https://github.com/ReliefApplications/ems-frontend/issues/2158)) ([3b8ca03](https://github.com/ReliefApplications/ems-frontend/commit/3b8ca03ae72b08bdc9ff034ba9d0a51995bf8190))
* allow filtering on ref data aggregations ([#2175](https://github.com/ReliefApplications/ems-frontend/issues/2175)) ([00a85ca](https://github.com/ReliefApplications/ems-frontend/commit/00a85ca8702c326cdbc6c111f9a5036b866c5f7e))
* allow html question in dashboard filter ([f51abee](https://github.com/ReliefApplications/ems-frontend/commit/f51abeef839aa522a34babffd34d85400e32fde7))
* allow preview of aggregation data ([#2176](https://github.com/ReliefApplications/ems-frontend/issues/2176)) ([5665f06](https://github.com/ReliefApplications/ems-frontend/commit/5665f0663253fe3a1bf2821f5d3fdb0af28e3604))
* allow ref data to appear in grid mode ([#2138](https://github.com/ReliefApplications/ems-frontend/issues/2138)) ([86d293a](https://github.com/ReliefApplications/ems-frontend/commit/86d293a864aa7f480c17286b1af75fd1019c3b53))
* allow reference data to be used in charts ([#2148](https://github.com/ReliefApplications/ems-frontend/issues/2148)) ([6adf1d1](https://github.com/ReliefApplications/ems-frontend/commit/6adf1d1a6e2f88e92a61576f8b7db007be6ff49d)), closes [#68346](https://github.com/ReliefApplications/ems-frontend/issues/68346) [#68346](https://github.com/ReliefApplications/ems-frontend/issues/68346) [#68346](https://github.com/ReliefApplications/ems-frontend/issues/68346) [#68346](https://github.com/ReliefApplications/ems-frontend/issues/68346) [#68346](https://github.com/ReliefApplications/ems-frontend/issues/68346) [#68346](https://github.com/ReliefApplications/ems-frontend/issues/68346)
* allow text & summary card widgets to use record edition when using resource & layout ([#2134](https://github.com/ReliefApplications/ems-frontend/issues/2134)) ([a0f0ca0](https://github.com/ReliefApplications/ems-frontend/commit/a0f0ca0be44bb0c4e908d8317f08abe835592ff8))
* allow to inject aggregation in text widget ([#2172](https://github.com/ReliefApplications/ems-frontend/issues/2172)) ([41106a3](https://github.com/ReliefApplications/ems-frontend/commit/41106a3ecbcd8a4dc2882a80ea8c7490bfd19d89)), closes [#78949](https://github.com/ReliefApplications/ems-frontend/issues/78949) [#78949](https://github.com/ReliefApplications/ems-frontend/issues/78949) [#78949](https://github.com/ReliefApplications/ems-frontend/issues/78949) [#78949](https://github.com/ReliefApplications/ems-frontend/issues/78949) [#78949](https://github.com/ReliefApplications/ems-frontend/issues/78949)
* allow to trigger dashboard filter from some widgets ([#2160](https://github.com/ReliefApplications/ems-frontend/issues/2160)) ([3ab66be](https://github.com/ReliefApplications/ems-frontend/commit/3ab66bee5bf1262175bbb4e0970442d8e6629747))
* app builder as web component should not update the url ([#2152](https://github.com/ReliefApplications/ems-frontend/issues/2152)) ([253ba2f](https://github.com/ReliefApplications/ems-frontend/commit/253ba2f18da43d94b901a1114350a8ff8739b735))
* can now use context filter in ref data aggregations ([18aa19c](https://github.com/ReliefApplications/ems-frontend/commit/18aa19cf2ecb799ad7b650374944a7500e936ce4))
* can use context variables in widgets ([#2003](https://github.com/ReliefApplications/ems-frontend/issues/2003)) ([a592082](https://github.com/ReliefApplications/ems-frontend/commit/a5920827436adceaf32d2c86223ea2a2b6cb22dc))

## [2.2.2](https://github.com/ReliefApplications/ems-frontend/compare/v2.2.1...v2.2.2) (2023-12-13)


### Bug Fixes

* non readable message when failing to load application's style ([06c692a](https://github.com/ReliefApplications/ems-frontend/commit/06c692a39c4475067866bb4eb88147de3d207202))

## [2.2.1](https://github.com/ReliefApplications/ems-frontend/compare/v2.2.0...v2.2.1) (2023-12-12)


### Bug Fixes

* incorrect position of dashboard filter in front-office ([6dc6184](https://github.com/ReliefApplications/ems-frontend/commit/6dc61841a6a69dddd30abc91d62c45e8849c6cc1))
* layout & aggregation not appearing in grid widget when adding them ([66f7dc1](https://github.com/ReliefApplications/ems-frontend/commit/66f7dc1e57d56928f685660f108a1e79a1a5a7d1))
* profile page not working in front-office ([#2150](https://github.com/ReliefApplications/ems-frontend/issues/2150)) ([fe5bad3](https://github.com/ReliefApplications/ems-frontend/commit/fe5bad366908a5ab1fd5562a7bf0c922787b73d6))
* put Accept headers in graphql module instead of auth-interceptor ([4ba7456](https://github.com/ReliefApplications/ems-frontend/commit/4ba74563471b2a0c5808e7f0719df595dd383f5d))
* setting sort fields in summary cards would refresh the modal ([#2156](https://github.com/ReliefApplications/ems-frontend/issues/2156)) ([539017b](https://github.com/ReliefApplications/ems-frontend/commit/539017bca5d93214dfdeb02360e3b74a58954f75))

# [2.2.0](https://github.com/ReliefApplications/ems-frontend/compare/v2.1.8...v2.2.0) (2023-12-08)


### Bug Fixes

* accordion could not expand ([02b63da](https://github.com/ReliefApplications/ems-frontend/commit/02b63da126bcb3d19059b0dd56e5e8b9409a7cee))
* aggregation not displaying in grid configurations after changes ([#1935](https://github.com/ReliefApplications/ems-frontend/issues/1935)) ([314d66e](https://github.com/ReliefApplications/ems-frontend/commit/314d66e1d30c7faa9fae6c695bc4713ae4d42aa0))
* api configuration edition would sometimes not display correct status for save button ([eac0bd6](https://github.com/ReliefApplications/ems-frontend/commit/eac0bd6f71acb651b12a40565e3e81646fe106df))
* app preview would never load content ([30cb581](https://github.com/ReliefApplications/ems-frontend/commit/30cb5812ab02ac38cf91fd72c92cf0039f2ce5f9))
* application style would not be applied before load ([4e33254](https://github.com/ReliefApplications/ems-frontend/commit/4e33254443ca5a0f61da127076035ec90d5aa48a))
* arcgis layers now appear in layer control ([6d08d72](https://github.com/ReliefApplications/ems-frontend/commit/6d08d726f400cb631b5e0270ed2e973771b17f5f))
* arcgis webmap select would not take search value when doing pagination ([711f0a0](https://github.com/ReliefApplications/ems-frontend/commit/711f0a08fe5fb7c57610f6501880451201cfdb21))
* arcgis webmap would not use zoom / default location configured in arcgis ([4245061](https://github.com/ReliefApplications/ems-frontend/commit/4245061e0f288bb1ff8108a8ebf824087a4c5d39))
* assets not working in back-office ([4fa9245](https://github.com/ReliefApplications/ems-frontend/commit/4fa924509fb506101b5aacbd066811a46e6895fc))
* auto sizing grid columns would create tiny columns when too many columns ([#2057](https://github.com/ReliefApplications/ems-frontend/issues/2057)) ([6afea60](https://github.com/ReliefApplications/ems-frontend/commit/6afea60bf26a5fb0d3951677605f94167078cfb9))
* basemap layers not appearing in correct order on maps ([5eb8d82](https://github.com/ReliefApplications/ems-frontend/commit/5eb8d824ad3a81c616685bf3b690daec295bc6b2))
* basemap would sometimes won't appear on search ([12f1d02](https://github.com/ReliefApplications/ems-frontend/commit/12f1d025c28450129892d4688aae9f3c36cce7f8))
* better indicate file size in uploads ([#2095](https://github.com/ReliefApplications/ems-frontend/issues/2095)) ([40dae08](https://github.com/ReliefApplications/ems-frontend/commit/40dae087910a34b87c86961d4d5038357df40062))
* bring back filtering in aggregation builder ([#2077](https://github.com/ReliefApplications/ems-frontend/issues/2077)) ([b179147](https://github.com/ReliefApplications/ems-frontend/commit/b179147a6fdddccbc709c86ce7978f16c379a741))
* build issue after 2.0.x merge ([f8bc621](https://github.com/ReliefApplications/ems-frontend/commit/f8bc621c1be9adccdfc56d5b26aa2531d70567ee))
* build not working ([3ed5f5b](https://github.com/ReliefApplications/ems-frontend/commit/3ed5f5b1ca16e41678412609caba2cd9973abf41))
* button action not appearing in front-office ([7d0d397](https://github.com/ReliefApplications/ems-frontend/commit/7d0d397aeff35ddc833ecdd693af6c642775f7ba))
* Changing form locale duplicates some questions ([#2124](https://github.com/ReliefApplications/ems-frontend/issues/2124)) ([ed9bbe6](https://github.com/ReliefApplications/ems-frontend/commit/ed9bbe66421f7fe19bae89aa3580d0a059c29f57))
* chart update + cards from aggregation as grid ([aaba5bf](https://github.com/ReliefApplications/ems-frontend/commit/aaba5bfc567b82a667330d789c88cd6fdfa6c5b8))
* chart would not display nicely in too small ([464fb65](https://github.com/ReliefApplications/ems-frontend/commit/464fb65c6c6e361ca16c1a94779993458ab28bdd))
* charts would load multiple times whenever dashboard would init ([#1933](https://github.com/ReliefApplications/ems-frontend/issues/1933)) ([bb42409](https://github.com/ReliefApplications/ems-frontend/commit/bb424096749f7bba29f970b450df7a2d7729dcad)), closes [AB#76508](https://github.com/AB/issues/76508) [AB#76508](https://github.com/AB/issues/76508)
* choices by url questions would not work in some cases ([8619755](https://github.com/ReliefApplications/ems-frontend/commit/8619755278228501da6abb2110a63cdbc4cbef47))
* context filter not loaded in front-office ([28d39fa](https://github.com/ReliefApplications/ems-frontend/commit/28d39fa44a4242f9ba0fbf779f0d57f29965dab5))
* contextual datasource would not work in all cases ([48843e7](https://github.com/ReliefApplications/ems-frontend/commit/48843e7403aaa855a7ae1b2b4ebaa29edc23f82d))
* could not build front-office due to missing import ([eb5bedb](https://github.com/ReliefApplications/ems-frontend/commit/eb5bedbf488bed5d7430918eead1b930a47e900d))
* could not open map from grid ([487450d](https://github.com/ReliefApplications/ems-frontend/commit/487450de6ccc0b4291e06db1f69b00515d96d31a))
* could not upload new records ([#1956](https://github.com/ReliefApplications/ems-frontend/issues/1956)) ([ba48f4e](https://github.com/ReliefApplications/ems-frontend/commit/ba48f4e08fcf58a6c7dd9122f89e34707214d5e7))
* custom style would sometimes fail when editing new widgets ([f6aebf5](https://github.com/ReliefApplications/ems-frontend/commit/f6aebf56976e814f2cff7a93d3d9b9bb5abf6cf0))
* custom widget styling would not correctly render when fullscreen mode is active ([6e19aec](https://github.com/ReliefApplications/ems-frontend/commit/6e19aec629acb0eaaef617ba817e0b495d932c88))
* dashboard filter not working in summary cards dashboard ([#1908](https://github.com/ReliefApplications/ems-frontend/issues/1908)) ([b0f3da0](https://github.com/ReliefApplications/ems-frontend/commit/b0f3da052d1d5b8e7d6c0c10468acc14e17354f1))
* dashboard navigation was messy in front-office, when using templates ([eeaa370](https://github.com/ReliefApplications/ems-frontend/commit/eeaa370ef361a3345984fd0ff3521bc361740372))
* default json editor tab of surveyjs would not work ([#2076](https://github.com/ReliefApplications/ems-frontend/issues/2076)) ([0fcd954](https://github.com/ReliefApplications/ems-frontend/commit/0fcd9541f4c9bed7bdc37638271346dd5e139a07))
* default width for column in layouts would appear even if not used ([4833666](https://github.com/ReliefApplications/ems-frontend/commit/4833666f4bd908f71fe187d3f4d7b4d7e270d44d))
* delete min-width of question in order to match current sidebar width ([#1912](https://github.com/ReliefApplications/ems-frontend/issues/1912)) ([697eb83](https://github.com/ReliefApplications/ems-frontend/commit/697eb8320a5c3cb2b0f377f19efe62cb8f3f060a))
* deleting btns no longer removes two of them ([2a7b6be](https://github.com/ReliefApplications/ems-frontend/commit/2a7b6be2c2249b5e5ed45bf7a01410952cdb6712))
* destroy layers control sidenav when closing the settings ([1754041](https://github.com/ReliefApplications/ems-frontend/commit/1754041cd8c26beb5861a09444a6af42e3efff88))
* editable text would sometimes hide other options of the UI ([eedbdd0](https://github.com/ReliefApplications/ems-frontend/commit/eedbdd09af375a2bcddb7453faca4107064a6130))
* editing widgets could sometimes scroll to top of dashboard ([#2135](https://github.com/ReliefApplications/ems-frontend/issues/2135)) ([da6dd93](https://github.com/ReliefApplications/ems-frontend/commit/da6dd93460ada1446233159ed5988484bd2f9530))
* exiting form builder could create multiple modals if some changes were not saved ([0cad118](https://github.com/ReliefApplications/ems-frontend/commit/0cad1181de097e1ff443fd9ed43907b561801071))
* few issues with layer styling ([baf115b](https://github.com/ReliefApplications/ems-frontend/commit/baf115b9ee907770b26334afd32602979af8d1a4))
* few issues with sidenav z-index + incorrect getter of value in records-tab ([1234e37](https://github.com/ReliefApplications/ems-frontend/commit/1234e376808482b41eeb394e303f84a60a565aca))
* few issues with templating & reference data ([c504e92](https://github.com/ReliefApplications/ems-frontend/commit/c504e922e1f73a6f8030b1388f066b6853a0dd4c))
* few map display ([0876ea9](https://github.com/ReliefApplications/ems-frontend/commit/0876ea9861aa1e1eb98b0f265a01d5b2aed54e40)), closes [fix/AB#65087](https://github.com/fix/AB/issues/65087) [fix/AB#65087](https://github.com/fix/AB/issues/65087)
* fields would still appear in layer edition even if datasource is not valid ([1723c6c](https://github.com/ReliefApplications/ems-frontend/commit/1723c6ce3a1d626e25e2744c65dd9b73c526c294))
* files uploaded before addRecord ([962b96f](https://github.com/ReliefApplications/ems-frontend/commit/962b96f64548d82f3a0c487945c8101a5886c23f))
* filter value incorrectly reset ([08785a8](https://github.com/ReliefApplications/ems-frontend/commit/08785a8dc8e38566cbe0843d02e4dd4c0aec24c7))
* filtering not working in summary cards ([aaa4be1](https://github.com/ReliefApplications/ems-frontend/commit/aaa4be13ac76087124264a8e22c469bfbec365f8))
* form popups not appearing in fullscreen ([#1791](https://github.com/ReliefApplications/ems-frontend/issues/1791)) ([ab04aab](https://github.com/ReliefApplications/ems-frontend/commit/ab04aab0bd0c079df607fd85abb07d68f503d736))
* front-office and app preview would not correctly use changeStep event of workflow ([7727f6b](https://github.com/ReliefApplications/ems-frontend/commit/7727f6b2cac8794409a6c90a3de52dd13881db15))
* geospatial map reverse search does not have same APi than search, and could cause some issues ([94c7757](https://github.com/ReliefApplications/ems-frontend/commit/94c7757a573ed490c2248fbc33dd6586c79acab7))
* geospatial map showing incorrect controls ([3a11156](https://github.com/ReliefApplications/ems-frontend/commit/3a111562e04c86923e0067ffff1cd57f0adab892))
* geospatial map would not appear if no selected fields ([e49fffc](https://github.com/ReliefApplications/ems-frontend/commit/e49fffc283af45b960200d693ffb59b4e97d4d37))
* heatmap not rendering well in settings ([54a5285](https://github.com/ReliefApplications/ems-frontend/commit/54a52859fd365b2602bbfe54588bfd43d9f598a9))
* heatmap selection was preventing some options to be reapplied + by default, color was not applied to dots ([f273d9f](https://github.com/ReliefApplications/ems-frontend/commit/f273d9fe8491a05f23034012255b627d59ab0fea))
* heatmap would not render due to incorrect lat / lng array ([8c811a2](https://github.com/ReliefApplications/ems-frontend/commit/8c811a2ed72e1debfd2ea129280815e96097a9c8))
* hidden layer no longer appears on zoom ([56420fe](https://github.com/ReliefApplications/ems-frontend/commit/56420fec705959fe789b4fda21cacf84e594685f))
* hidden pages not working for top navigation ([931f3bc](https://github.com/ReliefApplications/ems-frontend/commit/931f3bc753f4b48cad1b586a6bb6812c2654eb3a))
* history now appearing in nested grids, in modals ([efe9421](https://github.com/ReliefApplications/ems-frontend/commit/efe94216d7658844348cf2a8ce45842da42e4c6e))
* html could be passed in links built from values in summary cards / text widgets ([6cc0545](https://github.com/ReliefApplications/ems-frontend/commit/6cc05456c58782bfe74e20190372c00f210260d0))
* html widgets ( summary cards & text ) style issue with tailwind ([e0ad6fd](https://github.com/ReliefApplications/ems-frontend/commit/e0ad6fdeaba4e44c796612c503cb299a0aa5a0ce))
* i18n issue when errors in grid in web widgets ([38ecef2](https://github.com/ReliefApplications/ems-frontend/commit/38ecef2e9a7ff5a579545b9e6048906f0bcc75c7))
* icon display when variant and category class are empty ([#1975](https://github.com/ReliefApplications/ems-frontend/issues/1975)) ([b05b722](https://github.com/ReliefApplications/ems-frontend/commit/b05b722316deae9f6124f07078e50ef2947e77ef))
* icon picker sending error due to web elements changes [#79780](https://github.com/ReliefApplications/ems-frontend/issues/79780) ([#2094](https://github.com/ReliefApplications/ems-frontend/issues/2094)) ([eb94e7f](https://github.com/ReliefApplications/ems-frontend/commit/eb94e7fc03095e082d6beb9ecfd13481f35582b4))
* impossible to edit application page form's name ([88c54fd](https://github.com/ReliefApplications/ems-frontend/commit/88c54fddbafaa8da544f164760e9c33ca1da7a27))
* in some cases, the select overlay was hard to read, as it was too close to bottom. Overlay should now appear on top if not enough space ([238a9c0](https://github.com/ReliefApplications/ems-frontend/commit/238a9c0bad3e4a13b99eabe112dc25a217376816))
* inconsistent scroll when editing role's access on resources ([#1647](https://github.com/ReliefApplications/ems-frontend/issues/1647)) ([d4e05c3](https://github.com/ReliefApplications/ems-frontend/commit/d4e05c3e2ba55a98f7348dbebed1edbe7d3454af))
* incorrect auth interceptor would make code fail locally ([a7aba87](https://github.com/ReliefApplications/ems-frontend/commit/a7aba87c9bf7b12ceb98a64cf976e5b9a99966e3))
* incorrect calculation of dates in calculated fields. Now enforcing user timezone ([f860162](https://github.com/ReliefApplications/ems-frontend/commit/f860162f29369df55074226debeb6b98b6338db6))
* incorrect default scroll when loading dashboards ([#2086](https://github.com/ReliefApplications/ems-frontend/issues/2086)) ([0f40b0d](https://github.com/ReliefApplications/ems-frontend/commit/0f40b0d83928e830b455c57200dbe6b9a8240a30))
* incorrect drag / drop for steps in aggregation pipeline ([#1978](https://github.com/ReliefApplications/ems-frontend/issues/1978)) ([8c47de3](https://github.com/ReliefApplications/ems-frontend/commit/8c47de36e9da7622fc5db8aae37a93bf680c641c))
* incorrect exitFullscreen message on dashboard ([ce27d6d](https://github.com/ReliefApplications/ems-frontend/commit/ce27d6d65b1a4594bb21be925e4a4ec282185c4f))
* incorrect fill text in series settings ([aaee1b1](https://github.com/ReliefApplications/ems-frontend/commit/aaee1b1cc81eb470f51c3454e901b355ce66027f))
* incorrect indicator for pagination of records-tab in resource ([#1960](https://github.com/ReliefApplications/ems-frontend/issues/1960)) ([862c899](https://github.com/ReliefApplications/ems-frontend/commit/862c899e88a7de9f7e815b533480935904860227))
* incorrect loading from cache for reference data fields ([9041ff3](https://github.com/ReliefApplications/ems-frontend/commit/9041ff3831b840c83b83a39158261e8071ac0efa))
* incorrect overflow in grid widget settings action view ([e3d9118](https://github.com/ReliefApplications/ems-frontend/commit/e3d911870f3f664890ef5a885d24e1cc062370bf))
* incorrect reorder & delete events in tabs widget ([#2097](https://github.com/ReliefApplications/ems-frontend/issues/2097)) ([9e4246b](https://github.com/ReliefApplications/ems-frontend/commit/9e4246bc4091ac735146c471fb49b7eded345beb))
* incorrect scroll due to new gridster library could cause some conflicts ([9fc9504](https://github.com/ReliefApplications/ems-frontend/commit/9fc950494d75106e4ad9e372ae29cfaa2458d3d8))
* incorrect scroll in grid widgets & some unexpected effects when showing / hiding columns ([#2087](https://github.com/ReliefApplications/ems-frontend/issues/2087)) ([35adb87](https://github.com/ReliefApplications/ems-frontend/commit/35adb872ec62a2e67de3aa4824a33acb1cc9f52d))
* incorrect sorting on api configuration ([#2125](https://github.com/ReliefApplications/ems-frontend/issues/2125)) ([5acf213](https://github.com/ReliefApplications/ems-frontend/commit/5acf213d1c7e3880ae69be8a6b62e2de98f09aa2))
* incorrect style of aggregation grids & some settings could be saved even if unused ([#1984](https://github.com/ReliefApplications/ems-frontend/issues/1984)) ([210b8e7](https://github.com/ReliefApplications/ems-frontend/commit/210b8e774d3bce21ae0d20f93cac1e1614f0af1c))
* incorrect text when editing pull job notification ([30b621c](https://github.com/ReliefApplications/ems-frontend/commit/30b621cd5ef3146a8cec0729258b9eb22da46a29))
* Incorrect UI for workflow access in application role editor ([#1973](https://github.com/ReliefApplications/ems-frontend/issues/1973)) ([3640be1](https://github.com/ReliefApplications/ems-frontend/commit/3640be100d27346716ae60be71d89d2ff455e9df))
* incorrect zoom styling on maps ([c647f82](https://github.com/ReliefApplications/ems-frontend/commit/c647f820e0ab1af396fab10d5beac4232c02d623))
* incorrectly sized columns ([#2127](https://github.com/ReliefApplications/ems-frontend/issues/2127)) ([c0be7b1](https://github.com/ReliefApplications/ems-frontend/commit/c0be7b1e30ac4b71f659b97845caf2f79adf8edd))
* infinite re renders of dropdown in filter builder ([#1927](https://github.com/ReliefApplications/ems-frontend/issues/1927)) ([71e1bcd](https://github.com/ReliefApplications/ems-frontend/commit/71e1bcd30c9fa77dc27decc3b850380c0122f1d4))
* infinite redirection when trying to open a contextual page ([#1903](https://github.com/ReliefApplications/ems-frontend/issues/1903)) ([3dbec90](https://github.com/ReliefApplications/ems-frontend/commit/3dbec908991c2fde0dd70e84a9e7a45fd03af954))
* issue loading some webmaps with arcgis ([5fbf5fc](https://github.com/ReliefApplications/ems-frontend/commit/5fbf5fc2e04794b9a9da0d3e830eb8c0e356cf34)), closes [bugfix/AB#65126](https://github.com/bugfix/AB/issues/65126)
* issue with build ([7db6463](https://github.com/ReliefApplications/ems-frontend/commit/7db646399d64ea0b720eac47367e1819f7139893))
* issue with map-settings takeUntil ([53bb171](https://github.com/ReliefApplications/ems-frontend/commit/53bb1713270a992d0c9d685117199613d4ea57e9))
* issue with overlay ([e5e984f](https://github.com/ReliefApplications/ems-frontend/commit/e5e984f696e01cfa2ab9f616c7bc10fdc9bc1120))
* issue with select a layout text ([8238173](https://github.com/ReliefApplications/ems-frontend/commit/82381734fdb4639bdb770f7d95d7edad817c3d49))
* issues with visibility ([ce79519](https://github.com/ReliefApplications/ems-frontend/commit/ce79519b4941e0220ffcd698263c479187aee9c4))
* layer control being duplicated ([995588a](https://github.com/ReliefApplications/ems-frontend/commit/995588abaa87405a0f902754edc984922a681c4e))
* layer control could not be removed anymore ([b8356cd](https://github.com/ReliefApplications/ems-frontend/commit/b8356cd4c40f680f3b371b226646b12c9f35b5c7))
* layers control would not be made visible / hidden when trying to show it from map settings ([4b6f899](https://github.com/ReliefApplications/ems-frontend/commit/4b6f899b6a0eb96bc276729dd936038db4be4a42))
* layers fields would not be usable ([f8bc2cb](https://github.com/ReliefApplications/ems-frontend/commit/f8bc2cbc1f5ae7c07786973441b3ff0608ab5dec))
* layers get duplicated when changing dashboard filter value ([#1876](https://github.com/ReliefApplications/ems-frontend/issues/1876)) ([5decf06](https://github.com/ReliefApplications/ems-frontend/commit/5decf068efcf7a2d438eb8f4976dfbe60a91cd36))
* layers would be duplicated when doing some changes on them ([06c801d](https://github.com/ReliefApplications/ems-frontend/commit/06c801dda00a97198035b33d18d74085e987658e)), closes [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091)
* left sidenav would incorrectly display on small screens, when over the content ([3192e07](https://github.com/ReliefApplications/ems-frontend/commit/3192e074a8a1509d2695ad75e7ec4518dc069524))
* legend control on map would appear multiple times ([a43f261](https://github.com/ReliefApplications/ems-frontend/commit/a43f26149b4026aee75572bb85408c3bf8b4d65b))
* legend now correctly working for unique value layer points ([4fdb7f9](https://github.com/ReliefApplications/ems-frontend/commit/4fdb7f9d4b0b3c43e38101a5349ff16927d33c6b))
* manually enabled layers on map would not appear after filter refresh ([4e7653b](https://github.com/ReliefApplications/ems-frontend/commit/4e7653b223b59fa7d338ff58925c4a137fd3f655))
* map in settings could do weird movements ([ac6e509](https://github.com/ReliefApplications/ems-frontend/commit/ac6e509d81a2fec6031dd1f16ca518fdec6acf8e))
* map layers would not always render correctly after dashboard filtering ([f795215](https://github.com/ReliefApplications/ems-frontend/commit/f795215533d3ff6c92b15097fd09db95055ccfb4))
* map search results would overlap fullscreen control ([e337cfa](https://github.com/ReliefApplications/ems-frontend/commit/e337cfafa13a1d8fad5670531cdc60663fb6c970))
* map would not appear when editing a layer ([97fcfba](https://github.com/ReliefApplications/ems-frontend/commit/97fcfba8385b02b3eb6e64183a888a098fb371d0))
* maps in tab widget would not correctly initialize + prevent all tabs to load at same tiem ([33c4745](https://github.com/ReliefApplications/ems-frontend/commit/33c47453d6b220015e2da730bab9c6c3b77fec21))
* menu items text and buttons overlapping in firefox ([#1834](https://github.com/ReliefApplications/ems-frontend/issues/1834)) ([47532f9](https://github.com/ReliefApplications/ems-frontend/commit/47532f9f42984134b4ae96f7bade0bbdf58ba1cf))
* missing tooltip for fullscreen button on front-office ([8a624d9](https://github.com/ReliefApplications/ems-frontend/commit/8a624d981639cd7debca62c291cbe1742e2429f9))
* multi select questions would not be usable in grids ([b4fe63b](https://github.com/ReliefApplications/ems-frontend/commit/b4fe63bf997bf8a73592983fbacf227028a8a8aa))
* navigate to page action in grid / summary card would limit to only id field ([#2029](https://github.com/ReliefApplications/ems-frontend/issues/2029)) ([12eb046](https://github.com/ReliefApplications/ems-frontend/commit/12eb0466655bb4cecd27c00957e2cdd4ddd3fac9))
* navigation not working back-office dashboard when using templates ([11b9ae3](https://github.com/ReliefApplications/ems-frontend/commit/11b9ae389868bf8581d4fdf8f47469575979ea26))
* notification not initializing recipientsType ([#2006](https://github.com/ReliefApplications/ems-frontend/issues/2006)) ([ea29578](https://github.com/ReliefApplications/ems-frontend/commit/ea29578c824156b6c9a61719dbf6fdbc0478c5d0))
* number in center of clusters not aligned ([1bca1f6](https://github.com/ReliefApplications/ems-frontend/commit/1bca1f620c1237ab3bcc1fdbabe808c24f48437e)), closes [bugfix/AB#63765](https://github.com/bugfix/AB/issues/63765) [bugfix/AB#63765](https://github.com/bugfix/AB/issues/63765)
* popup could not appear with polygons ([c6fa211](https://github.com/ReliefApplications/ems-frontend/commit/c6fa211a8192929e65c609116cb316894fb0d7d2))
* popup text element could go out of bounds ([203001a](https://github.com/ReliefApplications/ems-frontend/commit/203001aa41e8bd4580e8c30d72bbd1d098d773da))
* prevent aggregation fields to be fetched before query builder is ready ([#2139](https://github.com/ReliefApplications/ems-frontend/issues/2139)) ([3bee583](https://github.com/ReliefApplications/ems-frontend/commit/3bee5837c221a799d9e479e91cab0131afb3c259))
* previous update changed some package versions ([e054784](https://github.com/ReliefApplications/ems-frontend/commit/e05478444f376beaf4b741b55f1105a5d2a6405c))
* pull jobs would not be editable ([cc9d685](https://github.com/ReliefApplications/ems-frontend/commit/cc9d685c3620450a38bd3f0cbbaf38d697dcac6d))
* **query builder:** sometimes no fields are displayed due to incorrect events ordering ([#1961](https://github.com/ReliefApplications/ems-frontend/issues/1961)) ([f0fee3e](https://github.com/ReliefApplications/ems-frontend/commit/f0fee3e8393a73d39c079a530e97be7bd388c9eb))
* readOnly attribute of fields would not be taken into account when doing edition ([21b9010](https://github.com/ReliefApplications/ems-frontend/commit/21b90101d354785afdf92ec64482e2c501487eb3))
* readonly would not be correctly considered in resources question ([#2054](https://github.com/ReliefApplications/ems-frontend/issues/2054)) ([498bb96](https://github.com/ReliefApplications/ems-frontend/commit/498bb969acf03b961d7ba7dbc9e4eff08dec9f10))
* record history could send an error when object was null or undefined ([80fd7ee](https://github.com/ReliefApplications/ems-frontend/commit/80fd7ee865f5156a700907680f2b338f16c0146d))
* reference data would appear as object object in grid ([b9b1910](https://github.com/ReliefApplications/ems-frontend/commit/b9b191032ef2bf74a4fbeec9459d973c99e1b835))
* reference data would be cached everytime ([5f0a99d](https://github.com/ReliefApplications/ems-frontend/commit/5f0a99d53377da4e7a4c93e348e809a9c65bf65e))
* remove code information in url after login ([bcfb603](https://github.com/ReliefApplications/ems-frontend/commit/bcfb603b2a74a03437ae6a236451de22c343ca3d))
* remove custom logic about choicesbyurl that could break questions ([e7b6390](https://github.com/ReliefApplications/ems-frontend/commit/e7b639024c79b1025ae24b66821c911005633631))
* remove expand option for map widgets ([#1877](https://github.com/ReliefApplications/ems-frontend/issues/1877)) ([bfd1b2c](https://github.com/ReliefApplications/ems-frontend/commit/bfd1b2c049fbd3075660e65fadf319fa367b227f))
* renderer type incorrectly set in layerDefinitionForm ([73f224b](https://github.com/ReliefApplications/ems-frontend/commit/73f224baaa325d5964fa5409c659c8ebdc8a0512))
* reset default button not available in front-office ([#2122](https://github.com/ReliefApplications/ems-frontend/issues/2122)) ([ab81073](https://github.com/ReliefApplications/ems-frontend/commit/ab810737f245ea4b527d4f477dd77ff09819c1e1))
* reset default button not restoring sticky columns if hidden ([#2119](https://github.com/ReliefApplications/ems-frontend/issues/2119)) ([d9c9dbd](https://github.com/ReliefApplications/ems-frontend/commit/d9c9dbd11d323df30bdc7697169fe45ee157d6d5))
* scrollbar would not look the same on firefox ([#1827](https://github.com/ReliefApplications/ems-frontend/issues/1827)) ([3638c3d](https://github.com/ReliefApplications/ems-frontend/commit/3638c3defca5a608cd4d900f56a8f69d2aae2201))
* search with filter not working in GetResources queries ([054fa48](https://github.com/ReliefApplications/ems-frontend/commit/054fa48087b483ce27fa31b18ffcd94268669cf7))
* selected records in text widget would not appear when opening settings ([#1901](https://github.com/ReliefApplications/ems-frontend/issues/1901)) ([93a9af6](https://github.com/ReliefApplications/ems-frontend/commit/93a9af668d2adb3681badc1bc96307fb112fc0ee))
* shadow dom not working in all cases ([a7d920d](https://github.com/ReliefApplications/ems-frontend/commit/a7d920d2c75dbceb742018f957edc74ec14f8cee))
* show new records created in resouce questions in the search grid ([4d0ed40](https://github.com/ReliefApplications/ems-frontend/commit/4d0ed4048f5a7173ee57bfb2d6106f45749bd5e2))
* simplify reference data dropdown component ([37289f0](https://github.com/ReliefApplications/ems-frontend/commit/37289f08df4b352177ab963e092c916fdd9428e4))
* some features from contextual dashboards would not work correctly ([#1825](https://github.com/ReliefApplications/ems-frontend/issues/1825)) ([a8d089b](https://github.com/ReliefApplications/ems-frontend/commit/a8d089b80d87a8b8157cf32d468a3fcb151a8707))
* some fields would not appear in style fields selector ([a0094e1](https://github.com/ReliefApplications/ems-frontend/commit/a0094e1901cd03df69ada53bea13557d1125766b))
* some fields would not be accessible in map popup ([48f98aa](https://github.com/ReliefApplications/ems-frontend/commit/48f98aaa83ad05520b21638068254ec171656e43))
* some issues with new dashboard filter ([fd3d00e](https://github.com/ReliefApplications/ems-frontend/commit/fd3d00e147123e26933ff193238df1b7c2127302))
* some layers would break the map when loading due to incorrect API call ([35a50a0](https://github.com/ReliefApplications/ems-frontend/commit/35a50a0800caf0e3370dd8f36f3a2afdd162aa98))
* some layers would break the map when loading due to incorrect API call ([d305963](https://github.com/ReliefApplications/ems-frontend/commit/d30596359ced6b2f39c4b8180607c0a99c069d52))
* some lint issues and incorrect logic in the edition of geofields ([470819e](https://github.com/ReliefApplications/ems-frontend/commit/470819e279f56fdfce3e38edfced7c3d7ba9a3a2))
* some notifications would not update their content  ([#1947](https://github.com/ReliefApplications/ems-frontend/issues/1947)) ([a90001f](https://github.com/ReliefApplications/ems-frontend/commit/a90001f7307034cb747e01ba66a0f2dc906d856d))
* some options would not correctly appear in some instances of form builder ([#2105](https://github.com/ReliefApplications/ems-frontend/issues/2105)) ([2763ff2](https://github.com/ReliefApplications/ems-frontend/commit/2763ff22931dcaba59136c8044257f22e54559c7))
* some popups could not appear due to incorrect geojson or event ([2e41dde](https://github.com/ReliefApplications/ems-frontend/commit/2e41ddedb566af604d9458f3fc2095aa89837583))
* some reference data could not load in forms ([4dee883](https://github.com/ReliefApplications/ems-frontend/commit/4dee8839f2a66b3b65f260d58664cb30d59a0389))
* Some select in widgets would display ID instead of name ([#2058](https://github.com/ReliefApplications/ems-frontend/issues/2058)) ([1ab1d30](https://github.com/ReliefApplications/ems-frontend/commit/1ab1d30e2a92086614755ae61400048bf2d56c8b))
* some widgets in tab widget could not be resized ([1413948](https://github.com/ReliefApplications/ems-frontend/commit/1413948528a752a0ce1584d8ba15fcbf2106ec19))
* sorting in ref data table not working ([#2126](https://github.com/ReliefApplications/ems-frontend/issues/2126)) ([1ae1e27](https://github.com/ReliefApplications/ems-frontend/commit/1ae1e276a7eef1682ab73bfa2ac645bb30ad0dea))
* sorting tab incorrect display in summary card settings ([#1818](https://github.com/ReliefApplications/ems-frontend/issues/1818)) ([18abea2](https://github.com/ReliefApplications/ems-frontend/commit/18abea27b2a96dd8af29de209d0f42420d65fed9))
* sticky columns in grids could be wrongly resized ([#2069](https://github.com/ReliefApplications/ems-frontend/issues/2069)) ([7e7ee5b](https://github.com/ReliefApplications/ems-frontend/commit/7e7ee5b39126b6ff1285a170a3d6c8501e5939ba))
* storybook not building for shared library ([3d62401](https://github.com/ReliefApplications/ems-frontend/commit/3d6240152527710b7dd561a1f1286a465bb6d34a))
* subscribe to geoForm lat/lng ([40e19ba](https://github.com/ReliefApplications/ems-frontend/commit/40e19ba7e76fce2e0fa008ad29c596b503f3f573))
* survey localization not working after update. ([#1936](https://github.com/ReliefApplications/ems-frontend/issues/1936)) ([0e2e742](https://github.com/ReliefApplications/ems-frontend/commit/0e2e7428f367d89ef92ec656b08afb5a0f4ed813))
* tabs widget would be badly displayed due to changes on dashboard & widgets ([cf3f1ca](https://github.com/ReliefApplications/ems-frontend/commit/cf3f1cac99c40cbcf4cb40843692ccfee0a0e062))
* tabs widget would not correctly indicate when updated, preventing modal to appear when closing ([8395a71](https://github.com/ReliefApplications/ems-frontend/commit/8395a71c2547d3985e462631b4b6d65a510ce534))
* tagbox in surveyjs would not work in some cases ([f6cba5a](https://github.com/ReliefApplications/ems-frontend/commit/f6cba5ad548b6a377951704a3b99271bb2b903d7))
* text selector for date filtering in layouts would not appear anymore ([9212038](https://github.com/ReliefApplications/ems-frontend/commit/9212038ae1ec803113b8df5237f43850c5495d8c))
* text widget edition would lose widget display configuration ([7f3b18b](https://github.com/ReliefApplications/ems-frontend/commit/7f3b18ba98fded73b0a90681a6019fbc86504707))
* toggle of archived records would create incorrect list ([#2132](https://github.com/ReliefApplications/ems-frontend/issues/2132)) ([f1abf81](https://github.com/ReliefApplications/ems-frontend/commit/f1abf811189f67841a8770ac5e6cc35af0bf745c))
* toggle would not correctly indicate touch events ([43cba1d](https://github.com/ReliefApplications/ems-frontend/commit/43cba1d4c99b6ee828573c2d5efea5208c82310d))
* tooltip in form builder could get duplicated ([2d49c1e](https://github.com/ReliefApplications/ems-frontend/commit/2d49c1e7f8e8f6da84a69ca0b88deec95876e8ef))
* ui lib storybook could not compile due to recent changes ([bedbdc7](https://github.com/ReliefApplications/ems-frontend/commit/bedbdc716987ddb772c709450b25b96d5e7f286e))
* unable to scroll when using expression builder in calculated fields UI ([334b4da](https://github.com/ReliefApplications/ems-frontend/commit/334b4dac2eb463e06d15eb729ac469dfda1947fe))
* unionBy causing type issue in update-queries method ([b1dff4a](https://github.com/ReliefApplications/ems-frontend/commit/b1dff4a375b66d2bd8e4e7fe44a3e585d68051b9))
* unique renderer would not render correctly ([ca83272](https://github.com/ReliefApplications/ems-frontend/commit/ca83272417b2b6d3be76c8e04a4f67017b038540))
* update resources field permissions in roles page ([dbae656](https://github.com/ReliefApplications/ems-frontend/commit/dbae6561d438dd8f9b640c2f98859522f3876de1))
* uploading files from default value ([02ad65b](https://github.com/ReliefApplications/ems-frontend/commit/02ad65be80e380f695d469f127b7cf46bfb6184b))
* visibility icon would not appear for hidden pages ([#1967](https://github.com/ReliefApplications/ems-frontend/issues/1967)) ([00e07d4](https://github.com/ReliefApplications/ems-frontend/commit/00e07d4de77fa687afeba7624a220dd8bcb70439))
* visibility of parent could break visibility of children elements in layers ([7b48e79](https://github.com/ReliefApplications/ems-frontend/commit/7b48e79af44511df4e0406130fee1907f58086bc))
* visibility was not correctly working for some layers ([0f66086](https://github.com/ReliefApplications/ems-frontend/commit/0f6608648629a5e0ecf3cc19cc46be3e9f095584))
* web widgets would not build ([#1886](https://github.com/ReliefApplications/ems-frontend/issues/1886)) ([73c1bc4](https://github.com/ReliefApplications/ems-frontend/commit/73c1bc4a584718f3b5d78f6512f82796dd41c25c))
* webmap incorrect options in searchbar ([#1405](https://github.com/ReliefApplications/ems-frontend/issues/1405)) ([20b95da](https://github.com/ReliefApplications/ems-frontend/commit/20b95da15726a55c2c2cd7b8c3dbb62b4ed14f9e))
* when selected reference data would not appear in summary card settings ([ba067b3](https://github.com/ReliefApplications/ems-frontend/commit/ba067b3a3938b49c0584935a26a87b1e912d1046))
* widget grid would fail to get collapsed status of widgets ([1e2e9e0](https://github.com/ReliefApplications/ems-frontend/commit/1e2e9e012440e6378cdda1d53f8d42b2032d2441))
* workflow step never loads if dashboard structure has null elements ([13f90e3](https://github.com/ReliefApplications/ems-frontend/commit/13f90e397843a1fcb555a9ae7519df5f125e83a4))
* working sidenav when fullscreen mode is active & widget is expanded ([7b04fed](https://github.com/ReliefApplications/ems-frontend/commit/7b04fedca469a5cb44dd21e1b60cf5f7864405b7))


### Features

* ability to archive and restore application pages ([#1505](https://github.com/ReliefApplications/ems-frontend/issues/1505)) ([8c38ccf](https://github.com/ReliefApplications/ems-frontend/commit/8c38ccf42c115dd943efd20110d0b2c9bcbb7e5f))
* Ability to save draft record ([#2030](https://github.com/ReliefApplications/ems-frontend/issues/2030)) ([2aeeca1](https://github.com/ReliefApplications/ems-frontend/commit/2aeeca1f0a056525f88fc39dde268d41441201f7))
* ability to set predefined filter on charts ([#2060](https://github.com/ReliefApplications/ems-frontend/issues/2060)) ([4f79eb1](https://github.com/ReliefApplications/ems-frontend/commit/4f79eb1cb02492c4df507ab5098a2e56d9968b17))
* add auth code APIs ([#1999](https://github.com/ReliefApplications/ems-frontend/issues/1999)) ([ba32de7](https://github.com/ReliefApplications/ems-frontend/commit/ba32de792a00cec66a9c5bafaa65892318120db0))
* add contextual menu to relevant controls using tinymce editor ([b8902df](https://github.com/ReliefApplications/ems-frontend/commit/b8902dfb45342b5883580edb66788fa78b24ed3b))
* add custom styling to widgets ([1132f45](https://github.com/ReliefApplications/ems-frontend/commit/1132f45e019b168dc046f500f64de543e496e53a))
* add dashboard button actions ([9f52272](https://github.com/ReliefApplications/ems-frontend/commit/9f52272100361f3f933358a4d8a65a98164f1da9))
* add fields component in map layer settings ([6327f21](https://github.com/ReliefApplications/ems-frontend/commit/6327f21663ae04d4e0b20e744497dd05f37917f4))
* add filter input & output in app-widget ([4d94cef](https://github.com/ReliefApplications/ems-frontend/commit/4d94cefd8718f0b382679e2d0fc79e6242bb49e7))
* add heatmap to map-forms ([ca9af30](https://github.com/ReliefApplications/ems-frontend/commit/ca9af30fde313787eb0b942741641bd6e54bf353))
* Add JSON editor tab to survey builder ([22adaf5](https://github.com/ReliefApplications/ems-frontend/commit/22adaf5f397e077cc9decfc51d968a53779d2d8a))
* add missing translations ([8c504ac](https://github.com/ReliefApplications/ems-frontend/commit/8c504ac58dd744d6bdd93db0984a50c97df5296c))
* add more missing translations ([cfab01b](https://github.com/ReliefApplications/ems-frontend/commit/cfab01bd762ed8ffadeb24c3c43c18aaafba9073))
* add more options to cluster layers ([#1906](https://github.com/ReliefApplications/ems-frontend/issues/1906)) ([c5e2d14](https://github.com/ReliefApplications/ems-frontend/commit/c5e2d14418a4a5c9d779280324a05b4750ac463b))
* add new control for tinymce editor, usable in mat form fields ([984ba1d](https://github.com/ReliefApplications/ems-frontend/commit/984ba1d8f5feecf381d601b063f8d7eca045bc0a)), closes [refactor/AB#61059](https://github.com/refactor/AB/issues/61059)
* add one more missing translation ([90e98f3](https://github.com/ReliefApplications/ems-frontend/commit/90e98f3b23f3c23438eb3032f4d0bb7bfd722383))
* add possibility to fetch nested fields in ref data ([efbcc1d](https://github.com/ReliefApplications/ems-frontend/commit/efbcc1db4e278f346966952fb3411dae3e4c3d9a))
* add possibility to setup sorting for grids & summary cards ([21648ec](https://github.com/ReliefApplications/ems-frontend/commit/21648ecb2e0d21e5b8fe944330a8d2c6afa32347))
* add survey scss import in form modal ([55f1299](https://github.com/ReliefApplications/ems-frontend/commit/55f12999151660186c412a3ecdd438857ac4f0e2))
* add user variables on form ([aed4116](https://github.com/ReliefApplications/ems-frontend/commit/aed4116853a338cfd7a7e37ecf2b29cacce422ee))
* added filter record option when context datasource is coming from a resource ([#2022](https://github.com/ReliefApplications/ems-frontend/issues/2022)) ([e750a47](https://github.com/ReliefApplications/ems-frontend/commit/e750a4776f36d6e3c8e4103d4ef5aaf5742895f4))
* Adding surveyJS variables for fields of selected record in resource question ([da7f8ca](https://github.com/ReliefApplications/ems-frontend/commit/da7f8ca73fcff9a35306889333a0601c1cd8bbe6))
* Adds length custom function to be used in survey builder ([bf02242](https://github.com/ReliefApplications/ems-frontend/commit/bf02242d5d5f26213f6fdf6fbb4dd502ac62cdfa))
* allow admins to set an action to navigate to another page of the app ([#1897](https://github.com/ReliefApplications/ems-frontend/issues/1897)) ([e1b68c0](https://github.com/ReliefApplications/ems-frontend/commit/e1b68c0235ccb414fa5826245cff189f3e5f42a2))
* allow draft edition of records in grids ([3cea89b](https://github.com/ReliefApplications/ems-frontend/commit/3cea89b26b0094741dedf9499f26410264ff98d6))
* allow fields from ref data linked to a resource to be used  ([#1575](https://github.com/ReliefApplications/ems-frontend/issues/1575)) ([cb8b30c](https://github.com/ReliefApplications/ems-frontend/commit/cb8b30ca36074c1544bf3d95796a6553f1de1b55))
* allow nested fields to be used in map layers fields selectors ([#2089](https://github.com/ReliefApplications/ems-frontend/issues/2089)) ([0bed298](https://github.com/ReliefApplications/ems-frontend/commit/0bed29848e9cd7b01dee606befe81f40c143f3a3))
* allow single widget page ([45ae280](https://github.com/ReliefApplications/ems-frontend/commit/45ae2808ef2ac9fb182965acd73157ca3cf26936))
* allow to activate / deactivate edition in back-office, to preview changes ([a54c4a5](https://github.com/ReliefApplications/ems-frontend/commit/a54c4a5cd805e66c4052a4c480af41bbb66a03dc))
* allow to define grid actions in summary card settings ([#1888](https://github.com/ReliefApplications/ems-frontend/issues/1888)) ([1f90171](https://github.com/ReliefApplications/ems-frontend/commit/1f901714a13ef147d50c96794efd6ae2b264f8ee))
* allow to edit / add reference data fields ([#2128](https://github.com/ReliefApplications/ems-frontend/issues/2128)) ([c7f047b](https://github.com/ReliefApplications/ems-frontend/commit/c7f047b654235516d42cb9f5e645b33b2fc9d715))
* also allow scss in custom style of application ([222d67c](https://github.com/ReliefApplications/ems-frontend/commit/222d67c95a6c4fc2f1f4e4a261f93c99d07ccb72))
* can customize dashboards, by setting number of columns, size of rows, and margin ([#2055](https://github.com/ReliefApplications/ems-frontend/issues/2055)) ([fbdf27a](https://github.com/ReliefApplications/ems-frontend/commit/fbdf27a76ca183c095b95a54d52a9098f8d4db43))
* can expand widgets horizontally ([#2080](https://github.com/ReliefApplications/ems-frontend/issues/2080)) ([5203e74](https://github.com/ReliefApplications/ems-frontend/commit/5203e7461340d30c3fec646d6f796121c9e61701))
* can now edit page / step 's icon ([5a58854](https://github.com/ReliefApplications/ems-frontend/commit/5a58854f6b1bc5ada65b07f621b172b0257b0b54))
* can now enable / disable inner padding of some widgets ([#2081](https://github.com/ReliefApplications/ems-frontend/issues/2081)) ([3962249](https://github.com/ReliefApplications/ems-frontend/commit/3962249a1c3ab57a595e41a59f2213e9944f8bd0))
* can now go to previous step automatically from a dashboard in a workflow ([4d592d1](https://github.com/ReliefApplications/ems-frontend/commit/4d592d1dfdbc4db3233b1344a3b3d07adaf609ba)), closes [2.1.x/AB#10686](https://github.com/2.1.x/AB/issues/10686)
* can now group layers ([a99a17f](https://github.com/ReliefApplications/ems-frontend/commit/a99a17fcf63ec4acb67c0e26243913bd208af998))
* can now hide application menu by default ([5470097](https://github.com/ReliefApplications/ems-frontend/commit/5470097a0a4d21047d4184ef565495cc5a76f5a6))
* can now query historical data ([#1873](https://github.com/ReliefApplications/ems-frontend/issues/1873)) ([7627df4](https://github.com/ReliefApplications/ems-frontend/commit/7627df4f256d8838902e7c39b326650a3768fec5))
* can now use App Builder applications as web element ([#1977](https://github.com/ReliefApplications/ems-frontend/issues/1977)) ([b7b98b0](https://github.com/ReliefApplications/ems-frontend/commit/b7b98b06dccb28384f76d9b4f7837b86dfe584de))
* can now use infinite aggregations ([4379df2](https://github.com/ReliefApplications/ems-frontend/commit/4379df2025636c97c00037e14b938c55e49c85a1))
* can now use reference data in summary card ([ba3c61a](https://github.com/ReliefApplications/ems-frontend/commit/ba3c61aad1c3122511cd87b735945b43b8c69482))
* can update grid options inside tabs widgets ([#2093](https://github.com/ReliefApplications/ems-frontend/issues/2093)) ([055152d](https://github.com/ReliefApplications/ems-frontend/commit/055152d5debc04fc39f1a699d0366d59fa15bde0))
* display matrix questions in grid / text / summary card widgets ([#1350](https://github.com/ReliefApplications/ems-frontend/issues/1350)) ([25dc2df](https://github.com/ReliefApplications/ems-frontend/commit/25dc2df6459846a9b215b12da940ba9050859355))
* filtering widgets by dashboard filters ([6379f78](https://github.com/ReliefApplications/ems-frontend/commit/6379f781fe602a43e2370fcaeade2b136dc03400))
* geomap working ([ce44cc9](https://github.com/ReliefApplications/ems-frontend/commit/ce44cc9fc6a14628c80f2fee23fc49e09242abe7))
* grid columns should now automatically size ([915d895](https://github.com/ReliefApplications/ems-frontend/commit/915d8954be30518b907c621bd200539dcb85fade))
* implement filter icon ([356c39a](https://github.com/ReliefApplications/ems-frontend/commit/356c39a0f3a7d7e459376651eda82c11b1d441da))
* implement filter icon & dashboard filter modern variant ([ed63923](https://github.com/ReliefApplications/ems-frontend/commit/ed63923e45e814e73ec8c668233486c354b7701d))
* improve hide page feature ([15ec6d1](https://github.com/ReliefApplications/ems-frontend/commit/15ec6d1fa9cdfb82a97e68c0df837c6dc1ccdc3b))
* improve layers select styling ([bb0ecd8](https://github.com/ReliefApplications/ems-frontend/commit/bb0ecd8c4473a2fbd30a92099c4f8feb7b1a3e56))
* inline edition of reference data ([4dfa2b3](https://github.com/ReliefApplications/ems-frontend/commit/4dfa2b30be14dd5318cd17fba34dba338df055f6))
* last update map control ([#2002](https://github.com/ReliefApplications/ems-frontend/issues/2002)) ([2c92dd6](https://github.com/ReliefApplications/ems-frontend/commit/2c92dd6dd8b90da71e4b49116a4a0bddc29bb54d))
* now use filter at dashboard level ([#2078](https://github.com/ReliefApplications/ems-frontend/issues/2078)) ([38e0b13](https://github.com/ReliefApplications/ems-frontend/commit/38e0b136aaa47c21988aed7e90edcaefe40f84be))
* possibility to hide pages' ([0ba87cd](https://github.com/ReliefApplications/ems-frontend/commit/0ba87cdfcec7ac1d67e52ad2cc063ea3d71e9747))
* Reference data for dashboard filtering ([#1819](https://github.com/ReliefApplications/ems-frontend/issues/1819)) ([42e5bc2](https://github.com/ReliefApplications/ems-frontend/commit/42e5bc26d22f7927368616d4890a599827748d5b)), closes [feat/AB#74574](https://github.com/feat/AB/issues/74574)
* reference data now usable in text widget ([b0cefc5](https://github.com/ReliefApplications/ems-frontend/commit/b0cefc5f1377912e9fca79c7a37eae0c15550977))
* see markers from grid when opening geospatial question ([7231a50](https://github.com/ReliefApplications/ems-frontend/commit/7231a5013dd67302b6cfa495bb474c8d46a5cef8)), closes [Feat/ab#60047](https://github.com/Feat/ab/issues/60047)
* Show/Hide widget header ([#2005](https://github.com/ReliefApplications/ems-frontend/issues/2005)) ([20a964d](https://github.com/ReliefApplications/ems-frontend/commit/20a964d937b306161fd1af579498dd52df09d5f7))
* sidenav can now be collapsed on large screens ([49d74d7](https://github.com/ReliefApplications/ems-frontend/commit/49d74d757dddf4f31c7502800e5163a95b8ea446))
* Tabs widget ([#1793](https://github.com/ReliefApplications/ems-frontend/issues/1793)) ([16d793c](https://github.com/ReliefApplications/ems-frontend/commit/16d793cf964205275411e53b50be2f0a728f9c3d))
* Tabs widget ([#1795](https://github.com/ReliefApplications/ems-frontend/issues/1795)) ([cb31387](https://github.com/ReliefApplications/ems-frontend/commit/cb31387022216dfe1a7dd2d96fe00167483fdc1b))
* user attributes now usable in form builder ([#2075](https://github.com/ReliefApplications/ems-frontend/issues/2075)) ([446b9b1](https://github.com/ReliefApplications/ems-frontend/commit/446b9b12e334bfff32f41866250154814aba148e))
* zoom control new styling added to maps ([#1427](https://github.com/ReliefApplications/ems-frontend/issues/1427)) ([202504e](https://github.com/ReliefApplications/ems-frontend/commit/202504e3f8363a198e2cfc383a8b59f3319fabfa))


### Performance Improvements

* Add storybook for front-office & back-office ([#1990](https://github.com/ReliefApplications/ems-frontend/issues/1990)) ([ee42d8d](https://github.com/ReliefApplications/ems-frontend/commit/ee42d8d613ccdb40093f971a2904760ece5dd844)), closes [#77550](https://github.com/ReliefApplications/ems-frontend/issues/77550) [#77550](https://github.com/ReliefApplications/ems-frontend/issues/77550)
* **bundle:** remove useless kendo styles imports ([#1882](https://github.com/ReliefApplications/ems-frontend/issues/1882)) ([70b74fc](https://github.com/ReliefApplications/ems-frontend/commit/70b74fca16d840b5f4d187215bfb10cb08236c28))
* Load markers in chunks ([#1786](https://github.com/ReliefApplications/ems-frontend/issues/1786)) ([5eb316d](https://github.com/ReliefApplications/ems-frontend/commit/5eb316de6e42fe1a2e6cd5a52b944534e0a748cf))
* update Angular version to 15.2.9 ([8e985fb](https://github.com/ReliefApplications/ems-frontend/commit/8e985fb711622860fa8c6faff886039f8845ad66))
* update surveyjs package, to use Angular version, and drop knockout ([#1763](https://github.com/ReliefApplications/ems-frontend/issues/1763)) ([73f29f8](https://github.com/ReliefApplications/ems-frontend/commit/73f29f8ef862416cd69358adbe88e2a42ec06e2f))


### Reverts

* Revert "feat: Tabs widget (#1793)" (#1794) ([64c2a1b](https://github.com/ReliefApplications/ems-frontend/commit/64c2a1b2e29a12f68e9512d3e382b0b721a04516)), closes [#1793](https://github.com/ReliefApplications/ems-frontend/issues/1793) [#1794](https://github.com/ReliefApplications/ems-frontend/issues/1794)

## [2.1.8](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.7...v2.1.8) (2023-11-12)


### Bug Fixes

* remove initImplicitFlow ([4e9ddd0](https://github.com/ReliefApplications/oort-frontend/commit/4e9ddd046b16013f360d89fdcda7c9f9cf48c165))

## [2.1.7](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.6...v2.1.7) (2023-11-07)


### Bug Fixes

* add resource fields to history ([30c0846](https://github.com/ReliefApplications/oort-frontend/commit/30c0846a36a34db56f4024c4f482ad1bdce6ff71))

## [2.1.6](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.5...v2.1.6) (2023-11-06)


### Bug Fixes

* could not set as null in auto modify fields grid action ([#2041](https://github.com/ReliefApplications/oort-frontend/issues/2041)) ([a92230c](https://github.com/ReliefApplications/oort-frontend/commit/a92230c4c2e445aa4978b970293570f43d1c682d))

## [2.1.5](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.4...v2.1.5) (2023-11-03)


### Bug Fixes

* disable the button clear button if the question is read only ([#2038](https://github.com/ReliefApplications/oort-frontend/issues/2038)) ([4656d2e](https://github.com/ReliefApplications/oort-frontend/commit/4656d2eb5297f5dbba624122e9f9cad08d5e49b0))
* fields not being correctly removed in history ([#2036](https://github.com/ReliefApplications/oort-frontend/issues/2036)) ([8aaf87a](https://github.com/ReliefApplications/oort-frontend/commit/8aaf87a17430e1d23056834961892335f08d9c80))
* incorrect style of record history modal ([7011939](https://github.com/ReliefApplications/oort-frontend/commit/701193988a52b19a58c21f5ae863a57c93cab319))
* resources question grid actions could appear in display mode ([#2037](https://github.com/ReliefApplications/oort-frontend/issues/2037)) ([dd56837](https://github.com/ReliefApplications/oort-frontend/commit/dd56837ff34b903a3a56fd45093e6bfde4d57363))
* search was shared between instances of dropdown & tagbox questions ([ce748fa](https://github.com/ReliefApplications/oort-frontend/commit/ce748faa88eeb8dc65a0f2f0d76b52662b9800a2))

## [2.1.4](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.3...v2.1.4) (2023-10-25)


### Bug Fixes

* createdBy & modifiedBy would not appear in grids ([8b18cc6](https://github.com/ReliefApplications/oort-frontend/commit/8b18cc65a8deb0f32a9c8adcaec701bc0b14b9a8))
* dialog close directive could sometimes send empty string instead of undefined ([ef6a3af](https://github.com/ReliefApplications/oort-frontend/commit/ef6a3afc7e33f658e50aa0ce5fa1265674d1010e))

## [2.1.3](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.2...v2.1.3) (2023-10-24)


### Bug Fixes

* could not load aggregation grid ([d660f07](https://github.com/ReliefApplications/oort-frontend/commit/d660f0727b8b8d74cd128fc626f262c4672a58e1))
* improve front-office navigation that could sometimes lost track of redirection ([#1991](https://github.com/ReliefApplications/oort-frontend/issues/1991)) ([196d5ea](https://github.com/ReliefApplications/oort-frontend/commit/196d5ea040edc3280aaf15e7402777cb8437387c))
* page is taking too much resource when showing a grid with many columns records ([#1982](https://github.com/ReliefApplications/oort-frontend/issues/1982)) ([8205b20](https://github.com/ReliefApplications/oort-frontend/commit/8205b20cc99ffbd152f266d55f20f9466a2ec88a))
* prevent min & max of lines charts to not be integers, and add possibility to set them manually ([#1985](https://github.com/ReliefApplications/oort-frontend/issues/1985)) ([4194d5f](https://github.com/ReliefApplications/oort-frontend/commit/4194d5f5cdc89c881dc7b8021e7dd193dba0f782))

## [2.1.2](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.1...v2.1.2) (2023-10-09)


### Bug Fixes

* prevent metadata error to appear while building aggregation grid ([20470f9](https://github.com/ReliefApplications/oort-frontend/commit/20470f97cb299cbcd88cab8b9e01c0b8aa169b3d))
* unfriendly api configuration edition ([#1937](https://github.com/ReliefApplications/oort-frontend/issues/1937)) ([ee341e9](https://github.com/ReliefApplications/oort-frontend/commit/ee341e9cec5c90bf9ca27f90cd3ad629d357db2d))

## [2.0.11](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.10...v2.0.11) (2023-10-09)


### Bug Fixes

* prevent metadata error to appear while building aggregation grid ([20470f9](https://github.com/ReliefApplications/oort-frontend/commit/20470f97cb299cbcd88cab8b9e01c0b8aa169b3d))

## [2.1.1](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.0...v2.1.1) (2023-10-03)


### Bug Fixes

* unable to invite new users, UI was broken ([#1902](https://github.com/ReliefApplications/oort-frontend/issues/1902)) ([a0a5eb6](https://github.com/ReliefApplications/oort-frontend/commit/a0a5eb6cdb61582c257cba9d4366a1143b31310c))

# [2.1.0](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.10...v2.1.0) (2023-09-21)


### Features

* add tooltip when widget grid text overflows ([44850ed](https://github.com/ReliefApplications/oort-frontend/commit/44850ed0981eba04fa28c07d994323deec082146))
* automatically open widget settings on addition ([#1843](https://github.com/ReliefApplications/oort-frontend/issues/1843)) ([6ab4174](https://github.com/ReliefApplications/oort-frontend/commit/6ab41740e9f15d8d83b12d72f7cbd30cab6987b0)), closes [feat/AB#74663](https://github.com/feat/AB/issues/74663)


### Performance Improvements

* update apollo versions ([#1771](https://github.com/ReliefApplications/oort-frontend/issues/1771)) ([#1810](https://github.com/ReliefApplications/oort-frontend/issues/1810)) ([30180a1](https://github.com/ReliefApplications/oort-frontend/commit/30180a1013c8f9bdac58d9b107b570ca48eec9ba))

## [2.0.10](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.9...v2.0.10) (2023-09-21)


### Bug Fixes

* access to the platform could fail due to login not completed ([#1854](https://github.com/ReliefApplications/oort-frontend/issues/1854)) ([10ba120](https://github.com/ReliefApplications/oort-frontend/commit/10ba1204a6a0d12728af039fd8fd85d60f4d5628))
* aggregation filters only appling after saving twice ([#1829](https://github.com/ReliefApplications/oort-frontend/issues/1829)) ([3dd8bd4](https://github.com/ReliefApplications/oort-frontend/commit/3dd8bd409a117bfb51e46d7d4d2dee8145a898f1))
* aggregation filters only appling after saving twice ([#1829](https://github.com/ReliefApplications/oort-frontend/issues/1829)) ([5a788cb](https://github.com/ReliefApplications/oort-frontend/commit/5a788cbd9585437232783fb2764866a4583c8237))
* custom form variables not reused when creating multiple records from same view ([#1838](https://github.com/ReliefApplications/oort-frontend/issues/1838)) ([8fb2564](https://github.com/ReliefApplications/oort-frontend/commit/8fb25647aa7ee0e75765c7253255685c994ae7ae))
* date could not be cleared if opening a record with value in field ([2c0d047](https://github.com/ReliefApplications/oort-frontend/commit/2c0d0470f3889dbadf84d69c7aa529ef5d19bd05))
* date filters in grid could filter out items based on timezone ([2f37b39](https://github.com/ReliefApplications/oort-frontend/commit/2f37b39cfcf41df304673680c128a118ee8856ab))
* items per page would not correctly work on some page change  ([#1801](https://github.com/ReliefApplications/oort-frontend/issues/1801)) ([063391d](https://github.com/ReliefApplications/oort-frontend/commit/063391d6613bb1797bb00330a831c49bb3484b2d)), closes [bugfix/AB#74313](https://github.com/bugfix/AB/issues/74313)
* last option in grid tagbox filter remains active when removing options one by one ([#1777](https://github.com/ReliefApplications/oort-frontend/issues/1777)) ([f266e52](https://github.com/ReliefApplications/oort-frontend/commit/f266e522d688c841c53b46c1c730b0e5f3941d5c))
* only get visible fields when exporting grid data [#35940](https://github.com/ReliefApplications/oort-frontend/issues/35940) ([#1807](https://github.com/ReliefApplications/oort-frontend/issues/1807)) ([ce008da](https://github.com/ReliefApplications/oort-frontend/commit/ce008daba3cca2216bd3c40fd7a8ae6d2a68f358))
* only get visible fields when exporting grid data [#35940](https://github.com/ReliefApplications/oort-frontend/issues/35940) ([#1807](https://github.com/ReliefApplications/oort-frontend/issues/1807)) ([2d76aa8](https://github.com/ReliefApplications/oort-frontend/commit/2d76aa8eb4aaea48b0b0a95e935f34fcbd807c01))
* remove format filter method in grid, that could cause some date issues ([df3ee09](https://github.com/ReliefApplications/oort-frontend/commit/df3ee094c637b02c001eca81fe6ad6436ce0bd6f))
* remove format filter method in grid, that could cause some date issues ([bce889a](https://github.com/ReliefApplications/oort-frontend/commit/bce889aae3b862c08fbdfd7aa84562ef8290678e))
* tagbox filter could produce empty grid when removing value in grid quick filter ([7f05dce](https://github.com/ReliefApplications/oort-frontend/commit/7f05dce3000134bba8ae9a755196ed95718f1c7e))
* use flex-end and default margin false to the date field in the tab-filter component in order to align the element to the rest of the y axis ([#1809](https://github.com/ReliefApplications/oort-frontend/issues/1809)) ([d8b10c5](https://github.com/ReliefApplications/oort-frontend/commit/d8b10c57893e78f577972b1fd311a2ab94c99d69))
* use flex-end and default margin false to the date field in the tab-filter component in order to align the element to the rest of the y axis ([#1809](https://github.com/ReliefApplications/oort-frontend/issues/1809)) ([bd171c7](https://github.com/ReliefApplications/oort-frontend/commit/bd171c792a24d4b93528db1e443734b7ac3a3707))


### Features

* remove hidden class from date picker clear button on first load if picker contains any value, as the valueChange event only triggers from the calendar UI, not on setting a value into the date picker refactor: use the writeValue default built in method of kendo date picker in order to avoid any strange misbehavior on setting value ([#1799](https://github.com/ReliefApplications/oort-frontend/issues/1799)) ([aad4fca](https://github.com/ReliefApplications/oort-frontend/commit/aad4fcaf0414ebede98cccf0c687c90ab8c7b5ff))

## [2.0.10](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.9...v2.0.10) (2023-09-21)


### Bug Fixes

* access to the platform could fail due to login not completed ([#1854](https://github.com/ReliefApplications/oort-frontend/issues/1854)) ([10ba120](https://github.com/ReliefApplications/oort-frontend/commit/10ba1204a6a0d12728af039fd8fd85d60f4d5628))
* aggregation filters only appling after saving twice ([#1829](https://github.com/ReliefApplications/oort-frontend/issues/1829)) ([3dd8bd4](https://github.com/ReliefApplications/oort-frontend/commit/3dd8bd409a117bfb51e46d7d4d2dee8145a898f1))
* aggregation filters only appling after saving twice ([#1829](https://github.com/ReliefApplications/oort-frontend/issues/1829)) ([5a788cb](https://github.com/ReliefApplications/oort-frontend/commit/5a788cbd9585437232783fb2764866a4583c8237))
* custom form variables not reused when creating multiple records from same view ([#1838](https://github.com/ReliefApplications/oort-frontend/issues/1838)) ([8fb2564](https://github.com/ReliefApplications/oort-frontend/commit/8fb25647aa7ee0e75765c7253255685c994ae7ae))
* date could not be cleared if opening a record with value in field ([2c0d047](https://github.com/ReliefApplications/oort-frontend/commit/2c0d0470f3889dbadf84d69c7aa529ef5d19bd05))
* date filters in grid could filter out items based on timezone ([2f37b39](https://github.com/ReliefApplications/oort-frontend/commit/2f37b39cfcf41df304673680c128a118ee8856ab))
* items per page would not correctly work on some page change  ([#1801](https://github.com/ReliefApplications/oort-frontend/issues/1801)) ([063391d](https://github.com/ReliefApplications/oort-frontend/commit/063391d6613bb1797bb00330a831c49bb3484b2d)), closes [bugfix/AB#74313](https://github.com/bugfix/AB/issues/74313)
* last option in grid tagbox filter remains active when removing options one by one ([#1777](https://github.com/ReliefApplications/oort-frontend/issues/1777)) ([f266e52](https://github.com/ReliefApplications/oort-frontend/commit/f266e522d688c841c53b46c1c730b0e5f3941d5c))
* only get visible fields when exporting grid data [#35940](https://github.com/ReliefApplications/oort-frontend/issues/35940) ([#1807](https://github.com/ReliefApplications/oort-frontend/issues/1807)) ([ce008da](https://github.com/ReliefApplications/oort-frontend/commit/ce008daba3cca2216bd3c40fd7a8ae6d2a68f358))
* only get visible fields when exporting grid data [#35940](https://github.com/ReliefApplications/oort-frontend/issues/35940) ([#1807](https://github.com/ReliefApplications/oort-frontend/issues/1807)) ([2d76aa8](https://github.com/ReliefApplications/oort-frontend/commit/2d76aa8eb4aaea48b0b0a95e935f34fcbd807c01))
* remove format filter method in grid, that could cause some date issues ([df3ee09](https://github.com/ReliefApplications/oort-frontend/commit/df3ee094c637b02c001eca81fe6ad6436ce0bd6f))
* remove format filter method in grid, that could cause some date issues ([bce889a](https://github.com/ReliefApplications/oort-frontend/commit/bce889aae3b862c08fbdfd7aa84562ef8290678e))
* tagbox filter could produce empty grid when removing value in grid quick filter ([7f05dce](https://github.com/ReliefApplications/oort-frontend/commit/7f05dce3000134bba8ae9a755196ed95718f1c7e))
* use flex-end and default margin false to the date field in the tab-filter component in order to align the element to the rest of the y axis ([#1809](https://github.com/ReliefApplications/oort-frontend/issues/1809)) ([d8b10c5](https://github.com/ReliefApplications/oort-frontend/commit/d8b10c57893e78f577972b1fd311a2ab94c99d69))
* use flex-end and default margin false to the date field in the tab-filter component in order to align the element to the rest of the y axis ([#1809](https://github.com/ReliefApplications/oort-frontend/issues/1809)) ([bd171c7](https://github.com/ReliefApplications/oort-frontend/commit/bd171c792a24d4b93528db1e443734b7ac3a3707))


### Features

* remove hidden class from date picker clear button on first load if picker contains any value, as the valueChange event only triggers from the calendar UI, not on setting a value into the date picker refactor: use the writeValue default built in method of kendo date picker in order to avoid any strange misbehavior on setting value ([#1799](https://github.com/ReliefApplications/oort-frontend/issues/1799)) ([aad4fca](https://github.com/ReliefApplications/oort-frontend/commit/aad4fcaf0414ebede98cccf0c687c90ab8c7b5ff))

## [2.0.9](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.8...v2.0.9) (2023-08-29)


### Bug Fixes

* Change detection on POST choices by url ([#1764](https://github.com/ReliefApplications/oort-frontend/issues/1764)) ([a6c740e](https://github.com/ReliefApplications/oort-frontend/commit/a6c740ef65ca8c736d1277f6ef256a42930928b1))
* storybook not building ([7f17a8c](https://github.com/ReliefApplications/oort-frontend/commit/7f17a8c22cb148c8bb87901861ebc2a56d6bb09d))

## [2.0.8](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.7...v2.0.8) (2023-08-25)


### Bug Fixes

* aplly search to add new form page/step graphql-select ([#1739](https://github.com/ReliefApplications/oort-frontend/issues/1739)) ([3653dcc](https://github.com/ReliefApplications/oort-frontend/commit/3653dcc3080e712cf4529e5d39bbb23794e15d2b))

## [2.0.7](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.6...v2.0.7) (2023-08-17)


### Bug Fixes

* could not edit form page name ([2ce6e41](https://github.com/ReliefApplications/oort-frontend/commit/2ce6e414e4976112b53a2ba5f51e83d775fa9a6d))
* empty list display would hide some additional content that should be displayed in select elements ([6dac854](https://github.com/ReliefApplications/oort-frontend/commit/6dac85494d98102f7a79bf8d3feb8c15e8522303))
* in application style editor, autocomplete would not appear ([d8ed2d6](https://github.com/ReliefApplications/oort-frontend/commit/d8ed2d6b9d9c1d4d08d9ce88ba223570fdff04b4))
* incorrect pagination on some tables, using paginator component ([2fbd37e](https://github.com/ReliefApplications/oort-frontend/commit/2fbd37ec9fd546b6a6c7e0bfd5d519bfc63b57a9)), closes [fix/AB#72105](https://github.com/fix/AB/issues/72105)
* selection of form when adding new page / step would not work ([13f3b4d](https://github.com/ReliefApplications/oort-frontend/commit/13f3b4dcdf7fb27dd7fad03fc40377c671a2df1f))

## [2.0.6](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.5...v2.0.6) (2023-08-09)


### Bug Fixes

* add possibility to do POST requests on choicesByUrl fields in surveyjs ([b45bff9](https://github.com/ReliefApplications/oort-frontend/commit/b45bff9d1e18166099e153b871e1216f20bfdefa)), closes [#1698](https://github.com/ReliefApplications/oort-frontend/issues/1698)
* add possibility to do POST requests on choicesByUrl fields in surveyjs ([71c235c](https://github.com/ReliefApplications/oort-frontend/commit/71c235c538ffba72cf4298a73df7b66f3e182973))
* autosave action could lead to some conflicts, with the UI, and the logic of subsequent steps of the grid action ([cad5c47](https://github.com/ReliefApplications/oort-frontend/commit/cad5c4740e9a0a4896f172e6c806c703a0c4f074))
* expanded comment wrong behavior in many cases ([93f85c6](https://github.com/ReliefApplications/oort-frontend/commit/93f85c62477fc76be66302a493b94ca0f7ea3cc8))
* history partially hidden when seen in sidenav ([0ef9785](https://github.com/ReliefApplications/oort-frontend/commit/0ef97858ab2f6d9f9d0f810a394884321e706dfe))
* issue where closing the expand grid cell modal would set the cell value to null ([1564923](https://github.com/ReliefApplications/oort-frontend/commit/1564923f36f3413745910965dc796899e2f8a796))
* multiple issues detected by Sentry ([45f0d84](https://github.com/ReliefApplications/oort-frontend/commit/45f0d84e5f48f06d1be0c88a8cd03ccace99faf7))
* Pagination on choose record modal for attach to record button ([#1640](https://github.com/ReliefApplications/oort-frontend/issues/1640)) ([ed0ac2b](https://github.com/ReliefApplications/oort-frontend/commit/ed0ac2bc5ee13a4fb294ff9e31e92bec49640701)), closes [fix/AB#69369](https://github.com/fix/AB/issues/69369)
* survey dispose method could block interaction with UI when survey would not exist ([666a40e](https://github.com/ReliefApplications/oort-frontend/commit/666a40ef78116e82ebaf72dd200be1f731a8d60c))
* when editing user, changing application to assign roles of the user wouldn't clear the roles list ([d5f5502](https://github.com/ReliefApplications/oort-frontend/commit/d5f5502f08a2c52adc8f2bfc05bb2b258cabdd28))


### Reverts

* Revert "fix: add possibility to do POST requests on choicesByUrl fields in surveyjs" (#1698) ([d60414c](https://github.com/ReliefApplications/oort-frontend/commit/d60414c662c785cbfad9eff40977b25fe84ef618)), closes [#1698](https://github.com/ReliefApplications/oort-frontend/issues/1698)

## [2.0.5](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.4...v2.0.5) (2023-08-03)


### Bug Fixes

* fields could not be set to null in survey ([64bcb87](https://github.com/ReliefApplications/oort-frontend/commit/64bcb87b01eaf21c6cf2eda9b0b022ba66431c6b))
* pages logic in survey could be wrong, now using data from the survey directly ([52f64b5](https://github.com/ReliefApplications/oort-frontend/commit/52f64b54b069c36ccfe7427897d19fb6de46f530))
* values set to null in survey could raise unwanted updates while seeing history of records ([d6dc660](https://github.com/ReliefApplications/oort-frontend/commit/d6dc660e2bc72e951a4604c14d0f0c4f29e991d3))

## [2.0.4](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.3...v2.0.4) (2023-08-03)


### Bug Fixes

* breadcrumbs could go out of bounds and expand size of screen ([d5b10e3](https://github.com/ReliefApplications/oort-frontend/commit/d5b10e3b9a7f088c4efe3b0d77b56cdc12cda90a)), closes [fix/AB#70863](https://github.com/fix/AB/issues/70863)
* filtering on dropdown / tagbox in survey would only work for first rendering ([86aac64](https://github.com/ReliefApplications/oort-frontend/commit/86aac64f796ba60fa884bb69dd8fc49287a0f7f4))
* filtering options in survey could fail due to inexistence of option text ([4f2f611](https://github.com/ReliefApplications/oort-frontend/commit/4f2f611385c5f2cf6179c726fdf123de1d89fa59))
* scroll would remain while moving between pages ([86bc1ea](https://github.com/ReliefApplications/oort-frontend/commit/86bc1eaa0f89a74339e6567fb08ec997d16ef5d4))
* seeing users of role / application not working ([6012dc8](https://github.com/ReliefApplications/oort-frontend/commit/6012dc8cd6a5efbbabeadd53c7cdc91639e927a2))
* survey with default / selected value in dropdown / tagbox would break filtering ([e3af66b](https://github.com/ReliefApplications/oort-frontend/commit/e3af66bd36557fc6f4e591f9b9e95ecf9caa7b43))

## [2.0.3](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.2...v2.0.3) (2023-08-01)


### Bug Fixes

* add loading indicator in dropdown and tagbox in survey questions ([c06ad98](https://github.com/ReliefApplications/oort-frontend/commit/c06ad989b51e0163f63a9b84c3b962275308505a)), closes [fix/AB#71072](https://github.com/fix/AB/issues/71072) [fix/AB#71072](https://github.com/fix/AB/issues/71072) [fix/AB#71072](https://github.com/fix/AB/issues/71072) [fix/AB#71072](https://github.com/fix/AB/issues/71072) [fix/AB#71072](https://github.com/fix/AB/issues/71072)
* choices coming from url could be displayed as object due to missing value ([f42a536](https://github.com/ReliefApplications/oort-frontend/commit/f42a5362451e1daf920060f1959d02379830f6f9))
* toString in extractChoices in grids should now get correct value ([a2b9de5](https://github.com/ReliefApplications/oort-frontend/commit/a2b9de500c6f39667690256cefbc2094c270cded))
* when editing roles, channel would not get initial value if set ([bfcadeb](https://github.com/ReliefApplications/oort-frontend/commit/bfcadebabf988733e162fa34585d416275bc44b2))

## [2.0.2](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.1...v2.0.2) (2023-07-31)


### Bug Fixes

* choicesByUrl could fail to display depending on text ([c382ff2](https://github.com/ReliefApplications/oort-frontend/commit/c382ff2c70fdc3e8e0dacffbea32c24834251f0c))
* edition of form page was not linked to correct model if not in a step ([ead55c3](https://github.com/ReliefApplications/oort-frontend/commit/ead55c349ff3851964611c526a83d4ffe0a58723))
* incorrect notification when editing a pull job ([c49ac2d](https://github.com/ReliefApplications/oort-frontend/commit/c49ac2d6bc2ed6892b18cb9a0f379f830ca78e92))
* remove select2 files from import ([2f5d63f](https://github.com/ReliefApplications/oort-frontend/commit/2f5d63fc5ead92a2031362b2d2c77186907e8fea))
* resource modal opening as a blank page until we click anywhere ([#1664](https://github.com/ReliefApplications/oort-frontend/issues/1664)) ([4b4c98f](https://github.com/ReliefApplications/oort-frontend/commit/4b4c98f2c82a1bf54a09c49fa1bb5fcdc2cf8adf))
* resources question would consume too much memory because of stored records ([872485f](https://github.com/ReliefApplications/oort-frontend/commit/872485ff8eaee524a057beba2116cb1985ddd584))
* tabs component could raise issues due to missing tabs ([2f230bb](https://github.com/ReliefApplications/oort-frontend/commit/2f230bbc702001a52bb106c3c337c69cae7929ef))
* tagbox would freeze if too many items in forms ([8386e8b](https://github.com/ReliefApplications/oort-frontend/commit/8386e8b6c22d2d452254df205e5d95b422272d21))
* unable to attach to another form in grid actions ([3d2c9a5](https://github.com/ReliefApplications/oort-frontend/commit/3d2c9a5d5df19e9ed898414674f9dcda0a9c19fa))

## [2.0.1](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0...v2.0.1) (2023-07-07)


### Bug Fixes

* deploy not working ([e9b6dbb](https://github.com/ReliefApplications/oort-frontend/commit/e9b6dbb574643579a4fde5646bc7a9ec463b7792))

# [2.0.0](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.13...v2.0.0) (2023-07-03)


### Bug Fixes

* add a save error message when display as grid is selected witout an available field in custom question resources ([b798303](https://github.com/ReliefApplications/oort-frontend/commit/b79830310edaec50f461891cbb734097df9afd97))
* add records on resource(s) questions ([51d0991](https://github.com/ReliefApplications/oort-frontend/commit/51d0991c808ec2d76b9812ea5e789352dd5404d2))
* add save method in the column chooser ([#1420](https://github.com/ReliefApplications/oort-frontend/issues/1420)) ([ca55887](https://github.com/ReliefApplications/oort-frontend/commit/ca55887e48f4551cad4433104d54a4ae694a6664))
* add tooltip in summary card display settings, to better indicate purpose of 'link to data source' option ([75ca7d5](https://github.com/ReliefApplications/oort-frontend/commit/75ca7d53488789abcaf8c286d04b9e85090100a9))
* added validator to derived field name ([34fc348](https://github.com/ReliefApplications/oort-frontend/commit/34fc348452037af781da87a1fe5d48e9e5b49f23))
* adding a preview to images question URL ([0c284a0](https://github.com/ReliefApplications/oort-frontend/commit/0c284a0c298a5dba01285ee40f450bdf48c6e380))
* aggregations selection would take entire width on grid widgets ([1173c9d](https://github.com/ReliefApplications/oort-frontend/commit/1173c9d52490c1829b9b49456ae0100d64595336))
* apply styles on summary card ([#1394](https://github.com/ReliefApplications/oort-frontend/issues/1394)) ([9ccdf8c](https://github.com/ReliefApplications/oort-frontend/commit/9ccdf8cf1655d995d61a5c3e748773c3a9275638))
* autocompletion in summary cards not working with aggregations ([7545c4e](https://github.com/ReliefApplications/oort-frontend/commit/7545c4e5eb39d9ee7acd84ca11f1fa966c72d7b2)), closes [Fix/ab#60118](https://github.com/Fix/ab/issues/60118)
* avoid error 400 when loading empty summary card or creating a new one ([2efe4aa](https://github.com/ReliefApplications/oort-frontend/commit/2efe4aadba28b836c0cfa2ce215a587135d4519f))
* bug on replaceRecordFields ([#1454](https://github.com/ReliefApplications/oort-frontend/issues/1454)) ([aa603a2](https://github.com/ReliefApplications/oort-frontend/commit/aa603a2289028f4f42831404959e20fe02a6c42e))
* calculated fields 'add' component and style + add safe empty ([40c962e](https://github.com/ReliefApplications/oort-frontend/commit/40c962ec0b16164d3737f6b88d09405918352c7c))
* can now use triggers on date / datetime / time questions in forms ([7446ede](https://github.com/ReliefApplications/oort-frontend/commit/7446edeb8f0ee25f9079bf90f7891ebb3bba4960))
* circular dependency in tabs files ([e86939a](https://github.com/ReliefApplications/oort-frontend/commit/e86939a0e17bddf1ca65c0600e88268827e7c1df))
* clear date picker on surveys ([50fc735](https://github.com/ReliefApplications/oort-frontend/commit/50fc735f309aa806253bcb2153de3b8d27310cbf))
* color palette was incorrectly working ([1186045](https://github.com/ReliefApplications/oort-frontend/commit/11860451ed6d10b388932c16f73f5a5ae3162480))
* compilation error ([e8a232c](https://github.com/ReliefApplications/oort-frontend/commit/e8a232c88b6b43fbdf870afa1a507925fd4cc9d3))
* confirmation modal would appear below other modals, if opened from other dialog ([4277e6a](https://github.com/ReliefApplications/oort-frontend/commit/4277e6a7d330921a3a6370b1f0d45dc4c76970e5))
* could not load any route due to incorrect routing import ([953cca3](https://github.com/ReliefApplications/oort-frontend/commit/953cca3bfe95945fb643d4bb43904e7661ac9fd9))
* dashboard filter layout issue on workflows ([ca03d64](https://github.com/ReliefApplications/oort-frontend/commit/ca03d64a40c6615a5e17bda6c0bfd008d00e3b6d)), closes [Bugfix/ab#65852](https://github.com/Bugfix/ab/issues/65852)
* date fields would not appear correctly in summary cards ([ed3d960](https://github.com/ReliefApplications/oort-frontend/commit/ed3d96091ab5257a5f70865f178ac7dc2d432ad5)), closes [fix-2.0.x/AB#60045](https://github.com/fix-2.0.x/AB/issues/60045)
* date picker not properly updating with enabled conditions ([#1439](https://github.com/ReliefApplications/oort-frontend/issues/1439)) ([81bcaf8](https://github.com/ReliefApplications/oort-frontend/commit/81bcaf80ad79a89167b2600815c7b5891b13351a))
* display issue when hovering steps ([7abb1e4](https://github.com/ReliefApplications/oort-frontend/commit/7abb1e4df0cf3e8170f14fccbeab6a4596e890a7))
* display of select label ([75fa385](https://github.com/ReliefApplications/oort-frontend/commit/75fa3851e2e509f5c90bda5515f57ba8ea0926a0))
* distribution list incorrect input validation ([729f264](https://github.com/ReliefApplications/oort-frontend/commit/729f264e6bec8f83f940d52a02d63b312dba28c8))
* duplicate users could be seen when adding roles to users ([642af8b](https://github.com/ReliefApplications/oort-frontend/commit/642af8bd1a9fc2d578551d309f28a8b7878360ea))
* duplication of date editor in surveyjs when switching question type ([dbbaf1a](https://github.com/ReliefApplications/oort-frontend/commit/dbbaf1ab6093a4482f5b3baa2ebc6954c5b0402e))
* duplication of diviver in layout user menu ([4808637](https://github.com/ReliefApplications/oort-frontend/commit/48086371a492a1582c50d2a0a7c6638b38768c7f))
* edit labels of fields in layouts ([4f096e6](https://github.com/ReliefApplications/oort-frontend/commit/4f096e68e17e53b583052df4568b706e9b4e10dd))
* email template links + upload from FO ([7ac159e](https://github.com/ReliefApplications/oort-frontend/commit/7ac159e1ba10b02537d380fb081a728dd42df96e))
* emails can no longer be sent without subjects ([3462daf](https://github.com/ReliefApplications/oort-frontend/commit/3462daf8a94805ad78b441cb006626d0f2737271))
* empty fields & disable deleting used fields ([8c83fdf](https://github.com/ReliefApplications/oort-frontend/commit/8c83fdf944db6f786f080fcf90c7c9ebbeac36de))
* errors in button config ([38c72c9](https://github.com/ReliefApplications/oort-frontend/commit/38c72c92b359e3fc08c4eb291a5d173e2a513386))
* errors on survey submit (edge cases) ([bdea6d2](https://github.com/ReliefApplications/oort-frontend/commit/bdea6d20a9c45bc74129f934e1a22220c2ca609c))
* errors with selection of fields in aggregation builder ([7b53120](https://github.com/ReliefApplications/oort-frontend/commit/7b531208905e6fc47b9badb3c9f47e0939c3f7e3)), closes [fix/AB#59603](https://github.com/fix/AB/issues/59603)
* export of records not working ([464708b](https://github.com/ReliefApplications/oort-frontend/commit/464708b3ee0c2f4a4b994c8cff5d45775c3a8b74))
* exporting selected users ([02186de](https://github.com/ReliefApplications/oort-frontend/commit/02186de9525a7b1e34420971169f1135edd7a0bb))
* few issues related to tailwind ([ef5d4e7](https://github.com/ReliefApplications/oort-frontend/commit/ef5d4e7bdae289139bfd57a86fafd3655c94611c))
* fields not loading in summary cards settings by default ([8eb72e0](https://github.com/ReliefApplications/oort-frontend/commit/8eb72e0436f9451acb19001cf8562c4be07ae9be))
* filter for autocomplete on edit field ([166904b](https://github.com/ReliefApplications/oort-frontend/commit/166904b24a97adce93d4ebe87a992a9a72795aee))
* filtering properly for autocompletion ([13edd53](https://github.com/ReliefApplications/oort-frontend/commit/13edd532ce0b3c59399c002f3e237dd87f2be721))
* front office could not build ([7be6916](https://github.com/ReliefApplications/oort-frontend/commit/7be6916779b064ccf1e645024b07ce41914aff93))
* fullscreen directive would show error message on page leave ([bdf189d](https://github.com/ReliefApplications/oort-frontend/commit/bdf189da070c6344254c07f6af129b98f85011be))
* fullscreen now available for workflows ([15a4877](https://github.com/ReliefApplications/oort-frontend/commit/15a48771e782391e658b2673e6d0d80620dc092b))
* grid widget should stop loading if no data change detected when refetching ([3f25d57](https://github.com/ReliefApplications/oort-frontend/commit/3f25d57fde724beb5d616301be6e4bb72a623e91))
* hide side menu on app preview ([c05749b](https://github.com/ReliefApplications/oort-frontend/commit/c05749b631f7ba3a50a31a8a1259f7cf25e5188e))
* history of changes of record would not appear on form-records page due to scroll strategy error ([db17a49](https://github.com/ReliefApplications/oort-frontend/commit/db17a497e884713119a0189c9961318df1b86460))
* horizontal nav items incorrect width ([322d9cd](https://github.com/ReliefApplications/oort-frontend/commit/322d9cd2eab1a1d93bd98dae8d1d65c38865fc15))
* horizontal pages would break display of sidenav content if right sidenav enabled ([7f6d4ce](https://github.com/ReliefApplications/oort-frontend/commit/7f6d4ce1b931d1d78260b38c5b6296e6dd8790a9))
* i18n for pagination elements ([#1153](https://github.com/ReliefApplications/oort-frontend/issues/1153)) ([bcd5297](https://github.com/ReliefApplications/oort-frontend/commit/bcd5297089f24927e4001c5d746d426367f1f3e6))
* incorrect API of confirm service after tailwind update ([ae407d6](https://github.com/ReliefApplications/oort-frontend/commit/ae407d6f3aac44d1fab2a32889e2a79d5dcc8fb3))
* incorrect applyToWholeCard option ([a177a92](https://github.com/ReliefApplications/oort-frontend/commit/a177a9241fb0b06c3f0af2e742bc5b663e9ff701))
* incorrect choice callback in ref data ([#1401](https://github.com/ReliefApplications/oort-frontend/issues/1401)) ([42f6204](https://github.com/ReliefApplications/oort-frontend/commit/42f62042fb843dae2fd998e1fd913c9914408080))
* incorrect dashboard position and size when size of screen changes ([9f8a70c](https://github.com/ReliefApplications/oort-frontend/commit/9f8a70c02c8a5c9d99e2f878fa2b04e9e8678658))
* incorrect devops pipelines ([d4f31c9](https://github.com/ReliefApplications/oort-frontend/commit/d4f31c98d018eb974cf1e407d01eff9cc1b369b2))
* incorrect display of time fields in summary cards ([30a0785](https://github.com/ReliefApplications/oort-frontend/commit/30a078578c36ac59bdbe7ab6d68b117891f3a5ca))
* incorrect history display ([5fbf04b](https://github.com/ReliefApplications/oort-frontend/commit/5fbf04b4d8376504f06229f0a4c9a0ffef79f3a8))
* incorrect icon displayed on role resources page ([f97533c](https://github.com/ReliefApplications/oort-frontend/commit/f97533c2ce6aefa21995ee4b8c0710bb811c960e))
* incorrect overflow in summary cards ([58be2ca](https://github.com/ReliefApplications/oort-frontend/commit/58be2cae7d865227c42e41987b84501b58137419))
* incorrect pointer-events for dashboard-filter ([19357f3](https://github.com/ReliefApplications/oort-frontend/commit/19357f3d303b09017aef56ea7c881fedbe67a7b0))
* incorrect position of dashboard filter ([0d03f60](https://github.com/ReliefApplications/oort-frontend/commit/0d03f60edf13018bf57803f5a81099aa3c34d1e1))
* incorrect query builder due to lazy loading missing in tabs ([016d3f9](https://github.com/ReliefApplications/oort-frontend/commit/016d3f971bad0a6853bca51886ef57ecfe64ddd5))
* incorrect reference data dropdwon ([ec187a0](https://github.com/ReliefApplications/oort-frontend/commit/ec187a0b2b3961a7ded97c1967a477227b91a1e0))
* incorrect replacement of tab, now introducing lazy loading to fix some broken behaviors ([fcb7985](https://github.com/ReliefApplications/oort-frontend/commit/fcb798500dcc439215a056499761ba3ea7535280))
* incorrect scrollbar for summary cards ([e60494c](https://github.com/ReliefApplications/oort-frontend/commit/e60494c523f9d7ff9fcacb43ca93553b7e597efa)), closes [fix/AB#59926](https://github.com/fix/AB/issues/59926)
* incorrect select menu display if custom template ([78272f6](https://github.com/ReliefApplications/oort-frontend/commit/78272f69da3951a12e0c6fabe05eb10c8fbf2fdc))
* incorrect show series text ([05e60ff](https://github.com/ReliefApplications/oort-frontend/commit/05e60ff88f0a1b8b895ee5ef7a6526db7480726a))
* incorrect style of menus ([85fee50](https://github.com/ReliefApplications/oort-frontend/commit/85fee50f667f30900bf6cf5d682e1d2900f30c28))
* incorrect text orientation for dashboard filter quick value when put on left ([fd93d46](https://github.com/ReliefApplications/oort-frontend/commit/fd93d46a43ce89891b7b3cc9d9168c6bb7c1011e))
* incorrect text widget settings ([#1417](https://github.com/ReliefApplications/oort-frontend/issues/1417)) ([e450038](https://github.com/ReliefApplications/oort-frontend/commit/e450038b5e7504e684c60a84067e7d2642647089))
* incorrect use of graphqlname in text widget ([090b8ba](https://github.com/ReliefApplications/oort-frontend/commit/090b8babf192e6647b85e6d686a5ba4ad0a56abf))
* incorrect use of radio component value ([02d447c](https://github.com/ReliefApplications/oort-frontend/commit/02d447c392255a93d598e1fe0a9ab924396b36e7))
* incorrect use of top navigation in applications ([c3c949d](https://github.com/ReliefApplications/oort-frontend/commit/c3c949d3b8f66e291e0712ac8b3b83807693cb6c))
* infinite pagination not working for summary cards ([38bf9f2](https://github.com/ReliefApplications/oort-frontend/commit/38bf9f26527901eb9c5e610ba553803ea4d2237b))
* infinite scrolling ([753b382](https://github.com/ReliefApplications/oort-frontend/commit/753b3826f42505ad2b775c291b775923615238c7))
* inject btn in datepicker & edit safe-button ([7b9f28e](https://github.com/ReliefApplications/oort-frontend/commit/7b9f28e0e3786df64ed2b2c3801f1d609e8c0935))
* injecting fullscreen providers in app.module ([f8ba61a](https://github.com/ReliefApplications/oort-frontend/commit/f8ba61a8895b203eecd42ae3c0287a322e7ecd16))
* issue with autocomplete not displaying correct keys ([81e1ce9](https://github.com/ReliefApplications/oort-frontend/commit/81e1ce91a0eb16c8dd060bb6d852a2b83f21e382))
* issue with borderless widgets after tailwind update ([0084ab5](https://github.com/ReliefApplications/oort-frontend/commit/0084ab50d24a5b7cfb0df9a39d5870107e199a8f))
* issue with display of avatars in summary cards / text widgets ([9adb373](https://github.com/ReliefApplications/oort-frontend/commit/9adb373fbe3ed73b04b54d9b115262a1eb9b614e))
* issue with dropdown widget not sending data ([7e8e2b2](https://github.com/ReliefApplications/oort-frontend/commit/7e8e2b2c3c3739b88af415098be9e936d256d83a))
* issue with filter fields on record history ([74887f6](https://github.com/ReliefApplications/oort-frontend/commit/74887f6a72b152f3d434247800940a31bfa360a7))
* issue with records being saved with incorrect resource(s) ids ([63eaacc](https://github.com/ReliefApplications/oort-frontend/commit/63eaacc632bd2688bd51e625dc3f31313d917785))
* issues with surveyjs ([4333a30](https://github.com/ReliefApplications/oort-frontend/commit/4333a30e84852f91efa3381e8c4b2adb36e266f4))
* issues with tabs button actions in grid settings ([9eb00c1](https://github.com/ReliefApplications/oort-frontend/commit/9eb00c18a48d75e18c690d41d1dbb69bcb0cb4a9))
* jsonpath not being reflected for rest ref data ([aa61734](https://github.com/ReliefApplications/oort-frontend/commit/aa617349cdeea1cf4a6f309e6dd1990efa6823cc))
* labels of fields could not be edited ([d114125](https://github.com/ReliefApplications/oort-frontend/commit/d1141254a2caebeb5f09fcee9e456281517b6f81)), closes [fix/AB#61701](https://github.com/fix/AB/issues/61701)
* load correct workflow step page from shared URL or when refreshing page ([4e54758](https://github.com/ReliefApplications/oort-frontend/commit/4e54758abd119195eb547478173cc50785ce5bd9))
* many issues with form field wrapper directive ([476d641](https://github.com/ReliefApplications/oort-frontend/commit/476d64187c970d78d6a0a6f731905f14b5282851))
* missing translation for save survey modal ([82c121f](https://github.com/ReliefApplications/oort-frontend/commit/82c121f359725cbabde2fe4c2d259f6a1ebc1a23))
* missing variant error in tab-fields + incorrect check in query-builder component to hide label ([6a1f18b](https://github.com/ReliefApplications/oort-frontend/commit/6a1f18b6998861364236346a6f73afbd3876a8d4))
* now possible to delete values of date / time fields in forms ([ba19583](https://github.com/ReliefApplications/oort-frontend/commit/ba195834358c1bd9515156bd7ac940f20a92ba4c))
* pagination on aggregations ([30a3a4b](https://github.com/ReliefApplications/oort-frontend/commit/30a3a4b395a0183ef3dd3ecd6b9aff74bb095120))
* pointer events on dashboard filter would prevent some buttons to be clicked on ([0bafe88](https://github.com/ReliefApplications/oort-frontend/commit/0bafe88613c695fa7aef247f6d2bb45d385c15ad))
* put back ability to load page in front-office using url ([0aa2d8a](https://github.com/ReliefApplications/oort-frontend/commit/0aa2d8a98ee04a4f8c15683004fd2831f0dcf279))
* queryName would not be used when editing layout from summary card / text widget ([2c953de](https://github.com/ReliefApplications/oort-frontend/commit/2c953de5f66bcd74ac41f0ebd5a0e73ef7c1c61e))
* read only resource questions add record button ([215d2cc](https://github.com/ReliefApplications/oort-frontend/commit/215d2cc41526e02bdab193637cab92970e76f730))
* refData fetched through graphQL APIs ([d9f1c59](https://github.com/ReliefApplications/oort-frontend/commit/d9f1c594e0d340e1f7434511726b096e3b2a6ef9))
* reference data multiselect not appearing on grids ([91f5b56](https://github.com/ReliefApplications/oort-frontend/commit/91f5b563a6f70a71f37167b5efb44775310ab87d))
* reference data question could not be saved ([deae9c0](https://github.com/ReliefApplications/oort-frontend/commit/deae9c044727c70c09228d2402a9a0f51b539f5b))
* remove background on surveyjs forms ([9b64cce](https://github.com/ReliefApplications/oort-frontend/commit/9b64cce300fb6e8ee2714b686ddfb94174f82691))
* remove block input from unedited buttons ([2b340f1](https://github.com/ReliefApplications/oort-frontend/commit/2b340f1a099db70f232c14fc62a00fb54d062323))
* remove default span in summary card parsing if no styling, as it could prevent some images to appear ([0a4a252](https://github.com/ReliefApplications/oort-frontend/commit/0a4a2524a6e0309175ede3f47fb954c024bd3e35))
* remove irrelevant elements from graphql-select list of options ([fdf5df9](https://github.com/ReliefApplications/oort-frontend/commit/fdf5df9fe1839860d31c3d3ad3ac0e7b4efeaf90))
* removed calc fields from autocomplete ([f618f39](https://github.com/ReliefApplications/oort-frontend/commit/f618f399ef20a7b4252d60a02f5bae898616446d))
* removed fields from layout are now visible when adding them again ([9f61b17](https://github.com/ReliefApplications/oort-frontend/commit/9f61b1707c867d93ebb9f75ae52b2c71aa271ac5))
* reordering of actions buttons would not work ([4a2ce93](https://github.com/ReliefApplications/oort-frontend/commit/4a2ce9317985f3bdbc467f812b9be6118f9d0f9b))
* resource query on chart settings ([e07353e](https://github.com/ReliefApplications/oort-frontend/commit/e07353e96c145eed2a9f855318f9693bfdd4ed89))
* scroll indicator in summary card could appear infinitively ([d4f1ee3](https://github.com/ReliefApplications/oort-frontend/commit/d4f1ee336885b4c0fa8d511cfae9c5ccbf2b6cef))
* search mode would appear on summary card even if grid view was enabled ([65918d2](https://github.com/ReliefApplications/oort-frontend/commit/65918d2c778d2eec4fb833eac7743abcf228181b))
* search on static cards ([c738e6e](https://github.com/ReliefApplications/oort-frontend/commit/c738e6ef70727a8cfa6ad65bf263fd0e3434103e))
* search on summary cards would be duplicated if grid mode activated ([abf4646](https://github.com/ReliefApplications/oort-frontend/commit/abf4646d47eb4dc948d05702fc37d29da36d1a37))
* select records on resources and resource question not updating ([0402cb7](https://github.com/ReliefApplications/oort-frontend/commit/0402cb7e03133bae9cdd2bce7fe1ffa88824aea6))
* send emails to recipients not in the distribution list ([#1421](https://github.com/ReliefApplications/oort-frontend/issues/1421)) ([a9367a3](https://github.com/ReliefApplications/oort-frontend/commit/a9367a34f8dec19748a599fea32017cbada3959c))
* series settings were messing up when changing type of chart ([22aaf80](https://github.com/ReliefApplications/oort-frontend/commit/22aaf80ce6dbde1e547a93048e8fda32cae678b5))
* series settings would not compile anymore ([d3e4b88](https://github.com/ReliefApplications/oort-frontend/commit/d3e4b88cbd2b069ed5d2a9d7e00ba94229234a61))
* setting queryname from resource ([9d11809](https://github.com/ReliefApplications/oort-frontend/commit/9d11809f51a709bb6a0eb43d43b0ffa3da03b9ce))
* should remove blank page when going to the platform ([649985a](https://github.com/ReliefApplications/oort-frontend/commit/649985ab7c94dae354374fe09968e3b02caedd3b)), closes [bugfix/AB#35941_SA-IMST-R4](https://github.com/bugfix/AB/issues/35941_SA-IMST-R4)
* showBorder option was creating an issue with summary cards value selection ([216b0cf](https://github.com/ReliefApplications/oort-frontend/commit/216b0cfbe61abd27b96db7404df3c4c7326d29c0))
* size of tabs title and overflow ([6eec8ac](https://github.com/ReliefApplications/oort-frontend/commit/6eec8ac2b5b1a19056766e5d83990cee46f7d489))
* some confirmation modals would appear below the modal that opened them ([920cc2b](https://github.com/ReliefApplications/oort-frontend/commit/920cc2b4eca44593e1cc85acc7ad66a8b7a4ff79))
* some modals would appear under other modals due to fullscreen overlay changes ([a849b0c](https://github.com/ReliefApplications/oort-frontend/commit/a849b0c6d43a2beeb6649b38e1bb2e52e37d7372)), closes [Fix/ab#61981](https://github.com/Fix/ab/issues/61981)
* storybook breaking due to component API change ([1484c89](https://github.com/ReliefApplications/oort-frontend/commit/1484c890a5f41dcacb04526d20a26da555fc448d))
* styling not applying if datasource was layout ([d572947](https://github.com/ReliefApplications/oort-frontend/commit/d57294759fae97f4de1f02db1e598b448c85912a))
* summary card preview is not available ([#1407](https://github.com/ReliefApplications/oort-frontend/issues/1407)) ([90b9f66](https://github.com/ReliefApplications/oort-frontend/commit/90b9f6690f33ccb355eb85facb208027688739ee))
* summary card settings layout selection + fix: summary card item ([9d92451](https://github.com/ReliefApplications/oort-frontend/commit/9d9245158e4eb6a02101ec9a64d376523edae077))
* summary card style + allow card creation with the other type template ([91587b0](https://github.com/ReliefApplications/oort-frontend/commit/91587b07c1db048b14aa9959b08c2d76941074db))
* summary cards preventing scrollbar to be clicked when selecting placeholder ([dd630cd](https://github.com/ReliefApplications/oort-frontend/commit/dd630cd9735feadc19a15d7e4b46b46895ae4d44)), closes [Fix/ab#60033](https://github.com/Fix/ab/issues/60033)
* tagbox and dropdown question enable/disable status ([d643fae](https://github.com/ReliefApplications/oort-frontend/commit/d643fae931aafc467c2737a491f254d856c95ba1))
* tailwind display issues in query builder ([0fbae0c](https://github.com/ReliefApplications/oort-frontend/commit/0fbae0c9d8ac7cac28aff081e2614dae9eb51b86))
* tailwind was applying styling to all inputs, even non tailwind ones ([23a5eb7](https://github.com/ReliefApplications/oort-frontend/commit/23a5eb72d6b9772560d816297ec7855198ec67f2))
* toggle not appearing in summary card settings module ([6222290](https://github.com/ReliefApplications/oort-frontend/commit/6222290de9ab552f7fcea775b828cc5f6c0b67a6))
* ui-radio missing checked input ([5e2c38e](https://github.com/ReliefApplications/oort-frontend/commit/5e2c38ea6955ce8324ccce1e83ad60885bc5d203))
* undefined or null labels in charts ([eda357f](https://github.com/ReliefApplications/oort-frontend/commit/eda357f275063c870ca9f8830e732da957381a5d))
* unionBy typing issue would cause build failure ([79311e5](https://github.com/ReliefApplications/oort-frontend/commit/79311e5eff003e43a16543a21e0738c8536bef82))
* unique related name check to resources questions ([#1436](https://github.com/ReliefApplications/oort-frontend/issues/1436)) ([771012b](https://github.com/ReliefApplications/oort-frontend/commit/771012bac47dcb7ee6ab4fe702d0df6671311ac2))
* unlock application ([b9dd79b](https://github.com/ReliefApplications/oort-frontend/commit/b9dd79bdd9fbbea608aa8207e65d311385bbf34b))
* update of resource's roles permissions ([#1414](https://github.com/ReliefApplications/oort-frontend/issues/1414)) ([a887bd0](https://github.com/ReliefApplications/oort-frontend/commit/a887bd023330e090e7c7acf53496d1e6aea6b092))
* users list was not filtering on username ([bc675fa](https://github.com/ReliefApplications/oort-frontend/commit/bc675fa301a32261e1e83c31781fd2aa28eac378))
* values instead of labels appearing on custom filter in dashboards ([2045fdb](https://github.com/ReliefApplications/oort-frontend/commit/2045fdbfa6a9c9c39b3466755c1507fd3b334e25)), closes [bugfix/AB#65520](https://github.com/bugfix/AB/issues/65520) [bugfix/AB#65520](https://github.com/bugfix/AB/issues/65520)
* values instead of labels were displayed in dashboard filters ([37f628d](https://github.com/ReliefApplications/oort-frontend/commit/37f628d248ac387b6bcb1f078269c62f15f85a30))
* When reloading any tab of resource page, the tab appear as selected ([4fa88e9](https://github.com/ReliefApplications/oort-frontend/commit/4fa88e96c5f7ea667a1bc13a39b4dd3b308dfe96))
* wrong behavior with empty status of filters ([7a73b9e](https://github.com/ReliefApplications/oort-frontend/commit/7a73b9e259db817254d83705ae3f82e961d37ce5))


### Features

*  select / unselect all columns in grid column chooser ([5312a7e](https://github.com/ReliefApplications/oort-frontend/commit/5312a7e584008fe0144fa8c15086b38b7cf1335c)), closes [Feat/ab#11381](https://github.com/Feat/ab/issues/11381)
* add avatar group component ([bc952f9](https://github.com/ReliefApplications/oort-frontend/commit/bc952f9e1db5e9e87d4a6cd0ef6103979bbabbf3)), closes [feat/AB#61942](https://github.com/feat/AB/issues/61942)
* add cron editor modal ([d675ca2](https://github.com/ReliefApplications/oort-frontend/commit/d675ca2bc0619c34e504c6a13df804eb6d158dba))
* add custom listRowsWithColValue function ([0620dfd](https://github.com/ReliefApplications/oort-frontend/commit/0620dfdbc43b79dab7e90936d5d9fb4d00d56e17))
* add file type questions in possible types for matrix question ([0ecf108](https://github.com/ReliefApplications/oort-frontend/commit/0ecf1081fb50933caf0e27afec82a662aca4bd97))
* add fullscreen directive ([f46bc61](https://github.com/ReliefApplications/oort-frontend/commit/f46bc613f2b53db708a391ce3cf5c5f52256accc))
* add lastUpdateForm field ([2df7921](https://github.com/ReliefApplications/oort-frontend/commit/2df7921b05e176d68b47d3c3aa5c04a096410886))
* add notification interface ([1cc5134](https://github.com/ReliefApplications/oort-frontend/commit/1cc5134cbaa6c912469466aad659671c7926c391))
* add polar chart ([b9afcb3](https://github.com/ReliefApplications/oort-frontend/commit/b9afcb37fa5e1a9393cf20ac4b2297ef5fcba994)), closes [feat/AB#59512](https://github.com/feat/AB/issues/59512)
* add possibility to have one dashboard per record ([a3e527f](https://github.com/ReliefApplications/oort-frontend/commit/a3e527f906a444d0d9a87237ee9d02d69bc4a6dc)), closes [feat/AB#59620](https://github.com/feat/AB/issues/59620)
* add possibility to see line / bar / column charts as gradients ([15c67cd](https://github.com/ReliefApplications/oort-frontend/commit/15c67cd2d81a38d0089d6e24c215bb58e43830c5))
* add radar chart ([862950e](https://github.com/ReliefApplications/oort-frontend/commit/862950ef290b0ccfbb102fd7757e0b1e3c5e54f4))
* add scss editor in applications ([7bc48dc](https://github.com/ReliefApplications/oort-frontend/commit/7bc48dc20eacb5836132e741b9d40939f09b75f1)), closes [feat/AB#59633](https://github.com/feat/AB/issues/59633)
* add snackbar when CUD for distribution lists, notification template & custom ([5033358](https://github.com/ReliefApplications/oort-frontend/commit/503335820c65991a64077e2ea0f817b9aabf2416))
* add substr / toint / tolong calc key ([9756763](https://github.com/ReliefApplications/oort-frontend/commit/97567632077745403dca79e1bba10e8de7946527))
* added derived fields tab on resources ([32920b4](https://github.com/ReliefApplications/oort-frontend/commit/32920b42aaa16a95e6bba5650237d609a3326798))
* added info keys ([aaaaa60](https://github.com/ReliefApplications/oort-frontend/commit/aaaaa60bef5719e2ae87dcf5d803e5a02e5106eb))
* adding an alert to inform user it is possible to include variables in summary card ([6ed4e8a](https://github.com/ReliefApplications/oort-frontend/commit/6ed4e8a1b552984dade3a9163a9ea35d2b3d665e))
* allow distribution list to be empty ([808c23f](https://github.com/ReliefApplications/oort-frontend/commit/808c23f92a73e5942814455ca3b1f326223f0b84))
* allow multiple line interpolations in charts ([6b30215](https://github.com/ReliefApplications/oort-frontend/commit/6b30215a8e134adba406b8636a8d41a538023382))
* allow page to be injected as urls in tinymce for editor / summary card widgets ([4b5f3df](https://github.com/ReliefApplications/oort-frontend/commit/4b5f3dfe715f718ae2fca82291cbe0fca288791c))
* allow urls to be loaded as images in summary cards ([f0ac681](https://github.com/ReliefApplications/oort-frontend/commit/f0ac681f8c6409ec93725c5af10985722e6c3cb8)), closes [Feat/ab#63149](https://github.com/Feat/ab/issues/63149)
* autocomplete for definition editor ([c8534df](https://github.com/ReliefApplications/oort-frontend/commit/c8534dfc2d23668400c0f4f6db3450967b116eb7))
* borderless widgets ([b2fdd8b](https://github.com/ReliefApplications/oort-frontend/commit/b2fdd8b7fd3316987e3e17d91b53add8fa70d395))
* can now export multiple fields in history ([d305ee3](https://github.com/ReliefApplications/oort-frontend/commit/d305ee3215b4afd95a36e87ebbe2186909619e40))
* can now filter fields by template when editing role access ([1a3c0bc](https://github.com/ReliefApplications/oort-frontend/commit/1a3c0bc0715cce1523578e8d0c420a443c4cb074))
* can now hide / show series and categories ([93f3e3f](https://github.com/ReliefApplications/oort-frontend/commit/93f3e3f85826fc7c654464602681bcf4e0054d25)), closes [feat/AB#61106](https://github.com/feat/AB/issues/61106)
* can now integrate avatars in text widgets / summary cards widgets ([7a786fa](https://github.com/ReliefApplications/oort-frontend/commit/7a786fa46593e3d8a8e65eee3edab27b7a92193d)), closes [Feat/ab#66067](https://github.com/Feat/ab/issues/66067)
* can now save settings per serie in charts ([2958298](https://github.com/ReliefApplications/oort-frontend/commit/2958298c273979c01eb3b27ce83877a5df41e471)), closes [Ab#59837](https://github.com/Ab/issues/59837)
* can set options per category in charts ([b055112](https://github.com/ReliefApplications/oort-frontend/commit/b055112648aaad02f92e63d1775749670a7f6442))
* can toggle visibility of gridlines in charts ([726759b](https://github.com/ReliefApplications/oort-frontend/commit/726759b84d9482667d9f60bdf3d1522190b6a047)), closes [feat/AB#59422](https://github.com/feat/AB/issues/59422)
* dashboard now indicates if changes were not saved ([22ed685](https://github.com/ReliefApplications/oort-frontend/commit/22ed68581ed66e9b6c839eec04b4de587a1c5cee))
* dashboards with context ([424b5ac](https://github.com/ReliefApplications/oort-frontend/commit/424b5ac96e0c905b2f2e44195af8106ac37affcb))
* derived fields tab ([77972bc](https://github.com/ReliefApplications/oort-frontend/commit/77972bcd84eac98d8b54fcc6c717aaab1228d6e8))
* distribution list is now editable ([a0274ac](https://github.com/ReliefApplications/oort-frontend/commit/a0274ac4ce85ba10d250a0c596e4de47c5775beb))
* dynamic cards can now be transformed into grids ([adfc321](https://github.com/ReliefApplications/oort-frontend/commit/adfc3217eded1a3706f0beba38fe8787511543a6)), closes [Ab#59618](https://github.com/Ab/issues/59618)
* email subject is now editable ([f4396e9](https://github.com/ReliefApplications/oort-frontend/commit/f4396e9d390417ae0efe2ee397e0c2667308fd01))
* empty filter are now indicated in dashboards ([#1393](https://github.com/ReliefApplications/oort-frontend/issues/1393)) ([102971a](https://github.com/ReliefApplications/oort-frontend/commit/102971a499ff2c0970576515d289f62b829ab04f))
* implement search on summary cards ([f5f661e](https://github.com/ReliefApplications/oort-frontend/commit/f5f661eecb861fcf3f8ce0d9407fd18d95004666))
* layout selection on summary cards settings ([95c580d](https://github.com/ReliefApplications/oort-frontend/commit/95c580d75de3d2cdc0bf3a3fc6fcae814cda44ed))
* now supporting dynamic cards w/ aggregation ([fd27429](https://github.com/ReliefApplications/oort-frontend/commit/fd2742985008641521f67e7a63578971ffd6464c))
* now supporting static cards w/ aggregation ([119b842](https://github.com/ReliefApplications/oort-frontend/commit/119b842b6323b3445f586d7ad0ee3aa498c5bcec))
* pagination on summary cards ([99ae731](https://github.com/ReliefApplications/oort-frontend/commit/99ae7311aeb650f5f925478a860d5d45d3bc2295))
* possibility to have borderless widgets ([7657b39](https://github.com/ReliefApplications/oort-frontend/commit/7657b39195af31bd2caea5efafc2f056506746ba)), closes [feat/AB#59610](https://github.com/feat/AB/issues/59610)
* possibility to have pages on top of the app ([624f3dc](https://github.com/ReliefApplications/oort-frontend/commit/624f3dc14f4ce0692883eba97d11f4f0ea02c51e))
* possibility to move up / move down questions in forms ([e24bb3e](https://github.com/ReliefApplications/oort-frontend/commit/e24bb3eb4dcd25440211d949c8909906c22d81f1))
* removed field validator for grouping ([a963f46](https://github.com/ReliefApplications/oort-frontend/commit/a963f46a35d96e86a098a366f20162092b98f8ba))
* replace summary card icon by the new one and change its color value in widget_types ([b0fa058](https://github.com/ReliefApplications/oort-frontend/commit/b0fa058c447a149f2b4b0f722a5bbc11ddec23c1))
* selection of aggregation for summary cards ([fb6c59c](https://github.com/ReliefApplications/oort-frontend/commit/fb6c59c8fb7871a6147597183e02168330cc14ec))
* smart date filter in grids ([#1135](https://github.com/ReliefApplications/oort-frontend/issues/1135)) ([8c2406a](https://github.com/ReliefApplications/oort-frontend/commit/8c2406a1e23d368df439b1ded837406c1937b08a))
* start summary card component [#34839](https://github.com/ReliefApplications/oort-frontend/issues/34839) ([0c4e8fd](https://github.com/ReliefApplications/oort-frontend/commit/0c4e8fd6ff18feba261759e6ac4d60f2f73da9f9))
* using routerlink on link instead of list element ([38b7961](https://github.com/ReliefApplications/oort-frontend/commit/38b7961a0b9c6cdaaab9d2e3fc3799f2aa6337a3))


### Performance Improvements

* add bundle analyzer ([0021fb3](https://github.com/ReliefApplications/oort-frontend/commit/0021fb3a7f06126c484c8dc3781d72be7716a295))
* migrate to storybook 7 ([fa18efd](https://github.com/ReliefApplications/oort-frontend/commit/fa18efd1ec3067e6e790f5a7057627a5ee3565df))
* prevent custom styling of applications to be closed without saving + keep active when navigating in app ([ee5b128](https://github.com/ReliefApplications/oort-frontend/commit/ee5b128fd3314d5ec3cb27107801e93f96451b21)), closes [feat/AB#60921](https://github.com/feat/AB/issues/60921)
* setup nx ([e207715](https://github.com/ReliefApplications/oort-frontend/commit/e207715b1b46f7e54fd76ac0960b99a9e13ea89b))


### BREAKING CHANGES

* now a nx repo

Setup all projects as applications
Create safe shared library, based on existing safe library
Simplify development

## [1.3.13](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.12...v1.3.13) (2023-05-24)


### Bug Fixes

* incorrect tooltip position on forms when multi questions per line active ([c0b24b9](https://github.com/ReliefApplications/oort-frontend/commit/c0b24b964e275978f8dab79fe8ee1215b6508c3a))
* pagination issue in ref data table ([3dd142e](https://github.com/ReliefApplications/oort-frontend/commit/3dd142e68729bf6272214f48610d5c558bf94c60))
* user list would not perform pagination as expected ([0636e49](https://github.com/ReliefApplications/oort-frontend/commit/0636e49420dfcde2bd08bc2df852859d7758c784))

## [1.3.12](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.11...v1.3.12) (2023-05-15)


### Bug Fixes

* date / datetime / time can now be used in triggers in surveyjs ([6b1fc3d](https://github.com/ReliefApplications/oort-frontend/commit/6b1fc3d7f40a0136907bb52ba69dbd80cf713c02))

## [1.3.11](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.10...v1.3.11) (2023-04-14)


### Bug Fixes

* AB[#57872](https://github.com/ReliefApplications/oort-frontend/issues/57872) add isnull / isnotnull to available operators for boolean fields ([1338eea](https://github.com/ReliefApplications/oort-frontend/commit/1338eea7ea6b70fed3ff80fcab75e7b124d360a3))
* delete questions from surveyjs if not accessible ([f3785e6](https://github.com/ReliefApplications/oort-frontend/commit/f3785e69b51be23e95e51c9ccad1478c81976b92)), closes [bugfix/AB#35551_SA-HQ-and-all-RO-R4](https://github.com/bugfix/AB/issues/35551_SA-HQ-and-all-RO-R4)
* tagboxes and checkboxes fields of merged records could contain duplicates ([3f3beca](https://github.com/ReliefApplications/oort-frontend/commit/3f3beca89aebcdbb523bc9fa61f12ec84b094301))

## [1.3.10](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.9...v1.3.10) (2023-02-21)


### Bug Fixes

* application's users delete button ([#1138](https://github.com/ReliefApplications/oort-frontend/issues/1138)) ([a2cf857](https://github.com/ReliefApplications/oort-frontend/commit/a2cf8573910f8d16eebc7cf2a65441c4f8646495))

## [1.3.9](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.8...v1.3.9) (2023-02-03)


### Bug Fixes

* step could not be duplicated ([9383527](https://github.com/ReliefApplications/oort-frontend/commit/9383527075be50fa18003c87bab352059164fefd))

## [1.3.8](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.7...v1.3.8) (2023-01-26)


### Bug Fixes

* editing role access could be too slow for good experience ([b7dc5a2](https://github.com/ReliefApplications/oort-frontend/commit/b7dc5a21db8dce647626e0d2e2b508849ef30dd7))
* label field edition in layouts would not appear ([cff0c77](https://github.com/ReliefApplications/oort-frontend/commit/cff0c7793bc2e621b33b7c6c10f5cd58664b63a7))

## [1.3.7](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.6...v1.3.7) (2023-01-17)


### Bug Fixes

* filters without needed value could break + metadata fetched too often when editing role access ([1dd2a16](https://github.com/ReliefApplications/oort-frontend/commit/1dd2a166b015910addd71b5afa41c83b9765dbd5))

## [1.3.6](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.5...v1.3.6) (2023-01-17)


### Bug Fixes

* storybook build not working ([6471ddd](https://github.com/ReliefApplications/oort-frontend/commit/6471ddd362140aa468650d4729b5cfb2a36ee63d))
* widget choice could prevent items below to be clicked ([f70b1a6](https://github.com/ReliefApplications/oort-frontend/commit/f70b1a675ae480047f99bb0cd867414cb05c3367))

## [1.3.5](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.4...v1.3.5) (2023-01-16)


### Bug Fixes

* cached choices by url would never expire ([fc8e618](https://github.com/ReliefApplications/oort-frontend/commit/fc8e618b524a9b6e6394116c8cc49ef0011dcc79)), closes [1.3.x/AB#53527](https://github.com/1.3.x/AB/issues/53527)
* front-office routing break due to incorrect safe import ([ce15ea6](https://github.com/ReliefApplications/oort-frontend/commit/ce15ea6436e45ea50711e68537884f53f0862841))

## [1.3.4](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.3...v1.3.4) (2023-01-10)


### Bug Fixes

* aggregation pagination not working ([2911132](https://github.com/ReliefApplications/oort-frontend/commit/29111329311b05b8cec06e13d584dec75901db64))
* errors would not appear when editing resource permissions ([b5cf05d](https://github.com/ReliefApplications/oort-frontend/commit/b5cf05db974cde49d012855f266b235a9d2f9c1b))
* history would not reload if record was updated ([162646d](https://github.com/ReliefApplications/oort-frontend/commit/162646d45edc4dc51e21fd51dc4a19570c58745c))
* metadata error would appear when creating a grid widget ([6dce7fe](https://github.com/ReliefApplications/oort-frontend/commit/6dce7fe71f10f414c27a471ab2f95b638eb3de85))
* requests with metadata could cause system failure ([db38acc](https://github.com/ReliefApplications/oort-frontend/commit/db38acca903cadf4e979de6b9a53dcc08e6c7d2a)), closes [1.3.x/AB#53528](https://github.com/1.3.x/AB/issues/53528)
* widget choice container would not be clickable when collapsed ([559866b](https://github.com/ReliefApplications/oort-frontend/commit/559866b2d6ac29eefcb977454587345b4bda5f60))

## [1.3.3](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.2...v1.3.3) (2023-01-03)


### Bug Fixes

* interaction with query builder would sometimes fail ([a7a3d14](https://github.com/ReliefApplications/oort-frontend/commit/a7a3d145154f899bde9b9becf6fd000f70dd8fec))
* map settings would not display some resources by default, due to pagination ([388e034](https://github.com/ReliefApplications/oort-frontend/commit/388e0347f7762eb67bc2ace7dea5ddcf839f8704))
* setting resource in map settings could break some other settings ([c370a51](https://github.com/ReliefApplications/oort-frontend/commit/c370a51feee112df8d01f85c593ee8e047a3b844))
* user could see 'add' button in grids, even if not authorized ([7d2d95f](https://github.com/ReliefApplications/oort-frontend/commit/7d2d95f4c13a36390856af6bd08d0d05be56e2c5))
* users filter would always appear ([6a0d5b3](https://github.com/ReliefApplications/oort-frontend/commit/6a0d5b380cffcdc4aebdbf4d17d7d0b131f4010a))

## [1.3.2](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.1...v1.3.2) (2022-12-19)


### Bug Fixes

* 'not extensible object' error ([6989e44](https://github.com/ReliefApplications/oort-frontend/commit/6989e44d95a6f856c4dd4638c9b1a7ac8301cb9b))
* allow only selected fields as coords ([27e1405](https://github.com/ReliefApplications/oort-frontend/commit/27e1405b5b5b42251d8f40b97e4cebe35599ea96))
* could edit user attributes if not local config ([2399443](https://github.com/ReliefApplications/oort-frontend/commit/2399443652e36847e7c6515834599f4d3c48e259))
* hide icon overflow ([bc0c507](https://github.com/ReliefApplications/oort-frontend/commit/bc0c50712ef8990cd994d619aaf186969e751728))
* legend overflow ([70ea13a](https://github.com/ReliefApplications/oort-frontend/commit/70ea13ad1dcf865ec4b2988f3b137d53d771ecb4))
* replace dataset selection on map settings ([e7c4c64](https://github.com/ReliefApplications/oort-frontend/commit/e7c4c642e177e65d2a749da335082d2650ce9a1c))
* selected fields search would not appear with full width in query builder ([58b0150](https://github.com/ReliefApplications/oort-frontend/commit/58b0150bf190d90ac3f48735b658fc925255640a))
* typos ([400197b](https://github.com/ReliefApplications/oort-frontend/commit/400197bf05cb0e90808840a0ff9ca772fdc2d0c5))

## [1.3.1](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.0...v1.3.1) (2022-12-07)


### Bug Fixes

* adding list and template from settings ([991765c](https://github.com/ReliefApplications/oort-frontend/commit/991765cf87c6b6727c9fe7ba4707609afd18be34))
* **build:** commonjs creating warning when building ([dda7ad3](https://github.com/ReliefApplications/oort-frontend/commit/dda7ad354f93ab66fd8a8313e24d5e7e48e87399))
* hide labels on small devices ([39d6b54](https://github.com/ReliefApplications/oort-frontend/commit/39d6b546c029bc1bad3bd1a8120e5be379382249))
* using links in profile menu ([564e40a](https://github.com/ReliefApplications/oort-frontend/commit/564e40a76e017cc23154162d914d6ad959dbd7bb))
* using links instead of buttons on admin nav ([a47b97e](https://github.com/ReliefApplications/oort-frontend/commit/a47b97e3823064af938492c29553db3135d828db))

# [1.3.0](https://github.com/ReliefApplications/oort-frontend/compare/v1.2.0...v1.3.0) (2022-12-01)


### Bug Fixes

* add comma to correspond to the coding style ([762584b](https://github.com/ReliefApplications/oort-frontend/commit/762584b6358a5ebe9ab8d02507e76987546b15e3))
* added overflow containers to all tables ([6edccb0](https://github.com/ReliefApplications/oort-frontend/commit/6edccb043e76c88bc440651774e6da7a17a760d2))
* application name edition ([c8b7c39](https://github.com/ReliefApplications/oort-frontend/commit/c8b7c39f301336446504daf60d60c893de25f4ae))
* array filter operators ([f3763b0](https://github.com/ReliefApplications/oort-frontend/commit/f3763b00619b6f171b089f7bb32b842e2caa481c))
* auto-modify rows action without placeholder ([943762d](https://github.com/ReliefApplications/oort-frontend/commit/943762d92094f1aef0d99c61dca4f33d107bdcb1))
* bug with charts preview in grid with ref data [#37424](https://github.com/ReliefApplications/oort-frontend/issues/37424) ([bbd7b77](https://github.com/ReliefApplications/oort-frontend/commit/bbd7b7756d59b5dfe21da35c822e443da6470dc6))
* can now resize map widget ([b7f7216](https://github.com/ReliefApplications/oort-frontend/commit/b7f7216f01662c535fba41660c2b0202850e1796))
* correct error message when the choosen record doesn't exist and add a button to open settings ([7e8d927](https://github.com/ReliefApplications/oort-frontend/commit/7e8d92784cc5ddf78acd93b6df22f2035a63bf5f))
* default color black ([6e6f018](https://github.com/ReliefApplications/oort-frontend/commit/6e6f018666f9550e18ddefe28c447f291f10c3cf))
* display of reference datas table [#29451](https://github.com/ReliefApplications/oort-frontend/issues/29451) ([c53165c](https://github.com/ReliefApplications/oort-frontend/commit/c53165c00416345e59cd281a196e11eae530f438))
* drag / drop with search in query builders not moving the correct fields ([d1f6774](https://github.com/ReliefApplications/oort-frontend/commit/d1f677490515ea2915664785de5c4b352017f5c7))
* duplicate requests ([d549e43](https://github.com/ReliefApplications/oort-frontend/commit/d549e430810f8d89f1774f52846dc229a5929cdd))
* filter on choropleth ([a01f091](https://github.com/ReliefApplications/oort-frontend/commit/a01f0912eb4090282c91913f5718d9c79918cd41))
* fixed ng0100 error ([8bc5577](https://github.com/ReliefApplications/oort-frontend/commit/8bc5577f01e17ed3db542ed029f2b6ceffda239c))
* issue where add action would not appear anymore on grid ([bc68325](https://github.com/ReliefApplications/oort-frontend/commit/bc6832539fc086d847fa23a4dc5fdba35370231a))
* issue with charts not having custom palette ([ee22c22](https://github.com/ReliefApplications/oort-frontend/commit/ee22c22286edd55b7381e8aa449d711e16c35d2a))
* linting ([2f08108](https://github.com/ReliefApplications/oort-frontend/commit/2f0810876a12d69346740af9ea217b0dcc6b1707))
* linting ([fc21e78](https://github.com/ReliefApplications/oort-frontend/commit/fc21e78bed1113361b952d8260a03b8520c158db))
* linting ([9789ed7](https://github.com/ReliefApplications/oort-frontend/commit/9789ed75612b5c84efcad09d008016cf92edebe4))
* load aggregations is properly disabled now ([f958dc5](https://github.com/ReliefApplications/oort-frontend/commit/f958dc5bb3906d8efffeb759f57819e58f34d25b))
* mark form as dirty when updating fields [#29451](https://github.com/ReliefApplications/oort-frontend/issues/29451) ([55fd0d3](https://github.com/ReliefApplications/oort-frontend/commit/55fd0d354294e8f788a3da896f150f65b478cb23))
* minor changes ([1bef7d0](https://github.com/ReliefApplications/oort-frontend/commit/1bef7d07be95e97f9cc7556849d341612afed7d3))
* notification not working when editing app ([c9dc2d2](https://github.com/ReliefApplications/oort-frontend/commit/c9dc2d23b00f3443af53b28dd0185576110c3e20))
* now possible to correctly calculate permissions in grid toolbar ([5b18e5c](https://github.com/ReliefApplications/oort-frontend/commit/5b18e5cf68b3e6da6928d131c6769e4a414bfccb))
* overlay [#27255](https://github.com/ReliefApplications/oort-frontend/issues/27255) ([0cd5358](https://github.com/ReliefApplications/oort-frontend/commit/0cd535835036966746570ee4b74a9603d2b62f1d))
* page permissions are now updated when clicking on update button ([43463b0](https://github.com/ReliefApplications/oort-frontend/commit/43463b04b5caa434b5228f81f12846912362ad62))
* remove unused import ([688ba95](https://github.com/ReliefApplications/oort-frontend/commit/688ba95e390fafa8f5a2d9a84ae96c4a8294c3cf))
* remove warning when building safe library ([53d0bfb](https://github.com/ReliefApplications/oort-frontend/commit/53d0bfb512d40e4d6bccb2312ff438ca25477249))
* save changes button removed when selected field is not editable ([dfa50b0](https://github.com/ReliefApplications/oort-frontend/commit/dfa50b043963a05dfdce1a2f76901f3b4e6db8df))
* sort items by display name on RefDataService ([dfa9399](https://github.com/ReliefApplications/oort-frontend/commit/dfa939955f29b973abc661a127f499d3a2d1a1bf))
* tinymc + mat-tab interaction ([3a79090](https://github.com/ReliefApplications/oort-frontend/commit/3a79090521ab5d4fe0124629566d2a55e95cdfab))
* typo in query builder [#37424](https://github.com/ReliefApplications/oort-frontend/issues/37424) ([a5112ce](https://github.com/ReliefApplications/oort-frontend/commit/a5112ce1aa04d9fef8f76f5ccd92b4b6c7a67f62))
* update form step permissions with step permissions instead of page permissions ([9cc808e](https://github.com/ReliefApplications/oort-frontend/commit/9cc808e6bcd2031ccfb3e03ab19d7f09934f89c1))
* updating operator field correctly ([8fed57b](https://github.com/ReliefApplications/oort-frontend/commit/8fed57bcd5e388f52fd4fdb41197ffa24c04be2e))
* use ngZone to close addRecord modal ([1bd98d7](https://github.com/ReliefApplications/oort-frontend/commit/1bd98d72af591b6e5fa5de7c2a1348b9b5849df6))
* with unicity, clearing cache does not erase content ([3770dcc](https://github.com/ReliefApplications/oort-frontend/commit/3770dccaafd41a2a856d7d63a6987177a1e97f33))


### Features

* **404:** create 404 page ([32e1bc3](https://github.com/ReliefApplications/oort-frontend/commit/32e1bc3801709bf12c412dff870dc3e0ed2af65b))
* add advanced settings for users [#29935](https://github.com/ReliefApplications/oort-frontend/issues/29935) ([bc4c6cb](https://github.com/ReliefApplications/oort-frontend/commit/bc4c6cb44aba5af876ef021398bb7460c25ef867))
* add alert component ([da1c9dd](https://github.com/ReliefApplications/oort-frontend/commit/da1c9dd8a881168f4aaa41f876aa13d5ff3550f0))
* add bold, italic and underline functionalities for chart's title ([b3e3548](https://github.com/ReliefApplications/oort-frontend/commit/b3e35482894af7df2f0b1315a0c73580230a5113))
* add geosearch ([c69e504](https://github.com/ReliefApplications/oort-frontend/commit/c69e5040e6ee8fc674f1d406b4fd90bd88c89ef1))
* add loading indicator to dashboards ([0257abb](https://github.com/ReliefApplications/oort-frontend/commit/0257abb08f21f446ea04229d55eb93b8b21ef897))
* add loading to csv validation [#29451](https://github.com/ReliefApplications/oort-frontend/issues/29451) ([cd6b6f4](https://github.com/ReliefApplications/oort-frontend/commit/cd6b6f4ca8681b0a9b186a1df74500037d10f19b))
* add snackbar spinner to upload ([f910257](https://github.com/ReliefApplications/oort-frontend/commit/f9102578af5175cb7990fba483c3c82421545bc7))
* added attribute filters for role access ([2aa29da](https://github.com/ReliefApplications/oort-frontend/commit/2aa29da6712825e65fd446cc62895f38359f3fc4))
* added attribute filters to auto roles ([5a55934](https://github.com/ReliefApplications/oort-frontend/commit/5a559343bcd9d53c076c8e2b04cf9819206e1e9c))
* added resource aggregation tab ([16486d1](https://github.com/ReliefApplications/oort-frontend/commit/16486d1d76209baec8bafb993b4b2bbee0ff8f25))
* added resource fields table on role summary [#29961](https://github.com/ReliefApplications/oort-frontend/issues/29961) ([20051e3](https://github.com/ReliefApplications/oort-frontend/commit/20051e3c39c3121b4992380b22f6fd9bf9a8f1c9))
* alllow to filter multiselect refData ([8579f56](https://github.com/ReliefApplications/oort-frontend/commit/8579f56bf50df469be1175de38c9b776b2a4abe6))
* allow to filter on resource question ([9356f44](https://github.com/ReliefApplications/oort-frontend/commit/9356f44507983c26121416cfd46433a1ae759072))
* auto assignment of roles from groups ([6697f3b](https://github.com/ReliefApplications/oort-frontend/commit/6697f3b4f1e351855c4c3eab1197ad20e90ed680))
* can duplicate page in new / same application [#27084](https://github.com/ReliefApplications/oort-frontend/issues/27084) ([1dfeaa7](https://github.com/ReliefApplications/oort-frontend/commit/1dfeaa7999b78593a6a80724058e2256a4d5cbe6))
* can include graphql in API settings [#26926](https://github.com/ReliefApplications/oort-frontend/issues/26926) ([4995b9c](https://github.com/ReliefApplications/oort-frontend/commit/4995b9c1702e43ac5ce279a4d900ee6ce92d8494))
* can now collapse widget selector ([df9287b](https://github.com/ReliefApplications/oort-frontend/commit/df9287b44187d14514b1e3bae00c35fdb958c9b9))
* can now use now() as util for time fields ([ae9151a](https://github.com/ReliefApplications/oort-frontend/commit/ae9151a3eb08cda059224bd169184640eb173159))
* can use series in charts ([c2967e2](https://github.com/ReliefApplications/oort-frontend/commit/c2967e220099aa177ea976495fef40f7581a45ed))
* displaying fields based on user permission [#29961](https://github.com/ReliefApplications/oort-frontend/issues/29961) ([6fa960a](https://github.com/ReliefApplications/oort-frontend/commit/6fa960ae1e2a7e4176d5b4da2df7a86e600033c5))
* french translation of tinymce ([cf01040](https://github.com/ReliefApplications/oort-frontend/commit/cf01040d4bdcc739fa81bcbb0faa4a0c3098fa03))
* group by category in maps ([7e201d4](https://github.com/ReliefApplications/oort-frontend/commit/7e201d4c7a4298a9c0aca254e0d7e7fc313a6283))
* hide plugins and version parts of the 'help' of tinymce ([d2dbcbc](https://github.com/ReliefApplications/oort-frontend/commit/d2dbcbce7de1c4873c3aff6c7631f0831622eed3))
* improvements to filters on small screens ([c806397](https://github.com/ReliefApplications/oort-frontend/commit/c806397a6aac729033fb8b6440df9353c3fd8ace))
* indicate filtering in pages with queries ([af75f72](https://github.com/ReliefApplications/oort-frontend/commit/af75f72f49a3df86668310ce4d35c86baf1c5f7c))
* inline validation of records ([743173d](https://github.com/ReliefApplications/oort-frontend/commit/743173d009565e5813e98d27ec9f67d762861b9c))
* integrate filter field for graphQL refData [#29451](https://github.com/ReliefApplications/oort-frontend/issues/29451) ([893f020](https://github.com/ReliefApplications/oort-frontend/commit/893f020efe77be4e4c7da650be0b2d888217610c))
* page size now part of layout ([2cf933c](https://github.com/ReliefApplications/oort-frontend/commit/2cf933c107a36259a591499a499a6a5fb0104efc))
* pagination for aggregations ([6c92436](https://github.com/ReliefApplications/oort-frontend/commit/6c92436f45bc4c61d45444402ee1eb75e278b732))
* possibility to set custom colors for charts ([3bbacf7](https://github.com/ReliefApplications/oort-frontend/commit/3bbacf7557164bb4ed28736c47ccb0932a8264d5))
* searchable fields ([c2d1392](https://github.com/ReliefApplications/oort-frontend/commit/c2d139299b2321bc7cfa5d31b01d0fde5340919e))
* shorter dashboard link url ([cc4bbfa](https://github.com/ReliefApplications/oort-frontend/commit/cc4bbfaa8368e38dcd3f42203feca46e89937600))
* support caching for static refData [#29451](https://github.com/ReliefApplications/oort-frontend/issues/29451) ([601d24c](https://github.com/ReliefApplications/oort-frontend/commit/601d24c0a9844c7804eb8bb11afc44916e3eeea9))
* support for email and tel fields ([616d297](https://github.com/ReliefApplications/oort-frontend/commit/616d2979c20245c0efa04bb62ba74b8ba56ad8d1))
* support modifiedAt field [#29451](https://github.com/ReliefApplications/oort-frontend/issues/29451) ([fd2c9c6](https://github.com/ReliefApplications/oort-frontend/commit/fd2c9c6f0769db23bdafde5dd4c4a8fbbc19f93a))
* switch between basemap ([3e3770f](https://github.com/ReliefApplications/oort-frontend/commit/3e3770f24b51df02ff92108dd916a246f0152895))
* the size of the chart title and its color can be customized ([c5d7ef3](https://github.com/ReliefApplications/oort-frontend/commit/c5d7ef3110396b157f274f3e2ef5b143be877bb6))
* update graphql caching usage for refdata [#29451](https://github.com/ReliefApplications/oort-frontend/issues/29451) ([1217b2a](https://github.com/ReliefApplications/oort-frontend/commit/1217b2a05428971c281f3fde8532b9976007d3a5))
* Use a mutation to send email from the back [#25833](https://github.com/ReliefApplications/oort-frontend/issues/25833) ([5e69a05](https://github.com/ReliefApplications/oort-frontend/commit/5e69a05ba1e6191426e56a1a1910faa152ea7049))
* use safe-button and display it only if user have the update rights ([86fb9dd](https://github.com/ReliefApplications/oort-frontend/commit/86fb9dd488a1233d1c943161c0fc0c688737fac9))

# [1.2.0](https://github.com/ReliefApplications/oort-frontend/compare/v1.1.0...v1.2.0) (2022-12-01)


### Features

* start 1.2.0 ([55bfe3c](https://github.com/ReliefApplications/oort-frontend/commit/55bfe3c9d20b4c532de97f348452027f6ee2eb34))

# [1.1.0](https://github.com/ReliefApplications/oort-frontend/compare/v1.0.0...v1.1.0) (2022-12-01)


### Bug Fixes

* changed placement of tab ([b7ba86b](https://github.com/ReliefApplications/oort-frontend/commit/b7ba86b6a61d7a06a638215309cf7958e7ade250))
* minor fixes ([22c4ca9](https://github.com/ReliefApplications/oort-frontend/commit/22c4ca932fee6f871e2f4cdf62faa7c4b1ea392a))
* only updating newly added records ([662e383](https://github.com/ReliefApplications/oort-frontend/commit/662e383548aadbe8321777a76383e0be6f011e6c))


### Features

* add limit to records of type List thanks to sortFirst ([d635912](https://github.com/ReliefApplications/oort-frontend/commit/d635912c7d8b2ccf7fbab9b4592cc0d5836fd995))
* added error text for template selection ([490d85e](https://github.com/ReliefApplications/oort-frontend/commit/490d85e7ecf2e453a77eda2b40c7a2aea46075ca))
* added templates tab ([80b9040](https://github.com/ReliefApplications/oort-frontend/commit/80b90408ae1b01f042ea81bffd5cd76b8553cc86))
* select from mail templates on grid settings ([2561993](https://github.com/ReliefApplications/oort-frontend/commit/2561993b5558b05df9f5c55b3944b9c857f39e1d))

# 1.0.0 (2022-12-01)


### Bug Fixes

* add can update and can delete rules to linked records in grid [#11039](https://github.com/ReliefApplications/oort-frontend/issues/11039) ([28e474c](https://github.com/ReliefApplications/oort-frontend/commit/28e474cc8822fae5ea3691e8ddbec7e60e7529b3))
* assets for content selection missing ([81175fe](https://github.com/ReliefApplications/oort-frontend/commit/81175fea0cd18b5ba9bee69a44fa9b92d896ee13))
* attach to record actions links whole object ([a13b006](https://github.com/ReliefApplications/oort-frontend/commit/a13b006a888abeec59445c71ab4670f3420b8910))
* auth page should not block the navigation anymore ([5bc2b83](https://github.com/ReliefApplications/oort-frontend/commit/5bc2b83fdf8738c3651c584b390e8f63f4a5791e))
* boolean not color coded [#27686](https://github.com/ReliefApplications/oort-frontend/issues/27686) ([ce0ed56](https://github.com/ReliefApplications/oort-frontend/commit/ce0ed569fa755781d1bc04988a2c1a82ffcf4e6f))
* bug when changing source [#24823](https://github.com/ReliefApplications/oort-frontend/issues/24823) ([53ceaf3](https://github.com/ReliefApplications/oort-frontend/commit/53ceaf32b7eec864c77a42b461671f4e5989dc03))
* Bug whith protected resources scope [#10687](https://github.com/ReliefApplications/oort-frontend/issues/10687) ([40db481](https://github.com/ReliefApplications/oort-frontend/commit/40db4815f54123fd9e0282d62cc1da1018bc020d))
* bug with _ids fields meta [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([997cc20](https://github.com/ReliefApplications/oort-frontend/commit/997cc20c2d7d9942f31934a941dade0cad912aa4))
* bug with mapping fields when changing source [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([cc87628](https://github.com/ReliefApplications/oort-frontend/commit/cc8762865021c4c2f43f424d809fb663906278e5))
* bug with pipeline fields for first stage [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([12817e2](https://github.com/ReliefApplications/oort-frontend/commit/12817e250d9382a07ad391d38b0cbd2144d21ff3))
* build size error ([8758a13](https://github.com/ReliefApplications/oort-frontend/commit/8758a13dcebbb8e0e5b9e9a6dc172d376a0e49b0))
* cache issue if unicity active ([66865f6](https://github.com/ReliefApplications/oort-frontend/commit/66865f680c8c64b46c7105f4099d808570935cfa))
* cannot reorder layouts ([a262761](https://github.com/ReliefApplications/oort-frontend/commit/a262761285d3ebd4e8f7eb71132d5796a58c6874))
* cannot reorder pages ([f69fad6](https://github.com/ReliefApplications/oort-frontend/commit/f69fad6e688c22594de0e0e4bd5a766ff1763524))
* cannot view line charts because of data not extensible ([921a71f](https://github.com/ReliefApplications/oort-frontend/commit/921a71f270032f55efbf90fb91b3c84ccf127d99))
* choices dropdown inline edition ([9229d3c](https://github.com/ReliefApplications/oort-frontend/commit/9229d3c521e4447f18d719a9c1f4f982a788d43b))
* configuration azure for web apps ([ef03049](https://github.com/ReliefApplications/oort-frontend/commit/ef03049f36b0148ac8912f1bbd45ec364ea8cc3e))
* conflict in routing of front-office ([441d31a](https://github.com/ReliefApplications/oort-frontend/commit/441d31a56437113fa2fcde661a5264731723731f))
* create standard for snackbar notifications ([6183727](https://github.com/ReliefApplications/oort-frontend/commit/61837278739bc5be4183bdc550d92ef379dd8bab))
* default layout save would erase the selection of new settings for grid ([5005aaa](https://github.com/ReliefApplications/oort-frontend/commit/5005aaa0f14921c1829bcd8b38507dbe8a888a3d))
* disable the focus of the first input of the add user modal ([7fa84c8](https://github.com/ReliefApplications/oort-frontend/commit/7fa84c8cfbe95aa94de81e61955c3734fcc35e10))
* display of fields without meta ([c0911c5](https://github.com/ReliefApplications/oort-frontend/commit/c0911c555581c64716b31468c48d9e5d348d774b))
* display other choice in inline edition ([ebd9d27](https://github.com/ReliefApplications/oort-frontend/commit/ebd9d27d28adb5c1be094c2556f84d22b2860677))
* display time input in grid ([5de8ac6](https://github.com/ReliefApplications/oort-frontend/commit/5de8ac683021e33e648169ac9bf373d4bb5eac49))
* edit the logic of grid export, to get available fields from the grid only [#21939](https://github.com/ReliefApplications/oort-frontend/issues/21939) ([ce2e7bb](https://github.com/ReliefApplications/oort-frontend/commit/ce2e7bbfc037b97b3b7cf3d79b6c363a02a50b37))
* eissue where it wasn't possible to update the grid widget settings because of invalid form ([703e83f](https://github.com/ReliefApplications/oort-frontend/commit/703e83fb16dc6152d980a1970a5dac264cb6acbb))
* exporting dataset when sending email now export only visible fields [#16907](https://github.com/ReliefApplications/oort-frontend/issues/16907) ([815dc7a](https://github.com/ReliefApplications/oort-frontend/commit/815dc7a4134fbf2a4a0ecd0ad9afe2bec04e8a30))
* fetch policy for pagination in core grid [#18827](https://github.com/ReliefApplications/oort-frontend/issues/18827) ([4197139](https://github.com/ReliefApplications/oort-frontend/commit/4197139bdae0a762c860d7beecdaf45becc1a441))
* fetching new records pages ([fda85a8](https://github.com/ReliefApplications/oort-frontend/commit/fda85a864692d3c0c3e76f6012644eeb31644ca6))
* filter / sort not reset to default after edition [#11460](https://github.com/ReliefApplications/oort-frontend/issues/11460) ([3d11da2](https://github.com/ReliefApplications/oort-frontend/commit/3d11da2f629d5a83a32f0e0207ed19318470e2f9))
* form modal now looks like the record modal ([1ccaea2](https://github.com/ReliefApplications/oort-frontend/commit/1ccaea258e9fe0af6cd811b72ef96591830a4ad0))
* history overflow ([2009586](https://github.com/ReliefApplications/oort-frontend/commit/20095860cb83c563752421cafa4b54c146af4239))
* husky prepare commit msg hook ([9eced25](https://github.com/ReliefApplications/oort-frontend/commit/9eced2583ae28881ba26a9ea5618a4c3192f3f98))
* issue about kendo theme version ([34eaa88](https://github.com/ReliefApplications/oort-frontend/commit/34eaa88674519253825f2b60ccafc798c1d17532))
* issue where cache policy would prevent some updates to appear in the grids [#18827](https://github.com/ReliefApplications/oort-frontend/issues/18827) ([0ca3ede](https://github.com/ReliefApplications/oort-frontend/commit/0ca3edefc3f6f00dfe6f62416da3eb559ecd1d9c))
* issue where closing modal about rows / cols of a widget without saving would leave them as 0 [#18403](https://github.com/ReliefApplications/oort-frontend/issues/18403) ([d68e5c7](https://github.com/ReliefApplications/oort-frontend/commit/d68e5c724968d6e5e3715a7451b2d344f1b7a986))
* issue where editing would not prevent datepicker to close on click ([1a9a81c](https://github.com/ReliefApplications/oort-frontend/commit/1a9a81ce4b03179a7bcade324c46d3514d5f8cbd))
* issue where email service was not updated after changes made on custom queries filter [#11726](https://github.com/ReliefApplications/oort-frontend/issues/11726) ([9580b09](https://github.com/ReliefApplications/oort-frontend/commit/9580b098ae5cc53fc8ee7f0cc59ed6993102d106))
* issue where fields would not appear directly in query builder ([8505680](https://github.com/ReliefApplications/oort-frontend/commit/8505680c3bbae08ed5a41cd2dbe8f767fc7fedf8))
* issue where having default alyout would break widget options when edition closed [#16802](https://github.com/ReliefApplications/oort-frontend/issues/16802) ([cdfc3b8](https://github.com/ReliefApplications/oort-frontend/commit/cdfc3b8ec02ef91b7fdae47b53d56670556682be))
* issue where navigation with oauth2 was preventing new tab / refresh to correctly work ([7f76dc8](https://github.com/ReliefApplications/oort-frontend/commit/7f76dc8fe04851b4137944b3c41c03705a119dfe))
* issue where some items could not be searched on [#11820](https://github.com/ReliefApplications/oort-frontend/issues/11820) ([8e62703](https://github.com/ReliefApplications/oort-frontend/commit/8e62703ab5dad32325de01f7e320632a76b2c39a))
* issue where translated html would show 'yes' ([c28ad9d](https://github.com/ReliefApplications/oort-frontend/commit/c28ad9d9262547ea0d2401b44c73b71bd69ba5c8))
* issue where wrong template would be used to show details of a field ([ad683be](https://github.com/ReliefApplications/oort-frontend/commit/ad683be210e80d49b85ccf13831c3cfc4c006632))
* layout of core grid should now be the correct one ([229bfb5](https://github.com/ReliefApplications/oort-frontend/commit/229bfb530f7413173c7bff5d714b70907defd486))
* lint ([4e29f17](https://github.com/ReliefApplications/oort-frontend/commit/4e29f17de5e9f297a5b45b39dcabeed70719329c))
* lint ([1190823](https://github.com/ReliefApplications/oort-frontend/commit/11908237f99dec22f8db306a1da9e5bf46eda0d5))
* lint ([0d5f523](https://github.com/ReliefApplications/oort-frontend/commit/0d5f5235ee2b9950bc9a8f73bba4494ba879a4fa))
* lint issues of web element project ([4c3a77c](https://github.com/ReliefApplications/oort-frontend/commit/4c3a77c11c9abe7f7169e4a7d1995ead78436e0d))
* linting [#11731](https://github.com/ReliefApplications/oort-frontend/issues/11731) ([e546eef](https://github.com/ReliefApplications/oort-frontend/commit/e546eefb538b487eb2c64a5d9ecfe34e9ed409c4))
* long title of app does not go outside the box ([5e0e6a4](https://github.com/ReliefApplications/oort-frontend/commit/5e0e6a4561441ecbd96ebc8c8f399ccdec774b25))
* new service to remove circular depedency ([2cfa18f](https://github.com/ReliefApplications/oort-frontend/commit/2cfa18f09a239fd4507221598bb485f3e97e2996))
* pager of grid is invisible ([625299a](https://github.com/ReliefApplications/oort-frontend/commit/625299a900c3c79c0d37d311d3a8734ebc5101a0))
* permissions not working if two permissions can be linked to the same one ([9460e81](https://github.com/ReliefApplications/oort-frontend/commit/9460e816ad2b72f7cabe114f0e3805da31177658))
* pipeline fields not computed [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([b7fc2dd](https://github.com/ReliefApplications/oort-frontend/commit/b7fc2dd7b0f726551efeba458fbf87337d2fe439))
* prevents current edited row in grid to be closed without saving changes [#11796](https://github.com/ReliefApplications/oort-frontend/issues/11796) ([307b98e](https://github.com/ReliefApplications/oort-frontend/commit/307b98ec90001e6debbd3440c1078067c0732480))
* question error message style changed ([8fe35bf](https://github.com/ReliefApplications/oort-frontend/commit/8fe35bfb2e5c8b19927c7b23f6f1a82d522738f9))
* records placeholder was replaced by users in resources component ([dd4ce84](https://github.com/ReliefApplications/oort-frontend/commit/dd4ce84e47a83cffa2a75a280bccdd4b103b656a))
* records unicity when updating records ([abae70f](https://github.com/ReliefApplications/oort-frontend/commit/abae70f57b02f8e2c501acf6d78e81df14f05634))
* Redirect to /applications instead of /dashboard ([e580940](https://github.com/ReliefApplications/oort-frontend/commit/e5809409bbdc30e63030880d7dc95e4d837c02d1))
* remove artifacts of aggregation builder page ([530b094](https://github.com/ReliefApplications/oort-frontend/commit/530b094b0d9915d4b00dace3e7db3602441841be))
* remove null values from emails [#16682](https://github.com/ReliefApplications/oort-frontend/issues/16682) ([6353749](https://github.com/ReliefApplications/oort-frontend/commit/635374906792717af1e60ce2b46133262eeae33d))
* search div only appears if question is editable ([335114d](https://github.com/ReliefApplications/oort-frontend/commit/335114db1667675006818f2ee948387161ac5cd0))
* silent check sso and put credentials in env ([3b16b32](https://github.com/ReliefApplications/oort-frontend/commit/3b16b32d93ea455a6c22c2cd1de5dd5233936e21))
* small bugs ([ebf71c8](https://github.com/ReliefApplications/oort-frontend/commit/ebf71c84945ebf5db477eb39515eba10785e83d4))
* step with long name would not go out of the box ([8044be6](https://github.com/ReliefApplications/oort-frontend/commit/8044be666cd41bcc6295a349b23fcf2423137300))
* store only selected fields name ([2918c68](https://github.com/ReliefApplications/oort-frontend/commit/2918c68213261d8abdb801d895853cae39e6299b))
* survey style not applied to backoffice ([bedd164](https://github.com/ReliefApplications/oort-frontend/commit/bedd1640af3ea0ff112c80ec42c9fefc19dddff1))
* switch back / front office ([38595bb](https://github.com/ReliefApplications/oort-frontend/commit/38595bb2b24b2bc981a50c9cf860226613fcc6a4))
* tagbox initialisation [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([a1a3866](https://github.com/ReliefApplications/oort-frontend/commit/a1a3866dd2213484e6187f958f8b17a689108c5f))
* time inputs now have correct value on grid [#24068](https://github.com/ReliefApplications/oort-frontend/issues/24068) ([d4fcac1](https://github.com/ReliefApplications/oort-frontend/commit/d4fcac1424adabed23b5e4c601543049e50e5a0b))
* time inputs should now be correctly edited ([0529c9b](https://github.com/ReliefApplications/oort-frontend/commit/0529c9b6ca9eff0969f62800395963bf5c88a4f7))
* type error add channel ([516032b](https://github.com/ReliefApplications/oort-frontend/commit/516032b7bc95cf825675c71264dada80b68c4d93))
* typo ([e8a0729](https://github.com/ReliefApplications/oort-frontend/commit/e8a0729c55a24c0e1ac50bb2a450025a5b51ba9d))
* typo [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([2a55511](https://github.com/ReliefApplications/oort-frontend/commit/2a55511d654150dc07c00473b308b6945cfce32e))
* use display=true to fetch data for email [#21951](https://github.com/ReliefApplications/oort-frontend/issues/21951) ([17710e5](https://github.com/ReliefApplications/oort-frontend/commit/17710e5fa6a73371c10873d74c53e624419a3377))
* use lodash get to find choices from URL [#11477](https://github.com/ReliefApplications/oort-frontend/issues/11477) ([4b39b93](https://github.com/ReliefApplications/oort-frontend/commit/4b39b93e088714d478c821ab552aa34ed9c4cdf4))
* warning messages in library ([d6caf1e](https://github.com/ReliefApplications/oort-frontend/commit/d6caf1efa50316cc38546fc58755e575f57a21b8))
* widgets addition ([b42b428](https://github.com/ReliefApplications/oort-frontend/commit/b42b428306d9957de832f478fd9d573ff4741e33))


### Features

* ad step component [#11055](https://github.com/ReliefApplications/oort-frontend/issues/11055) ([1e7a44c](https://github.com/ReliefApplications/oort-frontend/commit/1e7a44c5f2433b8916ac91989fed616e5db58310))
* adapt display arguments for records data [#11477](https://github.com/ReliefApplications/oort-frontend/issues/11477) ([3082adb](https://github.com/ReliefApplications/oort-frontend/commit/3082adb1980231d0057bd81fca22ab8072363531))
* add addField stage [#24823](https://github.com/ReliefApplications/oort-frontend/issues/24823) ([d705171](https://github.com/ReliefApplications/oort-frontend/commit/d705171c2992fbf043581393d29c6fb5df8c4d27))
* add attachment in email ([8e03407](https://github.com/ReliefApplications/oort-frontend/commit/8e03407f9a8a5273c164e751caad9114baacc7f0))
* add avatar ui ([bd794d2](https://github.com/ReliefApplications/oort-frontend/commit/bd794d287466b13a6035703c91d39451e325d220))
* Add choice to map createdBy in pullJobs [#11063](https://github.com/ReliefApplications/oort-frontend/issues/11063) ([09f0631](https://github.com/ReliefApplications/oort-frontend/commit/09f0631960cf30a46707293dbf44523fc698983b))
* add custom stage [#24823](https://github.com/ReliefApplications/oort-frontend/issues/24823) ([ce0b569](https://github.com/ReliefApplications/oort-frontend/commit/ce0b569bb176f4ddb15d7b400934c0f2a01ef31c))
* add date picker and expression builder for date filtering ([344e468](https://github.com/ReliefApplications/oort-frontend/commit/344e4684b4f1c3df59b4007faf2d33d5e2772e6c))
* add forms dropdown component for agg builder ([605e232](https://github.com/ReliefApplications/oort-frontend/commit/605e232a299973190c7cb273af3179ed4d5e6c86))
* add group by stage [#24823](https://github.com/ReliefApplications/oort-frontend/issues/24823) ([b23bbed](https://github.com/ReliefApplications/oort-frontend/commit/b23bbed63e36ff4e81b609ba8a79f95b5808976a))
* add keycloak connection ([b9d4616](https://github.com/ReliefApplications/oort-frontend/commit/b9d4616aa6cde9dc6010bb059a62925dc0cb4688))
* add line and donut component ([0194bed](https://github.com/ReliefApplications/oort-frontend/commit/0194bedb6006aa71c86105102850b0082f973b88))
* add list of properties that can be edited in children forms without impacting core form [#11116](https://github.com/ReliefApplications/oort-frontend/issues/11116) ([99a6876](https://github.com/ReliefApplications/oort-frontend/commit/99a68769b9573432f245adbe9219a8abd6f2a211))
* add mapping, preview, charts integration ([efb9f8d](https://github.com/ReliefApplications/oort-frontend/commit/efb9f8de828d7deebf99781affe11d0c235dffaf))
* add new records from grid [#11610](https://github.com/ReliefApplications/oort-frontend/issues/11610) ([166bf80](https://github.com/ReliefApplications/oort-frontend/commit/166bf8071bba4437a1c94a289f17bd845966b332))
* add pie chart ([a7a8ac3](https://github.com/ReliefApplications/oort-frontend/commit/a7a8ac3828336e6b9523c196a0eafb6efe95b1b0))
* add pipeline with sort and filter steps ([383a398](https://github.com/ReliefApplications/oort-frontend/commit/383a3984abca7455d7fb15106d8fa87ab63a5553))
* Add possibility to define body text for mail [#11731](https://github.com/ReliefApplications/oort-frontend/issues/11731) ([cecf3eb](https://github.com/ReliefApplications/oort-frontend/commit/cecf3eb3b61236bd80350c854019797ef329c1a8))
* add route to test aggregation builder in BO ([5e37e79](https://github.com/ReliefApplications/oort-frontend/commit/5e37e79901e0a8e020d78f1fc3f6f8be48d2b68b))
* Add survey property onCompleteExpression [#11271](https://github.com/ReliefApplications/oort-frontend/issues/11271) ([4898b2d](https://github.com/ReliefApplications/oort-frontend/commit/4898b2d70a1d592b8acd462046eca5896d379e7c))
* add tagbox component ([9dff351](https://github.com/ReliefApplications/oort-frontend/commit/9dff351d96de3d1da04857c7f4e8e696b00a73b3))
* add title and edit properties of charts ([687c3a8](https://github.com/ReliefApplications/oort-frontend/commit/687c3a8b29dc70c2918317f458fe733f72fd29b4))
* add unwind stage [#24823](https://github.com/ReliefApplications/oort-frontend/issues/24823) ([95a3322](https://github.com/ReliefApplications/oort-frontend/commit/95a3322d199ebe36715d19bf807752f73469aca1))
* allow sending email with empty dataset [#21694](https://github.com/ReliefApplications/oort-frontend/issues/21694) ([041c309](https://github.com/ReliefApplications/oort-frontend/commit/041c3099e26b9efff709ad658b35b0174362a420))
* allow to use both LIST and OBJECT fields [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([49ee312](https://github.com/ReliefApplications/oort-frontend/commit/49ee3120ff2efb4035f0ce42f48d5b9be9d2e9b6))
* applications lsit [#11217](https://github.com/ReliefApplications/oort-frontend/issues/11217) ([178ad3d](https://github.com/ReliefApplications/oort-frontend/commit/178ad3db666fffdb4371e2923fd7f82088f8b2e3))
* Authentication with keycloak ([c27ee58](https://github.com/ReliefApplications/oort-frontend/commit/c27ee58a5c423dd5d7d4d35f34b4c67ef3d8a323))
* can edit position attributes ([4dfe89c](https://github.com/ReliefApplications/oort-frontend/commit/4dfe89c862948feebe01c4062aee4140daf0c79a))
* can select all records of a grid [#16603](https://github.com/ReliefApplications/oort-frontend/issues/16603) ([d57d2e6](https://github.com/ReliefApplications/oort-frontend/commit/d57d2e69dd6cd323e30a0a12e4fc166c32377088))
* can select language in modal ([56fe9ec](https://github.com/ReliefApplications/oort-frontend/commit/56fe9ecb71d845a2e53df8e17bb9077d78452af8))
* can update template of emails with editor [#29370](https://github.com/ReliefApplications/oort-frontend/issues/29370) ([92cbc15](https://github.com/ReliefApplications/oort-frontend/commit/92cbc15aa82746be4489e3f42c02944b8622ecf2))
* can use form as a field [#28944](https://github.com/ReliefApplications/oort-frontend/issues/28944) ([20b08fa](https://github.com/ReliefApplications/oort-frontend/commit/20b08faf2a2f900a6b8cc519488545e8d96270a5))
* can use public api cofn ([596a0f7](https://github.com/ReliefApplications/oort-frontend/commit/596a0f72c64545a889f5af215dd37820873dd30a))
* display incrementalId in grid, form/resource [#11375](https://github.com/ReliefApplications/oort-frontend/issues/11375) ([e4a8d46](https://github.com/ReliefApplications/oort-frontend/commit/e4a8d464d4aa6b4921c48501ca8ac2fe733835a5))
* email from back' [#25833](https://github.com/ReliefApplications/oort-frontend/issues/25833) ([7f516b9](https://github.com/ReliefApplications/oort-frontend/commit/7f516b92cced8a71569b86ab421ebe4013786b44))
* finish integration of agg builder in charts ([106adc0](https://github.com/ReliefApplications/oort-frontend/commit/106adc0e0b2d26fda7f1869e9e08a244a8525b2e))
* grid now generates files with timestamp in the name [#25831](https://github.com/ReliefApplications/oort-frontend/issues/25831) ([a2c991e](https://github.com/ReliefApplications/oort-frontend/commit/a2c991e4c2562e512013e462a3cd84809dced0e1))
* i18n enhanced ([6274d45](https://github.com/ReliefApplications/oort-frontend/commit/6274d4548cdb15007c82a69848499da96fa9fb6b))
* integrate tagbox in aggregation builder ([4c9f062](https://github.com/ReliefApplications/oort-frontend/commit/4c9f062f55a7127563a60cbb8bb78eba5f270e9c))
* kendo components are translated ([7cbe0d8](https://github.com/ReliefApplications/oort-frontend/commit/7cbe0d8504f9f849d34ccf97d23aaf4f69792643))
* keycloak connection ([a06fcd0](https://github.com/ReliefApplications/oort-frontend/commit/a06fcd08171cdf5a172f12221cc679fbc15a7891))
* language is saved between session ([b6a415e](https://github.com/ReliefApplications/oort-frontend/commit/b6a415e76becb4a6d432f617e088d10a226cf00c))
* multi-filter on resources and resource ([c5a1eb5](https://github.com/ReliefApplications/oort-frontend/commit/c5a1eb53b957a39c6f5b460707788385c91c0d1e))
* navigation buttons of forms at the bottom of modals [#11515](https://github.com/ReliefApplications/oort-frontend/issues/11515) ([1f0550d](https://github.com/ReliefApplications/oort-frontend/commit/1f0550dd0afecbe5ac3e08aea465e678d9319c25))
* new workflow styling [#11055](https://github.com/ReliefApplications/oort-frontend/issues/11055) ([4f2632e](https://github.com/ReliefApplications/oort-frontend/commit/4f2632e68afddef61310baea79facb46a0941370))
* order filters by name in query builder ([fc7bd11](https://github.com/ReliefApplications/oort-frontend/commit/fc7bd11951902f905aeb9574ff4330cfb8307733))
* pagination for notifications ([a13296c](https://github.com/ReliefApplications/oort-frontend/commit/a13296cf27dc9590b479af28a36f99723604d91e))
* popover to get application list ([74dc9f0](https://github.com/ReliefApplications/oort-frontend/commit/74dc9f0262382945e56ad329349a894525f3e485))
* preview email [#27626](https://github.com/ReliefApplications/oort-frontend/issues/27626) ([5c50267](https://github.com/ReliefApplications/oort-frontend/commit/5c502677cf839d8243ff71bc1ae12dca617a1367))
* pull job at the main backoffice level [#10628](https://github.com/ReliefApplications/oort-frontend/issues/10628) ([c985b2f](https://github.com/ReliefApplications/oort-frontend/commit/c985b2f0323afe3bdc45aa384acf060b6b09e61c))
* refactor preprocessing into a new service [#11731](https://github.com/ReliefApplications/oort-frontend/issues/11731) ([a547869](https://github.com/ReliefApplications/oort-frontend/commit/a547869d9b12dc894445b60f723df9c89997d6fb))
* remove consumerID parameter for apiConfig [#16099](https://github.com/ReliefApplications/oort-frontend/issues/16099) ([402757d](https://github.com/ReliefApplications/oort-frontend/commit/402757d2024811df42950ec6ce4c24af0d734e19))
* restructure i18n ([bf5c53f](https://github.com/ReliefApplications/oort-frontend/commit/bf5c53f05425456a98f983bb935f24746fbc2459))
* select all for emails [#16603](https://github.com/ReliefApplications/oort-frontend/issues/16603) ([765b569](https://github.com/ReliefApplications/oort-frontend/commit/765b569058e0d6cf791e5584a8f04e8080361524))
* select all with all actions except prefill [#16603](https://github.com/ReliefApplications/oort-frontend/issues/16603) ([53f9dfd](https://github.com/ReliefApplications/oort-frontend/commit/53f9dfd9c371fdcd2735f4014fe81ffc97c7453f))
* **semantic-release:** add semantic-release and improve workflows ([1ddc0e9](https://github.com/ReliefApplications/oort-frontend/commit/1ddc0e90587f647e95c06c5ac81d89d0bf25358a))
* set font-family of tinymce editor as important ([bb7e217](https://github.com/ReliefApplications/oort-frontend/commit/bb7e21727c191b4c28558e8df2da006b79a944a8))
* set initial order for grid available field list ([e3815d7](https://github.com/ReliefApplications/oort-frontend/commit/e3815d731bf527cf1b26fe25eb2f922f38d551f7))
* single deploy file ([b99f0fd](https://github.com/ReliefApplications/oort-frontend/commit/b99f0fd72ae7decd98d9fdc6a6cc564a18e61744))
* style grid cells [#11740](https://github.com/ReliefApplications/oort-frontend/issues/11740) ([fdc3ab8](https://github.com/ReliefApplications/oort-frontend/commit/fdc3ab8deb606764806500e1edca20c6a8d35628))
* support resources fields and disable _ids [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([50a51e4](https://github.com/ReliefApplications/oort-frontend/commit/50a51e4e83d51af288a20bf20505402e64b58d04))
* today() can now be used in modifications of automodify action [#11696](https://github.com/ReliefApplications/oort-frontend/issues/11696) ([828da3e](https://github.com/ReliefApplications/oort-frontend/commit/828da3ecb785eb1bc9734a911722f1e530549eb6))
* update angular version to 13 ([7327a87](https://github.com/ReliefApplications/oort-frontend/commit/7327a8797a0cde1678c852e4b06ca4e173042774))
* update msal package and fix related bugs Now refreshs properly after token expiracy. Now sends token request only once and use cached one then. [#10687](https://github.com/ReliefApplications/oort-frontend/issues/10687) ([ea8a8c6](https://github.com/ReliefApplications/oort-frontend/commit/ea8a8c627423d19438d01ac063c8fc8836b04a28))
* use categories in dropdowns for subFields [#24829](https://github.com/ReliefApplications/oort-frontend/issues/24829) ([8332a4a](https://github.com/ReliefApplications/oort-frontend/commit/8332a4a7d24e64209b4045a08679c5394c4a7e12))
* use tinymce for text widget edition ([4a93ae7](https://github.com/ReliefApplications/oort-frontend/commit/4a93ae77a2b3fbcfaeb5296fa57a0b3bfa659296))
* use title when no label for fields in mails ([15fabe3](https://github.com/ReliefApplications/oort-frontend/commit/15fabe311582d79714e5861519e714e54be93872))
* users export [#11391](https://github.com/ReliefApplications/oort-frontend/issues/11391) ([10e23f4](https://github.com/ReliefApplications/oort-frontend/commit/10e23f496ba68cbccb9d773f3e90a9b08c4b685a))
* working comment for some questions [#11322](https://github.com/ReliefApplications/oort-frontend/issues/11322) ([d0e256c](https://github.com/ReliefApplications/oort-frontend/commit/d0e256c61de81cfbbb0d70f5a832a618b0f163eb))


### Reverts

* Revert "Added queries count #24067" This reverts commit 38d5c900b2055780e86750ad4ad9e84026960bd8. #24067 ([76e20f2](https://github.com/ReliefApplications/oort-frontend/commit/76e20f2107d1923022dd6c513da6ee0b8e2a5afb)), closes [#24067](https://github.com/ReliefApplications/oort-frontend/issues/24067) [#24067](https://github.com/ReliefApplications/oort-frontend/issues/24067)
* Revert "add metaquery in tab-filter to add choices as a default filter" This reverts commit 6cb4a70c4451a49d3841fa64050e30ba57792dfb. # Veuillez saisir le message de validation pour vos modifications. Les lignes # commençant par '#' seront ignorées, et un message vide abandonne la validation. # # Sur la branche dev # Votre branche est en avance sur 'origin/dev' de 1 commit. # (utilisez "git push" pour publier vos commits locaux) # # Modifications qui seront validées : # modifié : projects/safe/src/lib/components/query-builder/query-builder.component.html # modifié : projects/safe/src/lib/components/query-builder/query-builder.component.ts # modifié : projects/safe/src/lib/components/query-builder/tab-filter/tab-filter.component.html # modifié : projects/safe/src/lib/components/query-builder/tab-filter/tab-filter.component.ts # modifié : projects/safe/src/lib/components/widgets/grid-settings/grid-settings.component.html # modifié : projects/safe/src/lib/services/email.service.ts # modifié : projects/safe/src/lib/services/query-builder.service.ts # ([9f5df57](https://github.com/ReliefApplications/oort-frontend/commit/9f5df57322373a4141a7671411af1ec245e87777))
* Revert "add users custom question, changes on users query and grid to fit new question" This reverts commit 1b89ccfc2e2e035affeef83a617a952a1830effe. # Veuillez saisir le message de validation pour vos modifications. Les lignes # commençant par '#' seront ignorées, et un message vide abandonne la validation. # # Sur la branche dev # Votre branche est en avance sur 'origin/dev' de 2 commits. # (utilisez "git push" pour publier vos commits locaux) # # Modifications qui seront validées : # modifié : projects/safe/src/lib/components/resource-grid/resource-grid.component.ts # modifié : projects/safe/src/lib/components/widgets/grid/grid.component.html # modifié : projects/safe/src/lib/components/widgets/grid/grid.component.ts # modifié : projects/safe/src/lib/graphql/queries.ts # modifié : projects/safe/src/lib/survey/components/users.ts # ([4fb19ec](https://github.com/ReliefApplications/oort-frontend/commit/4fb19ec5deb00105982a37aba821c9490c082931))
* Revert "chore(release): 0.1.14" ([4e73418](https://github.com/ReliefApplications/oort-frontend/commit/4e73418eb73b635f3d68b238da9733a311048c7a))
* Revert "clear some parts of code" ([e3fa315](https://github.com/ReliefApplications/oort-frontend/commit/e3fa3157f54a0032901f09cdd4d7c3a397770873))
* Revert "fix filters in resources" ([cd1f6e6](https://github.com/ReliefApplications/oort-frontend/commit/cd1f6e69b3e30c800763b0dcb6b36777b6906a20))
* Revert "[SAFE-301] remove package changes" ([3eba669](https://github.com/ReliefApplications/oort-frontend/commit/3eba669e9fd560139cb348c24a9f099970373831))
* Revert "goToNextStep behaviour changed for the last step on front-office" ([33ece96](https://github.com/ReliefApplications/oort-frontend/commit/33ece96132d9bb0da9b35c4ccdd016adc79c1aad))
