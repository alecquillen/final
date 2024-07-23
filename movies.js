const API_KEY = '2f6c566f2dmsh2688f1761e629a7p1f8353jsnbd54e9ac8f4e';
const RESULTS_PER_PAGE = 10;
const MAX_PAGES = 5; // Limit the pagination to 5 pages
let currentView = 'grid'; // Default view

function searchMovies() {
    const searchTerm = document.getElementById('searchInput').value;
    const url = `https://imdb-movies-web-series-etc-search.p.rapidapi.com/api/v1/searchIMDB?query=${encodeURIComponent(searchTerm)}.json`; // Ensure .json suffix

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'imdb-movies-web-series-etc-search.p.rapidapi.com'
        },
        success: function(data) {
            displaySearchResults(data);
            setupPagination(data.totalResults, searchTerm);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    });
}

function displaySearchResults(data) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';

    if (data.results) {
        data.results.forEach(movie => {
            const movieHtml = `
                <div class="movie ${currentView === 'list' ? 'centered' : ''}">
                    <h4><a href="movie-details.html?id=${movie.id}" class="movie-link">${movie.title}</a></h4>
                    <p>Released: ${movie.release_date}</p>
                    <img src="${movie.image}" alt="Movie Poster">
                </div>
            `;
            searchResultsContainer.innerHTML += movieHtml;
        });
    }

    applyViewLayout();
}

function setupPagination(totalItems, searchTerm) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    const totalPages = Math.min(Math.ceil(totalItems / RESULTS_PER_PAGE), MAX_PAGES); // Limit to 5 pages

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => fetchPage(i, searchTerm);
        paginationContainer.appendChild(button);
    }
}

function fetchPage(page, searchTerm) {
    const startIndex = (page - 1) * RESULTS_PER_PAGE;
    const url = `https://imdb-movies-web-series-etc-search.p.rapidapi.com/api/v1/searchIMDB?query=${encodeURIComponent(searchTerm)}.json&offset=${startIndex}`; // Ensure .json suffix

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'imdb-movies-web-series-etc-search.p.rapidapi.com'
        },
        success: function(data) {
            displaySearchResults(data);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data. Please try again.');
        }
    });
}

// View layout functions
function setGridView() {
    currentView = 'grid';
    applyViewLayout();
}

function setListView() {
    currentView = 'list';
    applyViewLayout();
}

function applyViewLayout() {
    const searchResultsContainer = document.getElementById('searchResults');
    if (currentView === 'grid') {
        searchResultsContainer.classList.add('grid-view');
        searchResultsContainer.classList.remove('list-view');
    } else {
        searchResultsContainer.classList.add('list-view');
        searchResultsContainer.classList.remove('grid-view');
    }
}

// Library Page
function loadLibrary() {
    const library = JSON.parse(localStorage.getItem('library')) || [];
    displayLibrary(library);
}

function displayLibrary(movies) {
    const libraryContainer = document.getElementById('library-container');
    libraryContainer.innerHTML = '';

    if (movies.length > 0) {
        movies.forEach(movie => {
            const movieHtml = `
                <div class="movie">
                    <h4><a href="movie-details.html?id=${movie.id}" class="movie-link">${movie.title}</a></h4>
                    <p>Released: ${movie.release_date}</p>
                    <img src="${movie.image}" alt="Movie Poster">
                    <button onclick="removeFromLibrary('${movie.id}')">Remove from Library</button>
                </div>
            `;
            libraryContainer.innerHTML += movieHtml;
        });
    } else {
        libraryContainer.innerHTML = '<p>Library is empty...</p>';
    }
}

function addToLibrary(movieId) {
    const url = `https://imdb-movies-web-series-etc-search.p.rapidapi.com/api/v1/getMovieDetails?movie_id=${movieId}.json`; // Ensure .json suffix

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'imdb-movies-web-series-etc-search.p.rapidapi.com'
        },
        success: function(data) {
            const movie = {
                id: movieId,
                title: data.title,
                release_date: data.release_date,
                image: data.image
            };

            let library = JSON.parse(localStorage.getItem('library')) || [];
            if (!library.find(m => m.id === movieId)) {
                library.push(movie);
                localStorage.setItem('library', JSON.stringify(library));
                alert('Movie added to library');
            } else {
                alert('Movie is already in the library');
            }
        },
        error: function(error) {
            console.error('Error adding movie to library:', error);
            alert('An error occurred while adding the movie to the library. Please try again.');
        }
    });
}

function removeFromLibrary(movieId) {
    let library = JSON.parse(localStorage.getItem('library')) || [];
    library = library.filter(movie => movie.id !== movieId);
    localStorage.setItem('library', JSON.stringify(library));
    loadLibrary();
}

// Fetch movie details and display them on the movie-details page
function fetchMovieDetails(movieId) {
    const url = `https://imdb-movies-web-series-etc-search.p.rapidapi.com/api/v1/getMovieDetails?movie_id=${movieId}.json`; // Ensure .json suffix

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'imdb-movies-web-series-etc-search.p.rapidapi.com'
        },
        success: function(data) {
            const movieDetailsHtml = `
                <h3>${data.title}</h3>
                <p>Released: ${data.release_date}</p>
                <img src="${data.image}" alt="Movie Poster">
                <p>${data.description}</p>
            `;
            document.getElementById('movieDetails').innerHTML = movieDetailsHtml;
        },
        error: function(error) {
            console.error('Error fetching movie details:', error);
            alert('An error occurred while fetching movie details. Please try again.');
        }
    });
}

// Load functions based on the current page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('home.html')) {
        document.getElementById('searchButton').onclick = searchMovies;
    } else if (window.location.pathname.includes('library.html')) {
        loadLibrary();
    } else if (window.location.pathname.includes('movie-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        if (movieId) {
            fetchMovieDetails(movieId);
        }
    }
});

