// Get selected decade from URL or localStorage
const params = new URLSearchParams(window.location.search)
const decade = params.get('decade') || localStorage.getItem('selectedDecade')

const decadeHeader = document.getElementById('decade-header')
decadeHeader.textContent = decade ? `Explore the ${decade}` : 'Unknown Decade'

const musicList = document.getElementById('music-list')
const filmList = document.getElementById('film-list')

const TMDB_API_KEY = 'afe16acc7371ea20cf842174d3cd101e' // Your TMDb API key

// --- Fetch Top Films from TMDB (exclude NC-17 and adult, include R and below) ---
async function fetchTopFilms(decade) {
  const yearStart = decade.startsWith('00') ? 2000 : parseInt(decade)
  const yearEnd = yearStart + 9

  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}` +
    `&sort_by=popularity.desc` +
    `&primary_release_date.gte=${yearStart}-01-01` +
    `&primary_release_date.lte=${yearEnd}-12-31` +
    `&include_adult=false` +
    `&certification_country=US` +
    `&certification.lte=R`

  try {
    const res = await fetch(url)
    const data = await res.json()

    filmList.innerHTML = ''
    data.results.slice(0, 10).forEach(movie => {
      const div = document.createElement('div')
      div.className = 'item'
      div.innerHTML = `
        <div class="item-title">${movie.title}</div>
        <div class="item-sub">Released: ${movie.release_date}</div>
      `
      div.style.cursor = 'pointer'
      div.addEventListener('click', () => {
        localStorage.setItem('selectedItemType', 'film')
        localStorage.setItem('selectedItemId', movie.id)
        window.location.href = 'details.html'
      })

      filmList.appendChild(div)
    })
  } catch (err) {
    filmList.textContent = 'Failed to load films.'
    console.error(err)
  }
}

// --- Fetch Top Songs for full decade from iTunes ---
async function fetchSongsFromDecade(decade) {
  const yearStart = decade.startsWith('00') ? 2000 : parseInt(decade)
  const limitPerYear = 5 // number of songs per year to fetch
  const combinedSongs = new Map() // Use Map to avoid duplicates by trackId

  musicList.innerHTML = 'Loading songs...'

  // Fetch songs for each year in parallel
  const fetchPromises = []
  for (let year = yearStart; year <= yearStart + 9; year++) {
    const url = `https://itunes.apple.com/search?term=pop&entity=song&limit=${limitPerYear}` +
      `&attribute=releaseYearTerm&releaseYear=${year}`
    fetchPromises.push(
      fetch(url)
        .then(res => res.json())
        .then(data => {
          data.results.forEach(song => {
            if (!combinedSongs.has(song.trackId)) {
              combinedSongs.set(song.trackId, song)
            }
          })
        })
        .catch(err => console.error(`Error fetching songs for year ${year}:`, err))
    )
  }

  // Wait for all fetches
  await Promise.all(fetchPromises)

  // Sort combined songs by releaseDate descending
  const songsArray = Array.from(combinedSongs.values())
  songsArray.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))

  musicList.innerHTML = ''
  songsArray.slice(0, 50).forEach(song => {
    const div = document.createElement('div')
    div.className = 'item'
    div.innerHTML = `
      <div class="item-title">${song.trackName}</div>
      <div class="item-sub">By ${song.artistName} — Released: ${song.releaseDate.slice(0, 10)}</div>
      <audio controls src="${song.previewUrl}"></audio>
    `
    div.style.cursor = 'pointer'
    div.addEventListener('click', () => {
      localStorage.setItem('selectedItemType', 'song')
      localStorage.setItem('selectedItemId', song.trackId)
      window.location.href = 'details.html'
    })

    musicList.appendChild(div)
  })

  if (songsArray.length === 0) {
    musicList.textContent = 'No songs found for this decade.'
  }
}

// Initialize page
if (decade) {
  fetchTopFilms(decade)
  fetchSongsFromDecade(decade)
} else {
  musicList.textContent = 'No decade selected.'
  filmList.textContent = 'No decade selected.'
}
