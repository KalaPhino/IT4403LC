const maxResults = 20;
let currentTerm = "";

$('#searchBtn').click(() => {
  currentTerm = $('#searchTerm').val();
  getBooks(0);
});

function getBooks(startIndex) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(currentTerm)}&startIndex=${startIndex}&maxResults=${maxResults}`;

  $.getJSON(url, function (data) {
    showBooks(data.items || []);
    setupPagination(data.totalItems);
  });
}

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
  select.empty();
  for (let i = 0; i < pageCount; i++) {
    select.append(`<option value="${i * maxResults}">Page ${i + 1}</option>`);
  }
  select.off('change').on('change', function () {
    getBooks(Number(this.value));
  });
}