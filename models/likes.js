'use strict';
module.exports = function(sequelize, DataTypes) {
  var Likes = sequelize.define('Likes', {
    isLiked: DataTypes.BOOLEAN,
    messageId: DataTypes.INTEGER,
    userId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
      
      Likes.belongsTo(models.Users, { foreignKey: 'id'});
      Likes.belongsTo(models.Messages, { foreignKey: 'id'});
      }
    }
  });
  return Likes;
};