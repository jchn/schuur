const uniq = require('ramda/src/uniq')
const updateEntity = require('./update-entity')
const updateOrAddEntityToStore = require('./update-or-add-entity-to-store')

// Adds an entity to the store
// Creates a relation
const addRelatedEntityToEntity = (entityModel, entityID, relatedModel, relatedEntity, store) => {
  store = updateOrAddEntityToStore(relatedModel, relatedEntity, store)

  // add relationship for related entity
  const relationshipWithEntity = relatedModel[entityModel.type] || relatedModel[entityModel.typePlural]
  if (relationshipWithEntity.type === 'belongsTo') {
    store = updateEntity(relatedModel, relatedEntity.id, {[entityModel.type]: entityID}, store)
  } else if (relationshipWithEntity.type === 'hasMany') {
    store = updateEntity(relatedModel, relatedEntity.id, {[entityModel.typePlural]: uniq([...relatedEntity[entityModel.typePlural], entityID])}, store)
  }

  // add relationship the other way around
  const relationshipWithRelatedEntity = entityModel[relatedModel.type] || entityModel[relatedModel.typePlural]
  if (relationshipWithRelatedEntity.type === 'belongsTo') {
    store = updateEntity(entityModel, entityID, {[relatedModel.type]: relatedEntity.id}, store)
  } else if (relationshipWithRelatedEntity.type === 'hasMany') {
    const entity = store[entityModel.typePlural].byId[entityID]
    store = updateEntity(entityModel, entityID, {[relatedModel.typePlural]: uniq([...entity[relatedModel.typePlural], relatedEntity.id])}, store)
  }

  return store
}

module.exports = addRelatedEntityToEntity
