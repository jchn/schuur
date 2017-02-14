import test from 'ava'
import {belongsTo} from '../lib'

test('belongsTo should add type and model to object', t => {
  const bookModel = {
    type: 'book',
    typePlural: 'books'
  }

  const pageModel = {
    type: 'page',
    typePlural: 'pages',
    ...belongsTo(bookModel)
  }

  const expectedPageModel = {
    type: 'page',
    typePlural: 'pages',
    book: {type: 'belongsTo', model: bookModel}
  }

  t.deepEqual(pageModel, expectedPageModel)
})
