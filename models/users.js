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

        Users.hasMany(models.Messages, {foreignKey: 'userId'}),
        Users.hasMany(models.Likes, {foreignKey: 'userId'})
      }
    }
  });
  return Users;
};