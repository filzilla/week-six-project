'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isLiked: {
        type: Sequelize.BOOLEAN
      },
      messageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Messages",
          key: 'id'
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: 'id'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Likes');
  }
};