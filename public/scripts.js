const submitBtn = $('#submit-btn');
const deleteBtn = $('#displayed-ideas')
submitBtn.on('click', postIdea)
deleteBtn.on('click', '.delete-btn', deleteIdea);

fetchIdeas()

function postIdea(e) {
  e.preventDefault()
  let title = $('#title-input').val()
  let body = $('#body-input').val()

  if (title === '' || body === '') {
    return alert('Please fill out required fields.')
  } 

  let idea = { title, body }

  fetch('/api/v1/ideas', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(idea)
    })
      .then(response => response.json())
      .then(results => fetchSingleIdea(results.id))
      .then(idea => displayIdeas(idea))

  $('#title-input').val('')
  $('#body-input').val('')

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

function deleteIdea() {
  let ideaId = $(this).closest('article').attr('id');

  fetch(`/api/v1/ideas/${ideaId}`, {
    method: 'DELETE'
  });

  $(this).closest('article').remove()
}

function displayIdeas(ideas) {
  return ideas.map(idea => {
    $('#displayed-ideas').append(`
      <article id="${idea.id}">
        <h2>${idea.title}</h2>
        <p>${idea.body}</p>
        <button class="delete-btn">Delete</button>
      </article>
    `)
  })
}