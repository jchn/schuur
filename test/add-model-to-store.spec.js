import test from 'ava'
import {addModelToStore} from '../index'

test('addModelToStore should prepare store for model', t => {
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }
  let store = {}

  store = addModelToStore(store, bookModel)

  const expectedStore = {
    books: {
      byId: {},
      ids: []
    }
  }

  t.deepEqual(store, expectedStore)
})
