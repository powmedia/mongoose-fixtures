
require("coffee-script");

var async = require('async');
var path = require('path');
var expect = require('expect.js');
var mongoose = require('mongoose');
var fixturesLoader = require('../mongoose_fixtures');
var MongooseInitializer = require('openifyit-commons').MongooseInitializer;

describe('mongoose-fixtures test', function(){
    before(function(done){
        // @todo Fix connection and model loader
        mongoose.connect(process.env.MONGODB_URL);
        require('./models/client');
        require('./models/paranoid');
        require('./models/country.coffee');
        done();
        
        // this.mongooseInitializer = new MongooseInitializer(process.env.MONGODB_URL, path.join(__dirname, './models'));

        // var functions = [
        //     this.mongooseInitializer.openConnection,
        //     this.mongooseInitializer.loadModels
        // ];
        // async.series(functions, done);
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

    it('should load fixtures from glob pattern', function(done){
        var pattern = './fixtures/globfolder/!(index.*)(.*)';
        fixturesLoader.load(pattern, function(err){
            expect(err).not.to.be.ok();
            var ClientSchema = mongoose.connection.model('Client');
            ClientSchema.find({}, function(err, clients){
                expect(err).not.to.be.ok();
                expect(clients).to.be.ok();
                expect(clients).to.be.an(Array);
                expect(clients.length).to.be.eql(1);
                done();
            });
        });
    });

    it('should load fixtures from a paranid model', function(done){
        var pattern = './fixtures/paranoidhooks/paranoids.js';
        fixturesLoader.load(pattern, function(err){
            expect(err).not.to.be.ok();
            var ParanoidSchema = mongoose.connection.model('Paranoid');
            ParanoidSchema.find({}, function(err, paranoids){
                expect(err).not.to.be.ok();
                expect(paranoids).to.be.ok();
                expect(paranoids).to.be.an(Array);
                expect(paranoids.length).to.be.eql(1);
                done();
            });
        });
    });
});
