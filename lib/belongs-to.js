const belongsTo = model => ({[model.type]: {type: 'belongsTo', model}})

module.exports = belongsTo
