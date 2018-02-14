PHONY:
	echo "Choose a build target!"

clean:
	rm -rf build

tscompile:
	node node_modules/typescript/bin/tsc -p ./tsconfig.json

basic: clean
	mkdir -p build
	cp -r data build
	cp -r images build
	cp -r src build
	cp -r sfx build
	cp index.html build
	cp service-worker.js build
	cp manifest.json build
	mkdir -p build/node_modules/angular
	cp       node_modules/angular/angular.min.js build/node_modules/angular/angular.min.js
	mkdir -p build/node_modules/angular-animate
	cp       node_modules/angular-animate/angular-animate.min.js build/node_modules/angular-animate/angular-animate.min.js
	mkdir -p build/node_modules/angular-aria
	cp       node_modules/angular-aria/angular-aria.min.js build/node_modules/angular-aria/angular-aria.min.js
	mkdir -p build/node_modules/angular-material
	cp       node_modules/angular-material/angular-material.min.js build/node_modules/angular-material/angular-material.min.js
	mkdir -p build/node_modules/angular-material
	cp       node_modules/angular-material/angular-material.min.css build/node_modules/angular-material/angular-material.min.css

gh: basic
	# ignore build on github
	cp .nojekyll build/.nojekyll
	mv build/ docs/

ipfs: basic
	ipfs add -rQ --pin=false build/
