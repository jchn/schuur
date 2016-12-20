const updateEntity = require('./update-entity')
const addEntityToStore = require('./add-entity-to-store')

// Creates a new entity in the store
const updateOrAddEntityToStore = (store, model, entity) => {
  if (store[model.typePlural].byId[entity.id]) {
    // entity was already in the store
    store = updateEntity(store, model, entity.id, entity)
  } else {
    // add entity
    store = addEntityToStore(store, model, entity)
  }
  return store
}

module.exports = updateOrAddEntityToStore
