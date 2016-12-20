const uniq = require('ramda/src/uniq')
const updateEntity = require('./update-entity')
const updateOrAddEntityToStore = require('./update-or-add-entity-to-store')

// Adds an entity to the store
// Creates a relation
const addRelatedEntityToEntity = (store, entityModel, entityID, relatedModel, relatedEntity) => {
  store = updateOrAddEntityToStore(store, relatedModel, relatedEntity)

  // add relationship for related entity
  const relationshipWithEntity = relatedModel[entityModel.type] || relatedModel[entityModel.typePlural]
  if (relationshipWithEntity.type === 'belongsTo') {
    store = updateEntity(store, relatedModel, relatedEntity.id, {[entityModel.type]: entityID})
  } else if (relationshipWithEntity.type === 'hasMany') {
    store = updateEntity(store, relatedModel, relatedEntity.id, {[entityModel.typePlural]: uniq([...relatedEntity[entityModel.typePlural], entityID])})
  }

  // add relationship the other way around
  const relationshipWithRelatedEntity = entityModel[relatedModel.type] || entityModel[relatedModel.typePlural]
  if (relationshipWithRelatedEntity.type === 'belongsTo') {
    store = updateEntity(store, entityModel, entityID, {[relatedModel.type]: relatedEntity.id})
  } else if (relationshipWithRelatedEntity.type === 'hasMany') {
    const entity = store[entityModel.typePlural].byId[entityID]
    store = updateEntity(store, entityModel, entityID, {[relatedModel.typePlural]: uniq([...entity[relatedModel.typePlural], relatedEntity.id])})
  }

  return store
}

module.exports = addRelatedEntityToEntity
