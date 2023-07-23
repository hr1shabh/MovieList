let currentPage = 1;
let currentSearchPage = 1;
const resultsPerPage = 10;
let previousRatingsAndComments = [];
let previousCommentsData = [];
let searchQuery = 'Dark';

async function fetchMoviesByPage(page, query) {
    const apiKey = '54bad426';
    let apiUrl;

    if (query) {
      apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&type=movie&page=${page}`;
    } else {
      apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=knight&type=movie&page=${page}`;
    }
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.Response === 'True') {
        return data.Search;
      } else {
        throw new Error(data.Error);
      }
    } catch (error) {
      console.error('Error fetching movies:', error.message);
      return [];
    }
}

function closeMovieDetails() {
  const movieDetailsDiv = document.getElementById('movieDetails');
  movieDetailsDiv.classList.remove('open');
}

function getPreviousRatingsAndComments() {
    const data = localStorage.getItem('previousRatingsAndComments');
    return data ? JSON.parse(data) : {};
  }
  
function updatePreviousRatingsAndComments(data) {
    localStorage.setItem('previousRatingsAndComments', JSON.stringify(data));
}

// ... (previous code)

async function showMovieDetails(movieId) {
    try {
      const apiKey = '54bad426';
      const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.Response === 'True') {
        const movieDetailsDiv = document.getElementById('movieDetails');
        movieDetailsDiv.classList.remove('hidden');
        const moviePoster = document.getElementById('moviePoster');
        const movieTitle = document.getElementById('movieTitle');
        const previousComments = document.getElementById('previousComments');
        const commentInput = document.getElementById('commentInput');
        const ratingStars = document.querySelectorAll('.star');
        const submitBtn = document.getElementById('submitBtn');
  
        // Clear previous comments before displaying new ones
        previousComments.innerHTML = '';
  
        commentInput.value = '';
        ratingStars.forEach(star => star.classList.remove('active'));
  
        moviePoster.src = data.Poster;
        movieTitle.textContent = data.Title;
  
        const previousRatingsAndComments = getPreviousRatingsAndComments();
        const movieRatingsAndComments = previousRatingsAndComments[movieId] || [];
  
        movieRatingsAndComments.forEach(item => {
          const commentElement = document.createElement('p');
          commentElement.textContent = item.comment;
          previousComments.appendChild(commentElement);
  
          const selectedStar = Array.from(ratingStars).find(star => parseInt(star.dataset.rating) === item.rating);
          if (selectedStar) {
            selectedStar.classList.add('active');
          }
        });
  
        ratingStars.forEach(star => {
          star.addEventListener('click', () => {
            const ratingValue = parseInt(star.dataset.rating);
            ratingStars.forEach(star => {
              if (parseInt(star.dataset.rating) <= ratingValue) {
                star.classList.add('active');
              } else {
                star.classList.remove('active');
              }
            });
          });
        });
  
        submitBtn.addEventListener('click', () => {
          handleSubmitClick(movieId, ratingStars, commentInput, previousComments);
        });
  
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', closeMovieDetails);
        const existingCloseButtons = document.querySelectorAll('.close-button');
        existingCloseButtons.forEach(button => button.remove());
        movieDetailsDiv.appendChild(closeButton);
  
        movieDetailsDiv.classList.add('open');
      } else {
        throw new Error(data.Error);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error.message);
    }
  }
  

// ... (previous code)

async function handleSubmitClick(movieId, ratingStars, commentInput, previousComments) {
  const selectedRating = document.querySelector('.star.active');
  const ratingValue = selectedRating ? parseInt(selectedRating.dataset.rating) : 0;
  const comment = commentInput.value.trim();

  if (ratingValue > 0 && comment !== '') {
    try {
      const previousRatingsAndComments = getPreviousRatingsAndComments();

      const movieRatingsAndComments = previousRatingsAndComments[movieId] || [];

      movieRatingsAndComments.push({ rating: ratingValue, comment });

      previousRatingsAndComments[movieId] = movieRatingsAndComments;

      updatePreviousRatingsAndComments(previousRatingsAndComments);

      previousComments.innerHTML = '';
      movieRatingsAndComments.forEach(item => {
        const commentElement = document.createElement('p');
        commentElement.textContent = item.comment;
        previousComments.appendChild(commentElement);

        const selectedStar = Array.from(ratingStars).find(star => parseInt(star.dataset.rating) === item.rating);
        if (selectedStar) {
          selectedStar.classList.add('active');
        }
      });

      // Clear the comment input and reset star ratings
      commentInput.value = '';
      ratingStars.forEach(star => star.classList.remove('active'));
    } catch (error) {
      console.error('Error updating ratings and comments:', error.message);
    }
  } else {
    alert('Please enter a rating and comment.');
  }
}

  
async function displayMovies() {
  searchQuery = document.getElementById('searchBox').value.trim();

  if (searchQuery !== '') {
    try {
      const movies = await fetchMoviesByPage(currentSearchPage, searchQuery);

      const movieListDiv = document.getElementById('movieList');
      movieListDiv.innerHTML = '';

      movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
          <img src="${movie.Poster}" alt="${movie.Title}">
          <p class="movie-title">${movie.Title}</p>
        `;

        movieCard.addEventListener('click', () => {
          showMovieDetails(movie.imdbID);
        });

        movieListDiv.appendChild(movieCard);
      });

      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const currentPageSpan = document.getElementById('currentPage');

      currentPageSpan.textContent = `Page ${currentSearchPage}`;

      prevBtn.disabled = currentSearchPage === 1;
      nextBtn.disabled = false;
    } catch (error) {
      console.error('Error fetching movies:', error.message);
    }
  } else {
    try {
      const movies = await fetchMoviesByPage(currentPage, searchQuery);

      const movieListDiv = document.getElementById('movieList');
      movieListDiv.innerHTML = '';

      movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
          <img src="${movie.Poster}" alt="${movie.Title}">
          <p class="movie-title">${movie.Title}</p>
        `;

        movieCard.addEventListener('click', () => {
          showMovieDetails(movie.imdbID);
        });

        movieListDiv.appendChild(movieCard);
      });

      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const currentPageSpan = document.getElementById('currentPage');

      currentPageSpan.textContent = `Page ${currentPage}`;

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = false;
    } catch (error) {
      console.error('Error fetching movies:', error.message);
    }
  }
}

async function handlePreviousClick() {
  if (searchQuery !== '' && currentSearchPage > 1) {
    currentSearchPage--;
    await displayMovies();
  } else if (currentPage > 1) {
    currentPage--;
    await displayMovies();
  }
}

async function handleNextClick() {
  if (searchQuery !== '') {
    currentSearchPage++;
    await displayMovies();
  } else {
    currentPage++;
    await displayMovies();
  }
}

async function handleSearchClick() {
  searchQuery = document.getElementById('searchBox').value.trim();
  currentSearchPage = 1;
  await displayMovies();
}

document.getElementById('prevBtn').addEventListener('click', handlePreviousClick);
document.getElementById('nextBtn').addEventListener('click', handleNextClick);
document.getElementById('searchBtn').addEventListener('click', handleSearchClick);

displayMovies();
const movieDetailsContainer = document.getElementById('movieDetails');
movieDetailsContainer.classList.add('hidden');