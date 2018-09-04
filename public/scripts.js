const submitBtn = $('#submit-btn')
submitBtn.on('click', postIdea)


function postIdea(e) {
  e.preventDefault()
  let title = $('#title-input').val()
  let body = $('#body-input').val()

  let idea = { title, body }

  return fetch('/api/v1/ideas', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(idea)
    })
      // .then(response => response.json())
      .then(a => console.log(a))

}

