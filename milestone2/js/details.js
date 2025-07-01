const bookId = new URLSearchParams(window.location.search).get('id');

$.getJSON(`https://www.googleapis.com/books/v1/volumes/${bookId}`, function(data) {
  const v = data.volumeInfo;
  $('#bookDetails').html(`
    <h2>${v.title}</h2>
    <p><strong>Authors:</strong> ${v.authors?.join(', ')}</p>
    <p><strong>Publisher:</strong> ${v.publisher}</p>
    <img src="${v.imageLinks?.thumbnail}">
    <p>${v.description}</p>
  `);
});