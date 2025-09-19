serve-back:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run back-office:serve

serve-front:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run front-office:serve

serve-widgets:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run web-widgets:serve

project?=azure-dev # default value of project
# For example, make bundle-widgets project=azure-prod
bundle-widgets:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run web-widgets:build:$(project)
	npx nx run web-widgets:bundle

build-widgets:
	node .scripts/build-widgets.js

prettify:
	npx prettier --write "**/*.{scss,html}"
