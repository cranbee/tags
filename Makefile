.PHONY: default install lib demo sample test clean patch minor

default: install lib demo

install:
	npm install
	npm update

lib:
	npx babel src -d lib

demo:
	npx webpack --config demo/webpack.config.js

sample:
	node test/generator.js

test:
	node test/test.js

clean:
	rm -rf lib
	rm -rf node_modules
	rm -f demo/bundle.js
	rm -f package-lock.json

patch:
	npm version patch && npm publish --access=public

minor:
	npm version minor && npm publish --access=public
