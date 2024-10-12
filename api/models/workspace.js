const mongoose = require('mongoose');
const workspaceSchema = require('~/models/schema/workspaceSchema');

const workspace = mongoose.model('workspaces', workspaceSchema);

module.exports = workspace;
