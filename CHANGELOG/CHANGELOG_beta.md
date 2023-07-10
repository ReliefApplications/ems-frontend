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
