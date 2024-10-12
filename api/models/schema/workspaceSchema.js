const mongoose = require('mongoose');

const { Schema } = mongoose;

const workspaceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Referencia a la colección de usuarios
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Referencia a la colección de usuarios
    },
  ],
  avatar: {
    type: Schema.Types.ObjectId,
  },
  connections: {
    type: Array, // Define connections como un array
    default: [], // Inicializa el array vacío por defecto
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Crear el modelo
module.exports = workspaceSchema;
