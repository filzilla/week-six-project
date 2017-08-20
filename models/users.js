'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    username: { type:DataTypes.STRING, unique: true},
    password: DataTypes.STRING,
    email: {type:DataTypes.STRING, unique: true},
    displayname:{ type: DataTypes.STRING, unique:true},
    userId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {

        Users.hasMany(models.Messages, {foreignKey: 'id'}),
        Users.hasMany(models.Likes, {foreignKey: 'id'})
      }
    }
  });
  return Users;
};