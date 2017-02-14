import test from 'ava'
import {hasMany, belongsTo, addModelToStore, addEntityToStore} from '../lib'

test('addEntityToStore should add an entity to the store', t => {
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }

  let store = {}

  store = addModelToStore(bookModel, store)

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  store = addEntityToStore(bookModel, book, store)

  const expectedStore = {
    books: {
      byId: {
        1: {
          id: '1',
          title: 'hitchhiker\'s guide to the galaxy'
        }
      },
      ids: ['1']
    }
  }

  t.deepEqual(expectedStore, store)
})

test('addEntityToStore should provide added object/entity with related key with a value of null for belongsTo relation', t => {
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }

  const pageModel = {
    type: 'page',
    typePlural: 'pages',
    book: belongsTo(bookModel)
  }

  const page = {
    id: '1',
    number: 42
  }

  let store = {}

  store = addModelToStore(pageModel, store)

  store = addEntityToStore(pageModel, page, store)

  const expectedStore = {
    pages: {
      byId: {
        1: {
          id: '1',
          number: 42,
          book: null
        }
      },
      ids: ['1']
    }
  }

  t.deepEqual(store, expectedStore)
})

test('addEntityToStore should provide added object/entity with related key with a value of an empty array for hasMany relation', t => {
  const pageModel = {
    type: 'page',
    typePlural: 'pages'
  }

  const bookModel = {
    type: 'book',
    typePlural: 'books',
    pages: hasMany(pageModel)
  }

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  let store = {}

  store = addModelToStore(bookModel, store)

  store = addEntityToStore(bookModel, book, store)

  const expectedStore = {
    books: {
      byId: {
        1: {
          id: '1',
          title: 'hitchhiker\'s guide to the galaxy',
          pages: []
        }
      },
      ids: ['1']
    }
  }

  t.deepEqual(store, expectedStore)
})

test('addEntityToStore should overwrite an existing entity if it is already in the store', t => {
  const pageModel = {
    type: 'page',
    typePlural: 'pages'
  }

  const bookModel = {
    type: 'book',
    typePlural: 'books',
    pages: hasMany(pageModel)
  }

  const book1 = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  const book2 = {
    id: '1',
    title: 'node.js for beginners'
  }

  let store = {}

  store = addModelToStore(bookModel, store)

  store = addEntityToStore(bookModel, book1, store)
  store = addEntityToStore(bookModel, book2, store)

  const expectedStore = {
    books: {
      byId: {
        1: {
          id: '1',
          title: 'node.js for beginners',
          pages: []
        }
      },
      ids: ['1']
    }
  }

  t.deepEqual(store, expectedStore)
})
