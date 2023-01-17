# [1.4.0-beta.7](https://github.com/ReliefApplications/oort-frontend/compare/v1.4.0-beta.6...v1.4.0-beta.7) (2023-01-17)


### Bug Fixes

* cached choices by url would never expire ([fc8e618](https://github.com/ReliefApplications/oort-frontend/commit/fc8e618b524a9b6e6394116c8cc49ef0011dcc79)), closes [1.3.x/AB#53527](https://github.com/1.3.x/AB/issues/53527)
* front-office routing break due to incorrect safe import ([ce15ea6](https://github.com/ReliefApplications/oort-frontend/commit/ce15ea6436e45ea50711e68537884f53f0862841))
* storybook build not working ([6471ddd](https://github.com/ReliefApplications/oort-frontend/commit/6471ddd362140aa468650d4729b5cfb2a36ee63d))
* widget choice could prevent items below to be clicked ([f70b1a6](https://github.com/ReliefApplications/oort-frontend/commit/f70b1a675ae480047f99bb0cd867414cb05c3367))

# [1.4.0-beta.6](https://github.com/ReliefApplications/oort-frontend/compare/v1.4.0-beta.5...v1.4.0-beta.6) (2023-01-10)


### Bug Fixes

* aggregation pagination not working ([2911132](https://github.com/ReliefApplications/oort-frontend/commit/29111329311b05b8cec06e13d584dec75901db64))
* errors would not appear when editing resource permissions ([b5cf05d](https://github.com/ReliefApplications/oort-frontend/commit/b5cf05db974cde49d012855f266b235a9d2f9c1b))
* history would not reload if record was updated ([162646d](https://github.com/ReliefApplications/oort-frontend/commit/162646d45edc4dc51e21fd51dc4a19570c58745c))
* metadata error would appear when creating a grid widget ([6dce7fe](https://github.com/ReliefApplications/oort-frontend/commit/6dce7fe71f10f414c27a471ab2f95b638eb3de85))
* requests with metadata could cause system failure ([db38acc](https://github.com/ReliefApplications/oort-frontend/commit/db38acca903cadf4e979de6b9a53dcc08e6c7d2a)), closes [1.3.x/AB#53528](https://github.com/1.3.x/AB/issues/53528)
* widget choice container would not be clickable when collapsed ([559866b](https://github.com/ReliefApplications/oort-frontend/commit/559866b2d6ac29eefcb977454587345b4bda5f60))

## [1.3.4](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.3...v1.3.4) (2023-01-10)

### Bug Fixes

* aggregation pagination not working ([2911132](https://github.com/ReliefApplications/oort-frontend/commit/29111329311b05b8cec06e13d584dec75901db64))
* errors would not appear when editing resource permissions ([b5cf05d](https://github.com/ReliefApplications/oort-frontend/commit/b5cf05db974cde49d012855f266b235a9d2f9c1b))
* history would not reload if record was updated ([162646d](https://github.com/ReliefApplications/oort-frontend/commit/162646d45edc4dc51e21fd51dc4a19570c58745c))
* metadata error would appear when creating a grid widget ([6dce7fe](https://github.com/ReliefApplications/oort-frontend/commit/6dce7fe71f10f414c27a471ab2f95b638eb3de85))
* requests with metadata could cause system failure ([db38acc](https://github.com/ReliefApplications/oort-frontend/commit/db38acca903cadf4e979de6b9a53dcc08e6c7d2a)), closes [1.3.x/AB#53528](https://github.com/1.3.x/AB/issues/53528)
* widget choice container would not be clickable when collapsed ([559866b](https://github.com/ReliefApplications/oort-frontend/commit/559866b2d6ac29eefcb977454587345b4bda5f60))

## [1.4.0-beta.5](https://github.com/ReliefApplications/oort-frontend/compare/v1.4.0-beta.4...v1.4.0-beta.5) (2023-01-04)

### Bug Fixes

* interaction with query builder would sometimes fail ([a7a3d14](https://github.com/ReliefApplications/oort-frontend/commit/a7a3d145154f899bde9b9becf6fd000f70dd8fec))
* map settings would not display some resources by default, due to pagination ([388e034](https://github.com/ReliefApplications/oort-frontend/commit/388e0347f7762eb67bc2ace7dea5ddcf839f8704))
* remove irrelevant elements from graphql-select list of options ([fdf5df9](https://github.com/ReliefApplications/oort-frontend/commit/fdf5df9fe1839860d31c3d3ad3ac0e7b4efeaf90))
* setting resource in map settings could break some other settings ([c370a51](https://github.com/ReliefApplications/oort-frontend/commit/c370a51feee112df8d01f85c593ee8e047a3b844))
* user could see 'add' button in grids, even if not authorized ([7d2d95f](https://github.com/ReliefApplications/oort-frontend/commit/7d2d95f4c13a36390856af6bd08d0d05be56e2c5))
* users filter would always appear ([6a0d5b3](https://github.com/ReliefApplications/oort-frontend/commit/6a0d5b380cffcdc4aebdbf4d17d7d0b131f4010a))

## [1.3.3](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.2...v1.3.3) (2023-01-03)


### Bug Fixes

* interaction with query builder would sometimes fail ([a7a3d14](https://github.com/ReliefApplications/oort-frontend/commit/a7a3d145154f899bde9b9becf6fd000f70dd8fec))
* map settings would not display some resources by default, due to pagination ([388e034](https://github.com/ReliefApplications/oort-frontend/commit/388e0347f7762eb67bc2ace7dea5ddcf839f8704))
* setting resource in map settings could break some other settings ([c370a51](https://github.com/ReliefApplications/oort-frontend/commit/c370a51feee112df8d01f85c593ee8e047a3b844))
* user could see 'add' button in grids, even if not authorized ([7d2d95f](https://github.com/ReliefApplications/oort-frontend/commit/7d2d95f4c13a36390856af6bd08d0d05be56e2c5))
* users filter would always appear ([6a0d5b3](https://github.com/ReliefApplications/oort-frontend/commit/6a0d5b380cffcdc4aebdbf4d17d7d0b131f4010a))

# [1.4.0-beta.4](https://github.com/ReliefApplications/oort-frontend/compare/v1.4.0-beta.3...v1.4.0-beta.4) (2022-12-20)


### Bug Fixes

* 'not extensible object' error ([6989e44](https://github.com/ReliefApplications/oort-frontend/commit/6989e44d95a6f856c4dd4638c9b1a7ac8301cb9b))
* allow only selected fields as coords ([27e1405](https://github.com/ReliefApplications/oort-frontend/commit/27e1405b5b5b42251d8f40b97e4cebe35599ea96))
* could edit user attributes if not local config ([2399443](https://github.com/ReliefApplications/oort-frontend/commit/2399443652e36847e7c6515834599f4d3c48e259))
* hide icon overflow ([bc0c507](https://github.com/ReliefApplications/oort-frontend/commit/bc0c50712ef8990cd994d619aaf186969e751728))
* legend overflow ([70ea13a](https://github.com/ReliefApplications/oort-frontend/commit/70ea13ad1dcf865ec4b2988f3b137d53d771ecb4))
* replace dataset selection on map settings ([e7c4c64](https://github.com/ReliefApplications/oort-frontend/commit/e7c4c642e177e65d2a749da335082d2650ce9a1c))
* selected fields search would not appear with full width in query builder ([58b0150](https://github.com/ReliefApplications/oort-frontend/commit/58b0150bf190d90ac3f48735b658fc925255640a))
* typos ([400197b](https://github.com/ReliefApplications/oort-frontend/commit/400197bf05cb0e90808840a0ff9ca772fdc2d0c5))

# [1.4.0-beta.3](https://github.com/ReliefApplications/oort-frontend/compare/v1.4.0-beta.2...v1.4.0-beta.3) (2022-12-08)

### Bug Fixes

* adding list and template from settings ([991765c](https://github.com/ReliefApplications/oort-frontend/commit/991765cf87c6b6727c9fe7ba4707609afd18be34))
* **build:** commonjs creating warning when building ([dda7ad3](https://github.com/ReliefApplications/oort-frontend/commit/dda7ad354f93ab66fd8a8313e24d5e7e48e87399))
* hide labels on small devices ([39d6b54](https://github.com/ReliefApplications/oort-frontend/commit/39d6b546c029bc1bad3bd1a8120e5be379382249))
* using links in profile menu ([564e40a](https://github.com/ReliefApplications/oort-frontend/commit/564e40a76e017cc23154162d914d6ad959dbd7bb))
* using links instead of buttons on admin nav ([a47b97e](https://github.com/ReliefApplications/oort-frontend/commit/a47b97e3823064af938492c29553db3135d828db))

# [1.4.0-beta.2](https://github.com/ReliefApplications/oort-frontend/compare/v1.4.0-beta.1...v1.4.0-beta.2) (2022-12-05)


### Bug Fixes

* remove block input from unedited buttons ([2b340f1](https://github.com/ReliefApplications/oort-frontend/commit/2b340f1a099db70f232c14fc62a00fb54d062323))


# [1.4.0-beta.1](https://github.com/ReliefApplications/oort-frontend/compare/v1.3.0...v1.4.0-beta.1) (2022-12-01)


### Bug Fixes

* added validator to derived field name ([34fc348](https://github.com/ReliefApplications/oort-frontend/commit/34fc348452037af781da87a1fe5d48e9e5b49f23))
* filter for autocomplete on edit field ([166904b](https://github.com/ReliefApplications/oort-frontend/commit/166904b24a97adce93d4ebe87a992a9a72795aee))
* filtering properly for autocompletion ([13edd53](https://github.com/ReliefApplications/oort-frontend/commit/13edd532ce0b3c59399c002f3e237dd87f2be721))
* removed calc fields from autocomplete ([f618f39](https://github.com/ReliefApplications/oort-frontend/commit/f618f399ef20a7b4252d60a02f5bae898616446d))
* resource query on chart settings ([e07353e](https://github.com/ReliefApplications/oort-frontend/commit/e07353e96c145eed2a9f855318f9693bfdd4ed89))
* setting queryname from resource ([9d11809](https://github.com/ReliefApplications/oort-frontend/commit/9d11809f51a709bb6a0eb43d43b0ffa3da03b9ce))
* When reloading any tab of resource page, the tab appear as selected ([4fa88e9](https://github.com/ReliefApplications/oort-frontend/commit/4fa88e96c5f7ea667a1bc13a39b4dd3b308dfe96))


### Features

* added derived fields tab on resources ([32920b4](https://github.com/ReliefApplications/oort-frontend/commit/32920b42aaa16a95e6bba5650237d609a3326798))
* added info keys ([aaaaa60](https://github.com/ReliefApplications/oort-frontend/commit/aaaaa60bef5719e2ae87dcf5d803e5a02e5106eb))
* autocomplete for definition editor ([c8534df](https://github.com/ReliefApplications/oort-frontend/commit/c8534dfc2d23668400c0f4f6db3450967b116eb7))
* derived fields tab ([77972bc](https://github.com/ReliefApplications/oort-frontend/commit/77972bcd84eac98d8b54fcc6c717aaab1228d6e8))
* layout selection on summary cards settings ([95c580d](https://github.com/ReliefApplications/oort-frontend/commit/95c580d75de3d2cdc0bf3a3fc6fcae814cda44ed))
* now supporting dynamic cards w/ aggregation ([fd27429](https://github.com/ReliefApplications/oort-frontend/commit/fd2742985008641521f67e7a63578971ffd6464c))
* now supporting static cards w/ aggregation ([119b842](https://github.com/ReliefApplications/oort-frontend/commit/119b842b6323b3445f586d7ad0ee3aa498c5bcec))
* removed field validator for grouping ([a963f46](https://github.com/ReliefApplications/oort-frontend/commit/a963f46a35d96e86a098a366f20162092b98f8ba))
* replace summary card icon by the new one and change its color value in widget_types ([b0fa058](https://github.com/ReliefApplications/oort-frontend/commit/b0fa058c447a149f2b4b0f722a5bbc11ddec23c1))
* selection of aggregation for summary cards ([fb6c59c](https://github.com/ReliefApplications/oort-frontend/commit/fb6c59c8fb7871a6147597183e02168330cc14ec))
* start summary card component [#34839](https://github.com/ReliefApplications/oort-frontend/issues/34839) ([0c4e8fd](https://github.com/ReliefApplications/oort-frontend/commit/0c4e8fd6ff18feba261759e6ac4d60f2f73da9f9))


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
