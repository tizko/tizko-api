'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: DataTypes.STRING,
      passwordHash: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      birthDate: DataTypes.DATEONLY,
      gender: DataTypes.STRING,
      contactNumber: DataTypes.STRING,
      shippingAddress: DataTypes.STRING,
      billingAddress: DataTypes.STRING,
    },
    {}
  );

  //remove id and password in API responses for security reasons
  User.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());

    //delete values.id;
    delete values.passwordHash;
    return values;
  };

  User.associate = function (models) {
    // associations can be defined here
  };

  return User;
};
