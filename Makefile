.PHONY: all sample test patch minor clean

all:
	npx babel src -d lib
	npx webpack --config demo/webpack.config.js

sample:
	node test/generator.js

test:
	node test/test.js

patch:
	npm version patch && npm publish --access=public

minor:
	npm version minor && npm publish --access=public

clean:
	rm -rf lib
	rm -f demo/bundle.js
