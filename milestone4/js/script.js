$(document).ready(function () {
  let currentView = 'grid';
  let books = [];

  // Search functionality
  $('#search-btn').on('click', function () {
    const query = $('#search-input').val().trim();
    if (!query) return;

    $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`, function (data) {
      if (!data.items || data.items.length === 0) {
        $('#results-container').html('<p>No results found. Try a different keyword.</p>');
        $('#book-detail').hide();
        return;
      }

      books = data.items.map(item => formatBook(item));
      renderBooks(books);
      $('#book-detail').hide();
      $('#results-tab').click(); // Ensure active view
    });
  }); 

  // Format book data from API
  function formatBook(item) {
    const info = item.volumeInfo;
    return {
      id: item.id,
      title: info.title || 'No title',
      authors: (info.authors || []).join(', '),
      thumbnail: info.imageLinks?.thumbnail || 'https://via.placeholder.com/128x193?text=No+Image',
      previewLink: info.previewLink || '#',
      description: info.description || 'No description available.',
      publisher: info.publisher || 'Unknown',
      publishedDate: info.publishedDate || 'N/A',
      pageCount: info.pageCount || 'N/A',
      categories: (info.categories || []).join(', ')
    };
  }

  // Render books in current view (grid or list)
  function renderBooks(bookArray) {
    const template = $('#book-card-template').html();
    const html = bookArray.map(book => Mustache.render(template, book)).join('');
    $('#results-container').html(html).removeClass('list-view').addClass(currentView === 'list' ? 'list-view' : '');
  }

  // Toggle view
  $('.toggle-btn').on('click', function () {
    $('.toggle-btn').removeClass('active');
    $(this).addClass('active');
    currentView = this.id === 'list-view' ? 'list' : 'grid';
    renderBooks(books);
  });

  // Allows Clicking on a book to show details
  $('#results-container, #shelf-container').on('click', '.book-card', function () {
    const bookId = $(this).data('id');
    const bookData = books.find(book => book.id === bookId);
    if (!bookData) return;

    const template = $('#book-detail-template').html();       
    const html = Mustache.render(template, bookData);
    $('#book-detail').html(html).show();
    window.scrollTo({ top: $('#book-detail').offset().top, behavior: 'smooth' });
  });

  // Tab switching
  $('#results-tab').on('click', function () {
    $('#results-tab').addClass('active-tab');
    $('#shelf-tab').removeClass('active-tab');
    $('#results-container').show();
    $('#shelf-container').hide();
    $('#book-detail').hide();
  });

  $('#shelf-tab').on('click', function () {
    $('#shelf-tab').addClass('active-tab');
    $('#results-tab').removeClass('active-tab');
    $('#results-container').hide();
    $('#shelf-container').show();
    $('#book-detail').hide();
    renderBookshelf();
  });

  // Hardcoded bookshelf data (Since personal bookshelf is not implementing properly)
  function renderBookshelf() {
    const shelfBooks = [
      {
        id: "dragonballz4",
        title: "Dragon Ball Z, Vol. 4 (VIZBIG Edition)",
        authors: "Akira Toriyama",
        thumbnail: "../images/Logo1.jpg",
        previewLink: "#",
        description: "The Many Faces of Freeza — an intergalactic battle for survival as Goku and allies face off against a transforming alien overlord.",
        publisher: "VIZ Media LLC",
        publishedDate: "Jun 16, 2009",
        pageCount: "568",
        categories: "Comics & Graphic Novels"
      },
      {
        id: "madmax",
        title: "Blood, Sweat & Chrome",
        authors: "Kyle Buchanan",
        thumbnail: "../images/Logo2.jpg",
        previewLink: "#",
        description: "An oral history of the nearly two-decade making of Mad Max: Fury Road with interviews from cast and crew.",
        publisher: "HarperCollins",
        publishedDate: "Feb 22, 2022",
        pageCount: "N/A",
        categories: "Film & Pop Culture"
      }
    ];

    const template = $('#bookshelf-template').html();                       
    const html = shelfBooks.map(book => Mustache.render(template, book)).join('');
    $('#shelf-container').html(html);
  }
});
