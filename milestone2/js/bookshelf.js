const userId = "109136170470676921574";
const shelfId = "1001";
const url = `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${shelfId}/volumes`;

$.getJSON(url, function(data) {
  const books = data.items || [];
  const container = $('#bookshelfContainer');
  container.empty();
  books.forEach(book => {
    container.append(`
      <div class="book-card">
        <img src="${book.volumeInfo.imageLinks?.thumbnail}" alt="cover">
        <a href="details.html?id=${book.id}">${book.volumeInfo.title}</a>
      </div>
    `);
  });
});