'use strict';
module.exports = function(sequelize, DataTypes) {
  var Messages = sequelize.define('Messages', {
    messageText: DataTypes.CHAR(140),
    userId: DataTypes.STRING,
    messageId: { type:DataTypes.INTEGER, primaryKey: true},
  }, {
    classMethods: {
      associate: function(models) {
         Messages.hasMany(models.Likes, { foreignKey: 'messageId'});
         Messages.belongsTo(models.Users, { foreignKey: 'userId'});
      }
    }
  });
  return Messages;
};