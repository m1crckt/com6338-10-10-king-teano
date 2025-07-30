document.querySelectorAll('.decade-card').forEach(card => {
    card.addEventListener('click', () => {
      const decade = card.getAttribute('data-decade')
      localStorage.setItem('selectedDecade', decade)
      window.location.href = `explore.html?decade=${encodeURIComponent(decade)}`
    })
  })