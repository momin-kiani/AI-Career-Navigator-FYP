// models/SkillRoleMapping.js
const mongoose = require('mongoose');

const skillRoleMappingSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerRole',
    required: true
  },
  importance: {
    type: String,
    enum: ['essential', 'important', 'preferred'],
    default: 'important'
  },
  proficiencyLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
});

module.exports = mongoose.model('SkillRoleMapping', skillRoleMappingSchema);
