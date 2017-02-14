const hasMany = require('./has-many')
const belongsTo = require('./belongs-to')
const addModelToStore = require('./add-model-to-store')
const addEntityToStore = require('./add-entity-to-store')
const updateEntity = require('./update-entity')
const addRelatedEntityToEntity = require('./add-related-entity-to-entity')
const removeEntityFromStore = require('./remove-entity-from-store.js')
const updateOrAddEntityToStore = require('./update-or-add-entity-to-store')

const Schuur = {
  hasMany,
  belongsTo,
  addModelToStore,
  addEntityToStore,
  updateEntity,
  addRelatedEntityToEntity,
  removeEntityFromStore,
  updateOrAddEntityToStore
}

module.exports = Schuur
