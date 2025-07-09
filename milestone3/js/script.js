$(document).ready(function() {
  // My Google Books user & shelf IDs
  const USER_ID   = '109136170470676921574'; 
  const SHELF_ID  = '1001';
  const API_BASE  = 'https://www.googleapis.com/books/v1';
  let currentQuery = '';
  let currentPage  = 1;

  // Search button handler
  $('#search-btn').on('click', () => {
    currentQuery = $('#search-input').val().trim();
    currentPage  = 1;
    if (currentQuery) {
      fetchBooks(currentQuery, currentPage);
    }
  });

  // Fetch books from Google Books API
  function fetchBooks(query, page) {
    const startIndex = (page - 1) * 10;
    $.getJSON(`${API_BASE}/volumes`, {
      q: query,
      startIndex,
      maxResults: 10
    })
    .done(data => {
      renderResults(data.items || []);
      renderPagination(data.totalItems, page);
    })
    .fail(err => console.error('Search error:', err));
  }

  // Render search results into #results
  function renderResults(items) {
    $('#results').empty();
    items.forEach(item => {
      const info  = item.volumeInfo;
      const thumb = info.imageLinks?.thumbnail || 'placeholder.png';
      $('#results').append(`
        <div class="book-card" data-id="${item.id}">
          <img src="${thumb}" alt="${info.title}">
          <p>${info.title}</p>
        </div>
      `);
    });
  }

  // Render pagination (up to 5 pages)
  function renderPagination(totalItems, current) {
    const totalPages = Math.min(5, Math.ceil(totalItems / 10));
    $('#pagination').empty();
    for (let i = 1; i <= totalPages; i++) {
      $('#pagination').append(`
        <span class="page-link ${i === current ? 'active' : ''}" data-page="${i}">
          ${i}
        </span>
      `);
    }
  }

  // Handle page-link clicks
  $('#pagination').on('click', '.page-link', function() {
    const page = Number($(this).data('page'));
    if (page !== currentPage) {
      currentPage = page;
      fetchBooks(currentQuery, page);
    }
  });

  // Handle book-card clicks (both search & shelf)
  $('#results, #shelf-results').on('click', '.book-card', function() {
    const volumeId = $(this).data('id');
    $.getJSON(`${API_BASE}/volumes/${volumeId}`)
      .done(showBookDetail)
      .fail(err => console.error('Detail fetch error:', err));
  });

  // Show detailed info in #book-detail
  function showBookDetail(data) {
    const info = data.volumeInfo;
    $('#book-detail').html(`
      <img src="${info.imageLinks?.thumbnail || 'placeholder.png'}" alt="${info.title}">
      <h3>${info.title}</h3>
      <p><strong>Authors:</strong> ${info.authors?.join(', ') || 'N/A'}</p>
      <p><strong>Publisher:</strong> ${info.publisher || 'N/A'}</p>
      <p>${info.description || 'No description available.'}</p>
    `);
    // Scroll into view on detail load 
    $('#book-detail')[0].scrollIntoView({ behavior: 'smooth' });
  }

  // Load your public bookshelf on init
  function loadBookshelf() {
    $.getJSON(`${API_BASE}/users/${USER_ID}/bookshelves/${SHELF_ID}/volumes`)
      .done(data => renderShelf(data.items || []))
      .fail(err => console.error('Shelf load error:', err));
  }

  // Render bookshelf items into #shelf-results
  function renderShelf(items) {
    $('#shelf-results').empty();
    items.forEach(item => {
      const info  = item.volume.volumeInfo;
      const thumb = info.imageLinks?.thumbnail || 'placeholder.png';
      $('#shelf-results').append(`
        <div class="book-card" data-id="${item.volume.id}">
          <img src="${thumb}" alt="${info.title}">
          <p>${info.title}</p>
        </div>
      `);
    });
  }

  // Initialize bookshelf load
  loadBookshelf();
});
