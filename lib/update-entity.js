const updateEntity = (model, id, values, store) => {
  const newStore = Object.assign({}, store)
  newStore[model.typePlural] = {...newStore[model.typePlural]}
  newStore[model.typePlural].byId = {...newStore[model.typePlural].byId}
  newStore[model.typePlural].byId[id] = {...newStore[model.typePlural].byId[id]}
  newStore[model.typePlural].byId[id] = Object.assign({}, newStore[model.typePlural].byId[id], values)

  return newStore
}

module.exports = updateEntity
