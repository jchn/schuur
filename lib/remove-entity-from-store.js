const omit = require('ramda/src/omit')
const pipe = require('ramda/src/pipe')
const values = require('ramda/src/values')
const updateEntity = require('./update-entity')

const removeEntityFromStore = (entityModel, entityId, store) => {
  store[entityModel.typePlural].ids = store[entityModel.typePlural].ids.filter(id => id !== entityId)

  const entity = store[entityModel.typePlural].byId[entityId]

  // check if the entity has any related entities
  const getRelatedProperties = pipe(omit(['type', 'typePlural']), values)

  const relations = getRelatedProperties(entityModel)

  relations.forEach(relation => {
    if (relation.type === 'hasMany') {
      const key = relation.model.typePlural
      const relatedEntityIds = entity[key]

      // get related entities
      const relatedEntities = relatedEntityIds.map(id => store[relation.model.typePlural].byId[id])
      // remove itself from related entities

      // check what kind of relationship relatedEntity has with our entity
      const relationWithRelatedEntity = (relation.model[entityModel.typePlural] || relation.model[entityModel.type]).type

      // set relation to null
      if (relationWithRelatedEntity === 'belongsTo') {
        relatedEntities.forEach(relatedEntity => {
          store = updateEntity(relation.model, relatedEntity.id, {[entityModel.type]: null}, store)
        })
      }

      // filter out any ids from entity
      if (relationWithRelatedEntity === 'hasMany') {
        relatedEntities.forEach(relatedEntity => {
          store = updateEntity(relation.model, relatedEntity.id, {[entityModel.typePlural]: relatedEntity[entityModel.typePlural].filter(id => id !== entityId)}, store)
        })
      }
    }

    if (relation.type === 'belongsTo') {
      const key = relation.model.type
      const relatedEntityId = entity[key]

      // get related entity
      const relatedEntity = store[relation.model.typePlural].byId[relatedEntityId]

      // remove itself from related entity

      // check what kind of relationship relatedEntity has with our entity
      const relationWithRelatedEntity = (relation.model[entityModel.typePlural] || relation.model[entityModel.type]).type

      // set relation to null
      if (relationWithRelatedEntity === 'belongsTo' && relatedEntity) {
        store = updateEntity(relation.model, relatedEntity.id, {[entityModel.type]: null}, store)
      }

      // filter out any ids from entity
      if (relationWithRelatedEntity === 'hasMany') {
        store = updateEntity(relation.model, relatedEntity.id, {[entityModel.typePlural]: relatedEntity[entityModel.typePlural].filter(id => id !== entityId)}, store)
      }
    }
  })

  store[entityModel.typePlural].byId = omit(entityId, store[entityModel.typePlural].byId)

  return store
}

module.exports = removeEntityFromStore
