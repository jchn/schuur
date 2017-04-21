[![Build Status](https://travis-ci.org/jchn/schuur.svg?branch=master)](https://travis-ci.org/jchn/schuur)
[![Coverage Status](https://coveralls.io/repos/github/jchn/schuur/badge.svg?branch=master)](https://coveralls.io/github/jchn/schuur?branch=master)

## Schuur.js

> A serializable relational plain object shed.

### Functions 

##### Updating the store

- addModelToStore
- addEntityToStore
- addRelatedEntityToEntity
- removeEntityFromStore

##### Helpers

- belongsTo
- hasMany

### Creating a store 

A store (or state) is a plain javascript object:

```js
let store = {}
```

### Defining models 

A model is a plain object with at least 2 properties: `type` and `typePlural`

#### Example

```js
let bookModel = {
    type: 'book',
    typePlural: 'books'
}
```

### Adding relations

Adding relations is done using the `hasMany` and `belongsTo` functions

```js
import { belongsTo, hasMany } from 'schuur'

let authorModel = {
    type: 'author',
    typePlural: 'authors',
    ...hasMany(bookModel)
}

Object.assign(bookModel, belongsTo(authorModel))

/*
    authorModel
    {
        type: 'author',
        typePlural: 'authors',
        books: {
            type: 'hasMany',
            model: bookModel
        }
    }

    bookModel
    {
        type: 'book',
        typePlural: 'books',
        author: {
            type: 'belongsTo',
            model: authorModel
        }
    }

```

### Adding models to the store

Adding models to the store will prepare it for any entities you'd like to add:

```js
import { addModelToStore } from 'schuur'

let store = {}

store = addModelToStore(bookModel, store)
store = addModelToStore(authorModel, store)

/*
    {
        books: {
            ids: [],
            byId: {}
        },
        authors: {
            ids: [],
            byId: {}
        }
    }
*/
```

### Adding entities to the store

Entities are javascript objects, which should at least have an `id` property. This property will be used to connect the entity with other related entities and to find the entity in the store.

```js
import { addEntityToStore } from 'schuur'

const bookEntity = {
    id: '42',
    title: 'Hitchhiker\'s guide to the galaxy'
}

store = addEntityToStore(bookModel, bookEntity, store)

/*
    {
        books: {
            ids: ['42'],
            byId: {
                id: '42',
                title: 'Hitchhiker\'s guide to the galaxy',
                author: null
            }
        }
    }
*/
```

### Adding related entities to the store

Adding a related entity to the store can be done using the `addRelatedEntityToEntity` function. Assuming our book was already added to the store:

```js
import { addRelatedEntityToEntity } from 'schuur'

const author = {
    id: '1',
    name: 'Douglas Adams'
}

store = addRelatedEntityToEntity(bookModel, '42', authorModel, author, store)

/*
    {
        books: {
            ids: ['42'],
            byId: {
                42: {
                    id: '42',
                    title: 'Hitchhiker\'s guide to the galaxy',
                    author: '1'
                }
            }
        },
        authors: {
            ids: ['1'],
            byId: {
                1: {
                    id: '1',
                    name: 'Douglas Adams',
                    books: ['42']
                }
            }
        }
    }
*/
```


### Removing entities from the store

To remove an entity and all its references (reverse relations) from the store, use `removeEntityFromStore`.
Assuming the store from our previous example is the current store.

```js
import { removeEntityFromStore } from 'schuur'

store = removeEntityFromStore(bookModel, '42', store)

/*
    {
        books: {
            ids: [],
            byId: {}
        },
        authors: {
            ids: ['1'],
            byId: {
                1: {
                    id: '1',
                    name: 'Douglas Adams',
                    books: []
                }
            }
        }
    }
*/
```
