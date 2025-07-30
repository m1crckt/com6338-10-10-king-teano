const detailsContainer = document.getElementById('details-container')
const detailHeader = document.getElementById('detail-header')

const TMDB_API_KEY = 'afe16acc7371ea20cf842174d3cd101e'

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
async function fetchSongDetails(trackId) {
  detailHeader.textContent = 'Song Details'

  const url = `https://itunes.apple.com/lookup?id=${trackId}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.resultCount === 0) {
      detailsContainer.innerHTML = '<p>Song not found.</p>'
      return
    }
    const song = data.results[0]
    const artwork = song.artworkUrl100.replace('100x100', '600x600')

    detailsContainer.innerHTML = `
      <div style="display: flex; gap: 1rem; align-items: flex-start;">
        <img src="${artwork}" alt="Album Art" style="width: 200px; border-radius: 8px;">
        <div>
          <h3>${song.trackName}</h3>
          <p><strong>Artist:</strong> ${song.artistName}</p>
          <p><strong>Album:</strong> ${song.collectionName}</p>
          <p><strong>Release Date:</strong> ${new Date(song.releaseDate).toLocaleDateString()}</p>
          <p><strong>Track Number:</strong> ${song.trackNumber || 'N/A'}</p>
          <p><strong>Genre:</strong> ${song.primaryGenreName}</p>
          <audio controls src="${song.previewUrl}"></audio>
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
