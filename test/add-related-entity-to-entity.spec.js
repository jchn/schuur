import test from 'ava'
import {hasMany, belongsTo, addModelToStore, addEntityToStore, addRelatedEntityToEntity} from '../index'

test('addRelatedEntityToEntity should update an belongsTo and hasMany relation', t => {
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }

  const pageModel = {
    type: 'page',
    typePlural: 'pages'
  }

  bookModel.pages = hasMany(pageModel)
  pageModel.book = belongsTo(bookModel)

  const page = {
    id: '1',
    number: 42
  }

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  let store = {}

  store = addModelToStore(store, pageModel)
  store = addModelToStore(store, bookModel)
  store = addEntityToStore(store, pageModel, page)

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

  store = addModelToStore(store, pageModel)
  store = addModelToStore(store, bookModel)
  store = addEntityToStore(store, bookModel, book)

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

  bookModel.authors = hasMany(bookModel)
  authorModel.books = hasMany(bookModel)

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
  store = addModelToStore(store, bookModel)
  store = addModelToStore(store, authorModel)
  store = addEntityToStore(store, bookModel, book)
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
  store = addModelToStore(store, bookModel)
  store = addModelToStore(store, authorModel)
  store = addEntityToStore(store, authorModel, author1)
  store = addEntityToStore(store, authorModel, author2)
  store = addRelatedEntityToEntity(store, authorModel, '1', bookModel, book)

  // book has been updated by the previous store update, and now holds the relation
  const updatedBook = store.books.byId[book.id]

  store = addRelatedEntityToEntity(store, authorModel, '2', bookModel, updatedBook)

  // doing things the other way round should give the same result
  t.deepEqual(store, expectedStore)
})
