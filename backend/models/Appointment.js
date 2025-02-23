const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const User = require('./User');

const Appointment = sequelize.define('Appointment', {
  patientId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  doctorId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'accepted', 'completed'), defaultValue: 'pending' },
  prescription: { type: DataTypes.TEXT }
});

module.exports = Appointment;
