
require("coffee-script");
var async = require('async');
var path = require('path');
var expect = require('expect.js');
var mongoose = require('mongoose');
var fixturesLoader = require('../mongoose_fixtures');
var MongooseInitializer =  require('openifyit-commons').MongooseInitializer;

describe('mongoose-fixtures test', function(){
    before(function(done){
        this.mongooseInitializer = new MongooseInitializer(process.env.MONGODB_URL, path.join(__dirname, './models'));

        var functions = [
            this.mongooseInitializer.openConnection,
            this.mongooseInitializer.loadModels
        ];
        async.series(functions, done);
    });

    after(function(done){
        done();
    });

    it('should load fixtures from a directory', function(done){
        done();
    });
});
