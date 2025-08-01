const detailsContainer = document.getElementById('details-container')
const detailHeader = document.getElementById('detail-header')

const TMDB_API_KEY = 'afe16acc7371ea20cf842174d3cd101e'
const LASTFM_API_KEY = 'b23e73024e246d9ed7226ddc54740e41'

// Get selected item info
const itemType = localStorage.getItem('selectedItemType')
const itemId = localStorage.getItem('selectedItemId')

if (!itemType || !itemId) {
  detailsContainer.innerHTML = '<p>No item selected.</p>'
} else if (itemType === 'album') {
  fetchAlbumDetails(itemId)
} else if (itemType === 'film') {
  fetchFilmDetails(itemId)
} else {
  detailsContainer.innerHTML = '<p>Invalid item type.</p>'
}

// Apply Theme from Decade (if exists)
const themeMap = {
  "1970s": { background: "#fce8b2", accent: "#e07b39", hover: "#a44a3f", highlight: "#a44a3f", musicSectionBg: "#e07b39", movieSectionBg: "#e07b39" },
  "1980s": { background: "#1b1b3a", accent: "#ff6ec7", hover: "#00f6ed", highlight: "#d2f1ff", musicSectionBg: "#ff6ec7", movieSectionBg: "#ff6ec7" },
  "1990s": { background: "#5d737e", accent: "#c0b283", hover: "#8b0000", highlight: "#c0b283", musicSectionBg: "#2b2b2b", movieSectionBg: "#2b2b2b" },
  "2000s": { background: "#f0f8ff", accent: "#ff8daa", hover: "#70c1b3", highlight: "#f0f8ff", musicSectionBg: "#7d5ba6", movieSectionBg: "#7d5ba6" },
  "2010s": { background: "#111", accent: "#444", hover: "#666", highlight: "#fff", musicSectionBg: "#1c1c1c", movieSectionBg: "#1c1c1c" }
}

const decade = localStorage.getItem("decadeInput")
if (decade && themeMap[decade]) {
  const theme = themeMap[decade]
  const root = document.documentElement
  root.style.setProperty('--background', theme.background)
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--hover', theme.hover)
  root.style.setProperty('--highlight', theme.highlight)
  root.style.setProperty('--music-section-bg', theme.musicSectionBg)
  root.style.setProperty('--movie-section-bg', theme.movieSectionBg)
}

// ALBUM DETAILS
async function fetchAlbumDetails(id) {
  detailHeader.textContent = 'Album Details'

  try {
    let [artist, album] = id.split(' - ')
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`
    const res = await fetch(url)
    const data = await res.json()

    if (!data.album) {
      detailsContainer.innerHTML = '<p>Album not found.</p>'
      return
    }

    const albumInfo = data.album

    const cover = albumInfo.image?.find(img => img.size === 'extralarge')?.['#text'] || ''
    const artistName = albumInfo.artist || 'N/A'
    const albumName = albumInfo.name || 'N/A'
    const genres = albumInfo.tags?.tag?.map(t => t.name) || ['N/A']
    const tracks = albumInfo.tracks?.track || []

    const trackList = Array.isArray(tracks)
      ? tracks.map(t => `<li>${t.name}</li>`).join('')
      : `<li>${tracks.name}</li>`

    detailsContainer.innerHTML = `
      <div class="album-detail-layout" style="display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap;">
        ${cover ? `<img src="${cover}" alt="${albumName} Cover" style="width: 250px; border-radius: 8px;">` : ''}
        <div style="flex: 1 1 300px; align-self: flex-start; margin-top: 0;">
          <h3 style="margin-top: 0;">${albumName}</h3>
          <p><strong>Artist:</strong> ${artistName}</p>
          <p><strong>Genre:</strong> ${genres.join(', ')}</p>
          <h4>Tracks:</h4>
          <ul>${trackList}</ul>
        </div>
      </div>
    `
  } catch (error) {
    detailsContainer.innerHTML = '<p>Error loading album details.</p>'
    console.error(error)
  }
}

// FILM DETAILS
async function fetchFilmDetails(movieId) {
  detailHeader.textContent = 'Film Details'

  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,release_dates,videos`

  try {
    const res = await fetch(url)
    const movie = await res.json()

    if (!movie.id) {
      detailsContainer.innerHTML = '<p>Film not found.</p>'
      return
    }

    const directors = movie.credits.crew.filter(c => c.job === 'Director').map(d => d.name).join(', ') || 'N/A'
    const cast = movie.credits.cast.slice(0, 5).map(c => c.name).join(', ') || 'N/A'
    const crew = movie.credits.crew
      .filter(c => c.job !== 'Director')
      .slice(0, 5)
      .map(c => `${c.job}: ${c.name}`)
      .join('<br>') || 'N/A'

    let rating = 'N/A'
    const releases = movie.release_dates.results.find(r => r.iso_3166_1 === 'US')
    if (releases) {
      const cert = releases.release_dates.find(rd => rd.certification)
      if (cert) rating = cert.certification
    }

    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : ''

    const overview = movie.overview || 'No description available.'
    const trailer = movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    const genres = movie.genres?.map(g => g.name).join(', ') || 'N/A'
    const runtime = movie.runtime ? `${movie.runtime} minutes` : 'N/A'

    const trailerEmbed = trailer
      ? `
        <div style="margin-top: 1rem;">
          <h4>Trailer</h4>
          <iframe width="100%" height="315"
            src="https://www.youtube.com/embed/${trailer.key}"
            title="YouTube trailer"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      `
      : ''

    detailsContainer.innerHTML = `
      <div style="display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap;">
        ${posterUrl ? `<img src="${posterUrl}" alt="Movie Poster" style="width: 200px; border-radius: 8px;">` : ''}
        <div style="flex: 1 1 300px;">
          <h3>${movie.title}</h3>
          <p><strong>Release Date:</strong> ${movie.release_date}</p>
          <p><strong>Runtime:</strong> ${runtime}</p>
          <p><strong>Genres:</strong> ${genres}</p>
          <p><strong>Director:</strong> ${directors}</p>
          <p><strong>Description:</strong> ${overview}</p>
          <p><strong>Rating:</strong> ${rating}</p>
          <p><strong>Cast:</strong> ${cast}</p>
          <p><strong>Crew:</strong><br>${crew}</p>
          ${trailerEmbed}
        </div>
      </div>
    `
  } catch (error) {
    detailsContainer.innerHTML = '<p>Error loading film details.</p>'
    console.error(error)
  }
}
