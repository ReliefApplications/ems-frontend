# [2.17.0-alpha.8](https://github.com/ReliefApplications/ems-frontend/compare/v2.17.0-alpha.7...v2.17.0-alpha.8) (2024-11-18)


### Features

* prevent map auto jump when close to bounds, and allow map to duplicate on left & right ([#2698](https://github.com/ReliefApplications/ems-frontend/issues/2698)) ([44b4d77](https://github.com/ReliefApplications/ems-frontend/commit/44b4d774fb141210515c95229a78d1a01a000604)), closes [Ab#105504](https://github.com/Ab/issues/105504)

# [2.17.0-alpha.7](https://github.com/ReliefApplications/ems-frontend/compare/v2.17.0-alpha.6...v2.17.0-alpha.7) (2024-11-18)


### Features

* add option to use a display field for records elements of queries ([#2630](https://github.com/ReliefApplications/ems-frontend/issues/2630)) ([27a7d90](https://github.com/ReliefApplications/ems-frontend/commit/27a7d90288c004d7a909d837c526913663cb798d)), closes [AB#103431](https://github.com/AB/issues/103431)

# [2.17.0-alpha.6](https://github.com/ReliefApplications/ems-frontend/compare/v2.17.0-alpha.5...v2.17.0-alpha.6) (2024-11-18)


### Bug Fixes

* meta data not correctly set in editor widget ([0a7f5b6](https://github.com/ReliefApplications/ems-frontend/commit/0a7f5b6332b0768d3b4b27551012bd19ec52c6dd))

# [2.17.0-alpha.5](https://github.com/ReliefApplications/ems-frontend/compare/v2.17.0-alpha.4...v2.17.0-alpha.5) (2024-11-15)


### Bug Fixes

* step redirection within a loaded workflow using workflow outside actions, e.g. action buttons ([#2695](https://github.com/ReliefApplications/ems-frontend/issues/2695)) ([fecbf5a](https://github.com/ReliefApplications/ems-frontend/commit/fecbf5a62243e7abca565195245360c093c32431)), closes [AB#105859](https://github.com/AB/issues/105859)


### Features

* allow expression builder to inject in editor widgets a record from context ([#2693](https://github.com/ReliefApplications/ems-frontend/issues/2693)) ([f0feab6](https://github.com/ReliefApplications/ems-frontend/commit/f0feab6ae9ff6617fca884f720bd126fccfcb5a7)), closes [AB#105413](https://github.com/AB/issues/105413)

# [2.17.0-alpha.4](https://github.com/ReliefApplications/ems-frontend/compare/v2.17.0-alpha.3...v2.17.0-alpha.4) (2024-11-14)


### Features

* add context after record addition / edition in application pages / steps forms ([#2691](https://github.com/ReliefApplications/ems-frontend/issues/2691)) ([5041042](https://github.com/ReliefApplications/ems-frontend/commit/504104201ef1bfe8f372f905a339c5bccf2a3532)), closes [AB#105659](https://github.com/AB/issues/105659)

# [2.17.0-alpha.3](https://github.com/ReliefApplications/ems-frontend/compare/v2.17.0-alpha.2...v2.17.0-alpha.3) (2024-11-13)


### Bug Fixes

* custom filtering for resources question not correctly setting filter when value prepopulated in form ([#2684](https://github.com/ReliefApplications/ems-frontend/issues/2684)) ([9e1a6ad](https://github.com/ReliefApplications/ems-frontend/commit/9e1a6addbb6c592e041e7daf79beff544dffe886)), closes [AB#105484](https://github.com/AB/issues/105484)


### Features

* allow to auto select first element from choices if unique choice provided, in resource question  ([#2685](https://github.com/ReliefApplications/ems-frontend/issues/2685)) ([cb259cf](https://github.com/ReliefApplications/ems-frontend/commit/cb259cff481b143d198bf6e2af78442059736547)), closes [AB#105619](https://github.com/AB/issues/105619)
* form quick action buttons ([#2683](https://github.com/ReliefApplications/ems-frontend/issues/2683)) ([e6dfff8](https://github.com/ReliefApplications/ems-frontend/commit/e6dfff8b04c85b33fb48d53fcaac39aec7285fa9)), closes [AB#104815](https://github.com/AB/issues/104815)

# [2.17.0-alpha.2](https://github.com/ReliefApplications/ems-frontend/compare/v2.17.0-alpha.1...v2.17.0-alpha.2) (2024-11-08)


### Features

* add unsubscribe from notification action in custom action buttons ([#2682](https://github.com/ReliefApplications/ems-frontend/issues/2682)) ([aff79c5](https://github.com/ReliefApplications/ems-frontend/commit/aff79c540285544170c645db0560bc519d6e9fb3)), closes [AB#105519](https://github.com/AB/issues/105519)

# [2.17.0-alpha.1](https://github.com/ReliefApplications/ems-frontend/compare/v2.16.0...v2.17.0-alpha.1) (2024-11-08)


### Bug Fixes

* add better error handling for upload files AB[#64764](https://github.com/ReliefApplications/ems-frontend/issues/64764) ([7296228](https://github.com/ReliefApplications/ems-frontend/commit/72962285363130599868dbc003d7e6f08d95b6f3))
* Broken navigation to some pages after baseHref change ([#2666](https://github.com/ReliefApplications/ems-frontend/issues/2666)) ([7797221](https://github.com/ReliefApplications/ems-frontend/commit/779722185d92c8f89fa19772980281ece97ceda9)), closes [AB#104811](https://github.com/AB/issues/104811)
* charts using auth code ref data would break if using context ([#2570](https://github.com/ReliefApplications/ems-frontend/issues/2570)) ([27af861](https://github.com/ReliefApplications/ems-frontend/commit/27af8617882437454ef0183e0e76cf5dd5e5d6f3))
* email distribution list filter logic not taken into account ([#2623](https://github.com/ReliefApplications/ems-frontend/issues/2623)) ([4cc4b91](https://github.com/ReliefApplications/ems-frontend/commit/4cc4b913e5b578135dc0512f2c3ef5afc5b89aae))
* expand text modal in grids not showing correct field title ([#2568](https://github.com/ReliefApplications/ems-frontend/issues/2568)) ([09cead3](https://github.com/ReliefApplications/ems-frontend/commit/09cead38e03908c23b3b73a856b165e7ea0eb55f))
* gql ref data would not query from correct endpoint when editing ([745a14c](https://github.com/ReliefApplications/ems-frontend/commit/745a14c6da2b7dfea9d20ac8997c5045dd1bba59))
* html question shows correct field title when expanded from grid ([#2642](https://github.com/ReliefApplications/ems-frontend/issues/2642)) ([9658f9f](https://github.com/ReliefApplications/ems-frontend/commit/9658f9f7ca8fa76b292a8989e2923e3e0de84553)), closes [AB#104241](https://github.com/AB/issues/104241)
* improve replaceContext method of context service ([#2636](https://github.com/ReliefApplications/ems-frontend/issues/2636)) ([a75e1cc](https://github.com/ReliefApplications/ems-frontend/commit/a75e1cc52af1e388c8892d23086fe5ebfa069bd2)), closes [AB#104226](https://github.com/AB/issues/104226)
* in some cases, html value would not render in grid ([e84e095](https://github.com/ReliefApplications/ems-frontend/commit/e84e09522d98421794d35501fb440d34d83510dc))
* incorrect integrity key for aria-query package ([728cef0](https://github.com/ReliefApplications/ems-frontend/commit/728cef0fac57c3961ac3e45694ca360cf446a7af))
* incorrect pathname stored in redirectPath before auth, for front-office instances using href ([5cbf38c](https://github.com/ReliefApplications/ems-frontend/commit/5cbf38c0b1ae9646bd30fb8d22ed1c9ebb167163))
* incorrect permission check for visibility of resource page in back-office ([#2627](https://github.com/ReliefApplications/ems-frontend/issues/2627)) ([3f0946a](https://github.com/ReliefApplications/ems-frontend/commit/3f0946ab14a4788fb617e93a037c83c833e7ae69))
* issue with missing shortcut would always redirect to default page of app ([3858947](https://github.com/ReliefApplications/ems-frontend/commit/385894778f08fd8ec571af7399f9db09272d726f))
* on quick action, rows would not be cleared ([#2649](https://github.com/ReliefApplications/ems-frontend/issues/2649)) ([1e59bcb](https://github.com/ReliefApplications/ems-frontend/commit/1e59bcbae711450143f7f7d3721cce77a3dfbb02)), closes [AB#104381](https://github.com/AB/issues/104381)
* pages marked as hidden should not display in front-office  ([#2647](https://github.com/ReliefApplications/ems-frontend/issues/2647)) ([3c3b942](https://github.com/ReliefApplications/ems-frontend/commit/3c3b9426bc4be8994b13411becdc39077b4534a8)), closes [AB#104349](https://github.com/AB/issues/104349)
* resources question incorrect default display in html widgets ([#2634](https://github.com/ReliefApplications/ems-frontend/issues/2634)) ([6278861](https://github.com/ReliefApplications/ems-frontend/commit/627886146076ac7cd20dd914e12bb282b586be9c)), closes [AB#104166](https://github.com/AB/issues/104166)
* search not included in redirection after login ([#2658](https://github.com/ReliefApplications/ems-frontend/issues/2658)) ([b99b7ae](https://github.com/ReliefApplications/ems-frontend/commit/b99b7ae9647bf1317932c33b940019988a4a00fe)), closes [AB#104570](https://github.com/AB/issues/104570)
* single geographic extent should now use all items with target value ([#2638](https://github.com/ReliefApplications/ems-frontend/issues/2638)) ([24fb86f](https://github.com/ReliefApplications/ems-frontend/commit/24fb86f4d2dc2282a577e29ab5ef6207899ac31f)), closes [AB#104254](https://github.com/AB/issues/104254)


### Features

* add addRecord action in custom action buttons of dashboard ([#2663](https://github.com/ReliefApplications/ems-frontend/issues/2663)) ([575db73](https://github.com/ReliefApplications/ems-frontend/commit/575db73f20a393b88aae15278ebf97b6fd3441fe)), closes [AB#104720](https://github.com/AB/issues/104720)
* add canDownloadRecords permission ([#2600](https://github.com/ReliefApplications/ems-frontend/issues/2600)) ([259ae8c](https://github.com/ReliefApplications/ems-frontend/commit/259ae8c404bab47dba4992aab47ceac618aaf224))
* add class break layer ([#2656](https://github.com/ReliefApplications/ems-frontend/issues/2656)) ([e08bc09](https://github.com/ReliefApplications/ems-frontend/commit/e08bc090a0103e3c56591bceb185f4038235e6d7)), closes [AB#104485](https://github.com/AB/issues/104485)
* add date calc method for html widgets ([#2648](https://github.com/ReliefApplications/ems-frontend/issues/2648)) ([a4b7857](https://github.com/ReliefApplications/ems-frontend/commit/a4b785793157137776778c120e52a8e9f0ed188c)), closes [AB#104296](https://github.com/AB/issues/104296)
* add EditRecord & goToPreviousPage actions in custom action button of dashboard  ([#2660](https://github.com/ReliefApplications/ems-frontend/issues/2660)) ([04e9c92](https://github.com/ReliefApplications/ems-frontend/commit/04e9c92077f90cc1fc62e4d869ae676794f9a903)), closes [AB#104621](https://github.com/AB/issues/104621)
* add possibility to auto reload dashboard when using editRecord / addRecord actions ([#2675](https://github.com/ReliefApplications/ems-frontend/issues/2675)) ([ddac625](https://github.com/ReliefApplications/ems-frontend/commit/ddac6254a1efc37991123a440d0e68da5832c407)), closes [AB#104882](https://github.com/AB/issues/104882)
* add possibility to show or hide page / step name ([#2628](https://github.com/ReliefApplications/ems-frontend/issues/2628)) ([2df7954](https://github.com/ReliefApplications/ems-frontend/commit/2df79544e8aeb479f7b669bb562a37b912744dc7)), closes [AB#102826](https://github.com/AB/issues/102826)
* add send notification action to custom action buttons ([#2670](https://github.com/ReliefApplications/ems-frontend/issues/2670)) ([6cf01e2](https://github.com/ReliefApplications/ems-frontend/commit/6cf01e29f5f8bdc7c27097502bff7086442d5f22)), closes [AB#104883](https://github.com/AB/issues/104883)
* add subscribeToNotification action in custom action buttons of dashboard ([#2661](https://github.com/ReliefApplications/ems-frontend/issues/2661)) ([7cba6ef](https://github.com/ReliefApplications/ems-frontend/commit/7cba6efbe4c06853fc62b79067117170eb1e535f)), closes [AB#104719](https://github.com/AB/issues/104719)
* admins can add paddings to geographic extent when zooming in ([#2673](https://github.com/ReliefApplications/ems-frontend/issues/2673)) ([53da375](https://github.com/ReliefApplications/ems-frontend/commit/53da375a206d39972bc8a6ea66ab0c0a4fc50702)), closes [AB#105312](https://github.com/AB/issues/105312)
* Allow admin to set document properties by static values or expressions ([#2652](https://github.com/ReliefApplications/ems-frontend/issues/2652)) ([fc2da44](https://github.com/ReliefApplications/ems-frontend/commit/fc2da4475c66633aa7dbe84b7d700093b482d1b5)), closes [AB#104463](https://github.com/AB/issues/104463)
* allow configuration of number of files + file size ([#2651](https://github.com/ReliefApplications/ems-frontend/issues/2651)) ([76c814d](https://github.com/ReliefApplications/ems-frontend/commit/76c814d8bd23ba7bdcced46a0f6512b1c5db591e)), closes [AB#104447](https://github.com/AB/issues/104447)
* allow html questions to display as text in grids ([#2643](https://github.com/ReliefApplications/ems-frontend/issues/2643)) ([d371f47](https://github.com/ReliefApplications/ems-frontend/commit/d371f471fb29247edc6571b0f5bf91d38e6bc7ab)), closes [AB#104243](https://github.com/AB/issues/104243)
* allow mapping between fields custom action button ([#2674](https://github.com/ReliefApplications/ems-frontend/issues/2674)) ([6a5eb1e](https://github.com/ReliefApplications/ems-frontend/commit/6a5eb1e300b4fd74332b2a268caf31ab4b68d1fd)), closes [AB#105315](https://github.com/AB/issues/105315)
* can set application shortcut ([#2644](https://github.com/ReliefApplications/ems-frontend/issues/2644)) ([c637d6f](https://github.com/ReliefApplications/ems-frontend/commit/c637d6fa936630edfa990c5dc267e7422d33fcc6)), closes [AB#104315](https://github.com/AB/issues/104315)
* dashboard export ([#2653](https://github.com/ReliefApplications/ems-frontend/issues/2653)) ([891c164](https://github.com/ReliefApplications/ems-frontend/commit/891c164a8fc590df54ee034c4096070c108e8d50)), closes [Ab#104302](https://github.com/Ab/issues/104302)
* html question ([#2522](https://github.com/ReliefApplications/ems-frontend/issues/2522)) ([51f3362](https://github.com/ReliefApplications/ems-frontend/commit/51f33620d5a09568ce00d46d33e2d36f5b82988b))
* improvements on email feature ([#2654](https://github.com/ReliefApplications/ems-frontend/issues/2654)) ([904971c](https://github.com/ReliefApplications/ems-frontend/commit/904971c55104acd25ca878b2e0dfe53053b6141c)), closes [Ab#104469](https://github.com/Ab/issues/104469)
* layers in maps are now ordered based on how they appear in the settings ([#2639](https://github.com/ReliefApplications/ems-frontend/issues/2639)) ([bcf4ddc](https://github.com/ReliefApplications/ems-frontend/commit/bcf4ddc8d6680c09f334802021c08c01be22347f)), closes [AB#104252](https://github.com/AB/issues/104252)
* selection of occurrence ([#2659](https://github.com/ReliefApplications/ems-frontend/issues/2659)) ([d604760](https://github.com/ReliefApplications/ems-frontend/commit/d604760b21c51907d2797f47df1062b8532773d1)), closes [AB#104622](https://github.com/AB/issues/104622)
* working custom filter property in resource.s questions ([#2650](https://github.com/ReliefApplications/ems-frontend/issues/2650)) ([2e8ce0e](https://github.com/ReliefApplications/ems-frontend/commit/2e8ce0e2dcf2c38c874c2e17f5fac54d7b90b5e5)), closes [AB#104427](https://github.com/AB/issues/104427)


### Reverts

* Revert ""AB#91806 revert changes" revert (#2536)" (#2540) ([c99c97b](https://github.com/ReliefApplications/ems-frontend/commit/c99c97b6d27f78f07ac192fc29e617a6cfef62bb)), closes [AB#91806](https://github.com/AB/issues/91806) [#2536](https://github.com/ReliefApplications/ems-frontend/issues/2536) [#2540](https://github.com/ReliefApplications/ems-frontend/issues/2540)

# [2.2.0-alpha.3](https://github.com/ReliefApplications/ems-frontend/compare/v2.2.0-alpha.2...v2.2.0-alpha.3) (2023-12-07)


### Bug Fixes

* editing widgets could sometimes scroll to top of dashboard ([#2135](https://github.com/ReliefApplications/ems-frontend/issues/2135)) ([da6dd93](https://github.com/ReliefApplications/ems-frontend/commit/da6dd93460ada1446233159ed5988484bd2f9530))
* few issues with templating & reference data ([c504e92](https://github.com/ReliefApplications/ems-frontend/commit/c504e922e1f73a6f8030b1388f066b6853a0dd4c))
* incorrect sorting on api configuration ([#2125](https://github.com/ReliefApplications/ems-frontend/issues/2125)) ([5acf213](https://github.com/ReliefApplications/ems-frontend/commit/5acf213d1c7e3880ae69be8a6b62e2de98f09aa2))
* incorrectly sized columns ([#2127](https://github.com/ReliefApplications/ems-frontend/issues/2127)) ([c0be7b1](https://github.com/ReliefApplications/ems-frontend/commit/c0be7b1e30ac4b71f659b97845caf2f79adf8edd))
* pull jobs would not be editable ([cc9d685](https://github.com/ReliefApplications/ems-frontend/commit/cc9d685c3620450a38bd3f0cbbaf38d697dcac6d))
* remove code information in url after login ([bcfb603](https://github.com/ReliefApplications/ems-frontend/commit/bcfb603b2a74a03437ae6a236451de22c343ca3d))
* sorting in ref data table not working ([#2126](https://github.com/ReliefApplications/ems-frontend/issues/2126)) ([1ae1e27](https://github.com/ReliefApplications/ems-frontend/commit/1ae1e276a7eef1682ab73bfa2ac645bb30ad0dea))
* text widget edition would lose widget display configuration ([7f3b18b](https://github.com/ReliefApplications/ems-frontend/commit/7f3b18ba98fded73b0a90681a6019fbc86504707))


### Features

* allow text & summary card widgets to use record edition when using resource & layout ([#2134](https://github.com/ReliefApplications/ems-frontend/issues/2134)) ([a0f0ca0](https://github.com/ReliefApplications/ems-frontend/commit/a0f0ca0be44bb0c4e908d8317f08abe835592ff8))
* allow to edit / add reference data fields ([#2128](https://github.com/ReliefApplications/ems-frontend/issues/2128)) ([c7f047b](https://github.com/ReliefApplications/ems-frontend/commit/c7f047b654235516d42cb9f5e645b33b2fc9d715))

# [2.2.0-alpha.2](https://github.com/ReliefApplications/ems-frontend/compare/v2.2.0-alpha.1...v2.2.0-alpha.2) (2023-12-05)


### Bug Fixes

* add resource fields to history ([30c0846](https://github.com/ReliefApplications/ems-frontend/commit/30c0846a36a34db56f4024c4f482ad1bdce6ff71))
* better indicate file size in uploads ([#2095](https://github.com/ReliefApplications/ems-frontend/issues/2095)) ([40dae08](https://github.com/ReliefApplications/ems-frontend/commit/40dae087910a34b87c86961d4d5038357df40062))
* Changing form locale duplicates some questions ([#2124](https://github.com/ReliefApplications/ems-frontend/issues/2124)) ([ed9bbe6](https://github.com/ReliefApplications/ems-frontend/commit/ed9bbe66421f7fe19bae89aa3580d0a059c29f57))
* could not load aggregation grid ([d660f07](https://github.com/ReliefApplications/ems-frontend/commit/d660f0727b8b8d74cd128fc626f262c4672a58e1))
* could not set as null in auto modify fields grid action ([#2041](https://github.com/ReliefApplications/ems-frontend/issues/2041)) ([a92230c](https://github.com/ReliefApplications/ems-frontend/commit/a92230c4c2e445aa4978b970293570f43d1c682d))
* createdBy & modifiedBy would not appear in grids ([8b18cc6](https://github.com/ReliefApplications/ems-frontend/commit/8b18cc65a8deb0f32a9c8adcaec701bc0b14b9a8))
* dialog close directive could sometimes send empty string instead of undefined ([ef6a3af](https://github.com/ReliefApplications/ems-frontend/commit/ef6a3afc7e33f658e50aa0ce5fa1265674d1010e))
* disable the button clear button if the question is read only ([#2038](https://github.com/ReliefApplications/ems-frontend/issues/2038)) ([4656d2e](https://github.com/ReliefApplications/ems-frontend/commit/4656d2eb5297f5dbba624122e9f9cad08d5e49b0))
* fields not being correctly removed in history ([#2036](https://github.com/ReliefApplications/ems-frontend/issues/2036)) ([8aaf87a](https://github.com/ReliefApplications/ems-frontend/commit/8aaf87a17430e1d23056834961892335f08d9c80))
* filter value incorrectly reset ([08785a8](https://github.com/ReliefApplications/ems-frontend/commit/08785a8dc8e38566cbe0843d02e4dd4c0aec24c7))
* history now appearing in nested grids, in modals ([efe9421](https://github.com/ReliefApplications/ems-frontend/commit/efe94216d7658844348cf2a8ce45842da42e4c6e))
* icon picker sending error due to web elements changes [#79780](https://github.com/ReliefApplications/ems-frontend/issues/79780) ([#2094](https://github.com/ReliefApplications/ems-frontend/issues/2094)) ([eb94e7f](https://github.com/ReliefApplications/ems-frontend/commit/eb94e7fc03095e082d6beb9ecfd13481f35582b4))
* improve front-office navigation that could sometimes lost track of redirection ([#1991](https://github.com/ReliefApplications/ems-frontend/issues/1991)) ([196d5ea](https://github.com/ReliefApplications/ems-frontend/commit/196d5ea040edc3280aaf15e7402777cb8437387c))
* incorrect reorder & delete events in tabs widget ([#2097](https://github.com/ReliefApplications/ems-frontend/issues/2097)) ([9e4246b](https://github.com/ReliefApplications/ems-frontend/commit/9e4246bc4091ac735146c471fb49b7eded345beb))
* incorrect scroll due to new gridster library could cause some conflicts ([9fc9504](https://github.com/ReliefApplications/ems-frontend/commit/9fc950494d75106e4ad9e372ae29cfaa2458d3d8))
* incorrect scroll in grid widgets & some unexpected effects when showing / hiding columns ([#2087](https://github.com/ReliefApplications/ems-frontend/issues/2087)) ([35adb87](https://github.com/ReliefApplications/ems-frontend/commit/35adb872ec62a2e67de3aa4824a33acb1cc9f52d))
* incorrect style of record history modal ([7011939](https://github.com/ReliefApplications/ems-frontend/commit/701193988a52b19a58c21f5ae863a57c93cab319))
* issue with build ([7db6463](https://github.com/ReliefApplications/ems-frontend/commit/7db646399d64ea0b720eac47367e1819f7139893))
* legend now correctly working for unique value layer points ([4fdb7f9](https://github.com/ReliefApplications/ems-frontend/commit/4fdb7f9d4b0b3c43e38101a5349ff16927d33c6b))
* manually enabled layers on map would not appear after filter refresh ([4e7653b](https://github.com/ReliefApplications/ems-frontend/commit/4e7653b223b59fa7d338ff58925c4a137fd3f655))
* page is taking too much resource when showing a grid with many columns records ([#1982](https://github.com/ReliefApplications/ems-frontend/issues/1982)) ([8205b20](https://github.com/ReliefApplications/ems-frontend/commit/8205b20cc99ffbd152f266d55f20f9466a2ec88a))
* prevent min & max of lines charts to not be integers, and add possibility to set them manually ([#1985](https://github.com/ReliefApplications/ems-frontend/issues/1985)) ([4194d5f](https://github.com/ReliefApplications/ems-frontend/commit/4194d5f5cdc89c881dc7b8021e7dd193dba0f782))
* reference data would appear as object object in grid ([b9b1910](https://github.com/ReliefApplications/ems-frontend/commit/b9b191032ef2bf74a4fbeec9459d973c99e1b835))
* remove initImplicitFlow ([4e9ddd0](https://github.com/ReliefApplications/ems-frontend/commit/4e9ddd046b16013f360d89fdcda7c9f9cf48c165))
* reset default button not available in front-office ([#2122](https://github.com/ReliefApplications/ems-frontend/issues/2122)) ([ab81073](https://github.com/ReliefApplications/ems-frontend/commit/ab810737f245ea4b527d4f477dd77ff09819c1e1))
* reset default button not restoring sticky columns if hidden ([#2119](https://github.com/ReliefApplications/ems-frontend/issues/2119)) ([d9c9dbd](https://github.com/ReliefApplications/ems-frontend/commit/d9c9dbd11d323df30bdc7697169fe45ee157d6d5))
* resources question grid actions could appear in display mode ([#2037](https://github.com/ReliefApplications/ems-frontend/issues/2037)) ([dd56837](https://github.com/ReliefApplications/ems-frontend/commit/dd56837ff34b903a3a56fd45093e6bfde4d57363))
* search was shared between instances of dropdown & tagbox questions ([ce748fa](https://github.com/ReliefApplications/ems-frontend/commit/ce748faa88eeb8dc65a0f2f0d76b52662b9800a2))
* shadow dom not working in all cases ([a7d920d](https://github.com/ReliefApplications/ems-frontend/commit/a7d920d2c75dbceb742018f957edc74ec14f8cee))
* some fields would not appear in style fields selector ([a0094e1](https://github.com/ReliefApplications/ems-frontend/commit/a0094e1901cd03df69ada53bea13557d1125766b))
* some fields would not be accessible in map popup ([48f98aa](https://github.com/ReliefApplications/ems-frontend/commit/48f98aaa83ad05520b21638068254ec171656e43))
* some options would not correctly appear in some instances of form builder ([#2105](https://github.com/ReliefApplications/ems-frontend/issues/2105)) ([2763ff2](https://github.com/ReliefApplications/ems-frontend/commit/2763ff22931dcaba59136c8044257f22e54559c7))
* tabs widget would not correctly indicate when updated, preventing modal to appear when closing ([8395a71](https://github.com/ReliefApplications/ems-frontend/commit/8395a71c2547d3985e462631b4b6d65a510ce534))
* unique renderer would not render correctly ([ca83272](https://github.com/ReliefApplications/ems-frontend/commit/ca83272417b2b6d3be76c8e04a4f67017b038540))
* when selected reference data would not appear in summary card settings ([ba067b3](https://github.com/ReliefApplications/ems-frontend/commit/ba067b3a3938b49c0584935a26a87b1e912d1046))


### Features

* add possibility to fetch nested fields in ref data ([efbcc1d](https://github.com/ReliefApplications/ems-frontend/commit/efbcc1db4e278f346966952fb3411dae3e4c3d9a))
* allow nested fields to be used in map layers fields selectors ([#2089](https://github.com/ReliefApplications/ems-frontend/issues/2089)) ([0bed298](https://github.com/ReliefApplications/ems-frontend/commit/0bed29848e9cd7b01dee606befe81f40c143f3a3))
* can now use reference data in summary card ([ba3c61a](https://github.com/ReliefApplications/ems-frontend/commit/ba3c61aad1c3122511cd87b735945b43b8c69482))
* can update grid options inside tabs widgets ([#2093](https://github.com/ReliefApplications/ems-frontend/issues/2093)) ([055152d](https://github.com/ReliefApplications/ems-frontend/commit/055152d5debc04fc39f1a699d0366d59fa15bde0))
* now use filter at dashboard level ([#2078](https://github.com/ReliefApplications/ems-frontend/issues/2078)) ([38e0b13](https://github.com/ReliefApplications/ems-frontend/commit/38e0b136aaa47c21988aed7e90edcaefe40f84be))
* reference data now usable in text widget ([b0cefc5](https://github.com/ReliefApplications/ems-frontend/commit/b0cefc5f1377912e9fca79c7a37eae0c15550977))
* user attributes now usable in form builder ([#2075](https://github.com/ReliefApplications/ems-frontend/issues/2075)) ([446b9b1](https://github.com/ReliefApplications/ems-frontend/commit/446b9b12e334bfff32f41866250154814aba148e))

# [2.2.0-alpha.1](https://github.com/ReliefApplications/ems-frontend/compare/v2.1.2...v2.2.0-alpha.1) (2023-11-22)


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
* bring back filtering in aggregation builder ([#2077](https://github.com/ReliefApplications/ems-frontend/issues/2077)) ([b179147](https://github.com/ReliefApplications/ems-frontend/commit/b179147a6fdddccbc709c86ce7978f16c379a741))
* build issue after 2.0.x merge ([f8bc621](https://github.com/ReliefApplications/ems-frontend/commit/f8bc621c1be9adccdfc56d5b26aa2531d70567ee))
* build not working ([3ed5f5b](https://github.com/ReliefApplications/ems-frontend/commit/3ed5f5b1ca16e41678412609caba2cd9973abf41))
* button action not appearing in front-office ([7d0d397](https://github.com/ReliefApplications/ems-frontend/commit/7d0d397aeff35ddc833ecdd693af6c642775f7ba))
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
* exiting form builder could create multiple modals if some changes were not saved ([0cad118](https://github.com/ReliefApplications/ems-frontend/commit/0cad1181de097e1ff443fd9ed43907b561801071))
* few issues with layer styling ([baf115b](https://github.com/ReliefApplications/ems-frontend/commit/baf115b9ee907770b26334afd32602979af8d1a4))
* few issues with sidenav z-index + incorrect getter of value in records-tab ([1234e37](https://github.com/ReliefApplications/ems-frontend/commit/1234e376808482b41eeb394e303f84a60a565aca))
* few map display ([0876ea9](https://github.com/ReliefApplications/ems-frontend/commit/0876ea9861aa1e1eb98b0f265a01d5b2aed54e40)), closes [fix/AB#65087](https://github.com/fix/AB/issues/65087) [fix/AB#65087](https://github.com/fix/AB/issues/65087)
* fields would still appear in layer edition even if datasource is not valid ([1723c6c](https://github.com/ReliefApplications/ems-frontend/commit/1723c6ce3a1d626e25e2744c65dd9b73c526c294))
* files uploaded before addRecord ([962b96f](https://github.com/ReliefApplications/ems-frontend/commit/962b96f64548d82f3a0c487945c8101a5886c23f))
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
* html could be passed in links built from values in summary cards / text widgets ([6cc0545](https://github.com/ReliefApplications/ems-frontend/commit/6cc05456c58782bfe74e20190372c00f210260d0))
* html widgets ( summary cards & text ) style issue with tailwind ([e0ad6fd](https://github.com/ReliefApplications/ems-frontend/commit/e0ad6fdeaba4e44c796612c503cb299a0aa5a0ce))
* i18n issue when errors in grid in web widgets ([38ecef2](https://github.com/ReliefApplications/ems-frontend/commit/38ecef2e9a7ff5a579545b9e6048906f0bcc75c7))
* icon display when variant and category class are empty ([#1975](https://github.com/ReliefApplications/ems-frontend/issues/1975)) ([b05b722](https://github.com/ReliefApplications/ems-frontend/commit/b05b722316deae9f6124f07078e50ef2947e77ef))
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
* incorrect style of aggregation grids & some settings could be saved even if unused ([#1984](https://github.com/ReliefApplications/ems-frontend/issues/1984)) ([210b8e7](https://github.com/ReliefApplications/ems-frontend/commit/210b8e774d3bce21ae0d20f93cac1e1614f0af1c))
* incorrect text when editing pull job notification ([30b621c](https://github.com/ReliefApplications/ems-frontend/commit/30b621cd5ef3146a8cec0729258b9eb22da46a29))
* Incorrect UI for workflow access in application role editor ([#1973](https://github.com/ReliefApplications/ems-frontend/issues/1973)) ([3640be1](https://github.com/ReliefApplications/ems-frontend/commit/3640be100d27346716ae60be71d89d2ff455e9df))
* incorrect zoom styling on maps ([c647f82](https://github.com/ReliefApplications/ems-frontend/commit/c647f820e0ab1af396fab10d5beac4232c02d623))
* infinite re renders of dropdown in filter builder ([#1927](https://github.com/ReliefApplications/ems-frontend/issues/1927)) ([71e1bcd](https://github.com/ReliefApplications/ems-frontend/commit/71e1bcd30c9fa77dc27decc3b850380c0122f1d4))
* infinite redirection when trying to open a contextual page ([#1903](https://github.com/ReliefApplications/ems-frontend/issues/1903)) ([3dbec90](https://github.com/ReliefApplications/ems-frontend/commit/3dbec908991c2fde0dd70e84a9e7a45fd03af954))
* issue loading some webmaps with arcgis ([5fbf5fc](https://github.com/ReliefApplications/ems-frontend/commit/5fbf5fc2e04794b9a9da0d3e830eb8c0e356cf34)), closes [bugfix/AB#65126](https://github.com/bugfix/AB/issues/65126)
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
* previous update changed some package versions ([e054784](https://github.com/ReliefApplications/ems-frontend/commit/e05478444f376beaf4b741b55f1105a5d2a6405c))
* **query builder:** sometimes no fields are displayed due to incorrect events ordering ([#1961](https://github.com/ReliefApplications/ems-frontend/issues/1961)) ([f0fee3e](https://github.com/ReliefApplications/ems-frontend/commit/f0fee3e8393a73d39c079a530e97be7bd388c9eb))
* readOnly attribute of fields would not be taken into account when doing edition ([21b9010](https://github.com/ReliefApplications/ems-frontend/commit/21b90101d354785afdf92ec64482e2c501487eb3))
* readonly would not be correctly considered in resources question ([#2054](https://github.com/ReliefApplications/ems-frontend/issues/2054)) ([498bb96](https://github.com/ReliefApplications/ems-frontend/commit/498bb969acf03b961d7ba7dbc9e4eff08dec9f10))
* record history could send an error when object was null or undefined ([80fd7ee](https://github.com/ReliefApplications/ems-frontend/commit/80fd7ee865f5156a700907680f2b338f16c0146d))
* reference data would be cached everytime ([5f0a99d](https://github.com/ReliefApplications/ems-frontend/commit/5f0a99d53377da4e7a4c93e348e809a9c65bf65e))
* remove custom logic about choicesbyurl that could break questions ([e7b6390](https://github.com/ReliefApplications/ems-frontend/commit/e7b639024c79b1025ae24b66821c911005633631))
* remove expand option for map widgets ([#1877](https://github.com/ReliefApplications/ems-frontend/issues/1877)) ([bfd1b2c](https://github.com/ReliefApplications/ems-frontend/commit/bfd1b2c049fbd3075660e65fadf319fa367b227f))
* renderer type incorrectly set in layerDefinitionForm ([73f224b](https://github.com/ReliefApplications/ems-frontend/commit/73f224baaa325d5964fa5409c659c8ebdc8a0512))
* scrollbar would not look the same on firefox ([#1827](https://github.com/ReliefApplications/ems-frontend/issues/1827)) ([3638c3d](https://github.com/ReliefApplications/ems-frontend/commit/3638c3defca5a608cd4d900f56a8f69d2aae2201))
* search with filter not working in GetResources queries ([054fa48](https://github.com/ReliefApplications/ems-frontend/commit/054fa48087b483ce27fa31b18ffcd94268669cf7))
* selected records in text widget would not appear when opening settings ([#1901](https://github.com/ReliefApplications/ems-frontend/issues/1901)) ([93a9af6](https://github.com/ReliefApplications/ems-frontend/commit/93a9af668d2adb3681badc1bc96307fb112fc0ee))
* show new records created in resouce questions in the search grid ([4d0ed40](https://github.com/ReliefApplications/ems-frontend/commit/4d0ed4048f5a7173ee57bfb2d6106f45749bd5e2))
* simplify reference data dropdown component ([37289f0](https://github.com/ReliefApplications/ems-frontend/commit/37289f08df4b352177ab963e092c916fdd9428e4))
* some features from contextual dashboards would not work correctly ([#1825](https://github.com/ReliefApplications/ems-frontend/issues/1825)) ([a8d089b](https://github.com/ReliefApplications/ems-frontend/commit/a8d089b80d87a8b8157cf32d468a3fcb151a8707))
* some issues with new dashboard filter ([fd3d00e](https://github.com/ReliefApplications/ems-frontend/commit/fd3d00e147123e26933ff193238df1b7c2127302))
* some layers would break the map when loading due to incorrect API call ([35a50a0](https://github.com/ReliefApplications/ems-frontend/commit/35a50a0800caf0e3370dd8f36f3a2afdd162aa98))
* some layers would break the map when loading due to incorrect API call ([d305963](https://github.com/ReliefApplications/ems-frontend/commit/d30596359ced6b2f39c4b8180607c0a99c069d52))
* some lint issues and incorrect logic in the edition of geofields ([470819e](https://github.com/ReliefApplications/ems-frontend/commit/470819e279f56fdfce3e38edfced7c3d7ba9a3a2))
* some notifications would not update their content  ([#1947](https://github.com/ReliefApplications/ems-frontend/issues/1947)) ([a90001f](https://github.com/ReliefApplications/ems-frontend/commit/a90001f7307034cb747e01ba66a0f2dc906d856d))
* some popups could not appear due to incorrect geojson or event ([2e41dde](https://github.com/ReliefApplications/ems-frontend/commit/2e41ddedb566af604d9458f3fc2095aa89837583))
* some reference data could not load in forms ([4dee883](https://github.com/ReliefApplications/ems-frontend/commit/4dee8839f2a66b3b65f260d58664cb30d59a0389))
* Some select in widgets would display ID instead of name ([#2058](https://github.com/ReliefApplications/ems-frontend/issues/2058)) ([1ab1d30](https://github.com/ReliefApplications/ems-frontend/commit/1ab1d30e2a92086614755ae61400048bf2d56c8b))
* some widgets in tab widget could not be resized ([1413948](https://github.com/ReliefApplications/ems-frontend/commit/1413948528a752a0ce1584d8ba15fcbf2106ec19))
* sorting tab incorrect display in summary card settings ([#1818](https://github.com/ReliefApplications/ems-frontend/issues/1818)) ([18abea2](https://github.com/ReliefApplications/ems-frontend/commit/18abea27b2a96dd8af29de209d0f42420d65fed9))
* sticky columns in grids could be wrongly resized ([#2069](https://github.com/ReliefApplications/ems-frontend/issues/2069)) ([7e7ee5b](https://github.com/ReliefApplications/ems-frontend/commit/7e7ee5b39126b6ff1285a170a3d6c8501e5939ba))
* storybook not building for shared library ([3d62401](https://github.com/ReliefApplications/ems-frontend/commit/3d6240152527710b7dd561a1f1286a465bb6d34a))
* subscribe to geoForm lat/lng ([40e19ba](https://github.com/ReliefApplications/ems-frontend/commit/40e19ba7e76fce2e0fa008ad29c596b503f3f573))
* survey localization not working after update. ([#1936](https://github.com/ReliefApplications/ems-frontend/issues/1936)) ([0e2e742](https://github.com/ReliefApplications/ems-frontend/commit/0e2e7428f367d89ef92ec656b08afb5a0f4ed813))
* tabs widget would be badly displayed due to changes on dashboard & widgets ([cf3f1ca](https://github.com/ReliefApplications/ems-frontend/commit/cf3f1cac99c40cbcf4cb40843692ccfee0a0e062))
* tagbox in surveyjs would not work in some cases ([f6cba5a](https://github.com/ReliefApplications/ems-frontend/commit/f6cba5ad548b6a377951704a3b99271bb2b903d7))
* text selector for date filtering in layouts would not appear anymore ([9212038](https://github.com/ReliefApplications/ems-frontend/commit/9212038ae1ec803113b8df5237f43850c5495d8c))
* toggle would not correctly indicate touch events ([43cba1d](https://github.com/ReliefApplications/ems-frontend/commit/43cba1d4c99b6ee828573c2d5efea5208c82310d))
* tooltip in form builder could get duplicated ([2d49c1e](https://github.com/ReliefApplications/ems-frontend/commit/2d49c1e7f8e8f6da84a69ca0b88deec95876e8ef))
* ui lib storybook could not compile due to recent changes ([bedbdc7](https://github.com/ReliefApplications/ems-frontend/commit/bedbdc716987ddb772c709450b25b96d5e7f286e))
* unable to scroll when using expression builder in calculated fields UI ([334b4da](https://github.com/ReliefApplications/ems-frontend/commit/334b4dac2eb463e06d15eb729ac469dfda1947fe))
* unionBy causing type issue in update-queries method ([b1dff4a](https://github.com/ReliefApplications/ems-frontend/commit/b1dff4a375b66d2bd8e4e7fe44a3e585d68051b9))
* update resources field permissions in roles page ([dbae656](https://github.com/ReliefApplications/ems-frontend/commit/dbae6561d438dd8f9b640c2f98859522f3876de1))
* uploading files from default value ([02ad65b](https://github.com/ReliefApplications/ems-frontend/commit/02ad65be80e380f695d469f127b7cf46bfb6184b))
* visibility icon would not appear for hidden pages ([#1967](https://github.com/ReliefApplications/ems-frontend/issues/1967)) ([00e07d4](https://github.com/ReliefApplications/ems-frontend/commit/00e07d4de77fa687afeba7624a220dd8bcb70439))
* visibility of parent could break visibility of children elements in layers ([7b48e79](https://github.com/ReliefApplications/ems-frontend/commit/7b48e79af44511df4e0406130fee1907f58086bc))
* visibility was not correctly working for some layers ([0f66086](https://github.com/ReliefApplications/ems-frontend/commit/0f6608648629a5e0ecf3cc19cc46be3e9f095584))
* web widgets would not build ([#1886](https://github.com/ReliefApplications/ems-frontend/issues/1886)) ([73c1bc4](https://github.com/ReliefApplications/ems-frontend/commit/73c1bc4a584718f3b5d78f6512f82796dd41c25c))
* webmap incorrect options in searchbar ([#1405](https://github.com/ReliefApplications/ems-frontend/issues/1405)) ([20b95da](https://github.com/ReliefApplications/ems-frontend/commit/20b95da15726a55c2c2cd7b8c3dbb62b4ed14f9e))
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
* add heatmap to map-forms ([ca9af30](https://github.com/ReliefApplications/ems-frontend/commit/ca9af30fde313787eb0b942741641bd6e54bf353))
* Add JSON editor tab to survey builder ([22adaf5](https://github.com/ReliefApplications/ems-frontend/commit/22adaf5f397e077cc9decfc51d968a53779d2d8a))
* add missing translations ([8c504ac](https://github.com/ReliefApplications/ems-frontend/commit/8c504ac58dd744d6bdd93db0984a50c97df5296c))
* add more missing translations ([cfab01b](https://github.com/ReliefApplications/ems-frontend/commit/cfab01bd762ed8ffadeb24c3c43c18aaafba9073))
* add more options to cluster layers ([#1906](https://github.com/ReliefApplications/ems-frontend/issues/1906)) ([c5e2d14](https://github.com/ReliefApplications/ems-frontend/commit/c5e2d14418a4a5c9d779280324a05b4750ac463b))
* add new control for tinymce editor, usable in mat form fields ([984ba1d](https://github.com/ReliefApplications/ems-frontend/commit/984ba1d8f5feecf381d601b063f8d7eca045bc0a)), closes [refactor/AB#61059](https://github.com/refactor/AB/issues/61059)
* add one more missing translation ([90e98f3](https://github.com/ReliefApplications/ems-frontend/commit/90e98f3b23f3c23438eb3032f4d0bb7bfd722383))
* add possibility to setup sorting for grids & summary cards ([21648ec](https://github.com/ReliefApplications/ems-frontend/commit/21648ecb2e0d21e5b8fe944330a8d2c6afa32347))
* add survey scss import in form modal ([55f1299](https://github.com/ReliefApplications/ems-frontend/commit/55f12999151660186c412a3ecdd438857ac4f0e2))
* add user variables on form ([aed4116](https://github.com/ReliefApplications/ems-frontend/commit/aed4116853a338cfd7a7e37ecf2b29cacce422ee))
* added filter record option when context datasource is coming from a resource ([#2022](https://github.com/ReliefApplications/ems-frontend/issues/2022)) ([e750a47](https://github.com/ReliefApplications/ems-frontend/commit/e750a4776f36d6e3c8e4103d4ef5aaf5742895f4))
* Adding surveyJS variables for fields of selected record in resource question ([da7f8ca](https://github.com/ReliefApplications/ems-frontend/commit/da7f8ca73fcff9a35306889333a0601c1cd8bbe6))
* Adds length custom function to be used in survey builder ([bf02242](https://github.com/ReliefApplications/ems-frontend/commit/bf02242d5d5f26213f6fdf6fbb4dd502ac62cdfa))
* allow admins to set an action to navigate to another page of the app ([#1897](https://github.com/ReliefApplications/ems-frontend/issues/1897)) ([e1b68c0](https://github.com/ReliefApplications/ems-frontend/commit/e1b68c0235ccb414fa5826245cff189f3e5f42a2))
* allow draft edition of records in grids ([3cea89b](https://github.com/ReliefApplications/ems-frontend/commit/3cea89b26b0094741dedf9499f26410264ff98d6))
* allow single widget page ([45ae280](https://github.com/ReliefApplications/ems-frontend/commit/45ae2808ef2ac9fb182965acd73157ca3cf26936))
* allow to activate / deactivate edition in back-office, to preview changes ([a54c4a5](https://github.com/ReliefApplications/ems-frontend/commit/a54c4a5cd805e66c4052a4c480af41bbb66a03dc))
* allow to define grid actions in summary card settings ([#1888](https://github.com/ReliefApplications/ems-frontend/issues/1888)) ([1f90171](https://github.com/ReliefApplications/ems-frontend/commit/1f901714a13ef147d50c96794efd6ae2b264f8ee))
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
* possibility to hide pages' ([0ba87cd](https://github.com/ReliefApplications/ems-frontend/commit/0ba87cdfcec7ac1d67e52ad2cc063ea3d71e9747))
* Reference data for dashboard filtering ([#1819](https://github.com/ReliefApplications/ems-frontend/issues/1819)) ([42e5bc2](https://github.com/ReliefApplications/ems-frontend/commit/42e5bc26d22f7927368616d4890a599827748d5b)), closes [feat/AB#74574](https://github.com/feat/AB/issues/74574)
* see markers from grid when opening geospatial question ([7231a50](https://github.com/ReliefApplications/ems-frontend/commit/7231a5013dd67302b6cfa495bb474c8d46a5cef8)), closes [Feat/ab#60047](https://github.com/Feat/ab/issues/60047)
* Show/Hide widget header ([#2005](https://github.com/ReliefApplications/ems-frontend/issues/2005)) ([20a964d](https://github.com/ReliefApplications/ems-frontend/commit/20a964d937b306161fd1af579498dd52df09d5f7))
* sidenav can now be collapsed on large screens ([49d74d7](https://github.com/ReliefApplications/ems-frontend/commit/49d74d757dddf4f31c7502800e5163a95b8ea446))
* Tabs widget ([#1793](https://github.com/ReliefApplications/ems-frontend/issues/1793)) ([16d793c](https://github.com/ReliefApplications/ems-frontend/commit/16d793cf964205275411e53b50be2f0a728f9c3d))
* Tabs widget ([#1795](https://github.com/ReliefApplications/ems-frontend/issues/1795)) ([cb31387](https://github.com/ReliefApplications/ems-frontend/commit/cb31387022216dfe1a7dd2d96fe00167483fdc1b))
* zoom control new styling added to maps ([#1427](https://github.com/ReliefApplications/ems-frontend/issues/1427)) ([202504e](https://github.com/ReliefApplications/ems-frontend/commit/202504e3f8363a198e2cfc383a8b59f3319fabfa))


### Performance Improvements

* Add storybook for front-office & back-office ([#1990](https://github.com/ReliefApplications/ems-frontend/issues/1990)) ([ee42d8d](https://github.com/ReliefApplications/ems-frontend/commit/ee42d8d613ccdb40093f971a2904760ece5dd844)), closes [#77550](https://github.com/ReliefApplications/ems-frontend/issues/77550) [#77550](https://github.com/ReliefApplications/ems-frontend/issues/77550)
* **bundle:** remove useless kendo styles imports ([#1882](https://github.com/ReliefApplications/ems-frontend/issues/1882)) ([70b74fc](https://github.com/ReliefApplications/ems-frontend/commit/70b74fca16d840b5f4d187215bfb10cb08236c28))
* Load markers in chunks ([#1786](https://github.com/ReliefApplications/ems-frontend/issues/1786)) ([5eb316d](https://github.com/ReliefApplications/ems-frontend/commit/5eb316de6e42fe1a2e6cd5a52b944534e0a748cf))
* update Angular version to 15.2.9 ([8e985fb](https://github.com/ReliefApplications/ems-frontend/commit/8e985fb711622860fa8c6faff886039f8845ad66))
* update surveyjs package, to use Angular version, and drop knockout ([#1763](https://github.com/ReliefApplications/ems-frontend/issues/1763)) ([73f29f8](https://github.com/ReliefApplications/ems-frontend/commit/73f29f8ef862416cd69358adbe88e2a42ec06e2f))


### Reverts

* Revert "feat: Tabs widget (#1793)" (#1794) ([64c2a1b](https://github.com/ReliefApplications/ems-frontend/commit/64c2a1b2e29a12f68e9512d3e382b0b721a04516)), closes [#1793](https://github.com/ReliefApplications/ems-frontend/issues/1793) [#1794](https://github.com/ReliefApplications/ems-frontend/issues/1794)

# [2.0.0-alpha.14](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2023-06-20)


### Bug Fixes

* add records on resource(s) questions ([51d0991](https://github.com/ReliefApplications/oort-frontend/commit/51d0991c808ec2d76b9812ea5e789352dd5404d2))
* duplicate users could be seen when adding roles to users ([642af8b](https://github.com/ReliefApplications/oort-frontend/commit/642af8bd1a9fc2d578551d309f28a8b7878360ea))
* issues with tabs button actions in grid settings ([9eb00c1](https://github.com/ReliefApplications/oort-frontend/commit/9eb00c18a48d75e18c690d41d1dbb69bcb0cb4a9))
* queryName would not be used when editing layout from summary card / text widget ([2c953de](https://github.com/ReliefApplications/oort-frontend/commit/2c953de5f66bcd74ac41f0ebd5a0e73ef7c1c61e))
* unable to scroll when using expression builder in calculated fields UI ([334b4da](https://github.com/ReliefApplications/oort-frontend/commit/334b4dac2eb463e06d15eb729ac469dfda1947fe))


### Features

* add dashboard button actions ([9f52272](https://github.com/ReliefApplications/oort-frontend/commit/9f52272100361f3f933358a4d8a65a98164f1da9))
* allow page to be injected as urls in tinymce for editor / summary card widgets ([4b5f3df](https://github.com/ReliefApplications/oort-frontend/commit/4b5f3dfe715f718ae2fca82291cbe0fca288791c))

# [2.0.0-alpha.13](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2023-06-19)


### Bug Fixes

* add save method in the column chooser ([#1420](https://github.com/ReliefApplications/oort-frontend/issues/1420)) ([ca55887](https://github.com/ReliefApplications/oort-frontend/commit/ca55887e48f4551cad4433104d54a4ae694a6664))
* adding a preview to images question URL ([0c284a0](https://github.com/ReliefApplications/oort-frontend/commit/0c284a0c298a5dba01285ee40f450bdf48c6e380))
* apply styles on summary card ([#1394](https://github.com/ReliefApplications/oort-frontend/issues/1394)) ([9ccdf8c](https://github.com/ReliefApplications/oort-frontend/commit/9ccdf8cf1655d995d61a5c3e748773c3a9275638))
* bug on replaceRecordFields ([#1454](https://github.com/ReliefApplications/oort-frontend/issues/1454)) ([aa603a2](https://github.com/ReliefApplications/oort-frontend/commit/aa603a2289028f4f42831404959e20fe02a6c42e))
* circular dependency in tabs files ([e86939a](https://github.com/ReliefApplications/oort-frontend/commit/e86939a0e17bddf1ca65c0600e88268827e7c1df))
* compilation error ([e8a232c](https://github.com/ReliefApplications/oort-frontend/commit/e8a232c88b6b43fbdf870afa1a507925fd4cc9d3))
* dashboard filter layout issue on workflows ([ca03d64](https://github.com/ReliefApplications/oort-frontend/commit/ca03d64a40c6615a5e17bda6c0bfd008d00e3b6d)), closes [Bugfix/ab#65852](https://github.com/Bugfix/ab/issues/65852)
* date / datetime / time can now be used in triggers in surveyjs ([6b1fc3d](https://github.com/ReliefApplications/oort-frontend/commit/6b1fc3d7f40a0136907bb52ba69dbd80cf713c02))
* date picker not properly updating with enabled conditions ([#1439](https://github.com/ReliefApplications/oort-frontend/issues/1439)) ([81bcaf8](https://github.com/ReliefApplications/oort-frontend/commit/81bcaf80ad79a89167b2600815c7b5891b13351a))
* display issue when hovering steps ([7abb1e4](https://github.com/ReliefApplications/oort-frontend/commit/7abb1e4df0cf3e8170f14fccbeab6a4596e890a7))
* display of select label ([75fa385](https://github.com/ReliefApplications/oort-frontend/commit/75fa3851e2e509f5c90bda5515f57ba8ea0926a0))
* distribution list incorrect input validation ([729f264](https://github.com/ReliefApplications/oort-frontend/commit/729f264e6bec8f83f940d52a02d63b312dba28c8))
* duplication of diviver in layout user menu ([4808637](https://github.com/ReliefApplications/oort-frontend/commit/48086371a492a1582c50d2a0a7c6638b38768c7f))
* emails can no longer be sent without subjects ([3462daf](https://github.com/ReliefApplications/oort-frontend/commit/3462daf8a94805ad78b441cb006626d0f2737271))
* errors in button config ([38c72c9](https://github.com/ReliefApplications/oort-frontend/commit/38c72c92b359e3fc08c4eb291a5d173e2a513386))
* errors on survey submit (edge cases) ([bdea6d2](https://github.com/ReliefApplications/oort-frontend/commit/bdea6d20a9c45bc74129f934e1a22220c2ca609c))
* few issues related to tailwind ([ef5d4e7](https://github.com/ReliefApplications/oort-frontend/commit/ef5d4e7bdae289139bfd57a86fafd3655c94611c))
* few map display ([0876ea9](https://github.com/ReliefApplications/oort-frontend/commit/0876ea9861aa1e1eb98b0f265a01d5b2aed54e40)), closes [fix/AB#65087](https://github.com/fix/AB/issues/65087) [fix/AB#65087](https://github.com/fix/AB/issues/65087)
* fields not loading in summary cards settings by default ([8eb72e0](https://github.com/ReliefApplications/oort-frontend/commit/8eb72e0436f9451acb19001cf8562c4be07ae9be))
* front office could not build ([7be6916](https://github.com/ReliefApplications/oort-frontend/commit/7be6916779b064ccf1e645024b07ce41914aff93))
* front-office and app preview would not correctly use changeStep event of workflow ([7727f6b](https://github.com/ReliefApplications/oort-frontend/commit/7727f6b2cac8794409a6c90a3de52dd13881db15))
* fullscreen now available for workflows ([15a4877](https://github.com/ReliefApplications/oort-frontend/commit/15a48771e782391e658b2673e6d0d80620dc092b))
* grid widget should stop loading if no data change detected when refetching ([3f25d57](https://github.com/ReliefApplications/oort-frontend/commit/3f25d57fde724beb5d616301be6e4bb72a623e91))
* hide side menu on app preview ([c05749b](https://github.com/ReliefApplications/oort-frontend/commit/c05749b631f7ba3a50a31a8a1259f7cf25e5188e))
* horizontal nav items incorrect width ([322d9cd](https://github.com/ReliefApplications/oort-frontend/commit/322d9cd2eab1a1d93bd98dae8d1d65c38865fc15))
* horizontal pages would break display of sidenav content if right sidenav enabled ([7f6d4ce](https://github.com/ReliefApplications/oort-frontend/commit/7f6d4ce1b931d1d78260b38c5b6296e6dd8790a9))
* incorrect API of confirm service after tailwind update ([ae407d6](https://github.com/ReliefApplications/oort-frontend/commit/ae407d6f3aac44d1fab2a32889e2a79d5dcc8fb3))
* incorrect applyToWholeCard option ([a177a92](https://github.com/ReliefApplications/oort-frontend/commit/a177a9241fb0b06c3f0af2e742bc5b663e9ff701))
* incorrect choice callback in ref data ([#1401](https://github.com/ReliefApplications/oort-frontend/issues/1401)) ([42f6204](https://github.com/ReliefApplications/oort-frontend/commit/42f62042fb843dae2fd998e1fd913c9914408080))
* incorrect fill text in series settings ([aaee1b1](https://github.com/ReliefApplications/oort-frontend/commit/aaee1b1cc81eb470f51c3454e901b355ce66027f))
* incorrect history display ([5fbf04b](https://github.com/ReliefApplications/oort-frontend/commit/5fbf04b4d8376504f06229f0a4c9a0ffef79f3a8))
* incorrect icon displayed on role resources page ([f97533c](https://github.com/ReliefApplications/oort-frontend/commit/f97533c2ce6aefa21995ee4b8c0710bb811c960e))
* incorrect position of dashboard filter ([0d03f60](https://github.com/ReliefApplications/oort-frontend/commit/0d03f60edf13018bf57803f5a81099aa3c34d1e1))
* incorrect query builder due to lazy loading missing in tabs ([016d3f9](https://github.com/ReliefApplications/oort-frontend/commit/016d3f971bad0a6853bca51886ef57ecfe64ddd5))
* incorrect reference data dropdwon ([ec187a0](https://github.com/ReliefApplications/oort-frontend/commit/ec187a0b2b3961a7ded97c1967a477227b91a1e0))
* incorrect replacement of tab, now introducing lazy loading to fix some broken behaviors ([fcb7985](https://github.com/ReliefApplications/oort-frontend/commit/fcb798500dcc439215a056499761ba3ea7535280))
* incorrect select menu display if custom template ([78272f6](https://github.com/ReliefApplications/oort-frontend/commit/78272f69da3951a12e0c6fabe05eb10c8fbf2fdc))
* incorrect show series text ([05e60ff](https://github.com/ReliefApplications/oort-frontend/commit/05e60ff88f0a1b8b895ee5ef7a6526db7480726a))
* incorrect style of menus ([85fee50](https://github.com/ReliefApplications/oort-frontend/commit/85fee50f667f30900bf6cf5d682e1d2900f30c28))
* incorrect text orientation for dashboard filter quick value when put on left ([fd93d46](https://github.com/ReliefApplications/oort-frontend/commit/fd93d46a43ce89891b7b3cc9d9168c6bb7c1011e))
* incorrect text widget settings ([#1417](https://github.com/ReliefApplications/oort-frontend/issues/1417)) ([e450038](https://github.com/ReliefApplications/oort-frontend/commit/e450038b5e7504e684c60a84067e7d2642647089))
* incorrect tooltip position on forms when multi questions per line active ([c0b24b9](https://github.com/ReliefApplications/oort-frontend/commit/c0b24b964e275978f8dab79fe8ee1215b6508c3a))
* incorrect use of graphqlname in text widget ([090b8ba](https://github.com/ReliefApplications/oort-frontend/commit/090b8babf192e6647b85e6d686a5ba4ad0a56abf))
* incorrect use of radio component value ([02d447c](https://github.com/ReliefApplications/oort-frontend/commit/02d447c392255a93d598e1fe0a9ab924396b36e7))
* incorrect use of top navigation in applications ([c3c949d](https://github.com/ReliefApplications/oort-frontend/commit/c3c949d3b8f66e291e0712ac8b3b83807693cb6c))
* incorrect zoom styling on maps ([c647f82](https://github.com/ReliefApplications/oort-frontend/commit/c647f820e0ab1af396fab10d5beac4232c02d623))
* infinite pagination not working for summary cards ([38bf9f2](https://github.com/ReliefApplications/oort-frontend/commit/38bf9f26527901eb9c5e610ba553803ea4d2237b))
* infinite scrolling ([753b382](https://github.com/ReliefApplications/oort-frontend/commit/753b3826f42505ad2b775c291b775923615238c7))
* issue loading some webmaps with arcgis ([5fbf5fc](https://github.com/ReliefApplications/oort-frontend/commit/5fbf5fc2e04794b9a9da0d3e830eb8c0e356cf34)), closes [bugfix/AB#65126](https://github.com/bugfix/AB/issues/65126)
* issue with autocomplete not displaying correct keys ([81e1ce9](https://github.com/ReliefApplications/oort-frontend/commit/81e1ce91a0eb16c8dd060bb6d852a2b83f21e382))
* issue with borderless widgets after tailwind update ([0084ab5](https://github.com/ReliefApplications/oort-frontend/commit/0084ab50d24a5b7cfb0df9a39d5870107e199a8f))
* issue with display of avatars in summary cards / text widgets ([9adb373](https://github.com/ReliefApplications/oort-frontend/commit/9adb373fbe3ed73b04b54d9b115262a1eb9b614e))
* issue with dropdown widget not sending data ([7e8e2b2](https://github.com/ReliefApplications/oort-frontend/commit/7e8e2b2c3c3739b88af415098be9e936d256d83a))
* issue with filter fields on record history ([74887f6](https://github.com/ReliefApplications/oort-frontend/commit/74887f6a72b152f3d434247800940a31bfa360a7))
* issue with select a layout text ([8238173](https://github.com/ReliefApplications/oort-frontend/commit/82381734fdb4639bdb770f7d95d7edad817c3d49))
* issues with surveyjs ([4333a30](https://github.com/ReliefApplications/oort-frontend/commit/4333a30e84852f91efa3381e8c4b2adb36e266f4))
* jsonpath not being reflected for rest ref data ([aa61734](https://github.com/ReliefApplications/oort-frontend/commit/aa617349cdeea1cf4a6f309e6dd1990efa6823cc))
* layer control being duplicated ([995588a](https://github.com/ReliefApplications/oort-frontend/commit/995588abaa87405a0f902754edc984922a681c4e))
* load correct workflow step page from shared URL or when refreshing page ([4e54758](https://github.com/ReliefApplications/oort-frontend/commit/4e54758abd119195eb547478173cc50785ce5bd9))
* many issues with form field wrapper directive ([476d641](https://github.com/ReliefApplications/oort-frontend/commit/476d64187c970d78d6a0a6f731905f14b5282851))
* missing variant error in tab-fields + incorrect check in query-builder component to hide label ([6a1f18b](https://github.com/ReliefApplications/oort-frontend/commit/6a1f18b6998861364236346a6f73afbd3876a8d4))
* number in center of clusters not aligned ([1bca1f6](https://github.com/ReliefApplications/oort-frontend/commit/1bca1f620c1237ab3bcc1fdbabe808c24f48437e)), closes [bugfix/AB#63765](https://github.com/bugfix/AB/issues/63765) [bugfix/AB#63765](https://github.com/bugfix/AB/issues/63765)
* pagination issue in ref data table ([3dd142e](https://github.com/ReliefApplications/oort-frontend/commit/3dd142e68729bf6272214f48610d5c558bf94c60))
* pointer events on dashboard filter would prevent some buttons to be clicked on ([0bafe88](https://github.com/ReliefApplications/oort-frontend/commit/0bafe88613c695fa7aef247f6d2bb45d385c15ad))
* put back ability to load page in front-office using url ([0aa2d8a](https://github.com/ReliefApplications/oort-frontend/commit/0aa2d8a98ee04a4f8c15683004fd2831f0dcf279))
* read only resource questions add record button ([215d2cc](https://github.com/ReliefApplications/oort-frontend/commit/215d2cc41526e02bdab193637cab92970e76f730))
* refData fetched through graphQL APIs ([d9f1c59](https://github.com/ReliefApplications/oort-frontend/commit/d9f1c594e0d340e1f7434511726b096e3b2a6ef9))
* reference data multiselect not appearing on grids ([91f5b56](https://github.com/ReliefApplications/oort-frontend/commit/91f5b563a6f70a71f37167b5efb44775310ab87d))
* reference data question could not be saved ([deae9c0](https://github.com/ReliefApplications/oort-frontend/commit/deae9c044727c70c09228d2402a9a0f51b539f5b))
* search on static cards ([c738e6e](https://github.com/ReliefApplications/oort-frontend/commit/c738e6ef70727a8cfa6ad65bf263fd0e3434103e))
* search on summary cards would be duplicated if grid mode activated ([abf4646](https://github.com/ReliefApplications/oort-frontend/commit/abf4646d47eb4dc948d05702fc37d29da36d1a37))
* search with filter not working in GetResources queries ([054fa48](https://github.com/ReliefApplications/oort-frontend/commit/054fa48087b483ce27fa31b18ffcd94268669cf7))
* send emails to recipients not in the distribution list ([#1421](https://github.com/ReliefApplications/oort-frontend/issues/1421)) ([a9367a3](https://github.com/ReliefApplications/oort-frontend/commit/a9367a34f8dec19748a599fea32017cbada3959c))
* should remove blank page when going to the platform ([649985a](https://github.com/ReliefApplications/oort-frontend/commit/649985ab7c94dae354374fe09968e3b02caedd3b)), closes [bugfix/AB#35941_SA-IMST-R4](https://github.com/bugfix/AB/issues/35941_SA-IMST-R4)
* summary card preview is not available ([#1407](https://github.com/ReliefApplications/oort-frontend/issues/1407)) ([90b9f66](https://github.com/ReliefApplications/oort-frontend/commit/90b9f6690f33ccb355eb85facb208027688739ee))
* tailwind display issues in query builder ([0fbae0c](https://github.com/ReliefApplications/oort-frontend/commit/0fbae0c9d8ac7cac28aff081e2614dae9eb51b86))
* tailwind was applying styling to all inputs, even non tailwind ones ([23a5eb7](https://github.com/ReliefApplications/oort-frontend/commit/23a5eb72d6b9772560d816297ec7855198ec67f2))
* toggle not appearing in summary card settings module ([6222290](https://github.com/ReliefApplications/oort-frontend/commit/6222290de9ab552f7fcea775b828cc5f6c0b67a6))
* ui-radio missing checked input ([5e2c38e](https://github.com/ReliefApplications/oort-frontend/commit/5e2c38ea6955ce8324ccce1e83ad60885bc5d203))
* unique related name check to resources questions ([#1436](https://github.com/ReliefApplications/oort-frontend/issues/1436)) ([771012b](https://github.com/ReliefApplications/oort-frontend/commit/771012bac47dcb7ee6ab4fe702d0df6671311ac2))
* update of resource's roles permissions ([#1414](https://github.com/ReliefApplications/oort-frontend/issues/1414)) ([a887bd0](https://github.com/ReliefApplications/oort-frontend/commit/a887bd023330e090e7c7acf53496d1e6aea6b092))
* user list would not perform pagination as expected ([0636e49](https://github.com/ReliefApplications/oort-frontend/commit/0636e49420dfcde2bd08bc2df852859d7758c784))
* values instead of labels appearing on custom filter in dashboards ([2045fdb](https://github.com/ReliefApplications/oort-frontend/commit/2045fdbfa6a9c9c39b3466755c1507fd3b334e25)), closes [bugfix/AB#65520](https://github.com/bugfix/AB/issues/65520) [bugfix/AB#65520](https://github.com/bugfix/AB/issues/65520)
* values instead of labels were displayed in dashboard filters ([37f628d](https://github.com/ReliefApplications/oort-frontend/commit/37f628d248ac387b6bcb1f078269c62f15f85a30))
* webmap incorrect options in searchbar ([#1405](https://github.com/ReliefApplications/oort-frontend/issues/1405)) ([20b95da](https://github.com/ReliefApplications/oort-frontend/commit/20b95da15726a55c2c2cd7b8c3dbb62b4ed14f9e))
* wrong behavior with empty status of filters ([7a73b9e](https://github.com/ReliefApplications/oort-frontend/commit/7a73b9e259db817254d83705ae3f82e961d37ce5))


### Features

*  select / unselect all columns in grid column chooser ([5312a7e](https://github.com/ReliefApplications/oort-frontend/commit/5312a7e584008fe0144fa8c15086b38b7cf1335c)), closes [Feat/ab#11381](https://github.com/Feat/ab/issues/11381)
* add lastUpdateForm field ([2df7921](https://github.com/ReliefApplications/oort-frontend/commit/2df7921b05e176d68b47d3c3aa5c04a096410886))
* add snackbar when CUD for distribution lists, notification template & custom ([5033358](https://github.com/ReliefApplications/oort-frontend/commit/503335820c65991a64077e2ea0f817b9aabf2416))
* adding an alert to inform user it is possible to include variables in summary card ([6ed4e8a](https://github.com/ReliefApplications/oort-frontend/commit/6ed4e8a1b552984dade3a9163a9ea35d2b3d665e))
* allow distribution list to be empty ([808c23f](https://github.com/ReliefApplications/oort-frontend/commit/808c23f92a73e5942814455ca3b1f326223f0b84))
* allow urls to be loaded as images in summary cards ([f0ac681](https://github.com/ReliefApplications/oort-frontend/commit/f0ac681f8c6409ec93725c5af10985722e6c3cb8)), closes [Feat/ab#63149](https://github.com/Feat/ab/issues/63149)
* can now group layers ([a99a17f](https://github.com/ReliefApplications/oort-frontend/commit/a99a17fcf63ec4acb67c0e26243913bd208af998))
* can now integrate avatars in text widgets / summary cards widgets ([7a786fa](https://github.com/ReliefApplications/oort-frontend/commit/7a786fa46593e3d8a8e65eee3edab27b7a92193d)), closes [Feat/ab#66067](https://github.com/Feat/ab/issues/66067)
* distribution list is now editable ([a0274ac](https://github.com/ReliefApplications/oort-frontend/commit/a0274ac4ce85ba10d250a0c596e4de47c5775beb))
* empty filter are now indicated in dashboards ([#1393](https://github.com/ReliefApplications/oort-frontend/issues/1393)) ([102971a](https://github.com/ReliefApplications/oort-frontend/commit/102971a499ff2c0970576515d289f62b829ab04f))
* implement search on summary cards ([f5f661e](https://github.com/ReliefApplications/oort-frontend/commit/f5f661eecb861fcf3f8ce0d9407fd18d95004666))
* improve layers select styling ([bb0ecd8](https://github.com/ReliefApplications/oort-frontend/commit/bb0ecd8c4473a2fbd30a92099c4f8feb7b1a3e56))
* pagination on summary cards ([99ae731](https://github.com/ReliefApplications/oort-frontend/commit/99ae7311aeb650f5f925478a860d5d45d3bc2295))
* possibility to have pages on top of the app ([624f3dc](https://github.com/ReliefApplications/oort-frontend/commit/624f3dc14f4ce0692883eba97d11f4f0ea02c51e))
* possibility to move up / move down questions in forms ([e24bb3e](https://github.com/ReliefApplications/oort-frontend/commit/e24bb3eb4dcd25440211d949c8909906c22d81f1))
* sidenav can now be collapsed on large screens ([49d74d7](https://github.com/ReliefApplications/oort-frontend/commit/49d74d757dddf4f31c7502800e5163a95b8ea446))
* zoom control new styling added to maps ([#1427](https://github.com/ReliefApplications/oort-frontend/issues/1427)) ([202504e](https://github.com/ReliefApplications/oort-frontend/commit/202504e3f8363a198e2cfc383a8b59f3319fabfa))

# [2.0.0-alpha.12](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2023-05-16)


### Bug Fixes

* can now use triggers on date / datetime / time questions in forms ([7446ede](https://github.com/ReliefApplications/oort-frontend/commit/7446edeb8f0ee25f9079bf90f7891ebb3bba4960))
* export of records not working ([464708b](https://github.com/ReliefApplications/oort-frontend/commit/464708b3ee0c2f4a4b994c8cff5d45775c3a8b74))
* renderer type incorrectly set in layerDefinitionForm ([73f224b](https://github.com/ReliefApplications/oort-frontend/commit/73f224baaa325d5964fa5409c659c8ebdc8a0512))


### Features

* add contextual menu to relevant controls using tinymce editor ([b8902df](https://github.com/ReliefApplications/oort-frontend/commit/b8902dfb45342b5883580edb66788fa78b24ed3b))
* add custom listRowsWithColValue function ([0620dfd](https://github.com/ReliefApplications/oort-frontend/commit/0620dfdbc43b79dab7e90936d5d9fb4d00d56e17))
* add file type questions in possible types for matrix question ([0ecf108](https://github.com/ReliefApplications/oort-frontend/commit/0ecf1081fb50933caf0e27afec82a662aca4bd97))
* can now go to previous step automatically from a dashboard in a workflow ([4d592d1](https://github.com/ReliefApplications/oort-frontend/commit/4d592d1dfdbc4db3233b1344a3b3d07adaf609ba)), closes [2.1.x/AB#10686](https://github.com/2.1.x/AB/issues/10686)
* email subject is now editable ([f4396e9](https://github.com/ReliefApplications/oort-frontend/commit/f4396e9d390417ae0efe2ee397e0c2667308fd01))

# [2.0.0-alpha.11](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2023-05-11)


### Bug Fixes

* geospatial map showing incorrect controls ([3a11156](https://github.com/ReliefApplications/oort-frontend/commit/3a111562e04c86923e0067ffff1cd57f0adab892))
* heatmap selection was preventing some options to be reapplied + by default, color was not applied to dots ([f273d9f](https://github.com/ReliefApplications/oort-frontend/commit/f273d9fe8491a05f23034012255b627d59ab0fea))
* heatmap would not render due to incorrect lat / lng array ([8c811a2](https://github.com/ReliefApplications/oort-frontend/commit/8c811a2ed72e1debfd2ea129280815e96097a9c8))

# [2.0.0-alpha.10](https://github.com/ReliefApplications/oort-frontend/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2023-05-10)


### Bug Fixes

* legend control on map would appear multiple times ([a43f261](https://github.com/ReliefApplications/oort-frontend/commit/a43f26149b4026aee75572bb85408c3bf8b4d65b))
