var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var passportLocalMongoose = require("passport-local-mongoose");

var acSchema = new mongoose.Schema({
  name: String,
  type: String,
  username: String,
  password: String,
  department: String,
  
  ods: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Od"
    }
  ]
});

acSchema.plugin(passportLocalMongoose);
var Ac = (module.exports = mongoose.model("Ac", acSchema));

module.exports.createAc= function(newAc, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newAc.password, salt, function(err, hash) {
      newAc.password = hash;
      newAc.save(callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  Ac.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
  Ac.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, passwordFound) {
    if (err) throw err;
    callback(null, passwordFound);
  });
};
