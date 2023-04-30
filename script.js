"use strict";

//Selecting elements
const searchEl = document.getElementById("search");
const searchIconEl = document.getElementById("search-icon");
const suggestionsListEl = document.getElementById("suggestions-list");
const favoritesDivEl = document.querySelector(".favorites-icon");
const favoritesSectionEl = document.querySelector(".favorites-section");

let suggestionsArray = [];
let favoritesArray = [];
let isSearchingId = false;

addFavDom();

//Fetch the movie from API
async function fetchMovies(search) {
  try {
    let url;
    if (isSearchingId) {
      url = `https://www.omdbapi.com/?i=${search}&apikey=c0eebbf7`;
      isSearchingId = false;
    } else {
      url = `https://www.omdbapi.com/?t=${search}&apikey=c0eebbf7`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

//Add and render the movies in the suggestions container
function addSuggestionToDom(data) {
  const newElement = document.createElement("div");

  newElement.innerHTML = `<div class="single-movie" >
  <div class="${data.Title}" id="mov-suggs">
      <img src="${data.Poster}" alt="" id="${data.Title}">
      <span>${data.Title}</span>
  </div>
  <div class="${data.Title}">
  <i class="fa-solid fa-star sugg-rating" ></i>
  <span class="sugg-rating" style="margin-right:1rem;">${data.imdbRating}</span>
  <i class="fa-solid fa-heart suggestions-heart"></i>
  </div>

    </div>`;

  suggestionsListEl.append(newElement);
}

function renderSuggestions(data) {
  suggestionsListEl.innerHTML = "";
  let isMoviePresent = false;
  suggestionsArray.forEach((movie) => {
    if (movie.Title == data.Title) {
      isMoviePresent = true;
    }
  });

  if (!isMoviePresent && data.Title != undefined) {
    suggestionsArray.unshift(data);
  }
  for (let i = 0; i < suggestionsArray.length; i++) {
    addSuggestionToDom(suggestionsArray[i]);
  }
}

//Render the movie page

function addMovieContentToDom(data) {
  const newContent = document.createElement("div");

  newContent.innerHTML = `<button class="btn"><i class="fa-solid fa-arrow-left"></i>Go Back</button>
  <div class="movie-container">
      <div class="title-rating-container">
          <div class="title-container">
              <h2>${data.Title}</h2>
              <div class="title-details">
                  <span>${data.Year}</span>
                  <span>${data.Rated}</span>
                  <span>${data.Runtime}</span>
              </div>
          </div>
          <div class="rating-container">
              <i class="fa-solid fa-star"></i>
              <span>${data.imdbRating}/10</span>
              <p class="rating-total">(${data.imdbVotes})</p>
          </div>
      </div>
      <div class="poster-details-container">
          <div class="image-container">
              <img src="${data.Poster}" alt="">
          </div>
          <div class="details-container">
              <p>
                  <strong>PLOT</strong> <br>
                  ${data.Plot}
              </p>

              <div class="other-details">

                  <p> <strong>Genre: </strong> <span>${data.Genre}</span> </p>
                  <p><strong>Director: </strong> <span>${data.Director}</span> </p>
                  <p><strong>Cast: </strong> <span>${data.Actors}</span> </p>
                  <div class="${data.Title}">
                  <button class="btn btn-mp"><i class="fa-solid fa-heart"></i> Add to Favorites</button>
                  </div>
              </div>
          </div>

      </div>

  </div>`;

  document.querySelector(".movie-details-section").append(newContent);
}

function renderMovieContent(movieName) {
  (async function fetchMoviesSearch() {
    let data = await fetchMovies(movieName);
    // console.log(data);
    if (data.Response == "True") {
      document.getElementById("mds").innerHTML = "";
      addMovieContentToDom(data);
    }
  })();
}

//Handling favorites
async function favorites(e) {
  console.log("entered function");
  const movieName = e.target.parentNode.className;

  let data = await fetchMovies(movieName);

  let favoritesLocal = localStorage.getItem("favMovies");

  if (favoritesLocal) {
    favoritesArray = Array.from(JSON.parse(favoritesLocal));
  } else {
    localStorage.setItem("favMovies", JSON.stringify(data));
  }
  let isMoviePresent = false;
  favoritesArray.forEach((movie) => {
    if (data.Title == movie.Title) {
      window.alert("Movie already added to Favorites!");
      isMoviePresent = true;
    }
  });

  if (!isMoviePresent) {
    favoritesArray.push(data);
    window.alert("Movie added to Favorites!");
  }

  localStorage.setItem("favMovies", JSON.stringify(favoritesArray));
  isMoviePresent = !isMoviePresent;
  addFavDom();
}

function addFavDom() {
  console.log("entered function dom");
  document.getElementById("favorites-container").innerHTML = "";
  let favMovies = JSON.parse(localStorage.getItem("favMovies"));
  if (favMovies) {
    favMovies.forEach((movie) => {
      const newElement = document.createElement("div");
      newElement.classList.add("favorite-movie");
      newElement.innerHTML = `
      <div class="${movie.Title}">
      <img src="${movie.Poster}" alt="">
      </div>
                <div class="fm-details ${movie.Title}">
                    <div class="${movie.Title}">
                        <p>${movie.Title}</p>
                        <p>${movie.Year}</p>
                        <p><i class="fa-solid fa-star star-favo" style="color:gold;"></i>${movie.imdbRating}</p>
                    </div>
                    <div>
                        <i class="fa-solid fa-trash" data-id="${movie.Title}"></i>
                    </div>
                </div>
      `;
      document.getElementById("favorites-container").prepend(newElement);
    });
  }
}

// Delete from favorite list
function deleteFavMovie(name) {
  let favMovie = JSON.parse(localStorage.getItem("favMovies"));
  let updatedList = Array.from(favMovie).filter((movie) => {
    return movie.Title != name;
  });

  localStorage.setItem("favMovies", JSON.stringify(updatedList));

  addFavDom();
}

//Handle keyboard event while search
searchEl.addEventListener("keyup", function () {
  document
    .querySelector(".search-results-container")
    .classList.remove("hidden");

  let search = searchEl.value;
  if (search === "") {
    // suggestionsContainer.innerHTML = "";
    suggestionsArray = [];
    document.querySelector(".search-results-container").classList.add("hidden");
  }
  if (search.substring(0, 2) == "tt") {
    isSearchingId = true;
  }
  (async function fetchMoviesSearch() {
    let data = await fetchMovies(search);
    // console.log(data);

    renderSuggestions(data);
  })();
});

//Handling click events
//Handle click for whole page
document.addEventListener("click", function (e) {
  searchEl.placeholder = "Search title or IMDB ID";
  const target = e.target;
  // console.log(target.className);
  let movieName = target.parentNode.className;
  document.querySelector(".search-results-container").classList.add("hidden");

  if (target.className == "search") {
    searchEl.placeholder = "";
    if (searchEl.value !== "") {
      document
        .querySelector(".search-results-container")
        .classList.remove("hidden");
    }
  }
  if (target.className == "btn") {
    document.getElementById("mds").innerHTML = "";
  }
  if (!favoritesSectionEl.classList.contains("hidden")) {
    const movieName = target.parentNode.className;
    //   let favMovie = JSON.parse(localStorage.getItem("favMovies"));
    // let movie = Array.from(favMovie).forEach((movie) => {
    //   if (movie.Title == movieName) {

    renderMovieContent(movieName);
    // }
    // });
  }
  if (target.className == "btn btn-mp") {
    favorites(e);
  }
});

suggestionsListEl.addEventListener("click", function (e) {
  const target = e.target;
  const movieName = target.parentNode.className;
  // console.log(movieName);
  if (movieName) {
    renderMovieContent(movieName);
  }
});

favoritesDivEl.addEventListener("click", function () {
  favoritesSectionEl.classList.toggle("hidden");
});

document.getElementById("close").addEventListener("click", function () {
  favoritesSectionEl.classList.toggle("hidden");
});

async function favClick(e) {
  if (e.target.classList.contains("suggestions-heart")) {
    favorites(e);
  } else if (e.target.classList.contains("fa-trash")) {
    deleteFavMovie(e.target.dataset.id);
  }
}
document.addEventListener("click", favClick);