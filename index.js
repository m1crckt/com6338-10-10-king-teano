// Add click listeners to all decade cards
document.querySelectorAll('.decade-card').forEach(card => {
    card.addEventListener('click', () => {
      const decade = card.getAttribute('data-decade')
  
      // Save selected decade to localStorage
      localStorage.setItem('selectedDecade', decade)
  
      // Navigate to the decade results page with the decade in the query string
      window.location.href = `decoy.html?decade=${encodeURIComponent(decade)}`
    })
  })
  