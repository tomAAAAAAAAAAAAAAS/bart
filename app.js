const express = require('express')
const mysql = require('mysql2');
const app = express()
const port = 3000

// Middleware para parse de JSON no corpo da requisição
app.use(express.json());

// Criação da conexão com a base de dados
const connection = mysql.createConnection({
  host: '127.0.0.1',       // Endereço do servidor MySQL
  user: 'root',            // user do MySQL
  password: '',            // Senha do MySQL
  database: 'psi_t2',         // Nome da base de dados
  port: 3306
});


// Teste da conexão
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar à base de dados:', err.message);
  } else {
    console.log('Conectado à base de dados MySQL!');
  }
});

const NOME_TABELA = "songs"

// Rota para listar todos os users
app.get('/api/songs', (req, res) => {

  // Onde definimos a query
  const myQuery = `SELECT * FROM ${NOME_TABELA}`

  // Executa a myQuery
  connection.query(myQuery, (err, results) => {

    // Dar erro se err existir
    if (err) {
      return res.status(500).send('Erro ao buscar users: ' + err.message);
    }

    // Enviar resposta
    res.json(results);
  });
  
});


// Rota para adicionar um novo user
app.post('/api/songs', (req, res) => {
  const title = req.body.title;
  const artist= req.body.artist;
  const album = req.body.album;
  const genre = req.body.genre;
  const duration_secs = req.body.duration_secs;
  const release_date = req.body.release_date;
  const likes = req.body.likes;
 


  const query = `INSERT INTO ${NOME_TABELA} (title, artist, album, genre, duration_secs, release_date,likes) VALUES ("${title}", "${artist}", "${album}", "${genre}", "${duration_secs}", "${release_date} ,"${likes} ")`;
  connection.query(query, (err, results) => {
    // Dar erro se err existir
    if (err) {
      return res.status(500).send('Erro ao adicionar songs: ' + err.message);
    }
    // Enviar resposta
    res.status(200).send('songs adicionado com sucesso!');
  });
});
                                                                                                                                                                                                                                                                                                    
// Rota para atualizar um user pelo ID
app.put('/api/songs/:id', (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const artist= req.body.artist;
  const album = req.body.album;
  const genre = req.body.genre;
  const duration_secs = req.body.duration_secs;
  const release_date = req.body.release_date;
  const likes = req.body.likes;

  const query = `UPDATE ${NOME_TABELA} SET title= "${title}", artist = "${artist}", album = "${album}"genre = "${genre}",  duration_secs = "${ duration_secs}" , release_date = "${release_date}" , likes = "${likes}" WHERE id = "${id}"`;

  connection.query(query, (err, results) => {
    // Dar erro se err existir
    if (err) {
      return res.status(500).send('Erro ao atualizar songs: ' + err.message);
    }
    // Enviar resposta
    res.status(200).send('songs a ser  atualizado com sucesso!');
  });
});

// Rota para apagar um user pelo ID
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM ${NOME_TABELA} WHERE id = ${id}`;

  connection.query(query, (err, results) => {
    // Dar erro se err existir
    if (err) {
      return res.status(500).send('Erro ao deletar user: ' + err.message);
    }
    // Enviar resposta
    res.status(200).send('user removido com sucesso!');
  });
});

// Código para Exercícios passados

/* 
// Mock database

let idCounter = 2;

const users = [
  {
    id: 0,
    first_name: 'John',
    last_name: 'Doe',
    email: 'johndoe@example.com',
  },
  {
    id: 1,
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alicesmith@example.com',
  },
]; */

/* GET */
/* app.get('/users', (request, response) => {
  response.send(users)
}) */

/* POST */
/* app.post('/users', (request, response) => {

  const user = request.body;

  // Adiciona um novo id ao user usando o contador atual
  user["id"] = idCounter;

  users.push(user);

  response.send(`Adicionado novo User com id ${user.id}`)

  // O counter do id sobe
  idCounter++;
}) */

/* PUT */
/* app.put('/users/:id', (request, response) => {

  const requestedId = request.params.id;
  const newUser = request.body;

  for(let i = 0; i<users.length; i++) {
    if (users[i].id == requestedId) {

      users[i].first_name = newUser.first_name;
      users[i].last_name = newUser.last_name;
      users[i].email = newUser.email;

      response.send(`Atualizado User com id ${requestedId}`)

      break;
    }
  }

  response.status(404);
  response.send("User not found")
}) */

/* DELETE */
/* app.delete('/users', (request, response) => {
  response.send(users)
})
 */

// Criar o servidor HTTP
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
