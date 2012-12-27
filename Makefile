
MONGODB_URL = 'mongodb://localhost:27017/mongoose-fixtures?safe=true'
REPORTER = list

test:
	@NODE_ENV=test \
	MONGODB_URL=$(MONGODB_URL) \
	./node_modules/.bin/mocha \
		--recursive \
		--reporter $(REPORTER) \
		--timeout 10000 \
		--bail \
		tests/*.test.js \
