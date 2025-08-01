// Get selected decade from URL or localStorage
const params = new URLSearchParams(window.location.search)
const decade = params.get('decade') || localStorage.getItem('selectedDecade')

const decadeHeader = document.getElementById('decade-header')
decadeHeader.textContent = decade ? `Explore the ${decade}` : 'Unknown Decade'

const musicList = document.getElementById('music-list')
const filmList = document.getElementById('film-list')

const TMDB_API_KEY = 'afe16acc7371ea20cf842174d3cd101e'
const LASTFM_API_KEY = 'b23e73024e246d9ed7226ddc54740e41'

// --- Fetch Top Films from TMDB ---
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

// --- Fetch Top Songs from Last.fm by decade tag ---
async function fetchTopSongs(decade) {
  // Map decade labels to Last.fm tags
  const decadeTagMap = {
    '70s': '1970s',
    '80s': '1980s',
    '90s': '1990s',
    '00s': '2000s',
    '2010s': '2010s'
  }
  const tag = decadeTagMap[decade] || '1970s'

  const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${tag}&api_key=${LASTFM_API_KEY}&format=json&limit=20`

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (!data.tracks || !data.tracks.track) {
      musicList.textContent = 'No songs found for this decade.'
      return
    }

    const tracks = data.tracks.track

    musicList.innerHTML = ''
    tracks.forEach(track => {
      const artistName = track.artist.name
      const trackName = track.name
      const mbid = track.mbid || ''

      const div = document.createElement('div')
      div.className = 'item'
      div.innerHTML = `
        <div class="item-title">${trackName}</div>
        <div class="item-sub">By ${artistName}</div>
      `
      div.style.cursor = 'pointer'
      div.addEventListener('click', () => {
        // Store mbid if available, else use artist+track combo
        localStorage.setItem('selectedItemType', 'song')
        localStorage.setItem('selectedItemId', mbid || `${artistName} - ${trackName}`)
        window.location.href = 'details.html'
      })
      musicList.appendChild(div)
    })
  } catch (err) {
    musicList.textContent = 'Failed to load music.'
    console.error(err)
  }
}

// Initialize page
if (decade) {
  fetchTopFilms(decade)
  fetchTopSongs(decade)
} else {
  musicList.textContent = 'No decade selected.'
  filmList.textContent = 'No decade selected.'
}
