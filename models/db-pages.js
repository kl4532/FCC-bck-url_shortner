const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
//  pages schema
const PagesSchema = new mongoose.Schema({
  url:{
    type: String,
    required: true
  }
});

PagesSchema.plugin(AutoIncrement, {inc_field: 'index'});
const Page = mongoose.model('Page', PagesSchema);

module.exports = Page;