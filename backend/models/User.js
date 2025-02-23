const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true },
  phone: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('patient', 'doctor', 'admin'), defaultValue: 'patient' },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  medicalHistory: { type: DataTypes.TEXT },
  greenhouseData: { type: DataTypes.JSON }, // Pesticide exposure, heat stress, etc.
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  twoFactorCode: { type: DataTypes.STRING }
});

module.exports = User;
