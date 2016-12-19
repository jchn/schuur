const hasMany = require('./lib/has-many')
const belongsTo = require('./lib/belongs-to')
const addModelToStore = require('./lib/add-model-to-store')
const addEntityToStore = require('./lib/add-entity-to-store')
const updateEntity = require('./lib/update-entity')
const addRelatedEntityToEntity = require('./lib/add-related-entity-to-entity')
const removeEntityFromStore = require('./lib/remove-entity-from-store.js')

const Schuur = {
  hasMany,
  belongsTo,
  addModelToStore,
  addEntityToStore,
  updateEntity,
  addRelatedEntityToEntity,
  removeEntityFromStore
}

module.exports = Schuur
