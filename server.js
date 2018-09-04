const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/ideas', (request, response) => {
  database('ideas').select()
    .then((ideas) => {
      response.status(200).json(ideas)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/ideas/:id', (request, response) => {
  database('ideas').where('id', request.params.id).select()
    .then(ideas => {
      if (ideas.length) {
        response.status(200).json(ideas);
      } else {
        response.status(404).json({
          error: `Could not find an idea with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});


app.post('/api/v1/ideas', (request, response) => {
  const idea = request.body;
  console.log(idea)

  for (let requireParameter of ['title', 'body']) {
    if (!idea[requireParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { title: <STRING>, body: <STRING> }. You're missing a "${requireParameter}" property.`})
    }
  }
  database('ideas').insert(idea, 'id')
    .then(idea => {
      response.status(201).json({ id: idea[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/ideas/:id', (request, response) => {
  database('ideas').where('id', request.params.id).del()
  .then(() => {
    response.status(202).json({
      'id': request.params.id
    });
  });
})



app.set('port', process.env.PORT || 3000);
app.locals.title = 'Idea Box';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});