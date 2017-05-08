import test from 'ava'
import {addModelToStore, addEntityToStore, updateEntity} from '../lib'

test('updateEntity should update an entity', t => {
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

  const bookRef1 = store.books.byId['1']
  const booksRef1 = store.books
  const booksByIdRef1 = store.books.byId

  store = updateEntity(bookModel, '1', {author: 'Douglas Adams'}, store)

  const bookRef2 = store.books.byId['1']
  const booksRef2 = store.books
  const booksByIdRef2 = store.books.byId

  const expectedStore = {
    books: {
      byId: {
        1: {
          id: '1',
          title: 'hitchhiker\'s guide to the galaxy',
          author: 'Douglas Adams'
        }
      },
      ids: ['1']
    }
  }

  t.deepEqual(store, expectedStore)

  console.log(bookRef1.title)
  console.log(bookRef2.title)

  t.not(bookRef1, bookRef2)
  t.not(booksRef1, booksRef2)
  t.not(booksByIdRef1, booksByIdRef2)
  t.notDeepEqual(bookRef1, bookRef2)
})
