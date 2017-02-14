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

  store = updateEntity(store, bookModel, '1', {author: 'Douglas Adams'})

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
})
