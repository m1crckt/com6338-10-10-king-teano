# com6338-10-10-king-teano
An interactive website where users can explore and play music, movies, or pop culture content from past decades — like the 70s, 80s, 90s, 00s, or 2010s.

### Created `index.html`
- Added decade cards for:
  - 1970s
  - 1980s
  - 1990s
  - 2000s
  - 2010s
- Made basic styling and awaiting final styles from Rachel

### Created `index.js`
- Added click listeners to all decade cards
- Saves selected decade to `localStorage`
- Navigates to decade results page with decade in query string

### Created `details.html`
- Created layout for **Song Details** that includes:
  - Artist name
  - Album name
  - Release date
  - Track number
  - Genre
- Created layout for **Film Details** that includes:
  - Release date
  - Runtime
  - Genre(s)
  - Director
  - Description
  - Rating
  - Cast
  - Crew
  - Trailer
- Uses basic styling; awaiting final styling from Rachel 

### Created `details.js`
- Pulls data from the **TMDB API** and **Last.FM API** to be applied to details for each selected song or film

