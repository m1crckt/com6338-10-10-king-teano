// Setup
// Apply decade-specific color palette (CSS class or inline styles)
const themeMap={
    "1970s": {
        background: "#fce8b2",
        accent: "#e07b39",
        hover: "#a44a3f",
        highlight: "#a44a3f",
        musicSectionBg: "#e07b39",
        movieSectionBg: "#e07b39",
    },

    "1980s": {
        background: "#1b1b3a",
        accent: "#ff6ec7",
        hover: "#00f6ed",
        highlight: "#d2f1ff",
        musicSectionBg: "#ff6ec7",
        movieSectionBg: "#ff6ec7",
    },

    "1990s": {
        background: "#5d737e",
        accent: "#c0b283",
        hover: "#8b0000",
        highlight: "#c0b283",
        musicSectionBg: "#2b2b2b",
        movieSectionBg: "#2b2b2b",
    },

    "2000s": {
        background: "#f0f8ff",
        accent: "#ff8daa",
        hover: "#70c1b3",
        highlight: "#f0f8ff",
        musicSectionBg: "#7d5ba6",
        movieSectionBg: "#7d5ba6",
    },   

    "2010s": {
        background: "#f4f4f4",
        accent: "#555555",
        hover: "#ff6b6b",
        highlight: "#f4f4f4",
        musicSectionBg: "#3c6e71",
        movieSectionBg: "#3c6e71",
    }
}
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

    //fetch music and movie data
    fetchMusicInfo(decade);
    fetchMovieInfo(decade);

    // Apply theme colors for decade
    applyTheme(decade);
})

// Fetch music from ReccoBeats
async function fetchMusicInfo(decade) {
    // List of decades
    const tagMap = {
        "1970s": "70s",
        "1980s": "80s",
        "1990s": "90s",
        "2000s": "2000s",
        "2010s": "2010s",
    }

    const tag = tagMap[decade];
    // Validate decade
    if (!tag) {
        console.error(`No decadeMap entry found or decade: "${decade}"`);
        return;
    }

        // Build API url for decades (or seed artist/track)
    const apiKey = "536406e378429b7115166fbf363b4d85";
    const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${tag}&api_key=536406e378429b7115166fbf363b4d85&format=json&limit=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check for data
        if (!data.tracks || !data.tracks.track) {
            console.error("No track data returned:", data);
            showError("No music found for this decade.");
            return;

        }
        displayMusicCards(data.tracks.track);
    } catch (error) {
        console.log("Error fetching music:", error);
        showError("Unable to load music data");
    }
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
        const imageArray = track.image || [];
        const albumArt = imageArray.length > 0 ? imageArray.at(-1)["#text"] : "";
        const img = document.createElement("img");
        img.src = albumArt || "https://dummyimage.com/150x150/000/fff&text=Album+Cover";
        img.alt = `${track.name} album cover`;

        // Add track title
        const title = document.createElement("h3");
        title.textContent = track.name;

        // Artis name
        const artist = document.createElement("p");
        artist.textContent = track.artist.name;

        // Year
        const year = document.createElement("p");
        const decade = localStorage.getItem("decadeInput");
        year.textContent = decade ? decade : "Unknown Decade";

        // Append card to container
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(artist);
        card.appendChild(year);

        // Add click event to card -> save track ID and navigate to details.html
        card.addEventListener("click", () => {
            navigateDetailsPage("track",track.name);
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
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=b4e8f9af29bda2f259d3fa26214f2ace
&primary_release_date.gte=${start}-01-01&primary_release_date.lte=${end}-12-31&sort_by=popularity.desc&include_adult=false&without_genres=99,10749&vote_average.gte=5&vote_average.gte=6`;
    // Make GET request to TMDb API
     // Parse response JSON
    // Limit results to 12 movies
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovieCards(data.results.slice(0, 12));
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
    localStorage.setItem("selectedId", id);
    window.location.href = "details.html";
}

// Handle Errors / Loading States
function showError(message) {
    // Display error message
}

// Apply Theme
function applyTheme(decade) {
    // Get decade from localStorage
    const theme = themeMap[decade];
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--hover", theme.hover);
    root.style.setProperty("--highlight", theme.highlight);
    root.style.setProperty("--music-section-bg", theme.musicSectionBg);
    root.style.setProperty("--movie-section-bg", theme.movieSectionBg);
    // Music and Movie sections
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;

    const musicSection = document.getElementById("music-section");
    const movieSection = document.getElementById("movie-section");
    if (musicSection) musicSection.style.backgroundColor = theme.musicSectionBg;
    if (movieSection) movieSection.style.backgroundColor = theme.movieSectionBg;

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.style.backgroundColor = theme.cardBg;
        card.style.color = theme.text;
    })

    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.style.backgroundColor = theme.accent;
        btn.style.color = theme.text;
        btn.addEventListener("mouseenter", () => {
            btn.style.backgroundColor = theme.hover;
        })
        btn.addEventListener("mouseleave", () => {
            btn.style.backgroundColor = theme.accent;
        })
    })

    const headers = document.querySelectorAll("h2");
    headers.forEach(h2 => {
        h2.style.color = theme.highlight;
    })
}