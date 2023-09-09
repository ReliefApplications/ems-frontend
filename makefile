serve-back:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run back-office:serve

serve-back-oort:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run back-office:serve:oort-local

serve-front:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run front-office:serve

serve-front-oort:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run front-office:serve:oort-local

serve-widgets:
	NODE_OPTIONS="--max-old-space-size=4096" npx nx run web-widgets:serve

bundle-widgets:
	NODE_OPTIONS="--max-old-space-size=4096" npm run bundle:widgets
