const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

const repositories = [];

app.use(express.json());

// const { v4: uuid } = require('uuid');

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID." })
  }

  return next();
}

app.use(logRequests);
app.use('/repositories/:id', validateProjectId);
app.use(cors());

app.get("/repositories", (request, response) => {
  // OK
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  // OK
  const { title, url, techs } = request.body;
  const postRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(postRepository);
  return response.json(postRepository);
});

app.put("/repositories/:id", (request, response) => {
  // OK
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // OK
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // OK
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repository.likes++;

  return response.json(repository);


});

module.exports = app;