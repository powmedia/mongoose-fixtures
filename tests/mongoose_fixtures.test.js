
require("coffee-script");

var async = require('async');
var path = require('path');
var expect = require('expect.js');
var mongoose = require('mongoose');
var fixturesLoader = require('../mongoose_fixtures');

describe('mongoose-fixtures test', function(){
    before(function(){
        mongoose.connect(process.env.MONGODB_URL);
        require('./models/country');
    });

    after(function(done){
        done();
    });

    it('should load fixtures from a directory', function(done){
        fixturesLoader.load('./fixtures', function(err){
            expect(err).not.to.be.ok();
            var CountrySchema = mongoose.connection.model('Country');
            CountrySchema.find({}, function(err, countries){
                expect(err).not.to.be.ok();
                expect(countries).to.be.ok();
                expect(countries).to.be.an(Array);
                expect(countries.length).to.be.eql(2);
                done();
            });
        });
    });

    it('should load fixtures from a file', function(done){
        fixturesLoader.load('./fixtures/countries.coffee', function(err){
            expect(err).not.to.be.ok();
            var CountrySchema = mongoose.connection.model('Country');
            CountrySchema.find({}, function(err, countries){
                expect(err).not.to.be.ok();
                expect(countries).to.be.ok();
                expect(countries).to.be.an(Array);
                expect(countries.length).to.be.eql(2);
                done();
            });
        });
    });

    it('should load fixtures from an object', function(done){
        var data = require('./fixtures/countries');
        fixturesLoader.load(data, function(err){
            expect(err).not.to.be.ok();
            var CountrySchema = mongoose.connection.model('Country');
            CountrySchema.find({}, function(err, countries){
                expect(err).not.to.be.ok();
                expect(countries).to.be.ok();
                expect(countries).to.be.an(Array);
                expect(countries.length).to.be.eql(2);
                done();
            });
        });
    });
});
