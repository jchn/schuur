// Adds model definition to store
const addModelToStore = (store, model) => {
  const newModelEntry = {[model.typePlural]: {byId: {}, ids: []}}

  return Object.assign({}, store, newModelEntry)
}

module.exports = addModelToStore
