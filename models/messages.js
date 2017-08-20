'use strict';
module.exports = function(sequelize, DataTypes) {
  var Messages = sequelize.define('Messages', {
    messageText: DataTypes.CHAR(140),
    userId: DataTypes.STRING,
    messageId: { type:DataTypes.INTEGER, primaryKey: true},
  }, {
    classMethods: {
      associate: function(models) {
         Messages.hasMany(models.Likes, { foreignKey: 'id'});
         Messages.belongsTo(models.Users, { foreignKey: 'id'});
      }
    }
  });
  return Messages;
};