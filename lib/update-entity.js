const updateEntity = (store, model, id, values) => {
  const entity = store[model.typePlural].byId[id]
  store[model.typePlural].byId[id] = Object.assign({}, entity, values)
  return store
}

module.exports = updateEntity
