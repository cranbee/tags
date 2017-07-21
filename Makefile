.PHONY: default lib demo sample test clean patch minor

default: lib demo

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
	rm -f demo/bundle.js

patch:
	npm version patch && npm publish --access=public

minor:
	npm version minor && npm publish --access=public
