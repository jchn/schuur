import test from 'ava'
import {hasMany} from '../lib'

test('hasMany should add type and model to object', t => {
  const pageModel = {
    type: 'page',
    typePlural: 'pages'
  }

  const bookModel = {
    type: 'book',
    typePlural: 'books',
    pages: hasMany(pageModel)
  }

  const expectedBookModel = {
    type: 'book',
    typePlural: 'books',
    pages: {type: 'hasMany', model: pageModel}
  }

  t.deepEqual(bookModel, expectedBookModel)
})
