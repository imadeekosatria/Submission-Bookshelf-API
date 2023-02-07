const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  // eslint-disable-next-line no-unneeded-ternary
  const finished = (pageCount === readPage) ? true : false

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.params

  if (name) {
    const data = []

    // eslint-disable-next-line array-callback-return
    books.map((book) => {
      if (book.name.toLowerCase().includes(name.toLowerCase())) {
        data.push({
          id: book.id, name: book.name, publisher: book.publisher
        })
      }
    })
    const response = h.response({
      status: 'success',
      data: {
        books: data
      }
    })
    response.code(200)
    return response
  }

  if (reading) {
    const data = []
    const bool = (reading === 1)
    // eslint-disable-next-line array-callback-return
    books.map((book) => {
      if (book.reading === bool) {
        data.push({
          id: book.id, name: book.name, publisher: book.publisher
        })
      }
    })
    const response = h.response({
      status: 'success',
      data: {
        books: data
      }
    })
    response.code(200)
    return response
  }

  if (finished) {
    const data = []
    const bool = (finished === 1)

    // eslint-disable-next-line array-callback-return
    books.map((book) => {
      if (book.finished === bool) {
        data.push({
          id: book.id, name: book.name, publisher: book.publisher
        })
      }
    })
    const response = h.response({
      status: 'success',
      data: {
        books: data
      }
    })
    response.code(200)
    return response
  }

  if (books.length > 0 && !name && !reading && !finished) {
    const data = []
    // eslint-disable-next-line array-callback-return
    books.map((book) => {
      data.push({
        id: book.id, name: book.name, publisher: book.publisher
      })
    })
    const response = h.response({
      status: 'success',
      data: {
        books: data
      }
    })
    response.code(200)
    return response
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })

      response.code(400)
      return response
    } else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })

      response.code(400)
      return response
    } else {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt
      }

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })

      response.code(200)
      return response
    }
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })

    response.code(404)
    return response
  }
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })

    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
