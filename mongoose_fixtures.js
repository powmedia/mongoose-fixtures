
var fs          = require('fs');
var mongoose    = require('mongoose');
var async       = require('async');
var path        = require('path');
var glob        = require('glob');
    

/**
 * Clears a collection and inserts the given data as new documents
 *
 * @param {Mixed}       The data to load. This parameter accepts either:
 *                          String: Path to a file or directory to load
 *                          Object: Object literal in the form described above
 * @param {Connection}  [db] Optionally, the mongoose connection to use.
 *                          Defaults to mongoose.connection.
 * @param {Function}    Callback
 */
var load = exports.load = function(data, db, callback) {
    if (typeof db === 'function') {
        callback = db;
        db = mongoose.connection;
    }

    if (typeof data == 'object') {

        loadObject(data, db, callback);

    } else if (typeof data == 'string') {

        loadFiles(data, db, callback);

    } else { //Unsupported type

        callback(new Error('Data must be an object, array or string (file or dir path)'));

    }
}

    
/**
 * Clears a collection and inserts the given data as new documents
 *
 * @param {String}      The name of the model e.g. User, Post etc.
 * @param {Object}      The data to insert, as an array or object. E.g.:
 *                          { user1: {name: 'Alex'}, user2: {name: 'Bob'} }
 *                      or:
 *                          [ {name: 'Alex'}, {name:'Bob'} ]
 * @param {Connection}  The mongoose connection to use
 * @param {Function}    Callback
 */
function insertCollection(modelName, data, db, callback) {
    callback = callback || {};
    
    //Counters for managing callbacks
    var tasks = { total: 0, done: 0 };
    
    //Load model
    var Model = db.model(modelName);
    
    //Clear existing collection
    Model.collection.remove(function(err) {
        if (err) return callback(err);
        
        //Convert object to array
        var items = [];
        if (Array.isArray(data)) {
            items = data;
        } else {
            for (var i in data) {
                items.push(data[i]);
            }
        }
        
        //Check number of tasks to run
        if (items.length == 0) {
            return callback();
        } else {
            tasks.total = items.length;
        }
        
        //Insert each item individually so we get Mongoose validation etc.
        items.forEach(function(item) {                       
            var doc = new Model(item);
            doc.save(function(err) {
                if (err) return callback(err);
                
                //Check if task queue is complete
                tasks.done++;
                if (tasks.done == tasks.total) callback();
            });
        });
    });
}


/**
 * Loads fixtures from object data
 * 
 * @param {Object}      The data to load, keyed by the Mongoose model name e.g.:
 *                          { User: [{name: 'Alex'}, {name: 'Bob'}] }
 * @param {Connection}  The mongoose connection to use
 * @param {Function}    Callback
 */
function loadObject(data, db, callback) {
    callback = callback || function() {};
    var iterator = function(modelName, next){
        insertCollection(modelName, data[modelName], db, next);
    };
    async.forEach(Object.keys(data), iterator, callback);
}

/**
 * Loads fixtures from matches of glob search filesystem pattern
 * 
 * TODO: Add callback option
 * 
 * @param {String}      The directory path to load e.g. 'data/fixtures' or '../data'
 * @param {Connection}  The mongoose connection to use
 * @param {Function}    Callback
 */
function loadFiles(data, db, callback) {
  var __cwd = module.parent.filename.split('/');
  __cwd.pop();
  __cwd = __cwd.join('/');

  data = path.join(__cwd, data);
  if (!/\*|\.js*/.test(data))
    data = data + '/*';

  glob(data, { cwd: __cwd }, function(err, files) {
    if (err) return callback(err);

    var iterator = function(file, next) {
        load(require(file), db, next);
    };
    async.forEach(files, iterator, callback);
  });
};
