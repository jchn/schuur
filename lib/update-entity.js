const updateEntity = (store, model, id, values) => {
  const entity = store[model.typePlural].byId[id]
  store[model.typePlural].byId[id] = Object.assign({}, entity, values)
  const entitiesById = store[model.typePlural].byId
  store[model.typePlural].byId = Object.assign({}, entitiesById)
  store[model.typePlural] = Object.assign({}, store[model.typePlural])
  return store
}

module.exports = updateEntity
