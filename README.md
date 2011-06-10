mongoose-fixtures
=================

Simple fixture loader for Mongoose on NodeJS.

Fixtures can be in one file, or divided up into separate files for organisation 
(e.g. one file per model)

The fixture files must export objects which are keyed by the Mongoose model name, each
containing the data for documents within that.

NOTE: Loading fixtures will clear the existing contents of a collection!

FOR EXAMPLE:
With the file below, 2 User models will be inserted into the 'User' collection:

    //users.js
    exports.User = {
        user1: {
            name: 'Michael'
        },
        user2: {
            name: 'Tobias'
        }
    }

    exports.User = [
        { name: 'Gob' },
        { name: 'Buster' }
    ]

Usage
-----

    var fixtures = require('fixtures');
    
    //Objects
    fixtures.load({
        User: [
            { name: 'Maeby' },
            { name: 'George Michael' }
        ]
    });

    //Files
    fixtures.load(__dirname + '/fixtures/users.js');

    //Directories (loads all files in the directory)
    fixtures.load(__dirname + '/fixtures');

Installation
------------

Clone / download from [github](https://github.com/powmedia/mongoose-fixtures),
and then require in your project:

    var fixtures = require('./lib/mongoose-fixtures');
