// Updated decoy.js with working Last.fm + TMDb integration and working click-to-details logic

const themeMap = {
  "1970s": {
    background: "#fce8b2",
    text: "#000000",
    accent: "#e07b39",
    hover: "#a44a3f",
    highlight: "#a44a3f",
    musicSectionBg: "#e07b39",
    movieSectionBg: "#e07b39"
  },
  "1980s": {
    background: "#1b1b3a",
    text: "#ffffff",
    accent: "#ff6ec7",
    hover: "#00f6ed",
    highlight: "#d2f1ff",
    musicSectionBg: "#ff6ec7",
    movieSectionBg: "#ff6ec7"
  },
  "1990s": {
    background: "#5d737e",
    text: "#ffffff",
    accent: "#c0b283",
    hover: "#8b0000",
    highlight: "#c0b283",
    musicSectionBg: "#2b2b2b",
    movieSectionBg: "#2b2b2b"
  },
  "2000s": {
    background: "#f0f8ff",
    text: "#000000",
    accent: "#ff8daa",
    hover: "#70c1b3",
    highlight: "#f0f8ff",
    musicSectionBg: "#7d5ba6",
    movieSectionBg: "#7d5ba6"
  },
  "2010s": {
    background: "#121212",
    text: "#ffffff",
    accent: "#8884ff",
    hover: "#5dd39e",
    highlight: "#ffffff",
    musicSectionBg: "#1e1e1e",
    movieSectionBg: "#1e1e1e"
  }
}

const TMDB_API_KEY = 'afe16acc7371ea20cf842174d3cd101e'
const LASTFM_API_KEY = 'b23e73024e246d9ed7226ddc54740e41'

// On page load
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search)
  const decade = params.get("decade")
  if (!decade) {
    window.location.href = "index.html"
    return
  }

  localStorage.setItem("decadeInput", decade)
  document.getElementById("decade-name").textContent = `${decade} Highlights`
  const musicHeader = document.querySelector("#music-section h2")
  if (musicHeader) musicHeader.textContent = "Top Albums"
  applyTheme(decade)
  fetchMusicInfo(decade)
  fetchMovieInfo(decade)
})

function applyTheme(decade) {
  const theme = themeMap[decade]
  if (!theme) return
  document.body.style.backgroundColor = theme.background
  document.body.style.color = theme.text
  const musicSection = document.getElementById("music-section")
  const movieSection = document.getElementById("movie-section")
  if (musicSection) musicSection.style.backgroundColor = theme.musicSectionBg
  if (movieSection) movieSection.style.backgroundColor = theme.movieSectionBg
}

// MUSIC
async function fetchMusicInfo(decade) {
  const tagMap = { "70s": "70s", "80s": "80s", "90s": "90s", "00s": "2000s", "2010s": "2010s" }
  const tag = tagMap[decade]
  if (!tag) return
  const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${tag}&api_key=${LASTFM_API_KEY}&format=json&limit=12`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!data.albums?.album) throw new Error("No albums found")
    displayMusicCards(data.albums.album)
  } catch (err) {
    console.error("Error fetching albums:", err)
  }
}

function displayMusicCards(albums) {
  const musicContainer = document.getElementById("music-cards")
  musicContainer.innerHTML = ""

  albums.forEach(album => {
    const card = document.createElement("div")
    card.classList.add("card")

    const img = document.createElement("img")
    let albumArt = album.image?.find(img => img.size === 'extralarge')?.['#text'] || ""
    if (!albumArt || albumArt.includes("/noimage") || albumArt.trim() === "") {
      albumArt = "https://dummyimage.com/150x150/000/fff&text=Album+Cover"
    }
    img.src = albumArt
    img.alt = `${album.name} cover`

    const title = document.createElement("h3")
    title.textContent = album.name

    const artist = document.createElement("p")
    artist.textContent = album.artist.name || album.artist

    card.appendChild(img)
    card.appendChild(title)
    card.appendChild(artist)

    card.addEventListener("click", () => {
      localStorage.setItem("selectedItemType", "album")
      localStorage.setItem("selectedItemId", `${album.artist.name || album.artist} - ${album.name}`)
      window.location.href = "details.html"
    })

    musicContainer.appendChild(card)
  })
}

// MOVIES
async function fetchMovieInfo(decade) {
  const decadeMap = {
    "70s": { start: 1970, end: 1979 },
    "80s": { start: 1980, end: 1989 },
    "90s": { start: 1990, end: 1999 },
    "00s": { start: 2000, end: 2009 },
    "2010s": { start: 2010, end: 2019 },
  }
  const range = decadeMap[decade]
  if (!range) return

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${range.start}-01-01&primary_release_date.lte=${range.end}-12-31&sort_by=popularity.desc&include_adult=false&vote_average.gte=6&certification_country=US&certification.lte=R`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (!data.results) throw new Error("No movies found")
    const filtered = data.results.filter(movie => movie.adult === false && movie.release_date && movie.poster_path && movie.vote_count > 0)
    displayMovieCards(filtered.slice(0, 12))
  } catch (err) {
    console.error("Error fetching movies:", err)
  }
}

function displayMovieCards(movies) {
  const movieContainer = document.getElementById("movie-cards")
  movieContainer.innerHTML = ""

  movies.forEach(movie => {
    const card = document.createElement("div")
    card.classList.add("card")

    const img = document.createElement("img")
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : "https://dummyimage.com/150x225/000/fff&text=Movie+Poster"
    img.alt = `${movie.title} poster`

    const title = document.createElement("h3")
    title.textContent = movie.title

    const year = document.createElement("p")
    year.textContent = movie.release_date?.split("-")[0] || "Unknown"

    card.appendChild(img)
    card.appendChild(title)
    card.appendChild(year)

    card.addEventListener("click", () => {
      localStorage.setItem("selectedItemType", "film")
      localStorage.setItem("selectedItemId", movie.id)
      window.location.href = "details.html"
    })

    movieContainer.appendChild(card)
  })
}
