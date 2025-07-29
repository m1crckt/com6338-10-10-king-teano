// Setup
// DOM elements for music and movie cards

// Store API keys


// On page load
document.addEventListener("DOMContentLoaded", () => {
// Check if a decade was selected on the home page (saved in localStorage
    const decade = localStorage.getItem("decadeInput");
// Display decade in <h1>
    const decadeHeading = document.getElementById("decade-name");
// If decade exists, fetchMusicInfo() and fetchMovieInfo() with the selected decade
    if (decade) {
        decadeHeading.textContent = `${decade} Highlights`;
    }

    //fetch music and movie data
    fetchMusicInfo(decade);
    fetchMovieInfo(decade);

    // Apply theme colors for decade
    applyDecadeTheme(decade);
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
    // Loop through tracks - create card elements dynamically
    // Create car element (div.card)
    // Add album art (img)
    // Add track title and artist name
    // Append card to container
    // Add click event to card -> save track ID and navigate to details.html
}

// Fetch movie informtion from TMCb
function fetchMovieInfo(decade) {
    // Build API IRL for TMDb (filter by release date decade)
    // Make GET request to TMDb API
    // Parse response JSON
    // Limit results to 8-10 movies
}



// Display movie cards
function displayMovieCards(movies) {
    // Clear #movie-section card container
    // Loop through movies
    // Create card element (div.card)
    // Add poster
    // Add movie title and release year
    // Append card to container
    // Add click event to card -> save movie ID & navigate to details.html
}
// Navigate to detailes page
function navigateDetailsPage(type, id) {
// On card click: save selected ID (music or movie) in localStorage
// Redirect to details.html
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
