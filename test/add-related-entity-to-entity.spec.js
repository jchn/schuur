import test from 'ava'
import {clone} from 'ramda'
import {hasMany, belongsTo, addModelToStore, addEntityToStore, addRelatedEntityToEntity} from '../lib'

test('addRelatedEntityToEntity should update a belongsTo and hasMany relation', t => {
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }

  const pageModel = {
    type: 'page',
    typePlural: 'pages'
  }

  Object.assign(bookModel, hasMany(pageModel))
  Object.assign(pageModel, belongsTo(bookModel))

  const page = {
    id: '1',
    number: 42
  }

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  let store = {}

  store = addModelToStore(pageModel, store)
  store = addModelToStore(bookModel, store)
  store = addEntityToStore(pageModel, page, store)

  // add a book to a page
  store = addRelatedEntityToEntity(store, pageModel, '1', bookModel, book)

  const expectedStore = {
    pages: {
      byId: {
        1: {
          id: '1',
          number: 42,
          book: '1'
        }
      },
      ids: ['1']
    },
    books: {
      byId: {
        1: {
          id: '1',
          title: 'hitchhiker\'s guide to the galaxy',
          pages: ['1']
        }
      },
      ids: ['1']
    }
  }

  t.deepEqual(store, expectedStore)

  store = {}

  store = addModelToStore(pageModel, store)
  store = addModelToStore(bookModel, store)
  store = addEntityToStore(bookModel, book, store)

  // add a page to a book
  store = addRelatedEntityToEntity(store, bookModel, '1', pageModel, page)

  // should give the same result
  t.deepEqual(store, expectedStore)
})

test('addRelatedEntityToEntity should create many to many relationships', t => {
  const authorModel = {
    type: 'author',
    typePlural: 'authors'
  }
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }

  Object.assign(bookModel, hasMany(authorModel))
  Object.assign(authorModel, hasMany(bookModel))

  const book = {
    id: '42',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  const author1 = {
    id: '1',
    name: 'Douglas Adams'
  }

  const author2 = {
    id: '2',
    name: 'Eoin Colfer'
  }

  let store = {}
  store = addModelToStore(bookModel, store)
  store = addModelToStore(authorModel, store)
  store = addEntityToStore(bookModel, book, store)
  store = addRelatedEntityToEntity(store, bookModel, '42', authorModel, author1)
  store = addRelatedEntityToEntity(store, bookModel, '42', authorModel, author2)

  const expectedStore = {
    authors: {
      byId: {
        1: {
          id: '1',
          name: 'Douglas Adams',
          books: ['42']
        },
        2: {
          id: '2',
          name: 'Eoin Colfer',
          books: ['42']
        }
      },
      ids: ['1', '2']
    },
    books: {
      byId: {
        42: {
          id: '42',
          title: 'hitchhiker\'s guide to the galaxy',
          authors: ['1', '2']
        }
      },
      ids: ['42']
    }
  }

  t.deepEqual(store, expectedStore)

  store = {}
  store = addModelToStore(bookModel, store)
  store = addModelToStore(authorModel, store)
  store = addEntityToStore(authorModel, author1, store)
  store = addEntityToStore(authorModel, author2, store)
  store = addRelatedEntityToEntity(store, authorModel, '1', bookModel, book)

  // book has been updated by the previous store update, and now holds the relation
  const updatedBook = store.books.byId[book.id]

  store = addRelatedEntityToEntity(store, authorModel, '2', bookModel, updatedBook)

  // doing things the other way round should give the same result
  t.deepEqual(store, expectedStore)
})

test('addRelatedEntityToEntity - when repeated multiple times should only add relations once', t => {
  const authorModel = {
    type: 'author',
    typePlural: 'authors'
  }
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }

  Object.assign(bookModel, hasMany(authorModel))
  Object.assign(authorModel, hasMany(bookModel))

  const book = {
    id: '42',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  const author1 = {
    id: '1',
    name: 'Douglas Adams'
  }

  let store = {}
  store = addModelToStore(authorModel, store)
  store = addModelToStore(bookModel, store)

  store = addEntityToStore(authorModel, author1, store)

  store = addRelatedEntityToEntity(store, authorModel, '1', bookModel, book)

  const expectedStore = clone(store)

  store = addRelatedEntityToEntity(store, authorModel, '1', bookModel, book)
  store = addRelatedEntityToEntity(store, authorModel, '1', bookModel, book)
  store = addRelatedEntityToEntity(store, authorModel, '1', bookModel, book)

  t.deepEqual(store, expectedStore)
})
