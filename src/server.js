// Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const shortid = require('shortid');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

// call
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 1.create a new player & save into db
app.post('/', async (req, res) => {
  const player = {
    ...req.body,
    id: shortid.generate(),
  };
  // file location
  const dbLocation = path.resolve('src', 'data.json');
  // location file read
  const data = await fs.readFile(dbLocation);
  // convert json to object
  const players = JSON.parse(data);
  players.push(player);
  // write file
  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(201).json(player);
});

// 2.find all players
app.get('/', async (req, res) => {
  // file location
  const dbLocation = path.resolve('src', 'data.json');
  // location file read
  const data = await fs.readFile(dbLocation);
  // convert json to object
  const players = JSON.parse(data);

  res.status(201).json(players);
});

// 3.find a single player by id
app.get('/:id', async (req, res) => {
  // parameter
  const id = req.params.id;
  // file location
  const dbLocation = path.resolve('src', 'data.json');
  // location file read
  const data = await fs.readFile(dbLocation);
  // convert json to object
  const players = JSON.parse(data);

  // find a single player by id
  const player = players.find((item) => item.id === id);

  // error handle
  if (!player) {
    return res.status(404).json({ message: 'Player Not Found' });
  }
  res.status(200).json(player);
});

// 4.update specify player
app.patch('/:id', async (req, res) => {
  const id = req.params.id;

  // file location
  const dbLocation = path.resolve('src', 'data.json');
  // location file read
  const data = await fs.readFile(dbLocation);
  // convert json to object
  const players = JSON.parse(data);
  // find a single player by id
  const player = players.find((item) => item.id === id);
  // error handle
  if (!player) {
    return res.status(404).json({ message: 'Player Not Found' });
  }

  // update information
  player.name = req.body.name || player.name;
  player.country = req.body.country || player.country;
  player.rank = req.body.rank || player.rank;

  // write file
  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(200).json(player);
});

// 5.update or create player
app.put('/:id', async (req, res) => {
  const id = req.params.id;

  // file location
  const dbLocation = path.resolve('src', 'data.json');
  // location file read
  const data = await fs.readFile(dbLocation);
  // convert json to object
  const players = JSON.parse(data);
  // find a single player by id
  let player = players.find((item) => item.id === id);

  // player create or update
  if (!player) {
    player = {
      id: shortid.generate(),
      ...req.body,
    };
    players.push(player);
  } else {
    player.name = req.body.name;
    player.country = req.body.country;
    player.rank = req.body.rank;
  }

  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(200).json(player);
});

// 6.delete player from Database
app.delete('/:id', async (req, res) => {
  const id = req.params.id;

  // file location
  const dbLocation = path.resolve('src', 'data.json');
  // location file read
  const data = await fs.readFile(dbLocation);
  // convert json to object
  const players = JSON.parse(data);
  // find a single player by id
  let player = players.find((item) => item.id === id);

  if (!player) {
    return res.status(404).json({ message: 'Player Not Found' });
  }
  const newPlayers = players.filter((item) => item.id !== id);

  await fs.writeFile(dbLocation, JSON.stringify(newPlayers));
  res.status(203).send();
});

// PORT
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on PORT http://localhost:${port}`);
});
