const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'workspaces',
    required: true,
  },
  invitedEmail: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Debe ser un correo electrónico válido'],
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired'],
    default: 'pending',
  },
}, {
  timestamps: true, // Añade campos de createdAt y updatedAt automáticamente
});

// Agregar un índice para que expire automáticamente
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
