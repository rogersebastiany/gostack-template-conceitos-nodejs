const express = require("express");
const cors = require("cors");

const { v4: uuidv4, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query

  const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories

  response.json(results)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository =  { id: uuidv4(), title, url, techs, likes: 0 }
  repositories.push(repository)
  response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params

  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository

  response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
    
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if ( repositoryIndex < 0 ) {
      return response.status(400).json({ error: 'Repository not found.'})
  }

  repositories.splice(repositoryIndex, 1)

  response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if ( repositoryIndex < 0 ) {
    return response.status(400).json({ error: 'Repository not found.'})
  }

  const repository = {
    id: repositories[repositoryIndex].id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].url,
    likes: repositories[repositoryIndex].likes +1
  }

  repositories[repositoryIndex] = repository

  response.json(repository)
});

module.exports = app;
