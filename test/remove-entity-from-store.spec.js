import test from 'ava'
import {clone} from 'ramda'
import {removeEntityFromStore, addModelToStore, addEntityToStore, addRelatedEntityToEntity, belongsTo, hasMany} from '../index'

test.beforeEach(t => {
  const pageModel = {
    type: 'page',
    typePlural: 'pages'
  }

  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }

  const authorModel = {
    type: 'author',
    typePlural: 'authors'
  }

  const summaryModel = {
    type: 'summary',
    typePlural: 'summaries'
  }

  bookModel.pages = hasMany(pageModel)
  pageModel.book = belongsTo(bookModel)
  bookModel.authors = hasMany(authorModel)
  authorModel.books = hasMany(bookModel)
  bookModel.summary = belongsTo(summaryModel)
  summaryModel.book = belongsTo(bookModel)

  t.context.bookModel = bookModel
  t.context.pageModel = pageModel
  t.context.authorModel = authorModel
  t.context.summaryModel = summaryModel
})

test('RemoveEntityFromStore should remove an entity from the store', t => {
  let store = {}
  const bookModel = t.context.bookModel
  const pageModel = t.context.pageModel
  const authorModel = t.context.authorModel
  const summaryModel = t.context.summaryModel

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  store = addModelToStore(store, bookModel)
  store = addModelToStore(store, pageModel)
  store = addModelToStore(store, authorModel)
  store = addModelToStore(store, summaryModel)

  const expectedStore = clone(store)

  store = addEntityToStore(store, bookModel, book)

  t.deepEqual(removeEntityFromStore(store, bookModel, '1'), expectedStore)
})

test('RemoveEntityFromStore should only remove a single entity from the store', t => {
  let store = {}
  const bookModel = t.context.bookModel
  const pageModel = t.context.pageModel
  const authorModel = t.context.authorModel
  const summaryModel = t.context.summaryModel

  const book1 = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  const book2 = {
    id: '2',
    title: 'Node.js for beginners'
  }

  store = addModelToStore(store, bookModel)
  store = addModelToStore(store, pageModel)
  store = addModelToStore(store, authorModel)
  store = addModelToStore(store, summaryModel)

  store = addEntityToStore(store, bookModel, book1)

  const expectedStore = clone(store)

  store = addEntityToStore(store, bookModel, book2)
  store = removeEntityFromStore(store, bookModel, '2')

  t.deepEqual(store, expectedStore)
})

test('RemoveEntityFromStore should remove references in related entities - hasMany - belongsTo', t => {
  let store = {}
  const bookModel = t.context.bookModel
  const pageModel = t.context.pageModel

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  const page1 = {
    id: '42',
    number: 42
  }

  const page2 = {
    id: '43',
    number: 43
  }

  store = addModelToStore(store, bookModel)
  store = addModelToStore(store, pageModel)
  store = addEntityToStore(store, bookModel, book)
  store = addRelatedEntityToEntity(store, bookModel, '1', pageModel, page1)

  const expectedStore = clone(store)

  store = addRelatedEntityToEntity(store, bookModel, '1', pageModel, page2)
  store = removeEntityFromStore(store, pageModel, '43')

  t.deepEqual(store, expectedStore)
})

test('RemoveEntityFromStore should remove references in related entities - belongsTo - hasMany', t => {
  let store = {}
  const bookModel = t.context.bookModel
  const pageModel = t.context.pageModel
  const authorModel = t.context.authorModel
  const summaryModel = t.context.summaryModel

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  const page1 = {
    id: '42',
    number: 42
  }

  const page2 = {
    id: '43',
    number: 43
  }

  store = addModelToStore(store, bookModel)
  store = addModelToStore(store, pageModel)
  store = addModelToStore(store, authorModel)
  store = addModelToStore(store, summaryModel)
  store = addEntityToStore(store, bookModel, book)
  store = addRelatedEntityToEntity(store, bookModel, '1', pageModel, page1)
  store = addRelatedEntityToEntity(store, bookModel, '1', pageModel, page2)

  let expectedStore = addModelToStore({}, bookModel)
  expectedStore = addModelToStore(expectedStore, pageModel)
  expectedStore = addModelToStore(expectedStore, authorModel)
  expectedStore = addModelToStore(expectedStore, summaryModel)
  expectedStore = addEntityToStore(expectedStore, pageModel, page1)
  expectedStore = addEntityToStore(expectedStore, pageModel, page2)

  store = removeEntityFromStore(store, bookModel, '1')

  t.deepEqual(store, expectedStore)
})

test('RemoveEntityFromStore should remove references in related entities - belongsTo - belongsTo', t => {
  let store = {}
  const bookModel = t.context.bookModel
  const pageModel = t.context.pageModel
  const authorModel = t.context.authorModel
  const summaryModel = t.context.summaryModel

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  const summary = {
    id: '50',
    text: 'Lorum ipsum dolor sit amet.'
  }

  store = addModelToStore(store, bookModel)
  store = addModelToStore(store, pageModel)
  store = addModelToStore(store, authorModel)
  store = addModelToStore(store, summaryModel)
  store = addEntityToStore(store, bookModel, book)

  const expectedStore = clone(store)

  store = addRelatedEntityToEntity(store, bookModel, '1', summaryModel, summary)
  store = removeEntityFromStore(store, summaryModel, '50')

  t.deepEqual(store, expectedStore)
})

test('RemoveEntityFromStore should remove references in related entities - hasMany - hasMany', t => {
  let store = {}
  const bookModel = t.context.bookModel
  const pageModel = t.context.pageModel
  const authorModel = t.context.authorModel
  const summaryModel = t.context.summaryModel

  const book = {
    id: '1',
    title: 'hitchhiker\'s guide to the galaxy'
  }

  const author = {
    id: '1',
    name: 'Douglas Adams'
  }

  store = addModelToStore(store, bookModel)
  store = addModelToStore(store, pageModel)
  store = addModelToStore(store, authorModel)
  store = addModelToStore(store, summaryModel)
  store = addEntityToStore(store, bookModel, book)

  const expectedStore = clone(store)

  store = addRelatedEntityToEntity(store, bookModel, '1', authorModel, author)
  store = removeEntityFromStore(store, authorModel, '1')

  t.deepEqual(store, expectedStore)
})
