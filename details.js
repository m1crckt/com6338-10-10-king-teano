const detailsContainer = document.getElementById('details-container')
const detailHeader = document.getElementById('detail-header')

const TMDB_API_KEY = 'afe16acc7371ea20cf842174d3cd101e'
const LASTFM_API_KEY = 'b23e73024e246d9ed7226ddc54740e41'

// Get selected item info
const itemType = localStorage.getItem('selectedItemType')
const itemId = localStorage.getItem('selectedItemId')

if (!itemType || !itemId) {
  detailsContainer.innerHTML = '<p>No item selected.</p>'
} else if (itemType === 'song') {
  fetchSongDetails(itemId)
} else if (itemType === 'film') {
  fetchFilmDetails(itemId)
} else {
  detailsContainer.innerHTML = '<p>Invalid item type.</p>'
}

// SONG DETAILS
async function fetchSongDetails(id) {
  detailHeader.textContent = 'Song Details'

  try {
    let url
    let artist = ''
    let track = ''
    if (id.includes(' - ')) {
      [artist, track] = id.split(' - ')
      url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`
    } else {
      url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&mbid=${id}&format=json`
    }

    const res = await fetch(url)
    const data = await res.json()

    if (!data.track) {
      detailsContainer.innerHTML = '<p>Song not found.</p>'
      return
    }

    const trackInfo = data.track

    const album = trackInfo.album?.title || 'N/A'
    const cover = trackInfo.album?.image?.find(img => img.size === 'extralarge')?.['#text'] || ''
    const artistName = trackInfo.artist?.name || 'N/A'
    const trackName = trackInfo.name || 'N/A'
    const genres = trackInfo.toptags?.tag?.map(t => t.name) || ['N/A']

    let releaseDate = 'N/A'
    if (trackInfo.wiki?.published) {
      const d = new Date(trackInfo.wiki.published)
      releaseDate = d.toLocaleDateString()
    }

    const trackNumber = 'N/A'

    detailsContainer.innerHTML = `
      <div class="song-detail-layout" style="display: flex; gap: 1rem; align-items: flex-start; flex-wrap: wrap;">
        ${cover ? `<img src="${cover}" alt="${trackName} Cover" style="width: 250px; border-radius: 8px;">` : ''}
        <div>
          <h3>${trackName}</h3>
          <p><strong>Artist:</strong> ${artistName}</p>
          <p><strong>Album:</strong> ${album}</p>
          <p><strong>Release Date:</strong> ${releaseDate}</p>
          <p><strong>Track Number:</strong> ${trackNumber}</p>
          <p><strong>Genre:</strong> ${genres.join(', ')}</p>
        </div>
      </div>
    `
  } catch (error) {
    detailsContainer.innerHTML = '<p>Error loading song details.</p>'
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
