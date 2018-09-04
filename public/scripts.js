const submitBtn = $('#submit-btn')
submitBtn.on('click', postIdea)

fetchIdeas()

function postIdea(e) {
  e.preventDefault()
  let title = $('#title-input').val()
  let body = $('#body-input').val()

  let idea = { title, body }

  fetch('/api/v1/ideas', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(idea)
    })
      .then(response => response.json())
      .then(a => fetchSingleIdea(a.id))
      .then(idea => displayIdeas(idea))
  // $('#idea-form').reset()
  // return fetchIdeas()

}

function fetchIdeas() {
  return fetch('/api/v1/ideas')
    .then(response => response.json())
    .then(ideas => displayIdeas(ideas))
}

function fetchSingleIdea(id) {
  return fetch(`/api/v1/ideas/${id}`)
    .then(response => response.json())
    .then(idea => idea)
}

function displayIdeas(ideas) {
  return ideas.map(idea => {
    $('#displayed-ideas').append(`
      <article id="${idea.id}">
        <h2>${idea.title}</h2>
        <p>${idea.body}</p>
      </article>
    `)
  })
}