import test from 'ava'
import {addModelToStore} from '../lib'

test('addModelToStore should prepare store for model', t => {
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }
  let store = {}

  store = addModelToStore(bookModel, store)

  const expectedStore = {
    books: {
      byId: {},
      ids: []
    }
  }

  t.deepEqual(store, expectedStore)
})
