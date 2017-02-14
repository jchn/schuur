import test from 'ava'
import {clone} from 'ramda'
import {removeEntityFromStore, addModelToStore, addEntityToStore, addRelatedEntityToEntity, belongsTo, hasMany} from '../lib'

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

  Object.assign(bookModel, hasMany(pageModel))
  Object.assign(pageModel, belongsTo(bookModel))
  Object.assign(bookModel, hasMany(authorModel))
  Object.assign(authorModel, hasMany(bookModel))
  Object.assign(bookModel, belongsTo(summaryModel))
  Object.assign(summaryModel, belongsTo(bookModel))

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

  store = addModelToStore(bookModel, store)
  store = addModelToStore(pageModel, store)
  store = addModelToStore(authorModel, store)
  store = addModelToStore(summaryModel, store)

  const expectedStore = clone(store)

  store = addEntityToStore(bookModel, book, store)

  t.deepEqual(removeEntityFromStore(bookModel, '1', store), expectedStore)
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

  store = addModelToStore(bookModel, store)
  store = addModelToStore(pageModel, store)
  store = addModelToStore(authorModel, store)
  store = addModelToStore(summaryModel, store)

  store = addEntityToStore(bookModel, book1, store)

  const expectedStore = clone(store)

  store = addEntityToStore(bookModel, book2, store)
  store = removeEntityFromStore(bookModel, '2', store)

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

  store = addModelToStore(bookModel, store)
  store = addModelToStore(pageModel, store)
  store = addEntityToStore(bookModel, book, store)
  store = addRelatedEntityToEntity(bookModel, '1', pageModel, page1, store)

  const expectedStore = clone(store)

  store = addRelatedEntityToEntity(bookModel, '1', pageModel, page2, store)
  store = removeEntityFromStore(pageModel, '43', store)

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

  store = addModelToStore(bookModel, store)
  store = addModelToStore(pageModel, store)
  store = addModelToStore(authorModel, store)
  store = addModelToStore(summaryModel, store)
  store = addEntityToStore(bookModel, book, store)
  store = addRelatedEntityToEntity(bookModel, '1', pageModel, page1, store)
  store = addRelatedEntityToEntity(bookModel, '1', pageModel, page2, store)

  let expectedStore = addModelToStore(bookModel, {})
  expectedStore = addModelToStore(pageModel, expectedStore)
  expectedStore = addModelToStore(authorModel, expectedStore)
  expectedStore = addModelToStore(summaryModel, expectedStore)
  expectedStore = addEntityToStore(pageModel, page1, expectedStore)
  expectedStore = addEntityToStore(pageModel, page2, expectedStore)

  store = removeEntityFromStore(bookModel, '1', store)

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

  store = addModelToStore(bookModel, store)
  store = addModelToStore(pageModel, store)
  store = addModelToStore(authorModel, store)
  store = addModelToStore(summaryModel, store)
  store = addEntityToStore(bookModel, book, store)

  const expectedStore = clone(store)

  store = addRelatedEntityToEntity(bookModel, '1', summaryModel, summary, store)
  store = removeEntityFromStore(summaryModel, '50', store)

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

  store = addModelToStore(bookModel, store)
  store = addModelToStore(pageModel, store)
  store = addModelToStore(authorModel, store)
  store = addModelToStore(summaryModel, store)
  store = addEntityToStore(bookModel, book, store)

  const expectedStore = clone(store)

  store = addRelatedEntityToEntity(bookModel, '1', authorModel, author, store)
  store = removeEntityFromStore(authorModel, '1', store)

  t.deepEqual(store, expectedStore)
})
