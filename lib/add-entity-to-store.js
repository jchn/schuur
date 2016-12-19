// Creates a new entity in the store
const addEntityToStore = (store, model, entity) => {
  // extend entity with related keys
  Object.keys(model).filter(key => (key !== 'type' && key !== 'typePlural')).forEach(key => {
    const relation = model[key]
    if (relation.type === 'belongsTo') {
      entity[key] = null
    } else if (relation.type === 'hasMany') {
      entity[key] = []
    }
  })

  store[model.typePlural].ids = [...store[model.typePlural].ids, entity.id]
  store[model.typePlural].byId = Object.assign({}, store[model.typePlural].byId, {[entity.id]: entity})
  return store
}

module.exports = addEntityToStore
