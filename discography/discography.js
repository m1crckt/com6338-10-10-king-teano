// Setup
// DOM elements for music and movie cards

// Store API keys


// On page load
document.addEventListener("DOMContentLoaded", () => {
// Check if a decade was selected on the home page (saved in localStorage
    const decade = localStorage.getItem("decadeInput");
// Display decade in <h1>
    const decadeHeading = document.getItem("decade-name");
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
function fetchMusicInfo(decade) {

}
// Build API url for decades (or seed artist/track)
// Send fetch request with API key in headers
// Parse JSON response
// Call a function to display the tracks as cards (album cover, artist, track name)


// Display music cards
function displayMusicCards(tracks) {

}
// Clear #music-section card container
// Loop through tracks - create card elements dynamically
    // Create car element (div.card)
    // Add album art (img)
    // Add track title and artist name
    // Append card to container
    // Add click event to card -> save track ID and navigate to details.html
    
    
// Fetch movie informtion from TMCb
function fetchMovieInfo(decade) {

}
// Build API IRL for TMDb (filter by release date decade)
// Make GET request to TMDb API
// Parse response JSON
// Limit results to 8-10 movies


// Display movie cards
function displayMovieCards(movies) {

}
// Clear #movie-section card container
// Loop through movies
    // Create card element (div.card)
    // Add poster
    // Add movie title and release year
    // Append card to container
    // Add click event to card -> save movie ID & navigate to details.html

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
