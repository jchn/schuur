const hasMany = model => ({[model.typePlural]: {type: 'hasMany', model}})

module.exports = hasMany
