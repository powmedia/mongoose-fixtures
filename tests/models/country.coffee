
mongoose = require 'mongoose'

CountrySchema = new mongoose.Schema(
    countryCode:
        type: String,
        require: true,
        trim: true
    countryName:
        type: String,
        require: true,
        trim: true
)

validateCountryCodeSize = (done) ->
    if @countryCode.length != 2
        done new Error('countryCode must be 2 characters long')
    else
        done()

CountrySchema.pre 'save', validateCountryCodeSize

mongoose.model 'Country', CountrySchema
