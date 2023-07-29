// movies.js

const apiKey = '54bad426'; // Replace with your actual OMDB API key
const defaultSearch = 'dark';
const moviesPerPage = 10; // Number of movies to display per page
let currentPage = 1; // Current page number
let totalResults = 0; // Total number of results from API
let lastSearchQuery = '';

// Function to fetch movies from OMDB API with pagination
// Function to fetch movies from OMDB API with pagination
// Function to fetch movies from OMDB API with pagination
async function fetchMovies(searchQuery = defaultSearch, page = 1) {
    try {
      // Use default search query 'dark' if the provided searchQuery is empty
      const query = searchQuery.trim() !== '' ? searchQuery : defaultSearch;
  
      // Reset current page to 1 when a new search query is entered
      if (searchQuery !== lastSearchQuery) {
        currentPage = 1;
        lastSearchQuery = searchQuery;
      }
  
      const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}&type=movie&page=${page}`);
      const data = await response.json();
  
      if (data.Response === 'True') {
        const movies = data.Search;
        if (movies && movies.length > 0) {
          const movieListContainer = document.querySelector('.movie-list');
          movieListContainer.innerHTML = '';
  
          movies.forEach((movie) => {
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('movie-container');
            movieContainer.setAttribute('data-movie-id', movie.imdbID);
  
            const moviePoster = movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg';
            const movieHtml = `
              <img class="movie-poster" src="${moviePoster}" alt="${movie.Title}">
              <div class="movie-name">${movie.Title}</div>
            `;
            movieContainer.innerHTML = movieHtml;
            movieListContainer.appendChild(movieContainer);
          });
  
          // Update total results and pagination buttons
          totalResults = parseInt(data.totalResults);
          updatePaginationButtons();
        } else {
          console.log('No movies found.');
        }
      } else {
        console.log('Error fetching movies:', data.Error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  

// Function to update pagination buttons
function updatePaginationButtons() {
  const paginationContainer = document.querySelector('.pagination');
  paginationContainer.innerHTML = '';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.classList.add('prev-button');
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', goToPreviousPage);
  paginationContainer.appendChild(prevButton);

  const pageNumbersContainer = document.createElement('div');
  pageNumbersContainer.classList.add('page-numbers');

  const currentPageButton = document.createElement('button');
  currentPageButton.textContent = currentPage;
  currentPageButton.classList.add('current-page');
  pageNumbersContainer.appendChild(currentPageButton);

  paginationContainer.appendChild(pageNumbersContainer);

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.classList.add('next-button');
  nextButton.disabled = currentPage === Math.ceil(totalResults / moviesPerPage);
  nextButton.addEventListener('click', goToNextPage);
  paginationContainer.appendChild(nextButton);
}

// Function to handle pagination button click
function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies(searchInput.value.trim(), currentPage);
  }
}

function goToNextPage() {
  const totalPages = Math.ceil(totalResults / moviesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    fetchMovies(searchInput.value.trim(), currentPage);
  }
}

// ... Remaining JavaScript code remains the same ...

// Function to fetch movie details from OMDB API
async function fetchMovieDetails(movieID) {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}&plot=full`);
    const movie = await response.json();
    return movie;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

// Function to submit user rating and comment
function submitRatingAndComment(movieID) {
    const usernameInput = document.getElementById('username');
    const rating = selectedRating;
    const commentInput = document.getElementById('comment');
    const comment = commentInput.value.trim();
  
    // Retrieve existing data from Local Storage
    const movieDetails = JSON.parse(localStorage.getItem('movieDetails')) || {};
    const movieData = movieDetails[movieID] || { ratings: [], comments: [] };
  
    // Add the new rating and comment to the existing data
    const newRating = { name: usernameInput.value.trim(), rating };
    movieData.ratings.push(newRating);
    movieData.comments.push(comment);
  
    // Update the movie data in Local Storage
    movieDetails[movieID] = movieData;
    localStorage.setItem('movieDetails', JSON.stringify(movieDetails));
  
    // Clear input fields after submission
    usernameInput.value = '';
    setRating(0);
    commentInput.value = '';
  
    // Refresh movie details section to show updated ratings and comments
    displayMovieDetails(movieID);
  }
  
function displayMovieDetails(movieID) {
  fetchMovieDetails(movieID).then((movie) => {
    if (movie) {
      const movieDetailsSection = document.querySelector('.movie-details');
      movieDetailsSection.innerHTML = `
        <span class="close-button" onclick="closeMovieDetails()">&times;</span>
        <div class="movie-title">${movie.Title}</div>
        <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title}">
        <div class="movie-info">Released: ${movie.Released}</div>
        <!-- Display previous user ratings and comments (if any) -->
        <div class="user-ratings-comments">
          ${getPreviousRatingsAndComments(movieID)}
        </div>
        <!-- User rating and comment section -->
        <div class="user-rating-input">
          <label for="username">Your Name:</label>
          <input type="text" id="username">
          <label for="rating">Your Rating:</label>
          <div class="rating-stars">
            <span class="star" onclick="setRating(1)">&#9733;</span>
            <span class="star" onclick="setRating(2)">&#9733;</span>
            <span class="star" onclick="setRating(3)">&#9733;</span>
            <span class="star" onclick="setRating(4)">&#9733;</span>
            <span class="star" onclick="setRating(5)">&#9733;</span>
          </div>
          <label for="comment">Your Comment:</label>
          <textarea id="comment" rows="4"></textarea>
          <button class="submit-button" onclick="submitRatingAndComment('${movieID}')">Submit</button>
        </div>
      `;
      movieDetailsSection.style.display = 'block';
    }
  });
}

// Function to close the movie details section
function closeMovieDetails() {
  const movieDetailsSection = document.querySelector('.movie-details');
  movieDetailsSection.style.display = 'none';
}

  // Function to set the selected rating
  let selectedRating = 0;
  function setRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.rating-stars .star');
    stars.forEach((star, index) => {
      star.classList.toggle('selected', index < rating);
    });
  }
  
  // Function to get the previous user ratings and comments from local storage
// Function to get the previous user ratings and comments from local storage
function getPreviousRatingsAndComments(movieID) {
    const movieDetails = JSON.parse(localStorage.getItem('movieDetails')) || {};
    const movieData = movieDetails[movieID];
    
    if (movieData && movieData.ratings && movieData.comments) {
      let ratingsAndCommentsHtml = '';
  
      for (let i = 0; i < movieData.ratings.length; i++) {
        const userRating = movieData.ratings[i];
        const userComment = movieData.comments[i];
  
        ratingsAndCommentsHtml += `
          <div class="user-rating-comment">
            <div class="username">${userRating.name}</div>
            <div class="rating">${getStarRating(userRating.rating)}</div>
            <div class="comment">${userComment}</div>
          </div>
        `;
      }
  
      return ratingsAndCommentsHtml;
    }
  
    return 'No ratings or comments yet.';
  }
  
  
  // Function to convert numeric rating to star format
  function getStarRating(rating) {
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += '&#9733;';
    }
    return stars;
  }
  
// Call the fetchMovies function with default search query 'dark'
fetchMovies();

// Add real-time search functionality
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (event) => {
  const searchQuery = event.target.value.trim();
  if (searchQuery) {
    fetchMovies(searchQuery);
  } else {
    fetchMovies(defaultSearch);
  }
});

// Handle click event on movie containers
const movieListContainer = document.querySelector('.movie-list');
movieListContainer.addEventListener('click', (event) => {
  const movieContainer = event.target.closest('.movie-container');
  if (movieContainer) {
    const movieID = movieContainer.dataset.movieId;
    displayMovieDetails(movieID);
  }
});
