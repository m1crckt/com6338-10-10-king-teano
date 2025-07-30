// Setup
// On page load
document.addEventListener("DOMContentLoaded", () => {
    // Check if a decade was selected on the home page (saved in localStorage
    let decade = localStorage.getItem("decadeInput")?.trim();
        // TEMP CODE
    if (!decade) {
        console.error("No decade found in localStorage. Redirecting to homepage...");
        window.location.href = "index.html";
        return;
        }
    // Display decade in <h1>
    const decadeHeading = document.getElementById("decade-name");
    decadeHeading.textContent = `${decade} Highlights`;

    // If decade exists, fetchMusicInfo() and fetchMovieInfo() with the selected decade
    /* if (decade) {
        decadeHeading.textContent = `${decade} Highlights`;
    } */
    //fetch music and movie data
    fetchMusicInfo(decade);
    fetchMovieInfo(decade);

    // Apply theme colors for decade
    applyTheme(decade);
})

// Fetch music from ReccoBeats
async function fetchMusicInfo(decade) {
    // List of decades
    const decadeMap = {
        "1970s": { start: 1970, end: 1979 },
        "1980s": { start: 1980, end: 1989 },
        "1990s": { start: 1990, end: 1999 },
        "2000s": { start: 2000, end: 2009 },
        "2010s": { start: 2010, end: 2019 },
    }
    // Validate decade
    if (!decadeMap[decade]) {
        console.error(`No decadeMap entry found or decade: "${decade}"`);
        return;
    }

        // Build API url for decades (or seed artist/track)
    const { start, end } = decadeMap[decade];
    const queryString = `?year_from=${start}&year_to=${end}&limit=10`;
    const url = `https://api.reccobeats.com/tracks${queryString}`;

    // Send fetch request with API key in headers
    // const reponse = await fetch(url);
    try {
        const response = await fetch(url);
        const data = await response.json(); 
        displayMusicCards(data);    
    } catch (error) {
        console.error("Error fetching music:", error);
        showError("Unable to load music data");
    }
    
    // Parse JSON response
    // const data = await response.json();

    // Call a function to display the tracks as cards (album cover, artist, track name)
    // displayMusicCards(data) to render results
}

// Display music cards
function displayMusicCards(tracks) {
    // Clear #music-section card container
    const musicContainer = document.getElementById("music-cards");
    musicContainer.innerHTML = "";

    // Loop through tracks - create card elements dynamically
    tracks.forEach(track => {
        // Create card element (div.card)   
        const card = document.createElement("div");
        card.classList.add("card");

        // Add album art (img)
        const img = document.createElement("img");
        img.src = track.album?.image || "https://dummyimage.com/150x150/000/fff&text=Album+Cover";
        img.alt = `${track.name} album cover`;

        // Add track title and artist name
        const title = document.createElement("h3");
        title.textContent = track.name;

        const artist = document.createElement("p");
        artist.textContent = track.artist?.name || "Unknown Artist";

        // Append card to container
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(artist);

        // Add click event to card -> save track ID and navigate to details.html
        card.addEventListener("click", () => {
            navigateDetailsPage("track",track.id);
        })

        musicContainer.appendChild(card);
    })

}

// Fetch movie informtion from TMCb
async function fetchMovieInfo(decade) {
    // List of decades
    const decadeMap = {
        "1970s": { start: 1970, end: 1979 },
        "1980s": { start: 1980, end: 1989 },
        "1990s": { start: 1990, end: 1999 },
        "2000s": { start: 2000, end: 2009 },
        "2010s": { start: 2010, end: 2019 },
    }

    if (!decadeMap[decade]) {
        console.error(`No decadeMap entry found for decade: "${decade}"`);
        return;
    }

    // Build API IRL for TMDb (filter by release date decade)
    const { start, end } = decadeMap[decade];
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=b4e8f9af29bda2f259d3fa26214f2ace&primary_release_date.gte=${start}-01-01&primary_release_date.lte=${end}-12-31&sort_by=popularity.desc`;
    // Make GET request to TMDb API
     // Parse response JSON
    // Limit results to 8-10 movies
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovieCards(data.results.slice(0, 10));
    } catch (error) {
        console.error("Error fetching movies:", error);
        showError("Unable to load movie data");
    }

}

// Display movie cards
function displayMovieCards(movies) {
    // Clear #movie-section card container
    const movieContainer = document.getElementById("movie-cards");
    movieContainer.innerHTML = "";

    // Loop through movies
    movies.forEach(movie => {
        // Create card element (div.card)
        const card = document.createElement("div");
        card.classList.add("card");

        // Add poster
        const img = document.createElement("img");
        img.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "https://dummyimage.com/150x225/000/fff&text=No+Poster";
        img.alt = `${movie.title} poster`;

        // Add movie title and release year
        const title = document.createElement("p");
        title.textContent = movie.title;

        const year = document.createElement("p");
        year.textContent = movie.release_date
            ? movie.release_date.split("-") [0]
            : "Unknown Year";

        // Append card to container
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(year);

        // Add click event to card -> save movie ID & navigate to details.html
        card.addEventListener("click", () => {
            navigateDetailsPage("movie", movie.id);
        })

        movieContainer.appendChild(card);
    })
}

// Navigate to details page
function navigateDetailsPage(type, id) {
    // On card click: save selected ID (music or movie) in localStorage
    localStorage.setItem("selectedType", type);
    // Redirect to details.html
    localStorage.setItem("setlectedId", id);
    window.location.href = "details.html";
}

// Handle Errors / Loading States
function showError(message) {
    // Display error message
}
// Show loading spinner during fetch
function showLoading(section) {

}

// Apply Theme
function applyTheme(decade) {
// Get decade from localStorage
// Apply decade-specific color palette (CSS class or inline styles)
}