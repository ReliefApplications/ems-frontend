# [2.2.0-beta.6](https://github.com/ReliefApplications/oort-frontend/compare/v2.2.0-beta.5...v2.2.0-beta.6) (2023-10-30)


### Bug Fixes

* incorrect style of aggregation grids & some settings could be saved even if unused ([#1984](https://github.com/ReliefApplications/oort-frontend/issues/1984)) ([210b8e7](https://github.com/ReliefApplications/oort-frontend/commit/210b8e774d3bce21ae0d20f93cac1e1614f0af1c))
* notification not initializing recipientsType ([#2006](https://github.com/ReliefApplications/oort-frontend/issues/2006)) ([ea29578](https://github.com/ReliefApplications/oort-frontend/commit/ea29578c824156b6c9a61719dbf6fdbc0478c5d0))


### Features

* added filter record option when context datasource is coming from a resource ([#2022](https://github.com/ReliefApplications/oort-frontend/issues/2022)) ([e750a47](https://github.com/ReliefApplications/oort-frontend/commit/e750a4776f36d6e3c8e4103d4ef5aaf5742895f4))
* allow to activate / deactivate edition in back-office, to preview changes ([a54c4a5](https://github.com/ReliefApplications/oort-frontend/commit/a54c4a5cd805e66c4052a4c480af41bbb66a03dc))
* last update map control ([#2002](https://github.com/ReliefApplications/oort-frontend/issues/2002)) ([2c92dd6](https://github.com/ReliefApplications/oort-frontend/commit/2c92dd6dd8b90da71e4b49116a4a0bddc29bb54d))
* Show/Hide widget header ([#2005](https://github.com/ReliefApplications/oort-frontend/issues/2005)) ([20a964d](https://github.com/ReliefApplications/oort-frontend/commit/20a964d937b306161fd1af579498dd52df09d5f7))


### Performance Improvements

* Add storybook for front-office & back-office ([#1990](https://github.com/ReliefApplications/oort-frontend/issues/1990)) ([ee42d8d](https://github.com/ReliefApplications/oort-frontend/commit/ee42d8d613ccdb40093f971a2904760ece5dd844)), closes [#77550](https://github.com/ReliefApplications/oort-frontend/issues/77550) [#77550](https://github.com/ReliefApplications/oort-frontend/issues/77550)

# [2.2.0-beta.5](https://github.com/ReliefApplications/oort-frontend/compare/v2.2.0-beta.4...v2.2.0-beta.5) (2023-10-20)


### Bug Fixes

* api configuration edition would sometimes not display correct status for save button ([eac0bd6](https://github.com/ReliefApplications/oort-frontend/commit/eac0bd6f71acb651b12a40565e3e81646fe106df))
* exiting form builder could create multiple modals if some changes were not saved ([0cad118](https://github.com/ReliefApplications/oort-frontend/commit/0cad1181de097e1ff443fd9ed43907b561801071))
* icon display when variant and category class are empty ([#1975](https://github.com/ReliefApplications/oort-frontend/issues/1975)) ([b05b722](https://github.com/ReliefApplications/oort-frontend/commit/b05b722316deae9f6124f07078e50ef2947e77ef))
* incorrect drag / drop for steps in aggregation pipeline ([#1978](https://github.com/ReliefApplications/oort-frontend/issues/1978)) ([8c47de3](https://github.com/ReliefApplications/oort-frontend/commit/8c47de36e9da7622fc5db8aae37a93bf680c641c))
* incorrect overflow in grid widget settings action view ([e3d9118](https://github.com/ReliefApplications/oort-frontend/commit/e3d911870f3f664890ef5a885d24e1cc062370bf))
* Incorrect UI for workflow access in application role editor ([#1973](https://github.com/ReliefApplications/oort-frontend/issues/1973)) ([3640be1](https://github.com/ReliefApplications/oort-frontend/commit/3640be100d27346716ae60be71d89d2ff455e9df))
* infinite re renders of dropdown in filter builder ([#1927](https://github.com/ReliefApplications/oort-frontend/issues/1927)) ([71e1bcd](https://github.com/ReliefApplications/oort-frontend/commit/71e1bcd30c9fa77dc27decc3b850380c0122f1d4))
* maps in tab widget would not correctly initialize + prevent all tabs to load at same tiem ([33c4745](https://github.com/ReliefApplications/oort-frontend/commit/33c47453d6b220015e2da730bab9c6c3b77fec21))
* tabs widget would be badly displayed due to changes on dashboard & widgets ([cf3f1ca](https://github.com/ReliefApplications/oort-frontend/commit/cf3f1cac99c40cbcf4cb40843692ccfee0a0e062))


### Features

* allow to define grid actions in summary card settings ([#1888](https://github.com/ReliefApplications/oort-frontend/issues/1888)) ([1f90171](https://github.com/ReliefApplications/oort-frontend/commit/1f901714a13ef147d50c96794efd6ae2b264f8ee))

# [2.2.0-beta.4](https://github.com/ReliefApplications/oort-frontend/compare/v2.2.0-beta.3...v2.2.0-beta.4) (2023-10-18)


### Bug Fixes

* incorrect indicator for pagination of records-tab in resource ([#1960](https://github.com/ReliefApplications/oort-frontend/issues/1960)) ([862c899](https://github.com/ReliefApplications/oort-frontend/commit/862c899e88a7de9f7e815b533480935904860227))
* ui lib storybook could not compile due to recent changes ([bedbdc7](https://github.com/ReliefApplications/oort-frontend/commit/bedbdc716987ddb772c709450b25b96d5e7f286e))
* visibility icon would not appear for hidden pages ([#1967](https://github.com/ReliefApplications/oort-frontend/issues/1967)) ([00e07d4](https://github.com/ReliefApplications/oort-frontend/commit/00e07d4de77fa687afeba7624a220dd8bcb70439))

# [2.2.0-beta.3](https://github.com/ReliefApplications/oort-frontend/compare/v2.2.0-beta.2...v2.2.0-beta.3) (2023-10-16)


### Bug Fixes

* aggregation not displaying in grid configurations after changes ([#1935](https://github.com/ReliefApplications/oort-frontend/issues/1935)) ([314d66e](https://github.com/ReliefApplications/oort-frontend/commit/314d66e1d30c7faa9fae6c695bc4713ae4d42aa0))
* charts would load multiple times whenever dashboard would init ([#1933](https://github.com/ReliefApplications/oort-frontend/issues/1933)) ([bb42409](https://github.com/ReliefApplications/oort-frontend/commit/bb424096749f7bba29f970b450df7a2d7729dcad)), closes [AB#76508](https://github.com/AB/issues/76508) [AB#76508](https://github.com/AB/issues/76508)
* choices by url questions would not work in some cases ([8619755](https://github.com/ReliefApplications/oort-frontend/commit/8619755278228501da6abb2110a63cdbc4cbef47))
* could not build front-office due to missing import ([eb5bedb](https://github.com/ReliefApplications/oort-frontend/commit/eb5bedbf488bed5d7430918eead1b930a47e900d))
* could not upload new records ([#1956](https://github.com/ReliefApplications/oort-frontend/issues/1956)) ([ba48f4e](https://github.com/ReliefApplications/oort-frontend/commit/ba48f4e08fcf58a6c7dd9122f89e34707214d5e7))
* prevent metadata error to appear while building aggregation grid ([20470f9](https://github.com/ReliefApplications/oort-frontend/commit/20470f97cb299cbcd88cab8b9e01c0b8aa169b3d))
* **query builder:** sometimes no fields are displayed due to incorrect events ordering ([#1961](https://github.com/ReliefApplications/oort-frontend/issues/1961)) ([f0fee3e](https://github.com/ReliefApplications/oort-frontend/commit/f0fee3e8393a73d39c079a530e97be7bd388c9eb))
* remove custom logic about choicesbyurl that could break questions ([e7b6390](https://github.com/ReliefApplications/oort-frontend/commit/e7b639024c79b1025ae24b66821c911005633631))
* some notifications would not update their content  ([#1947](https://github.com/ReliefApplications/oort-frontend/issues/1947)) ([a90001f](https://github.com/ReliefApplications/oort-frontend/commit/a90001f7307034cb747e01ba66a0f2dc906d856d))
* some reference data could not load in forms ([4dee883](https://github.com/ReliefApplications/oort-frontend/commit/4dee8839f2a66b3b65f260d58664cb30d59a0389))
* storybook not building for shared library ([3d62401](https://github.com/ReliefApplications/oort-frontend/commit/3d6240152527710b7dd561a1f1286a465bb6d34a))
* survey localization not working after update. ([#1936](https://github.com/ReliefApplications/oort-frontend/issues/1936)) ([0e2e742](https://github.com/ReliefApplications/oort-frontend/commit/0e2e7428f367d89ef92ec656b08afb5a0f4ed813))
* tooltip in form builder could get duplicated ([2d49c1e](https://github.com/ReliefApplications/oort-frontend/commit/2d49c1e7f8e8f6da84a69ca0b88deec95876e8ef))
* unfriendly api configuration edition ([#1937](https://github.com/ReliefApplications/oort-frontend/issues/1937)) ([ee341e9](https://github.com/ReliefApplications/oort-frontend/commit/ee341e9cec5c90bf9ca27f90cd3ad629d357db2d))


### Features

* allow admins to set an action to navigate to another page of the app ([#1897](https://github.com/ReliefApplications/oort-frontend/issues/1897)) ([e1b68c0](https://github.com/ReliefApplications/oort-frontend/commit/e1b68c0235ccb414fa5826245cff189f3e5f42a2))

# [2.2.0-beta.2](https://github.com/ReliefApplications/oort-frontend/compare/v2.2.0-beta.1...v2.2.0-beta.2) (2023-10-04)


### Bug Fixes

* access to the platform could fail due to login not completed ([#1854](https://github.com/ReliefApplications/oort-frontend/issues/1854)) ([10ba120](https://github.com/ReliefApplications/oort-frontend/commit/10ba1204a6a0d12728af039fd8fd85d60f4d5628))
* aggregation filters only appling after saving twice ([#1829](https://github.com/ReliefApplications/oort-frontend/issues/1829)) ([3dd8bd4](https://github.com/ReliefApplications/oort-frontend/commit/3dd8bd409a117bfb51e46d7d4d2dee8145a898f1))
* build not working ([3ed5f5b](https://github.com/ReliefApplications/oort-frontend/commit/3ed5f5b1ca16e41678412609caba2cd9973abf41))
* context filter not loaded in front-office ([28d39fa](https://github.com/ReliefApplications/oort-frontend/commit/28d39fa44a4242f9ba0fbf779f0d57f29965dab5))
* custom form variables not reused when creating multiple records from same view ([#1838](https://github.com/ReliefApplications/oort-frontend/issues/1838)) ([8fb2564](https://github.com/ReliefApplications/oort-frontend/commit/8fb25647aa7ee0e75765c7253255685c994ae7ae))
* dashboard filter not working in summary cards dashboard ([#1908](https://github.com/ReliefApplications/oort-frontend/issues/1908)) ([b0f3da0](https://github.com/ReliefApplications/oort-frontend/commit/b0f3da052d1d5b8e7d6c0c10468acc14e17354f1))
* date could not be cleared if opening a record with value in field ([2c0d047](https://github.com/ReliefApplications/oort-frontend/commit/2c0d0470f3889dbadf84d69c7aa529ef5d19bd05))
* delete min-width of question in order to match current sidebar width ([#1912](https://github.com/ReliefApplications/oort-frontend/issues/1912)) ([697eb83](https://github.com/ReliefApplications/oort-frontend/commit/697eb8320a5c3cb2b0f377f19efe62cb8f3f060a))
* few issues with layer styling ([baf115b](https://github.com/ReliefApplications/oort-frontend/commit/baf115b9ee907770b26334afd32602979af8d1a4))
* infinite redirection when trying to open a contextual page ([#1903](https://github.com/ReliefApplications/oort-frontend/issues/1903)) ([3dbec90](https://github.com/ReliefApplications/oort-frontend/commit/3dbec908991c2fde0dd70e84a9e7a45fd03af954))
* layers get duplicated when changing dashboard filter value ([#1876](https://github.com/ReliefApplications/oort-frontend/issues/1876)) ([5decf06](https://github.com/ReliefApplications/oort-frontend/commit/5decf068efcf7a2d438eb8f4976dfbe60a91cd36))
* menu items text and buttons overlapping in firefox ([#1834](https://github.com/ReliefApplications/oort-frontend/issues/1834)) ([47532f9](https://github.com/ReliefApplications/oort-frontend/commit/47532f9f42984134b4ae96f7bade0bbdf58ba1cf))
* only get visible fields when exporting grid data [#35940](https://github.com/ReliefApplications/oort-frontend/issues/35940) ([#1807](https://github.com/ReliefApplications/oort-frontend/issues/1807)) ([ce008da](https://github.com/ReliefApplications/oort-frontend/commit/ce008daba3cca2216bd3c40fd7a8ae6d2a68f358))
* remove expand option for map widgets ([#1877](https://github.com/ReliefApplications/oort-frontend/issues/1877)) ([bfd1b2c](https://github.com/ReliefApplications/oort-frontend/commit/bfd1b2c049fbd3075660e65fadf319fa367b227f))
* remove format filter method in grid, that could cause some date issues ([df3ee09](https://github.com/ReliefApplications/oort-frontend/commit/df3ee094c637b02c001eca81fe6ad6436ce0bd6f))
* selected records in text widget would not appear when opening settings ([#1901](https://github.com/ReliefApplications/oort-frontend/issues/1901)) ([93a9af6](https://github.com/ReliefApplications/oort-frontend/commit/93a9af668d2adb3681badc1bc96307fb112fc0ee))
* tagbox in surveyjs would not work in some cases ([f6cba5a](https://github.com/ReliefApplications/oort-frontend/commit/f6cba5ad548b6a377951704a3b99271bb2b903d7))
* toggle would not correctly indicate touch events ([43cba1d](https://github.com/ReliefApplications/oort-frontend/commit/43cba1d4c99b6ee828573c2d5efea5208c82310d))
* unable to invite new users, UI was broken ([#1902](https://github.com/ReliefApplications/oort-frontend/issues/1902)) ([a0a5eb6](https://github.com/ReliefApplications/oort-frontend/commit/a0a5eb6cdb61582c257cba9d4366a1143b31310c))
* use flex-end and default margin false to the date field in the tab-filter component in order to align the element to the rest of the y axis ([#1809](https://github.com/ReliefApplications/oort-frontend/issues/1809)) ([d8b10c5](https://github.com/ReliefApplications/oort-frontend/commit/d8b10c57893e78f577972b1fd311a2ab94c99d69))
* web widgets would not build ([#1886](https://github.com/ReliefApplications/oort-frontend/issues/1886)) ([73c1bc4](https://github.com/ReliefApplications/oort-frontend/commit/73c1bc4a584718f3b5d78f6512f82796dd41c25c))


### Features

* ability to archive and restore application pages ([#1505](https://github.com/ReliefApplications/oort-frontend/issues/1505)) ([8c38ccf](https://github.com/ReliefApplications/oort-frontend/commit/8c38ccf42c115dd943efd20110d0b2c9bcbb7e5f))
* add more options to cluster layers ([#1906](https://github.com/ReliefApplications/oort-frontend/issues/1906)) ([c5e2d14](https://github.com/ReliefApplications/oort-frontend/commit/c5e2d14418a4a5c9d779280324a05b4750ac463b))
* add tooltip when widget grid text overflows ([44850ed](https://github.com/ReliefApplications/oort-frontend/commit/44850ed0981eba04fa28c07d994323deec082146))
* automatically open widget settings on addition ([#1843](https://github.com/ReliefApplications/oort-frontend/issues/1843)) ([6ab4174](https://github.com/ReliefApplications/oort-frontend/commit/6ab41740e9f15d8d83b12d72f7cbd30cab6987b0)), closes [feat/AB#74663](https://github.com/feat/AB/issues/74663)
* can now edit page / step 's icon ([5a58854](https://github.com/ReliefApplications/oort-frontend/commit/5a58854f6b1bc5ada65b07f621b172b0257b0b54))
* can now query historical data ([#1873](https://github.com/ReliefApplications/oort-frontend/issues/1873)) ([7627df4](https://github.com/ReliefApplications/oort-frontend/commit/7627df4f256d8838902e7c39b326650a3768fec5))
* can now use infinite aggregations ([4379df2](https://github.com/ReliefApplications/oort-frontend/commit/4379df2025636c97c00037e14b938c55e49c85a1))
* display matrix questions in grid / text / summary card widgets ([#1350](https://github.com/ReliefApplications/oort-frontend/issues/1350)) ([25dc2df](https://github.com/ReliefApplications/oort-frontend/commit/25dc2df6459846a9b215b12da940ba9050859355))
* inline edition of reference data ([4dfa2b3](https://github.com/ReliefApplications/oort-frontend/commit/4dfa2b30be14dd5318cd17fba34dba338df055f6))


### Performance Improvements

* **bundle:** remove useless kendo styles imports ([#1882](https://github.com/ReliefApplications/oort-frontend/issues/1882)) ([70b74fc](https://github.com/ReliefApplications/oort-frontend/commit/70b74fca16d840b5f4d187215bfb10cb08236c28))
* update apollo versions ([#1771](https://github.com/ReliefApplications/oort-frontend/issues/1771)) ([#1810](https://github.com/ReliefApplications/oort-frontend/issues/1810)) ([30180a1](https://github.com/ReliefApplications/oort-frontend/commit/30180a1013c8f9bdac58d9b107b570ca48eec9ba))
* update surveyjs package, to use Angular version, and drop knockout ([#1763](https://github.com/ReliefApplications/oort-frontend/issues/1763)) ([73f29f8](https://github.com/ReliefApplications/oort-frontend/commit/73f29f8ef862416cd69358adbe88e2a42ec06e2f))

# [2.2.0-beta.1](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.1...v2.2.0-beta.1) (2023-09-14)


### Bug Fixes

* accordion could not expand ([02b63da](https://github.com/ReliefApplications/oort-frontend/commit/02b63da126bcb3d19059b0dd56e5e8b9409a7cee))
* app preview would never load content ([30cb581](https://github.com/ReliefApplications/oort-frontend/commit/30cb5812ab02ac38cf91fd72c92cf0039f2ce5f9))
* application style would not be applied before load ([4e33254](https://github.com/ReliefApplications/oort-frontend/commit/4e33254443ca5a0f61da127076035ec90d5aa48a))
* arcgis layers now appear in layer control ([6d08d72](https://github.com/ReliefApplications/oort-frontend/commit/6d08d726f400cb631b5e0270ed2e973771b17f5f))
* arcgis webmap select would not take search value when doing pagination ([711f0a0](https://github.com/ReliefApplications/oort-frontend/commit/711f0a08fe5fb7c57610f6501880451201cfdb21))
* arcgis webmap would not use zoom / default location configured in arcgis ([4245061](https://github.com/ReliefApplications/oort-frontend/commit/4245061e0f288bb1ff8108a8ebf824087a4c5d39))
* assets not working in back-office ([4fa9245](https://github.com/ReliefApplications/oort-frontend/commit/4fa924509fb506101b5aacbd066811a46e6895fc))
* basemap layers not appearing in correct order on maps ([5eb8d82](https://github.com/ReliefApplications/oort-frontend/commit/5eb8d824ad3a81c616685bf3b690daec295bc6b2))
* basemap would sometimes won't appear on search ([12f1d02](https://github.com/ReliefApplications/oort-frontend/commit/12f1d025c28450129892d4688aae9f3c36cce7f8))
* build issue after 2.0.x merge ([f8bc621](https://github.com/ReliefApplications/oort-frontend/commit/f8bc621c1be9adccdfc56d5b26aa2531d70567ee))
* button action not appearing in front-office ([7d0d397](https://github.com/ReliefApplications/oort-frontend/commit/7d0d397aeff35ddc833ecdd693af6c642775f7ba))
* chart update + cards from aggregation as grid ([aaba5bf](https://github.com/ReliefApplications/oort-frontend/commit/aaba5bfc567b82a667330d789c88cd6fdfa6c5b8))
* chart would not display nicely in too small ([464fb65](https://github.com/ReliefApplications/oort-frontend/commit/464fb65c6c6e361ca16c1a94779993458ab28bdd))
* contextual datasource would not work in all cases ([48843e7](https://github.com/ReliefApplications/oort-frontend/commit/48843e7403aaa855a7ae1b2b4ebaa29edc23f82d))
* could not open map from grid ([487450d](https://github.com/ReliefApplications/oort-frontend/commit/487450de6ccc0b4291e06db1f69b00515d96d31a))
* custom style would sometimes fail when editing new widgets ([f6aebf5](https://github.com/ReliefApplications/oort-frontend/commit/f6aebf56976e814f2cff7a93d3d9b9bb5abf6cf0))
* custom widget styling would not correctly render when fullscreen mode is active ([6e19aec](https://github.com/ReliefApplications/oort-frontend/commit/6e19aec629acb0eaaef617ba817e0b495d932c88))
* dashboard navigation was messy in front-office, when using templates ([eeaa370](https://github.com/ReliefApplications/oort-frontend/commit/eeaa370ef361a3345984fd0ff3521bc361740372))
* default width for column in layouts would appear even if not used ([4833666](https://github.com/ReliefApplications/oort-frontend/commit/4833666f4bd908f71fe187d3f4d7b4d7e270d44d))
* deleting btns no longer removes two of them ([2a7b6be](https://github.com/ReliefApplications/oort-frontend/commit/2a7b6be2c2249b5e5ed45bf7a01410952cdb6712))
* destroy layers control sidenav when closing the settings ([1754041](https://github.com/ReliefApplications/oort-frontend/commit/1754041cd8c26beb5861a09444a6af42e3efff88))
* editable text would sometimes hide other options of the UI ([eedbdd0](https://github.com/ReliefApplications/oort-frontend/commit/eedbdd09af375a2bcddb7453faca4107064a6130))
* few issues with sidenav z-index + incorrect getter of value in records-tab ([1234e37](https://github.com/ReliefApplications/oort-frontend/commit/1234e376808482b41eeb394e303f84a60a565aca))
* few map display ([0876ea9](https://github.com/ReliefApplications/oort-frontend/commit/0876ea9861aa1e1eb98b0f265a01d5b2aed54e40)), closes [fix/AB#65087](https://github.com/fix/AB/issues/65087) [fix/AB#65087](https://github.com/fix/AB/issues/65087)
* fields would still appear in layer edition even if datasource is not valid ([1723c6c](https://github.com/ReliefApplications/oort-frontend/commit/1723c6ce3a1d626e25e2744c65dd9b73c526c294))
* files uploaded before addRecord ([962b96f](https://github.com/ReliefApplications/oort-frontend/commit/962b96f64548d82f3a0c487945c8101a5886c23f))
* filtering not working in summary cards ([aaa4be1](https://github.com/ReliefApplications/oort-frontend/commit/aaa4be13ac76087124264a8e22c469bfbec365f8))
* form popups not appearing in fullscreen ([#1791](https://github.com/ReliefApplications/oort-frontend/issues/1791)) ([ab04aab](https://github.com/ReliefApplications/oort-frontend/commit/ab04aab0bd0c079df607fd85abb07d68f503d736))
* front-office and app preview would not correctly use changeStep event of workflow ([7727f6b](https://github.com/ReliefApplications/oort-frontend/commit/7727f6b2cac8794409a6c90a3de52dd13881db15))
* geospatial map reverse search does not have same APi than search, and could cause some issues ([94c7757](https://github.com/ReliefApplications/oort-frontend/commit/94c7757a573ed490c2248fbc33dd6586c79acab7))
* geospatial map showing incorrect controls ([3a11156](https://github.com/ReliefApplications/oort-frontend/commit/3a111562e04c86923e0067ffff1cd57f0adab892))
* geospatial map would not appear if no selected fields ([e49fffc](https://github.com/ReliefApplications/oort-frontend/commit/e49fffc283af45b960200d693ffb59b4e97d4d37))
* heatmap not rendering well in settings ([54a5285](https://github.com/ReliefApplications/oort-frontend/commit/54a52859fd365b2602bbfe54588bfd43d9f598a9))
* heatmap selection was preventing some options to be reapplied + by default, color was not applied to dots ([f273d9f](https://github.com/ReliefApplications/oort-frontend/commit/f273d9fe8491a05f23034012255b627d59ab0fea))
* heatmap would not render due to incorrect lat / lng array ([8c811a2](https://github.com/ReliefApplications/oort-frontend/commit/8c811a2ed72e1debfd2ea129280815e96097a9c8))
* hidden layer no longer appears on zoom ([56420fe](https://github.com/ReliefApplications/oort-frontend/commit/56420fec705959fe789b4fda21cacf84e594685f))
* hidden pages not working for top navigation ([931f3bc](https://github.com/ReliefApplications/oort-frontend/commit/931f3bc753f4b48cad1b586a6bb6812c2654eb3a))
* html could be passed in links built from values in summary cards / text widgets ([6cc0545](https://github.com/ReliefApplications/oort-frontend/commit/6cc05456c58782bfe74e20190372c00f210260d0))
* html widgets ( summary cards & text ) style issue with tailwind ([e0ad6fd](https://github.com/ReliefApplications/oort-frontend/commit/e0ad6fdeaba4e44c796612c503cb299a0aa5a0ce))
* impossible to edit application page form's name ([88c54fd](https://github.com/ReliefApplications/oort-frontend/commit/88c54fddbafaa8da544f164760e9c33ca1da7a27))
* inconsistent scroll when editing role's access on resources ([#1647](https://github.com/ReliefApplications/oort-frontend/issues/1647)) ([d4e05c3](https://github.com/ReliefApplications/oort-frontend/commit/d4e05c3e2ba55a98f7348dbebed1edbe7d3454af))
* incorrect calculation of dates in calculated fields. Now enforcing user timezone ([f860162](https://github.com/ReliefApplications/oort-frontend/commit/f860162f29369df55074226debeb6b98b6338db6))
* incorrect exitFullscreen message on dashboard ([ce27d6d](https://github.com/ReliefApplications/oort-frontend/commit/ce27d6d65b1a4594bb21be925e4a4ec282185c4f))
* incorrect fill text in series settings ([aaee1b1](https://github.com/ReliefApplications/oort-frontend/commit/aaee1b1cc81eb470f51c3454e901b355ce66027f))
* incorrect loading from cache for reference data fields ([9041ff3](https://github.com/ReliefApplications/oort-frontend/commit/9041ff3831b840c83b83a39158261e8071ac0efa))
* incorrect text when editing pull job notification ([30b621c](https://github.com/ReliefApplications/oort-frontend/commit/30b621cd5ef3146a8cec0729258b9eb22da46a29))
* incorrect zoom styling on maps ([c647f82](https://github.com/ReliefApplications/oort-frontend/commit/c647f820e0ab1af396fab10d5beac4232c02d623))
* issue loading some webmaps with arcgis ([5fbf5fc](https://github.com/ReliefApplications/oort-frontend/commit/5fbf5fc2e04794b9a9da0d3e830eb8c0e356cf34)), closes [bugfix/AB#65126](https://github.com/bugfix/AB/issues/65126)
* issue with map-settings takeUntil ([53bb171](https://github.com/ReliefApplications/oort-frontend/commit/53bb1713270a992d0c9d685117199613d4ea57e9))
* issue with overlay ([e5e984f](https://github.com/ReliefApplications/oort-frontend/commit/e5e984f696e01cfa2ab9f616c7bc10fdc9bc1120))
* issue with select a layout text ([8238173](https://github.com/ReliefApplications/oort-frontend/commit/82381734fdb4639bdb770f7d95d7edad817c3d49))
* issues with visibility ([ce79519](https://github.com/ReliefApplications/oort-frontend/commit/ce79519b4941e0220ffcd698263c479187aee9c4))
* layer control being duplicated ([995588a](https://github.com/ReliefApplications/oort-frontend/commit/995588abaa87405a0f902754edc984922a681c4e))
* layer control could not be removed anymore ([b8356cd](https://github.com/ReliefApplications/oort-frontend/commit/b8356cd4c40f680f3b371b226646b12c9f35b5c7))
* layers control would not be made visible / hidden when trying to show it from map settings ([4b6f899](https://github.com/ReliefApplications/oort-frontend/commit/4b6f899b6a0eb96bc276729dd936038db4be4a42))
* layers fields would not be usable ([f8bc2cb](https://github.com/ReliefApplications/oort-frontend/commit/f8bc2cbc1f5ae7c07786973441b3ff0608ab5dec))
* layers would be duplicated when doing some changes on them ([06c801d](https://github.com/ReliefApplications/oort-frontend/commit/06c801dda00a97198035b33d18d74085e987658e)), closes [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091)
* left sidenav would incorrectly display on small screens, when over the content ([3192e07](https://github.com/ReliefApplications/oort-frontend/commit/3192e074a8a1509d2695ad75e7ec4518dc069524))
* legend control on map would appear multiple times ([a43f261](https://github.com/ReliefApplications/oort-frontend/commit/a43f26149b4026aee75572bb85408c3bf8b4d65b))
* map in settings could do weird movements ([ac6e509](https://github.com/ReliefApplications/oort-frontend/commit/ac6e509d81a2fec6031dd1f16ca518fdec6acf8e))
* map layers would not always render correctly after dashboard filtering ([f795215](https://github.com/ReliefApplications/oort-frontend/commit/f795215533d3ff6c92b15097fd09db95055ccfb4))
* map search results would overlap fullscreen control ([e337cfa](https://github.com/ReliefApplications/oort-frontend/commit/e337cfafa13a1d8fad5670531cdc60663fb6c970))
* map would not appear when editing a layer ([97fcfba](https://github.com/ReliefApplications/oort-frontend/commit/97fcfba8385b02b3eb6e64183a888a098fb371d0))
* missing tooltip for fullscreen button on front-office ([8a624d9](https://github.com/ReliefApplications/oort-frontend/commit/8a624d981639cd7debca62c291cbe1742e2429f9))
* multi select questions would not be usable in grids ([b4fe63b](https://github.com/ReliefApplications/oort-frontend/commit/b4fe63bf997bf8a73592983fbacf227028a8a8aa))
* navigation not working back-office dashboard when using templates ([11b9ae3](https://github.com/ReliefApplications/oort-frontend/commit/11b9ae389868bf8581d4fdf8f47469575979ea26))
* number in center of clusters not aligned ([1bca1f6](https://github.com/ReliefApplications/oort-frontend/commit/1bca1f620c1237ab3bcc1fdbabe808c24f48437e)), closes [bugfix/AB#63765](https://github.com/bugfix/AB/issues/63765) [bugfix/AB#63765](https://github.com/bugfix/AB/issues/63765)
* popup could not appear with polygons ([c6fa211](https://github.com/ReliefApplications/oort-frontend/commit/c6fa211a8192929e65c609116cb316894fb0d7d2))
* popup text element could go out of bounds ([203001a](https://github.com/ReliefApplications/oort-frontend/commit/203001aa41e8bd4580e8c30d72bbd1d098d773da))
* previous update changed some package versions ([e054784](https://github.com/ReliefApplications/oort-frontend/commit/e05478444f376beaf4b741b55f1105a5d2a6405c))
* readOnly attribute of fields would not be taken into account when doing edition ([21b9010](https://github.com/ReliefApplications/oort-frontend/commit/21b90101d354785afdf92ec64482e2c501487eb3))
* record history could send an error when object was null or undefined ([80fd7ee](https://github.com/ReliefApplications/oort-frontend/commit/80fd7ee865f5156a700907680f2b338f16c0146d))
* reference data would be cached everytime ([5f0a99d](https://github.com/ReliefApplications/oort-frontend/commit/5f0a99d53377da4e7a4c93e348e809a9c65bf65e))
* renderer type incorrectly set in layerDefinitionForm ([73f224b](https://github.com/ReliefApplications/oort-frontend/commit/73f224baaa325d5964fa5409c659c8ebdc8a0512))
* scrollbar would not look the same on firefox ([#1827](https://github.com/ReliefApplications/oort-frontend/issues/1827)) ([3638c3d](https://github.com/ReliefApplications/oort-frontend/commit/3638c3defca5a608cd4d900f56a8f69d2aae2201))
* search with filter not working in GetResources queries ([054fa48](https://github.com/ReliefApplications/oort-frontend/commit/054fa48087b483ce27fa31b18ffcd94268669cf7))
* show new records created in resouce questions in the search grid ([4d0ed40](https://github.com/ReliefApplications/oort-frontend/commit/4d0ed4048f5a7173ee57bfb2d6106f45749bd5e2))
* simplify reference data dropdown component ([37289f0](https://github.com/ReliefApplications/oort-frontend/commit/37289f08df4b352177ab963e092c916fdd9428e4))
* some features from contextual dashboards would not work correctly ([#1825](https://github.com/ReliefApplications/oort-frontend/issues/1825)) ([a8d089b](https://github.com/ReliefApplications/oort-frontend/commit/a8d089b80d87a8b8157cf32d468a3fcb151a8707))
* some issues with new dashboard filter ([fd3d00e](https://github.com/ReliefApplications/oort-frontend/commit/fd3d00e147123e26933ff193238df1b7c2127302))
* some layers would break the map when loading due to incorrect API call ([35a50a0](https://github.com/ReliefApplications/oort-frontend/commit/35a50a0800caf0e3370dd8f36f3a2afdd162aa98))
* some layers would break the map when loading due to incorrect API call ([d305963](https://github.com/ReliefApplications/oort-frontend/commit/d30596359ced6b2f39c4b8180607c0a99c069d52))
* some lint issues and incorrect logic in the edition of geofields ([470819e](https://github.com/ReliefApplications/oort-frontend/commit/470819e279f56fdfce3e38edfced7c3d7ba9a3a2))
* some popups could not appear due to incorrect geojson or event ([2e41dde](https://github.com/ReliefApplications/oort-frontend/commit/2e41ddedb566af604d9458f3fc2095aa89837583))
* sorting tab incorrect display in summary card settings ([#1818](https://github.com/ReliefApplications/oort-frontend/issues/1818)) ([18abea2](https://github.com/ReliefApplications/oort-frontend/commit/18abea27b2a96dd8af29de209d0f42420d65fed9))
* subscribe to geoForm lat/lng ([40e19ba](https://github.com/ReliefApplications/oort-frontend/commit/40e19ba7e76fce2e0fa008ad29c596b503f3f573))
* text selector for date filtering in layouts would not appear anymore ([9212038](https://github.com/ReliefApplications/oort-frontend/commit/9212038ae1ec803113b8df5237f43850c5495d8c))
* unable to scroll when using expression builder in calculated fields UI ([334b4da](https://github.com/ReliefApplications/oort-frontend/commit/334b4dac2eb463e06d15eb729ac469dfda1947fe))
* unionBy causing type issue in update-queries method ([b1dff4a](https://github.com/ReliefApplications/oort-frontend/commit/b1dff4a375b66d2bd8e4e7fe44a3e585d68051b9))
* update resources field permissions in roles page ([dbae656](https://github.com/ReliefApplications/oort-frontend/commit/dbae6561d438dd8f9b640c2f98859522f3876de1))
* uploading files from default value ([02ad65b](https://github.com/ReliefApplications/oort-frontend/commit/02ad65be80e380f695d469f127b7cf46bfb6184b))
* visibility of parent could break visibility of children elements in layers ([7b48e79](https://github.com/ReliefApplications/oort-frontend/commit/7b48e79af44511df4e0406130fee1907f58086bc))
* visibility was not correctly working for some layers ([0f66086](https://github.com/ReliefApplications/oort-frontend/commit/0f6608648629a5e0ecf3cc19cc46be3e9f095584))
* webmap incorrect options in searchbar ([#1405](https://github.com/ReliefApplications/oort-frontend/issues/1405)) ([20b95da](https://github.com/ReliefApplications/oort-frontend/commit/20b95da15726a55c2c2cd7b8c3dbb62b4ed14f9e))
* workflow step never loads if dashboard structure has null elements ([13f90e3](https://github.com/ReliefApplications/oort-frontend/commit/13f90e397843a1fcb555a9ae7519df5f125e83a4))
* working sidenav when fullscreen mode is active & widget is expanded ([7b04fed](https://github.com/ReliefApplications/oort-frontend/commit/7b04fedca469a5cb44dd21e1b60cf5f7864405b7))


### Features

* add contextual menu to relevant controls using tinymce editor ([b8902df](https://github.com/ReliefApplications/oort-frontend/commit/b8902dfb45342b5883580edb66788fa78b24ed3b))
* add custom styling to widgets ([1132f45](https://github.com/ReliefApplications/oort-frontend/commit/1132f45e019b168dc046f500f64de543e496e53a))
* add dashboard button actions ([9f52272](https://github.com/ReliefApplications/oort-frontend/commit/9f52272100361f3f933358a4d8a65a98164f1da9))
* add fields component in map layer settings ([6327f21](https://github.com/ReliefApplications/oort-frontend/commit/6327f21663ae04d4e0b20e744497dd05f37917f4))
* add heatmap to map-forms ([ca9af30](https://github.com/ReliefApplications/oort-frontend/commit/ca9af30fde313787eb0b942741641bd6e54bf353))
* Add JSON editor tab to survey builder ([22adaf5](https://github.com/ReliefApplications/oort-frontend/commit/22adaf5f397e077cc9decfc51d968a53779d2d8a))
* add missing translations ([8c504ac](https://github.com/ReliefApplications/oort-frontend/commit/8c504ac58dd744d6bdd93db0984a50c97df5296c))
* add more missing translations ([cfab01b](https://github.com/ReliefApplications/oort-frontend/commit/cfab01bd762ed8ffadeb24c3c43c18aaafba9073))
* add new control for tinymce editor, usable in mat form fields ([984ba1d](https://github.com/ReliefApplications/oort-frontend/commit/984ba1d8f5feecf381d601b063f8d7eca045bc0a)), closes [refactor/AB#61059](https://github.com/refactor/AB/issues/61059)
* add one more missing translation ([90e98f3](https://github.com/ReliefApplications/oort-frontend/commit/90e98f3b23f3c23438eb3032f4d0bb7bfd722383))
* add possibility to setup sorting for grids & summary cards ([21648ec](https://github.com/ReliefApplications/oort-frontend/commit/21648ecb2e0d21e5b8fe944330a8d2c6afa32347))
* add survey scss import in form modal ([55f1299](https://github.com/ReliefApplications/oort-frontend/commit/55f12999151660186c412a3ecdd438857ac4f0e2))
* add user variables on form ([aed4116](https://github.com/ReliefApplications/oort-frontend/commit/aed4116853a338cfd7a7e37ecf2b29cacce422ee))
* Adding surveyJS variables for fields of selected record in resource question ([da7f8ca](https://github.com/ReliefApplications/oort-frontend/commit/da7f8ca73fcff9a35306889333a0601c1cd8bbe6))
* Adds length custom function to be used in survey builder ([bf02242](https://github.com/ReliefApplications/oort-frontend/commit/bf02242d5d5f26213f6fdf6fbb4dd502ac62cdfa))
* allow draft edition of records in grids ([3cea89b](https://github.com/ReliefApplications/oort-frontend/commit/3cea89b26b0094741dedf9499f26410264ff98d6))
* allow single widget page ([45ae280](https://github.com/ReliefApplications/oort-frontend/commit/45ae2808ef2ac9fb182965acd73157ca3cf26936))
* also allow scss in custom style of application ([222d67c](https://github.com/ReliefApplications/oort-frontend/commit/222d67c95a6c4fc2f1f4e4a261f93c99d07ccb72))
* can now go to previous step automatically from a dashboard in a workflow ([4d592d1](https://github.com/ReliefApplications/oort-frontend/commit/4d592d1dfdbc4db3233b1344a3b3d07adaf609ba)), closes [2.1.x/AB#10686](https://github.com/2.1.x/AB/issues/10686)
* can now group layers ([a99a17f](https://github.com/ReliefApplications/oort-frontend/commit/a99a17fcf63ec4acb67c0e26243913bd208af998))
* filtering widgets by dashboard filters ([6379f78](https://github.com/ReliefApplications/oort-frontend/commit/6379f781fe602a43e2370fcaeade2b136dc03400))
* geomap working ([ce44cc9](https://github.com/ReliefApplications/oort-frontend/commit/ce44cc9fc6a14628c80f2fee23fc49e09242abe7))
* improve hide page feature ([15ec6d1](https://github.com/ReliefApplications/oort-frontend/commit/15ec6d1fa9cdfb82a97e68c0df837c6dc1ccdc3b))
* improve layers select styling ([bb0ecd8](https://github.com/ReliefApplications/oort-frontend/commit/bb0ecd8c4473a2fbd30a92099c4f8feb7b1a3e56))
* possibility to hide pages' ([0ba87cd](https://github.com/ReliefApplications/oort-frontend/commit/0ba87cdfcec7ac1d67e52ad2cc063ea3d71e9747))
* Reference data for dashboard filtering ([#1819](https://github.com/ReliefApplications/oort-frontend/issues/1819)) ([42e5bc2](https://github.com/ReliefApplications/oort-frontend/commit/42e5bc26d22f7927368616d4890a599827748d5b)), closes [feat/AB#74574](https://github.com/feat/AB/issues/74574)
* see markers from grid when opening geospatial question ([7231a50](https://github.com/ReliefApplications/oort-frontend/commit/7231a5013dd67302b6cfa495bb474c8d46a5cef8)), closes [Feat/ab#60047](https://github.com/Feat/ab/issues/60047)
* sidenav can now be collapsed on large screens ([49d74d7](https://github.com/ReliefApplications/oort-frontend/commit/49d74d757dddf4f31c7502800e5163a95b8ea446))
* Tabs widget ([#1793](https://github.com/ReliefApplications/oort-frontend/issues/1793)) ([16d793c](https://github.com/ReliefApplications/oort-frontend/commit/16d793cf964205275411e53b50be2f0a728f9c3d))
* Tabs widget ([#1795](https://github.com/ReliefApplications/oort-frontend/issues/1795)) ([cb31387](https://github.com/ReliefApplications/oort-frontend/commit/cb31387022216dfe1a7dd2d96fe00167483fdc1b))
* zoom control new styling added to maps ([#1427](https://github.com/ReliefApplications/oort-frontend/issues/1427)) ([202504e](https://github.com/ReliefApplications/oort-frontend/commit/202504e3f8363a198e2cfc383a8b59f3319fabfa))


### Performance Improvements

* Load markers in chunks ([#1786](https://github.com/ReliefApplications/oort-frontend/issues/1786)) ([5eb316d](https://github.com/ReliefApplications/oort-frontend/commit/5eb316de6e42fe1a2e6cd5a52b944534e0a748cf))
* update Angular version to 15.2.9 ([8e985fb](https://github.com/ReliefApplications/oort-frontend/commit/8e985fb711622860fa8c6faff886039f8845ad66))


### Reverts

* Revert "feat: Tabs widget (#1793)" (#1794) ([64c2a1b](https://github.com/ReliefApplications/oort-frontend/commit/64c2a1b2e29a12f68e9512d3e382b0b721a04516)), closes [#1793](https://github.com/ReliefApplications/oort-frontend/issues/1793) [#1794](https://github.com/ReliefApplications/oort-frontend/issues/1794)

# [2.1.0-beta.4](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.0-beta.3...v2.1.0-beta.4) (2023-09-05)


### Bug Fixes

* basemap would sometimes won't appear on search ([12f1d02](https://github.com/ReliefApplications/oort-frontend/commit/12f1d025c28450129892d4688aae9f3c36cce7f8))
* custom style would sometimes fail when editing new widgets ([f6aebf5](https://github.com/ReliefApplications/oort-frontend/commit/f6aebf56976e814f2cff7a93d3d9b9bb5abf6cf0))
* filtering not working in summary cards ([aaa4be1](https://github.com/ReliefApplications/oort-frontend/commit/aaa4be13ac76087124264a8e22c469bfbec365f8))
* form popups not appearing in fullscreen ([#1791](https://github.com/ReliefApplications/oort-frontend/issues/1791)) ([ab04aab](https://github.com/ReliefApplications/oort-frontend/commit/ab04aab0bd0c079df607fd85abb07d68f503d736))
* some popups could not appear due to incorrect geojson or event ([2e41dde](https://github.com/ReliefApplications/oort-frontend/commit/2e41ddedb566af604d9458f3fc2095aa89837583))


### Features

* Tabs widget ([#1793](https://github.com/ReliefApplications/oort-frontend/issues/1793)) ([16d793c](https://github.com/ReliefApplications/oort-frontend/commit/16d793cf964205275411e53b50be2f0a728f9c3d))
* Tabs widget ([#1795](https://github.com/ReliefApplications/oort-frontend/issues/1795)) ([cb31387](https://github.com/ReliefApplications/oort-frontend/commit/cb31387022216dfe1a7dd2d96fe00167483fdc1b))


### Reverts

* Revert "feat: Tabs widget (#1793)" (#1794) ([64c2a1b](https://github.com/ReliefApplications/oort-frontend/commit/64c2a1b2e29a12f68e9512d3e382b0b721a04516)), closes [#1793](https://github.com/ReliefApplications/oort-frontend/issues/1793) [#1794](https://github.com/ReliefApplications/oort-frontend/issues/1794)

# [2.1.0-beta.3](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.0-beta.2...v2.1.0-beta.3) (2023-08-23)


### Bug Fixes

* incorrect loading from cache for reference data fields ([9041ff3](https://github.com/ReliefApplications/oort-frontend/commit/9041ff3831b840c83b83a39158261e8071ac0efa))
* popup could not appear with polygons ([c6fa211](https://github.com/ReliefApplications/oort-frontend/commit/c6fa211a8192929e65c609116cb316894fb0d7d2))


### Features

* add possibility to setup sorting for grids & summary cards ([21648ec](https://github.com/ReliefApplications/oort-frontend/commit/21648ecb2e0d21e5b8fe944330a8d2c6afa32347))
* allow draft edition of records in grids ([3cea89b](https://github.com/ReliefApplications/oort-frontend/commit/3cea89b26b0094741dedf9499f26410264ff98d6))

# [2.1.0-beta.2](https://github.com/ReliefApplications/oort-frontend/compare/v2.1.0-beta.1...v2.1.0-beta.2) (2023-08-17)


### Bug Fixes

* accordion could not expand ([02b63da](https://github.com/ReliefApplications/oort-frontend/commit/02b63da126bcb3d19059b0dd56e5e8b9409a7cee))
* add loading indicator in dropdown and tagbox in survey questions ([c06ad98](https://github.com/ReliefApplications/oort-frontend/commit/c06ad989b51e0163f63a9b84c3b962275308505a)), closes [fix/AB#71072](https://github.com/fix/AB/issues/71072) [fix/AB#71072](https://github.com/fix/AB/issues/71072) [fix/AB#71072](https://github.com/fix/AB/issues/71072) [fix/AB#71072](https://github.com/fix/AB/issues/71072) [fix/AB#71072](https://github.com/fix/AB/issues/71072)
* add possibility to do POST requests on choicesByUrl fields in surveyjs ([b45bff9](https://github.com/ReliefApplications/oort-frontend/commit/b45bff9d1e18166099e153b871e1216f20bfdefa)), closes [#1698](https://github.com/ReliefApplications/oort-frontend/issues/1698)
* add possibility to do POST requests on choicesByUrl fields in surveyjs ([71c235c](https://github.com/ReliefApplications/oort-frontend/commit/71c235c538ffba72cf4298a73df7b66f3e182973))
* app preview would never load content ([30cb581](https://github.com/ReliefApplications/oort-frontend/commit/30cb5812ab02ac38cf91fd72c92cf0039f2ce5f9))
* application style would not be applied before load ([4e33254](https://github.com/ReliefApplications/oort-frontend/commit/4e33254443ca5a0f61da127076035ec90d5aa48a))
* arcgis webmap would not use zoom / default location configured in arcgis ([4245061](https://github.com/ReliefApplications/oort-frontend/commit/4245061e0f288bb1ff8108a8ebf824087a4c5d39))
* autosave action could lead to some conflicts, with the UI, and the logic of subsequent steps of the grid action ([cad5c47](https://github.com/ReliefApplications/oort-frontend/commit/cad5c4740e9a0a4896f172e6c806c703a0c4f074))
* breadcrumbs could go out of bounds and expand size of screen ([d5b10e3](https://github.com/ReliefApplications/oort-frontend/commit/d5b10e3b9a7f088c4efe3b0d77b56cdc12cda90a)), closes [fix/AB#70863](https://github.com/fix/AB/issues/70863)
* chart update + cards from aggregation as grid ([aaba5bf](https://github.com/ReliefApplications/oort-frontend/commit/aaba5bfc567b82a667330d789c88cd6fdfa6c5b8))
* chart would not display nicely in too small ([464fb65](https://github.com/ReliefApplications/oort-frontend/commit/464fb65c6c6e361ca16c1a94779993458ab28bdd))
* choices coming from url could be displayed as object due to missing value ([f42a536](https://github.com/ReliefApplications/oort-frontend/commit/f42a5362451e1daf920060f1959d02379830f6f9))
* choicesByUrl could fail to display depending on text ([c382ff2](https://github.com/ReliefApplications/oort-frontend/commit/c382ff2c70fdc3e8e0dacffbea32c24834251f0c))
* contextual datasource would not work in all cases ([48843e7](https://github.com/ReliefApplications/oort-frontend/commit/48843e7403aaa855a7ae1b2b4ebaa29edc23f82d))
* could not edit form page name ([2ce6e41](https://github.com/ReliefApplications/oort-frontend/commit/2ce6e414e4976112b53a2ba5f51e83d775fa9a6d))
* custom widget styling would not correctly render when fullscreen mode is active ([6e19aec](https://github.com/ReliefApplications/oort-frontend/commit/6e19aec629acb0eaaef617ba817e0b495d932c88))
* default width for column in layouts would appear even if not used ([4833666](https://github.com/ReliefApplications/oort-frontend/commit/4833666f4bd908f71fe187d3f4d7b4d7e270d44d))
* deploy not working ([e9b6dbb](https://github.com/ReliefApplications/oort-frontend/commit/e9b6dbb574643579a4fde5646bc7a9ec463b7792))
* editable text would sometimes hide other options of the UI ([eedbdd0](https://github.com/ReliefApplications/oort-frontend/commit/eedbdd09af375a2bcddb7453faca4107064a6130))
* edition of form page was not linked to correct model if not in a step ([ead55c3](https://github.com/ReliefApplications/oort-frontend/commit/ead55c349ff3851964611c526a83d4ffe0a58723))
* empty list display would hide some additional content that should be displayed in select elements ([6dac854](https://github.com/ReliefApplications/oort-frontend/commit/6dac85494d98102f7a79bf8d3feb8c15e8522303))
* expanded comment wrong behavior in many cases ([93f85c6](https://github.com/ReliefApplications/oort-frontend/commit/93f85c62477fc76be66302a493b94ca0f7ea3cc8))
* fields could not be set to null in survey ([64bcb87](https://github.com/ReliefApplications/oort-frontend/commit/64bcb87b01eaf21c6cf2eda9b0b022ba66431c6b))
* fields would still appear in layer edition even if datasource is not valid ([1723c6c](https://github.com/ReliefApplications/oort-frontend/commit/1723c6ce3a1d626e25e2744c65dd9b73c526c294))
* files uploaded before addRecord ([962b96f](https://github.com/ReliefApplications/oort-frontend/commit/962b96f64548d82f3a0c487945c8101a5886c23f))
* filtering on dropdown / tagbox in survey would only work for first rendering ([86aac64](https://github.com/ReliefApplications/oort-frontend/commit/86aac64f796ba60fa884bb69dd8fc49287a0f7f4))
* filtering options in survey could fail due to inexistence of option text ([4f2f611](https://github.com/ReliefApplications/oort-frontend/commit/4f2f611385c5f2cf6179c726fdf123de1d89fa59))
* history partially hidden when seen in sidenav ([0ef9785](https://github.com/ReliefApplications/oort-frontend/commit/0ef97858ab2f6d9f9d0f810a394884321e706dfe))
* html could be passed in links built from values in summary cards / text widgets ([6cc0545](https://github.com/ReliefApplications/oort-frontend/commit/6cc05456c58782bfe74e20190372c00f210260d0))
* html widgets ( summary cards & text ) style issue with tailwind ([e0ad6fd](https://github.com/ReliefApplications/oort-frontend/commit/e0ad6fdeaba4e44c796612c503cb299a0aa5a0ce))
* impossible to edit application page form's name ([88c54fd](https://github.com/ReliefApplications/oort-frontend/commit/88c54fddbafaa8da544f164760e9c33ca1da7a27))
* in application style editor, autocomplete would not appear ([d8ed2d6](https://github.com/ReliefApplications/oort-frontend/commit/d8ed2d6b9d9c1d4d08d9ce88ba223570fdff04b4))
* inconsistent scroll when editing role's access on resources ([#1647](https://github.com/ReliefApplications/oort-frontend/issues/1647)) ([d4e05c3](https://github.com/ReliefApplications/oort-frontend/commit/d4e05c3e2ba55a98f7348dbebed1edbe7d3454af))
* incorrect calculation of dates in calculated fields. Now enforcing user timezone ([f860162](https://github.com/ReliefApplications/oort-frontend/commit/f860162f29369df55074226debeb6b98b6338db6))
* incorrect notification when editing a pull job ([c49ac2d](https://github.com/ReliefApplications/oort-frontend/commit/c49ac2d6bc2ed6892b18cb9a0f379f830ca78e92))
* incorrect pagination on some tables, using paginator component ([2fbd37e](https://github.com/ReliefApplications/oort-frontend/commit/2fbd37ec9fd546b6a6c7e0bfd5d519bfc63b57a9)), closes [fix/AB#72105](https://github.com/fix/AB/issues/72105)
* incorrect text when editing pull job notification ([30b621c](https://github.com/ReliefApplications/oort-frontend/commit/30b621cd5ef3146a8cec0729258b9eb22da46a29))
* issue where closing the expand grid cell modal would set the cell value to null ([1564923](https://github.com/ReliefApplications/oort-frontend/commit/1564923f36f3413745910965dc796899e2f8a796))
* layers fields would not be usable ([f8bc2cb](https://github.com/ReliefApplications/oort-frontend/commit/f8bc2cbc1f5ae7c07786973441b3ff0608ab5dec))
* layers would be duplicated when doing some changes on them ([06c801d](https://github.com/ReliefApplications/oort-frontend/commit/06c801dda00a97198035b33d18d74085e987658e)), closes [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091) [bugfix/AB#69091](https://github.com/bugfix/AB/issues/69091)
* left sidenav would incorrectly display on small screens, when over the content ([3192e07](https://github.com/ReliefApplications/oort-frontend/commit/3192e074a8a1509d2695ad75e7ec4518dc069524))
* map layers would not always render correctly after dashboard filtering ([f795215](https://github.com/ReliefApplications/oort-frontend/commit/f795215533d3ff6c92b15097fd09db95055ccfb4))
* map search results would overlap fullscreen control ([e337cfa](https://github.com/ReliefApplications/oort-frontend/commit/e337cfafa13a1d8fad5670531cdc60663fb6c970))
* multi select questions would not be usable in grids ([b4fe63b](https://github.com/ReliefApplications/oort-frontend/commit/b4fe63bf997bf8a73592983fbacf227028a8a8aa))
* multiple issues detected by Sentry ([45f0d84](https://github.com/ReliefApplications/oort-frontend/commit/45f0d84e5f48f06d1be0c88a8cd03ccace99faf7))
* pages logic in survey could be wrong, now using data from the survey directly ([52f64b5](https://github.com/ReliefApplications/oort-frontend/commit/52f64b54b069c36ccfe7427897d19fb6de46f530))
* Pagination on choose record modal for attach to record button ([#1640](https://github.com/ReliefApplications/oort-frontend/issues/1640)) ([ed0ac2b](https://github.com/ReliefApplications/oort-frontend/commit/ed0ac2bc5ee13a4fb294ff9e31e92bec49640701)), closes [fix/AB#69369](https://github.com/fix/AB/issues/69369)
* readOnly attribute of fields would not be taken into account when doing edition ([21b9010](https://github.com/ReliefApplications/oort-frontend/commit/21b90101d354785afdf92ec64482e2c501487eb3))
* record history could send an error when object was null or undefined ([80fd7ee](https://github.com/ReliefApplications/oort-frontend/commit/80fd7ee865f5156a700907680f2b338f16c0146d))
* reference data would be cached everytime ([5f0a99d](https://github.com/ReliefApplications/oort-frontend/commit/5f0a99d53377da4e7a4c93e348e809a9c65bf65e))
* remove select2 files from import ([2f5d63f](https://github.com/ReliefApplications/oort-frontend/commit/2f5d63fc5ead92a2031362b2d2c77186907e8fea))
* resource modal opening as a blank page until we click anywhere ([#1664](https://github.com/ReliefApplications/oort-frontend/issues/1664)) ([4b4c98f](https://github.com/ReliefApplications/oort-frontend/commit/4b4c98f2c82a1bf54a09c49fa1bb5fcdc2cf8adf))
* resources question would consume too much memory because of stored records ([872485f](https://github.com/ReliefApplications/oort-frontend/commit/872485ff8eaee524a057beba2116cb1985ddd584))
* scroll would remain while moving between pages ([86bc1ea](https://github.com/ReliefApplications/oort-frontend/commit/86bc1eaa0f89a74339e6567fb08ec997d16ef5d4))
* seeing users of role / application not working ([6012dc8](https://github.com/ReliefApplications/oort-frontend/commit/6012dc8cd6a5efbbabeadd53c7cdc91639e927a2))
* selection of form when adding new page / step would not work ([13f3b4d](https://github.com/ReliefApplications/oort-frontend/commit/13f3b4dcdf7fb27dd7fad03fc40377c671a2df1f))
* show new records created in resouce questions in the search grid ([4d0ed40](https://github.com/ReliefApplications/oort-frontend/commit/4d0ed4048f5a7173ee57bfb2d6106f45749bd5e2))
* some issues with new dashboard filter ([fd3d00e](https://github.com/ReliefApplications/oort-frontend/commit/fd3d00e147123e26933ff193238df1b7c2127302))
* survey dispose method could block interaction with UI when survey would not exist ([666a40e](https://github.com/ReliefApplications/oort-frontend/commit/666a40ef78116e82ebaf72dd200be1f731a8d60c))
* survey with default / selected value in dropdown / tagbox would break filtering ([e3af66b](https://github.com/ReliefApplications/oort-frontend/commit/e3af66bd36557fc6f4e591f9b9e95ecf9caa7b43))
* tabs component could raise issues due to missing tabs ([2f230bb](https://github.com/ReliefApplications/oort-frontend/commit/2f230bbc702001a52bb106c3c337c69cae7929ef))
* tagbox would freeze if too many items in forms ([8386e8b](https://github.com/ReliefApplications/oort-frontend/commit/8386e8b6c22d2d452254df205e5d95b422272d21))
* text selector for date filtering in layouts would not appear anymore ([9212038](https://github.com/ReliefApplications/oort-frontend/commit/9212038ae1ec803113b8df5237f43850c5495d8c))
* toString in extractChoices in grids should now get correct value ([a2b9de5](https://github.com/ReliefApplications/oort-frontend/commit/a2b9de500c6f39667690256cefbc2094c270cded))
* unable to attach to another form in grid actions ([3d2c9a5](https://github.com/ReliefApplications/oort-frontend/commit/3d2c9a5d5df19e9ed898414674f9dcda0a9c19fa))
* update resources field permissions in roles page ([dbae656](https://github.com/ReliefApplications/oort-frontend/commit/dbae6561d438dd8f9b640c2f98859522f3876de1))
* uploading files from default value ([02ad65b](https://github.com/ReliefApplications/oort-frontend/commit/02ad65be80e380f695d469f127b7cf46bfb6184b))
* values set to null in survey could raise unwanted updates while seeing history of records ([d6dc660](https://github.com/ReliefApplications/oort-frontend/commit/d6dc660e2bc72e951a4604c14d0f0c4f29e991d3))
* when editing roles, channel would not get initial value if set ([bfcadeb](https://github.com/ReliefApplications/oort-frontend/commit/bfcadebabf988733e162fa34585d416275bc44b2))
* when editing user, changing application to assign roles of the user wouldn't clear the roles list ([d5f5502](https://github.com/ReliefApplications/oort-frontend/commit/d5f5502f08a2c52adc8f2bfc05bb2b258cabdd28))
* workflow step never loads if dashboard structure has null elements ([13f90e3](https://github.com/ReliefApplications/oort-frontend/commit/13f90e397843a1fcb555a9ae7519df5f125e83a4))
* working sidenav when fullscreen mode is active & widget is expanded ([7b04fed](https://github.com/ReliefApplications/oort-frontend/commit/7b04fedca469a5cb44dd21e1b60cf5f7864405b7))


### Features

* add custom styling to widgets ([1132f45](https://github.com/ReliefApplications/oort-frontend/commit/1132f45e019b168dc046f500f64de543e496e53a))
* Add JSON editor tab to survey builder ([22adaf5](https://github.com/ReliefApplications/oort-frontend/commit/22adaf5f397e077cc9decfc51d968a53779d2d8a))
* add more missing translations ([cfab01b](https://github.com/ReliefApplications/oort-frontend/commit/cfab01bd762ed8ffadeb24c3c43c18aaafba9073))
* add one more missing translation ([90e98f3](https://github.com/ReliefApplications/oort-frontend/commit/90e98f3b23f3c23438eb3032f4d0bb7bfd722383))
* add survey scss import in form modal ([55f1299](https://github.com/ReliefApplications/oort-frontend/commit/55f12999151660186c412a3ecdd438857ac4f0e2))
* add user variables on form ([aed4116](https://github.com/ReliefApplications/oort-frontend/commit/aed4116853a338cfd7a7e37ecf2b29cacce422ee))
* Adding surveyJS variables for fields of selected record in resource question ([da7f8ca](https://github.com/ReliefApplications/oort-frontend/commit/da7f8ca73fcff9a35306889333a0601c1cd8bbe6))
* Adds length custom function to be used in survey builder ([bf02242](https://github.com/ReliefApplications/oort-frontend/commit/bf02242d5d5f26213f6fdf6fbb4dd502ac62cdfa))
* allow single widget page ([45ae280](https://github.com/ReliefApplications/oort-frontend/commit/45ae2808ef2ac9fb182965acd73157ca3cf26936))
* also allow scss in custom style of application ([222d67c](https://github.com/ReliefApplications/oort-frontend/commit/222d67c95a6c4fc2f1f4e4a261f93c99d07ccb72))
* filtering widgets by dashboard filters ([6379f78](https://github.com/ReliefApplications/oort-frontend/commit/6379f781fe602a43e2370fcaeade2b136dc03400))


### Performance Improvements

* update Angular version to 15.2.9 ([8e985fb](https://github.com/ReliefApplications/oort-frontend/commit/8e985fb711622860fa8c6faff886039f8845ad66))


### Reverts

* Revert "fix: add possibility to do POST requests on choicesByUrl fields in surveyjs" (#1698) ([d60414c](https://github.com/ReliefApplications/oort-frontend/commit/d60414c662c785cbfad9eff40977b25fe84ef618)), closes [#1698](https://github.com/ReliefApplications/oort-frontend/issues/1698)

# [2.1.0-beta.1](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0...v2.1.0-beta.1) (2023-07-03)


### Bug Fixes

* arcgis layers now appear in layer control ([6d08d72](https://github.com/ReliefApplications/oort-frontend/commit/6d08d726f400cb631b5e0270ed2e973771b17f5f))
* arcgis webmap select would not take search value when doing pagination ([711f0a0](https://github.com/ReliefApplications/oort-frontend/commit/711f0a08fe5fb7c57610f6501880451201cfdb21))
* assets not working in back-office ([4fa9245](https://github.com/ReliefApplications/oort-frontend/commit/4fa924509fb506101b5aacbd066811a46e6895fc))
* basemap layers not appearing in correct order on maps ([5eb8d82](https://github.com/ReliefApplications/oort-frontend/commit/5eb8d824ad3a81c616685bf3b690daec295bc6b2))
* button action not appearing in front-office ([7d0d397](https://github.com/ReliefApplications/oort-frontend/commit/7d0d397aeff35ddc833ecdd693af6c642775f7ba))
* could not open map from grid ([487450d](https://github.com/ReliefApplications/oort-frontend/commit/487450de6ccc0b4291e06db1f69b00515d96d31a))
* deleting btns no longer removes two of them ([2a7b6be](https://github.com/ReliefApplications/oort-frontend/commit/2a7b6be2c2249b5e5ed45bf7a01410952cdb6712))
* destroy layers control sidenav when closing the settings ([1754041](https://github.com/ReliefApplications/oort-frontend/commit/1754041cd8c26beb5861a09444a6af42e3efff88))
* few issues with sidenav z-index + incorrect getter of value in records-tab ([1234e37](https://github.com/ReliefApplications/oort-frontend/commit/1234e376808482b41eeb394e303f84a60a565aca))
* few map display ([0876ea9](https://github.com/ReliefApplications/oort-frontend/commit/0876ea9861aa1e1eb98b0f265a01d5b2aed54e40)), closes [fix/AB#65087](https://github.com/fix/AB/issues/65087) [fix/AB#65087](https://github.com/fix/AB/issues/65087)
* front-office and app preview would not correctly use changeStep event of workflow ([7727f6b](https://github.com/ReliefApplications/oort-frontend/commit/7727f6b2cac8794409a6c90a3de52dd13881db15))
* geospatial map reverse search does not have same APi than search, and could cause some issues ([94c7757](https://github.com/ReliefApplications/oort-frontend/commit/94c7757a573ed490c2248fbc33dd6586c79acab7))
* geospatial map showing incorrect controls ([3a11156](https://github.com/ReliefApplications/oort-frontend/commit/3a111562e04c86923e0067ffff1cd57f0adab892))
* geospatial map would not appear if no selected fields ([e49fffc](https://github.com/ReliefApplications/oort-frontend/commit/e49fffc283af45b960200d693ffb59b4e97d4d37))
* heatmap not rendering well in settings ([54a5285](https://github.com/ReliefApplications/oort-frontend/commit/54a52859fd365b2602bbfe54588bfd43d9f598a9))
* heatmap selection was preventing some options to be reapplied + by default, color was not applied to dots ([f273d9f](https://github.com/ReliefApplications/oort-frontend/commit/f273d9fe8491a05f23034012255b627d59ab0fea))
* heatmap would not render due to incorrect lat / lng array ([8c811a2](https://github.com/ReliefApplications/oort-frontend/commit/8c811a2ed72e1debfd2ea129280815e96097a9c8))
* hidden layer no longer appears on zoom ([56420fe](https://github.com/ReliefApplications/oort-frontend/commit/56420fec705959fe789b4fda21cacf84e594685f))
* hidden pages not working for top navigation ([931f3bc](https://github.com/ReliefApplications/oort-frontend/commit/931f3bc753f4b48cad1b586a6bb6812c2654eb3a))
* incorrect exitFullscreen message on dashboard ([ce27d6d](https://github.com/ReliefApplications/oort-frontend/commit/ce27d6d65b1a4594bb21be925e4a4ec282185c4f))
* incorrect fill text in series settings ([aaee1b1](https://github.com/ReliefApplications/oort-frontend/commit/aaee1b1cc81eb470f51c3454e901b355ce66027f))
* incorrect zoom styling on maps ([c647f82](https://github.com/ReliefApplications/oort-frontend/commit/c647f820e0ab1af396fab10d5beac4232c02d623))
* issue loading some webmaps with arcgis ([5fbf5fc](https://github.com/ReliefApplications/oort-frontend/commit/5fbf5fc2e04794b9a9da0d3e830eb8c0e356cf34)), closes [bugfix/AB#65126](https://github.com/bugfix/AB/issues/65126)
* issue with map-settings takeUntil ([53bb171](https://github.com/ReliefApplications/oort-frontend/commit/53bb1713270a992d0c9d685117199613d4ea57e9))
* issue with overlay ([e5e984f](https://github.com/ReliefApplications/oort-frontend/commit/e5e984f696e01cfa2ab9f616c7bc10fdc9bc1120))
* issue with select a layout text ([8238173](https://github.com/ReliefApplications/oort-frontend/commit/82381734fdb4639bdb770f7d95d7edad817c3d49))
* issues with visibility ([ce79519](https://github.com/ReliefApplications/oort-frontend/commit/ce79519b4941e0220ffcd698263c479187aee9c4))
* layer control being duplicated ([995588a](https://github.com/ReliefApplications/oort-frontend/commit/995588abaa87405a0f902754edc984922a681c4e))
* layer control could not be removed anymore ([b8356cd](https://github.com/ReliefApplications/oort-frontend/commit/b8356cd4c40f680f3b371b226646b12c9f35b5c7))
* layers control would not be made visible / hidden when trying to show it from map settings ([4b6f899](https://github.com/ReliefApplications/oort-frontend/commit/4b6f899b6a0eb96bc276729dd936038db4be4a42))
* legend control on map would appear multiple times ([a43f261](https://github.com/ReliefApplications/oort-frontend/commit/a43f26149b4026aee75572bb85408c3bf8b4d65b))
* map in settings could do weird movements ([ac6e509](https://github.com/ReliefApplications/oort-frontend/commit/ac6e509d81a2fec6031dd1f16ca518fdec6acf8e))
* map would not appear when editing a layer ([97fcfba](https://github.com/ReliefApplications/oort-frontend/commit/97fcfba8385b02b3eb6e64183a888a098fb371d0))
* missing tooltip for fullscreen button on front-office ([8a624d9](https://github.com/ReliefApplications/oort-frontend/commit/8a624d981639cd7debca62c291cbe1742e2429f9))
* number in center of clusters not aligned ([1bca1f6](https://github.com/ReliefApplications/oort-frontend/commit/1bca1f620c1237ab3bcc1fdbabe808c24f48437e)), closes [bugfix/AB#63765](https://github.com/bugfix/AB/issues/63765) [bugfix/AB#63765](https://github.com/bugfix/AB/issues/63765)
* popup text element could go out of bounds ([203001a](https://github.com/ReliefApplications/oort-frontend/commit/203001aa41e8bd4580e8c30d72bbd1d098d773da))
* renderer type incorrectly set in layerDefinitionForm ([73f224b](https://github.com/ReliefApplications/oort-frontend/commit/73f224baaa325d5964fa5409c659c8ebdc8a0512))
* search with filter not working in GetResources queries ([054fa48](https://github.com/ReliefApplications/oort-frontend/commit/054fa48087b483ce27fa31b18ffcd94268669cf7))
* some layers would break the map when loading due to incorrect API call ([35a50a0](https://github.com/ReliefApplications/oort-frontend/commit/35a50a0800caf0e3370dd8f36f3a2afdd162aa98))
* some layers would break the map when loading due to incorrect API call ([d305963](https://github.com/ReliefApplications/oort-frontend/commit/d30596359ced6b2f39c4b8180607c0a99c069d52))
* some lint issues and incorrect logic in the edition of geofields ([470819e](https://github.com/ReliefApplications/oort-frontend/commit/470819e279f56fdfce3e38edfced7c3d7ba9a3a2))
* subscribe to geoForm lat/lng ([40e19ba](https://github.com/ReliefApplications/oort-frontend/commit/40e19ba7e76fce2e0fa008ad29c596b503f3f573))
* unable to scroll when using expression builder in calculated fields UI ([334b4da](https://github.com/ReliefApplications/oort-frontend/commit/334b4dac2eb463e06d15eb729ac469dfda1947fe))
* unionBy causing type issue in update-queries method ([b1dff4a](https://github.com/ReliefApplications/oort-frontend/commit/b1dff4a375b66d2bd8e4e7fe44a3e585d68051b9))
* visibility of parent could break visibility of children elements in layers ([7b48e79](https://github.com/ReliefApplications/oort-frontend/commit/7b48e79af44511df4e0406130fee1907f58086bc))
* visibility was not correctly working for some layers ([0f66086](https://github.com/ReliefApplications/oort-frontend/commit/0f6608648629a5e0ecf3cc19cc46be3e9f095584))
* webmap incorrect options in searchbar ([#1405](https://github.com/ReliefApplications/oort-frontend/issues/1405)) ([20b95da](https://github.com/ReliefApplications/oort-frontend/commit/20b95da15726a55c2c2cd7b8c3dbb62b4ed14f9e))


### Features

* add contextual menu to relevant controls using tinymce editor ([b8902df](https://github.com/ReliefApplications/oort-frontend/commit/b8902dfb45342b5883580edb66788fa78b24ed3b))
* add dashboard button actions ([9f52272](https://github.com/ReliefApplications/oort-frontend/commit/9f52272100361f3f933358a4d8a65a98164f1da9))
* add fields component in map layer settings ([6327f21](https://github.com/ReliefApplications/oort-frontend/commit/6327f21663ae04d4e0b20e744497dd05f37917f4))
* add heatmap to map-forms ([ca9af30](https://github.com/ReliefApplications/oort-frontend/commit/ca9af30fde313787eb0b942741641bd6e54bf353))
* add missing translations ([8c504ac](https://github.com/ReliefApplications/oort-frontend/commit/8c504ac58dd744d6bdd93db0984a50c97df5296c))
* add new control for tinymce editor, usable in mat form fields ([984ba1d](https://github.com/ReliefApplications/oort-frontend/commit/984ba1d8f5feecf381d601b063f8d7eca045bc0a)), closes [refactor/AB#61059](https://github.com/refactor/AB/issues/61059)
* can now go to previous step automatically from a dashboard in a workflow ([4d592d1](https://github.com/ReliefApplications/oort-frontend/commit/4d592d1dfdbc4db3233b1344a3b3d07adaf609ba)), closes [2.1.x/AB#10686](https://github.com/2.1.x/AB/issues/10686)
* can now group layers ([a99a17f](https://github.com/ReliefApplications/oort-frontend/commit/a99a17fcf63ec4acb67c0e26243913bd208af998))
* geomap working ([ce44cc9](https://github.com/ReliefApplications/oort-frontend/commit/ce44cc9fc6a14628c80f2fee23fc49e09242abe7))
* improve hide page feature ([15ec6d1](https://github.com/ReliefApplications/oort-frontend/commit/15ec6d1fa9cdfb82a97e68c0df837c6dc1ccdc3b))
* improve layers select styling ([bb0ecd8](https://github.com/ReliefApplications/oort-frontend/commit/bb0ecd8c4473a2fbd30a92099c4f8feb7b1a3e56))
* possibility to hide pages' ([0ba87cd](https://github.com/ReliefApplications/oort-frontend/commit/0ba87cdfcec7ac1d67e52ad2cc063ea3d71e9747))
* see markers from grid when opening geospatial question ([7231a50](https://github.com/ReliefApplications/oort-frontend/commit/7231a5013dd67302b6cfa495bb474c8d46a5cef8)), closes [Feat/ab#60047](https://github.com/Feat/ab/issues/60047)
* sidenav can now be collapsed on large screens ([49d74d7](https://github.com/ReliefApplications/oort-frontend/commit/49d74d757dddf4f31c7502800e5163a95b8ea446))
* zoom control new styling added to maps ([#1427](https://github.com/ReliefApplications/oort-frontend/issues/1427)) ([202504e](https://github.com/ReliefApplications/oort-frontend/commit/202504e3f8363a198e2cfc383a8b59f3319fabfa))

# [2.0.0-beta.17](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-beta.16...v2.0.0-beta.17) (2023-07-03)


### Bug Fixes

* add records on resource(s) questions ([51d0991](https://github.com/ReliefApplications/oort-frontend/commit/51d0991c808ec2d76b9812ea5e789352dd5404d2))
* duplicate users could be seen when adding roles to users ([642af8b](https://github.com/ReliefApplications/oort-frontend/commit/642af8bd1a9fc2d578551d309f28a8b7878360ea))
* email template links + upload from FO ([7ac159e](https://github.com/ReliefApplications/oort-frontend/commit/7ac159e1ba10b02537d380fb081a728dd42df96e))
* incorrect overflow in summary cards ([58be2ca](https://github.com/ReliefApplications/oort-frontend/commit/58be2cae7d865227c42e41987b84501b58137419))
* incorrect pointer-events for dashboard-filter ([19357f3](https://github.com/ReliefApplications/oort-frontend/commit/19357f3d303b09017aef56ea7c881fedbe67a7b0))
* issue with records being saved with incorrect resource(s) ids ([63eaacc](https://github.com/ReliefApplications/oort-frontend/commit/63eaacc632bd2688bd51e625dc3f31313d917785))
* issues with tabs button actions in grid settings ([9eb00c1](https://github.com/ReliefApplications/oort-frontend/commit/9eb00c18a48d75e18c690d41d1dbb69bcb0cb4a9))
* pagination on aggregations ([30a3a4b](https://github.com/ReliefApplications/oort-frontend/commit/30a3a4b395a0183ef3dd3ecd6b9aff74bb095120))
* queryName would not be used when editing layout from summary card / text widget ([2c953de](https://github.com/ReliefApplications/oort-frontend/commit/2c953de5f66bcd74ac41f0ebd5a0e73ef7c1c61e))
* scroll indicator in summary card could appear infinitively ([d4f1ee3](https://github.com/ReliefApplications/oort-frontend/commit/d4f1ee336885b4c0fa8d511cfae9c5ccbf2b6cef))
* search mode would appear on summary card even if grid view was enabled ([65918d2](https://github.com/ReliefApplications/oort-frontend/commit/65918d2c778d2eec4fb833eac7743abcf228181b))
* select records on resources and resource question not updating ([0402cb7](https://github.com/ReliefApplications/oort-frontend/commit/0402cb7e03133bae9cdd2bce7fe1ffa88824aea6))
* size of tabs title and overflow ([6eec8ac](https://github.com/ReliefApplications/oort-frontend/commit/6eec8ac2b5b1a19056766e5d83990cee46f7d489))
* tagbox and dropdown question enable/disable status ([d643fae](https://github.com/ReliefApplications/oort-frontend/commit/d643fae931aafc467c2737a491f254d856c95ba1))
* users list was not filtering on username ([bc675fa](https://github.com/ReliefApplications/oort-frontend/commit/bc675fa301a32261e1e83c31781fd2aa28eac378))


### Features

* allow page to be injected as urls in tinymce for editor / summary card widgets ([4b5f3df](https://github.com/ReliefApplications/oort-frontend/commit/4b5f3dfe715f718ae2fca82291cbe0fca288791c))
* using routerlink on link instead of list element ([38b7961](https://github.com/ReliefApplications/oort-frontend/commit/38b7961a0b9c6cdaaab9d2e3fc3799f2aa6337a3))

# [2.0.0-beta.16](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-beta.15...v2.0.0-beta.16) (2023-06-19)


### Bug Fixes

* circular dependency in tabs files ([e86939a](https://github.com/ReliefApplications/oort-frontend/commit/e86939a0e17bddf1ca65c0600e88268827e7c1df))
* distribution list incorrect input validation ([729f264](https://github.com/ReliefApplications/oort-frontend/commit/729f264e6bec8f83f940d52a02d63b312dba28c8))
* duplication of diviver in layout user menu ([4808637](https://github.com/ReliefApplications/oort-frontend/commit/48086371a492a1582c50d2a0a7c6638b38768c7f))
* errors in button config ([38c72c9](https://github.com/ReliefApplications/oort-frontend/commit/38c72c92b359e3fc08c4eb291a5d173e2a513386))
* hide side menu on app preview ([c05749b](https://github.com/ReliefApplications/oort-frontend/commit/c05749b631f7ba3a50a31a8a1259f7cf25e5188e))
* incorrect query builder due to lazy loading missing in tabs ([016d3f9](https://github.com/ReliefApplications/oort-frontend/commit/016d3f971bad0a6853bca51886ef57ecfe64ddd5))
* incorrect use of top navigation in applications ([c3c949d](https://github.com/ReliefApplications/oort-frontend/commit/c3c949d3b8f66e291e0712ac8b3b83807693cb6c))
* issue with autocomplete not displaying correct keys ([81e1ce9](https://github.com/ReliefApplications/oort-frontend/commit/81e1ce91a0eb16c8dd060bb6d852a2b83f21e382))
* issue with display of avatars in summary cards / text widgets ([9adb373](https://github.com/ReliefApplications/oort-frontend/commit/9adb373fbe3ed73b04b54d9b115262a1eb9b614e))
* issue with dropdown widget not sending data ([7e8e2b2](https://github.com/ReliefApplications/oort-frontend/commit/7e8e2b2c3c3739b88af415098be9e936d256d83a))
* issue with filter fields on record history ([74887f6](https://github.com/ReliefApplications/oort-frontend/commit/74887f6a72b152f3d434247800940a31bfa360a7))
* put back ability to load page in front-office using url ([0aa2d8a](https://github.com/ReliefApplications/oort-frontend/commit/0aa2d8a98ee04a4f8c15683004fd2831f0dcf279))

# [2.0.0-beta.15](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-beta.14...v2.0.0-beta.15) (2023-06-14)


### Bug Fixes

* add save method in the column chooser ([#1420](https://github.com/ReliefApplications/oort-frontend/issues/1420)) ([ca55887](https://github.com/ReliefApplications/oort-frontend/commit/ca55887e48f4551cad4433104d54a4ae694a6664))
* bug on replaceRecordFields ([#1454](https://github.com/ReliefApplications/oort-frontend/issues/1454)) ([aa603a2](https://github.com/ReliefApplications/oort-frontend/commit/aa603a2289028f4f42831404959e20fe02a6c42e))
* compilation error ([e8a232c](https://github.com/ReliefApplications/oort-frontend/commit/e8a232c88b6b43fbdf870afa1a507925fd4cc9d3))
* dashboard filter layout issue on workflows ([ca03d64](https://github.com/ReliefApplications/oort-frontend/commit/ca03d64a40c6615a5e17bda6c0bfd008d00e3b6d)), closes [Bugfix/ab#65852](https://github.com/Bugfix/ab/issues/65852)
* date picker not properly updating with enabled conditions ([#1439](https://github.com/ReliefApplications/oort-frontend/issues/1439)) ([81bcaf8](https://github.com/ReliefApplications/oort-frontend/commit/81bcaf80ad79a89167b2600815c7b5891b13351a))
* display issue when hovering steps ([7abb1e4](https://github.com/ReliefApplications/oort-frontend/commit/7abb1e4df0cf3e8170f14fccbeab6a4596e890a7))
* display of select label ([75fa385](https://github.com/ReliefApplications/oort-frontend/commit/75fa3851e2e509f5c90bda5515f57ba8ea0926a0))
* few issues related to tailwind ([ef5d4e7](https://github.com/ReliefApplications/oort-frontend/commit/ef5d4e7bdae289139bfd57a86fafd3655c94611c))
* front office could not build ([7be6916](https://github.com/ReliefApplications/oort-frontend/commit/7be6916779b064ccf1e645024b07ce41914aff93))
* incorrect API of confirm service after tailwind update ([ae407d6](https://github.com/ReliefApplications/oort-frontend/commit/ae407d6f3aac44d1fab2a32889e2a79d5dcc8fb3))
* incorrect history display ([5fbf04b](https://github.com/ReliefApplications/oort-frontend/commit/5fbf04b4d8376504f06229f0a4c9a0ffef79f3a8))
* incorrect icon displayed on role resources page ([f97533c](https://github.com/ReliefApplications/oort-frontend/commit/f97533c2ce6aefa21995ee4b8c0710bb811c960e))
* incorrect position of dashboard filter ([0d03f60](https://github.com/ReliefApplications/oort-frontend/commit/0d03f60edf13018bf57803f5a81099aa3c34d1e1))
* incorrect reference data dropdwon ([ec187a0](https://github.com/ReliefApplications/oort-frontend/commit/ec187a0b2b3961a7ded97c1967a477227b91a1e0))
* incorrect replacement of tab, now introducing lazy loading to fix some broken behaviors ([fcb7985](https://github.com/ReliefApplications/oort-frontend/commit/fcb798500dcc439215a056499761ba3ea7535280))
* incorrect select menu display if custom template ([78272f6](https://github.com/ReliefApplications/oort-frontend/commit/78272f69da3951a12e0c6fabe05eb10c8fbf2fdc))
* incorrect style of menus ([85fee50](https://github.com/ReliefApplications/oort-frontend/commit/85fee50f667f30900bf6cf5d682e1d2900f30c28))
* incorrect text orientation for dashboard filter quick value when put on left ([fd93d46](https://github.com/ReliefApplications/oort-frontend/commit/fd93d46a43ce89891b7b3cc9d9168c6bb7c1011e))
* incorrect text widget settings ([#1417](https://github.com/ReliefApplications/oort-frontend/issues/1417)) ([e450038](https://github.com/ReliefApplications/oort-frontend/commit/e450038b5e7504e684c60a84067e7d2642647089))
* incorrect use of graphqlname in text widget ([090b8ba](https://github.com/ReliefApplications/oort-frontend/commit/090b8babf192e6647b85e6d686a5ba4ad0a56abf))
* incorrect use of radio component value ([02d447c](https://github.com/ReliefApplications/oort-frontend/commit/02d447c392255a93d598e1fe0a9ab924396b36e7))
* infinite pagination not working for summary cards ([38bf9f2](https://github.com/ReliefApplications/oort-frontend/commit/38bf9f26527901eb9c5e610ba553803ea4d2237b))
* issue with borderless widgets after tailwind update ([0084ab5](https://github.com/ReliefApplications/oort-frontend/commit/0084ab50d24a5b7cfb0df9a39d5870107e199a8f))
* issues with surveyjs ([4333a30](https://github.com/ReliefApplications/oort-frontend/commit/4333a30e84852f91efa3381e8c4b2adb36e266f4))
* jsonpath not being reflected for rest ref data ([aa61734](https://github.com/ReliefApplications/oort-frontend/commit/aa617349cdeea1cf4a6f309e6dd1990efa6823cc))
* load correct workflow step page from shared URL or when refreshing page ([4e54758](https://github.com/ReliefApplications/oort-frontend/commit/4e54758abd119195eb547478173cc50785ce5bd9))
* many issues with form field wrapper directive ([476d641](https://github.com/ReliefApplications/oort-frontend/commit/476d64187c970d78d6a0a6f731905f14b5282851))
* missing variant error in tab-fields + incorrect check in query-builder component to hide label ([6a1f18b](https://github.com/ReliefApplications/oort-frontend/commit/6a1f18b6998861364236346a6f73afbd3876a8d4))
* pointer events on dashboard filter would prevent some buttons to be clicked on ([0bafe88](https://github.com/ReliefApplications/oort-frontend/commit/0bafe88613c695fa7aef247f6d2bb45d385c15ad))
* read only resource questions add record button ([215d2cc](https://github.com/ReliefApplications/oort-frontend/commit/215d2cc41526e02bdab193637cab92970e76f730))
* reference data multiselect not appearing on grids ([91f5b56](https://github.com/ReliefApplications/oort-frontend/commit/91f5b563a6f70a71f37167b5efb44775310ab87d))
* reference data question could not be saved ([deae9c0](https://github.com/ReliefApplications/oort-frontend/commit/deae9c044727c70c09228d2402a9a0f51b539f5b))
* send emails to recipients not in the distribution list ([#1421](https://github.com/ReliefApplications/oort-frontend/issues/1421)) ([a9367a3](https://github.com/ReliefApplications/oort-frontend/commit/a9367a34f8dec19748a599fea32017cbada3959c))
* should remove blank page when going to the platform ([649985a](https://github.com/ReliefApplications/oort-frontend/commit/649985ab7c94dae354374fe09968e3b02caedd3b)), closes [bugfix/AB#35941_SA-IMST-R4](https://github.com/bugfix/AB/issues/35941_SA-IMST-R4)
* summary card preview is not available ([#1407](https://github.com/ReliefApplications/oort-frontend/issues/1407)) ([90b9f66](https://github.com/ReliefApplications/oort-frontend/commit/90b9f6690f33ccb355eb85facb208027688739ee))
* tailwind display issues in query builder ([0fbae0c](https://github.com/ReliefApplications/oort-frontend/commit/0fbae0c9d8ac7cac28aff081e2614dae9eb51b86))
* tailwind was applying styling to all inputs, even non tailwind ones ([23a5eb7](https://github.com/ReliefApplications/oort-frontend/commit/23a5eb72d6b9772560d816297ec7855198ec67f2))
* toggle not appearing in summary card settings module ([6222290](https://github.com/ReliefApplications/oort-frontend/commit/6222290de9ab552f7fcea775b828cc5f6c0b67a6))
* ui-radio missing checked input ([5e2c38e](https://github.com/ReliefApplications/oort-frontend/commit/5e2c38ea6955ce8324ccce1e83ad60885bc5d203))
* unique related name check to resources questions ([#1436](https://github.com/ReliefApplications/oort-frontend/issues/1436)) ([771012b](https://github.com/ReliefApplications/oort-frontend/commit/771012bac47dcb7ee6ab4fe702d0df6671311ac2))
* update of resource's roles permissions ([#1414](https://github.com/ReliefApplications/oort-frontend/issues/1414)) ([a887bd0](https://github.com/ReliefApplications/oort-frontend/commit/a887bd023330e090e7c7acf53496d1e6aea6b092))
* values instead of labels appearing on custom filter in dashboards ([2045fdb](https://github.com/ReliefApplications/oort-frontend/commit/2045fdbfa6a9c9c39b3466755c1507fd3b334e25)), closes [bugfix/AB#65520](https://github.com/bugfix/AB/issues/65520) [bugfix/AB#65520](https://github.com/bugfix/AB/issues/65520)
* values instead of labels were displayed in dashboard filters ([37f628d](https://github.com/ReliefApplications/oort-frontend/commit/37f628d248ac387b6bcb1f078269c62f15f85a30))
* wrong behavior with empty status of filters ([7a73b9e](https://github.com/ReliefApplications/oort-frontend/commit/7a73b9e259db817254d83705ae3f82e961d37ce5))


### Features

* add lastUpdateForm field ([2df7921](https://github.com/ReliefApplications/oort-frontend/commit/2df7921b05e176d68b47d3c3aa5c04a096410886))
* allow distribution list to be empty ([808c23f](https://github.com/ReliefApplications/oort-frontend/commit/808c23f92a73e5942814455ca3b1f326223f0b84))
* can now integrate avatars in text widgets / summary cards widgets ([7a786fa](https://github.com/ReliefApplications/oort-frontend/commit/7a786fa46593e3d8a8e65eee3edab27b7a92193d)), closes [Feat/ab#66067](https://github.com/Feat/ab/issues/66067)
* possibility to move up / move down questions in forms ([e24bb3e](https://github.com/ReliefApplications/oort-frontend/commit/e24bb3eb4dcd25440211d949c8909906c22d81f1))

# [2.0.0-beta.14](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-beta.13...v2.0.0-beta.14) (2023-05-31)


### Bug Fixes

* adding a preview to images question URL ([0c284a0](https://github.com/ReliefApplications/oort-frontend/commit/0c284a0c298a5dba01285ee40f450bdf48c6e380))
* apply styles on summary card ([#1394](https://github.com/ReliefApplications/oort-frontend/issues/1394)) ([9ccdf8c](https://github.com/ReliefApplications/oort-frontend/commit/9ccdf8cf1655d995d61a5c3e748773c3a9275638))
* date / datetime / time can now be used in triggers in surveyjs ([6b1fc3d](https://github.com/ReliefApplications/oort-frontend/commit/6b1fc3d7f40a0136907bb52ba69dbd80cf713c02))
* emails can no longer be sent without subjects ([3462daf](https://github.com/ReliefApplications/oort-frontend/commit/3462daf8a94805ad78b441cb006626d0f2737271))
* fields not loading in summary cards settings by default ([8eb72e0](https://github.com/ReliefApplications/oort-frontend/commit/8eb72e0436f9451acb19001cf8562c4be07ae9be))
* fullscreen now available for workflows ([15a4877](https://github.com/ReliefApplications/oort-frontend/commit/15a48771e782391e658b2673e6d0d80620dc092b))
* grid widget should stop loading if no data change detected when refetching ([3f25d57](https://github.com/ReliefApplications/oort-frontend/commit/3f25d57fde724beb5d616301be6e4bb72a623e91))
* horizontal nav items incorrect width ([322d9cd](https://github.com/ReliefApplications/oort-frontend/commit/322d9cd2eab1a1d93bd98dae8d1d65c38865fc15))
* horizontal pages would break display of sidenav content if right sidenav enabled ([7f6d4ce](https://github.com/ReliefApplications/oort-frontend/commit/7f6d4ce1b931d1d78260b38c5b6296e6dd8790a9))
* incorrect applyToWholeCard option ([a177a92](https://github.com/ReliefApplications/oort-frontend/commit/a177a9241fb0b06c3f0af2e742bc5b663e9ff701))
* incorrect choice callback in ref data ([#1401](https://github.com/ReliefApplications/oort-frontend/issues/1401)) ([42f6204](https://github.com/ReliefApplications/oort-frontend/commit/42f62042fb843dae2fd998e1fd913c9914408080))
* incorrect show series text ([05e60ff](https://github.com/ReliefApplications/oort-frontend/commit/05e60ff88f0a1b8b895ee5ef7a6526db7480726a))
* incorrect tooltip position on forms when multi questions per line active ([c0b24b9](https://github.com/ReliefApplications/oort-frontend/commit/c0b24b964e275978f8dab79fe8ee1215b6508c3a))
* infinite scrolling ([753b382](https://github.com/ReliefApplications/oort-frontend/commit/753b3826f42505ad2b775c291b775923615238c7))
* pagination issue in ref data table ([3dd142e](https://github.com/ReliefApplications/oort-frontend/commit/3dd142e68729bf6272214f48610d5c558bf94c60))
* refData fetched through graphQL APIs ([d9f1c59](https://github.com/ReliefApplications/oort-frontend/commit/d9f1c594e0d340e1f7434511726b096e3b2a6ef9))
* search on static cards ([c738e6e](https://github.com/ReliefApplications/oort-frontend/commit/c738e6ef70727a8cfa6ad65bf263fd0e3434103e))
* search on summary cards would be duplicated if grid mode activated ([abf4646](https://github.com/ReliefApplications/oort-frontend/commit/abf4646d47eb4dc948d05702fc37d29da36d1a37))
* user list would not perform pagination as expected ([0636e49](https://github.com/ReliefApplications/oort-frontend/commit/0636e49420dfcde2bd08bc2df852859d7758c784))


### Features

*  select / unselect all columns in grid column chooser ([5312a7e](https://github.com/ReliefApplications/oort-frontend/commit/5312a7e584008fe0144fa8c15086b38b7cf1335c)), closes [Feat/ab#11381](https://github.com/Feat/ab/issues/11381)
* adding an alert to inform user it is possible to include variables in summary card ([6ed4e8a](https://github.com/ReliefApplications/oort-frontend/commit/6ed4e8a1b552984dade3a9163a9ea35d2b3d665e))
* allow urls to be loaded as images in summary cards ([f0ac681](https://github.com/ReliefApplications/oort-frontend/commit/f0ac681f8c6409ec93725c5af10985722e6c3cb8)), closes [Feat/ab#63149](https://github.com/Feat/ab/issues/63149)
* distribution list is now editable ([a0274ac](https://github.com/ReliefApplications/oort-frontend/commit/a0274ac4ce85ba10d250a0c596e4de47c5775beb))
* empty filter are now indicated in dashboards ([#1393](https://github.com/ReliefApplications/oort-frontend/issues/1393)) ([102971a](https://github.com/ReliefApplications/oort-frontend/commit/102971a499ff2c0970576515d289f62b829ab04f))
* implement search on summary cards ([f5f661e](https://github.com/ReliefApplications/oort-frontend/commit/f5f661eecb861fcf3f8ce0d9407fd18d95004666))
* pagination on summary cards ([99ae731](https://github.com/ReliefApplications/oort-frontend/commit/99ae7311aeb650f5f925478a860d5d45d3bc2295))
* possibility to have pages on top of the app ([624f3dc](https://github.com/ReliefApplications/oort-frontend/commit/624f3dc14f4ce0692883eba97d11f4f0ea02c51e))

# [2.0.0-beta.13](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2023-05-19)


### Bug Fixes

* errors on survey submit (edge cases) ([bdea6d2](https://github.com/ReliefApplications/oort-frontend/commit/bdea6d20a9c45bc74129f934e1a22220c2ca609c))


### Features

* add snackbar when CUD for distribution lists, notification template & custom ([5033358](https://github.com/ReliefApplications/oort-frontend/commit/503335820c65991a64077e2ea0f817b9aabf2416))

# [2.0.0-beta.12](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2023-05-15)


### Bug Fixes

* can now use triggers on date / datetime / time questions in forms ([7446ede](https://github.com/ReliefApplications/oort-frontend/commit/7446edeb8f0ee25f9079bf90f7891ebb3bba4960))
* export of records not working ([464708b](https://github.com/ReliefApplications/oort-frontend/commit/464708b3ee0c2f4a4b994c8cff5d45775c3a8b74))


### Features

* add custom listRowsWithColValue function ([0620dfd](https://github.com/ReliefApplications/oort-frontend/commit/0620dfdbc43b79dab7e90936d5d9fb4d00d56e17))
* add file type questions in possible types for matrix question ([0ecf108](https://github.com/ReliefApplications/oort-frontend/commit/0ecf1081fb50933caf0e27afec82a662aca4bd97))
* email subject is now editable ([f4396e9](https://github.com/ReliefApplications/oort-frontend/commit/f4396e9d390417ae0efe2ee397e0c2667308fd01))
