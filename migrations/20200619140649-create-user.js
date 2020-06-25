'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false, 
        isEmail: true,
        type: Sequelize.STRING
      },
      passwordHash: {
        allowNull: false,
        isAlphanumeric: true,
        type: Sequelize.STRING
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        defaultValue: null
      },
      gender: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      contactNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shippingAddress: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      billingAddress: {
        type: Sequelize.STRING,
        defaultValue: null
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};