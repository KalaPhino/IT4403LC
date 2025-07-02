const maxResults = 25;                // Max number of books per page
let currentTerm = "";                 // Keeps what was placed in the search bar

$('#searchBtn').click(() => {
  currentTerm = $('#searchTerm').val();
  getBooks(0);
});
                                             // Grabs books from Google Books API
function getBooks(startIndex) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(currentTerm)}&startIndex=${startIndex}&maxResults=${maxResults}`;

  $.getJSON(url, function (data) {
    showBooks(data.items || []);
    setupPagination(data.totalItems);
  });
}
                                                    //Book renders on the page 
function showBooks(books) {
  const container = $('#resultsContainer');
  container.empty();
  books.forEach(book => {
    const title = book.volumeInfo.title;
    const img = book.volumeInfo.imageLinks?.thumbnail || '';
    container.append(`
      <div class="book-card">
        <img src="${img}">
        <a href="details.html?id=${book.id}">${title}</a>
      </div>
    `);
  });
}

function setupPagination(totalItems) {
  const pageCount = Math.ceil(Math.min(totalItems, 60) / maxResults);
  const select = $('#pageSelect');
  select.empty();                 // This will reset the dropdown for select
  for (let i = 0; i < pageCount; i++) {
    select.append(`<option value="${i * maxResults}">Page ${i + 1}</option>`);
  }
  select.off('change').on('change', function () {
    getBooks(Number(this.value));
  });
}
