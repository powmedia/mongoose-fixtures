
ObjectID = require('mongodb').BSONNative.ObjectID
countries = new Array()

country1 =
    _id: new ObjectID(),
    countryCode: "CA",
    countryName: "Canada",
countries.push country1

country2 =
    _id: new ObjectID(),
    countryCode: "SE",
    countryName: "Sweden",
countries.push country2

module.exports.Country = countries
