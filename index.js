//Dependencies
var fs          = require('fs'),
    mongoose    = require('mongoose');
    

/**
 * Clears a collection and inserts the given data as new documents
 *
 * @param {Mixed}       The data to load. This parameter accepts either:
 *                          String: Path to a file or directory to load
 *                          Object: Object literal in the form described above
 * @param {Function}    Callback
 */
var load = exports.load = function(data, callback) {
    if (typeof data == 'object') {

        loadObject(data, callback);

    } else if (typeof data == 'string') {

        //Get the absolute dir path if a relative path was given
        if (data.substr(0, 1) !== '/') {
            var parentPath = module.parent.filename.split('/');
            parentPath.pop();
            data = parentPath.join('/') + '/' + data;
        }

        //Determine if data is pointing to a file or directory
        fs.stat(data, function(err, stats) {
            if (err) throw err;

            if (stats.isDirectory()) {
                loadDir(data, callback);
            } else { //File
                loadFile(data, callback);
            }
        });

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
 * @param {Function}    Callback
 */
function insertCollection(modelName, data, callback) {
    callback = callback || {};
    
    //Counters for managing callbacks
    var tasks = { total: 0, done: 0 };
    
    //Load model
    var Model = mongoose.model(modelName);
    
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
 * @param {Function}    Callback
 */
function loadObject(data, callback) {
    callback = callback || function() {};
    
    //Counters for managing callbacks
    var tasks = { total: 0, done: 0 };
    
    //Go through each model's data
    for (var modelName in data) {
        (function() {
            tasks.total++;
            
            insertCollection(modelName, data[modelName], function(err) {
                if (err) throw(err);
                
                tasks.done++;
                if (tasks.done == tasks.total) callback();
            });
        })();
    }
}


/**
 * Loads fixtures from one file
 * 
 * TODO: Add callback option
 * 
 * @param {String}      The full path to the file to load
 * @param {Function}    Callback
 */
function loadFile(file, callback) { 
    callback = callback || function() {};
    
    if (file.substr(0, 1) !== '/') {
        var parentPath = module.parent.filename.split('/');
        parentPath.pop();
        file = parentPath.join('/') + '/' + file;
    }
    
    load(require(file), callback);
}


/**
 * Loads fixtures from all files in a directory
 * 
 * TODO: Add callback option
 * 
 * @param {String}      The directory path to load e.g. 'data/fixtures' or '../data'
 * @param {Function}    Callback
 */
function loadDir(dir, callback) {
    callback = callback || function() {};
    
    //Get the absolute dir path if a relative path was given
    if (dir.substr(0, 1) !== '/') {
        var parentPath = module.parent.filename.split('/');
        parentPath.pop();
        dir = parentPath.join('/') + '/' + dir;
    }
    
    //Counters for managing callbacks
    var tasks = { total: 0, done: 0 };
    
    //Load each file in directory
    fs.readdir(dir, function(err, files){
        if (err) return callback(err);
        
        tasks.total = files.length;
        
        files.forEach(function(file) {
            loadFile(dir + '/' + file, function(err) {
                if (err) return callback(err);
                
                tasks.done++;
                if (tasks.total == tasks.done) callback();
            });
        });
    });
};
