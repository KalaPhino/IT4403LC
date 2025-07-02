// This page takes API url to get book details with the book ID 

// Makes Ajax request to the google books api for the specific book



const bookId = new URLSearchParams(window.location.search).get('id');

$.getJSON(`https://www.googleapis.com/books/v1/volumes/${bookId}`, function(data) {
  const v = data.volumeInfo;


    //Populating page with book details


  $('#bookDetails').html(`                 
    <h2>${v.title}</h2>
    <p><strong>Authors:</strong> ${v.authors?.join(', ')}</p>
    <p><strong>Publisher:</strong> ${v.publisher}</p>
    <img src="${v.imageLinks?.thumbnail}">
    <p>${v.description}</p>
  `);
});
