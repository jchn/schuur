const updateEntity = require('./update-entity')
const addEntityToStore = require('./add-entity-to-store')

// Creates a new entity in the store
const updateOrAddEntityToStore = (model, entity, store) => {
  if (store[model.typePlural].byId[entity.id]) {
    // entity was already in the store
    store = updateEntity(model, entity.id, entity, store)
  } else {
    // add entity
    store = addEntityToStore(model, entity, store)
  }
  return store
}

module.exports = updateOrAddEntityToStore
