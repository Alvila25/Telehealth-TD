const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const Content = sequelize.define('Content', {
  title: { type: DataTypes.STRING, allowNull: false },
  body: { type: DataTypes.TEXT, allowNull: false },
  language: { type: DataTypes.STRING, defaultValue: 'en' } // en, fr, ar
});

module.exports = Content;
