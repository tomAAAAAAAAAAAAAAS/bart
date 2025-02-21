// Autor: Renato Henriques

// Importação de módulos
const express = require("express");
const mysql = require("mysql2");
const app = express();
const axios = require("axios");

// Constantes do Projeto
const port = 3001;
const NOME_TABELA = "songs";

// Middleware para parse de JSON no corpo dos pedidos
app.use(express.json());

// Criar o servidor HTTP
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

// Criação da  com a base de dados
const connection = mysql.createConnection({
  host: "127.0.0.1", // Endereço do servidor MySQL
  user: "root", // user do MySQL
  password: "", // Senha do MySQL
  database: "psi_t2", // Nome da base de dados
  port: 3306,
});

// Conexão à base de dados
connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar à base de dados:", err.message);
  } else {
    console.log("Conectado à base de dados MySQL!");
  }
});

// Variável global para guardar o preço por like
let pricePerLike = 0.4;

// Variável global para guardar as bandas
const bands = [
  {
    artist: "Ed Sheeran",
    band_members: ["Ed Sheeran"],
  },
  {
    artist: "Queen",
    band_members: [
      "Freddie Mercury",
      "Brian May",
      "Roger Taylor",
      "John Deacon",
    ],
  },
  {
    artist: "Adele",
    band_members: ["Adele"],
  },
  {
    artist: "Systems of a Down",
    band_members: [
      "Serj Tankian",
      "Daron Malakian",
      "Shavo Odadjian",
      "John Dolmayan",
    ],
  },
];

/* ENDPOINTS DA API */

// Rota para listar todas as músicas
app.get("/api/songs", (req, res) => {
  // Obter os filtros da URL
  const urlQuery = req.query;

  // Query default. Buscar todas as músicas
  let myQuery = `SELECT * FROM ${NOME_TABELA}`;

  // Verificar se existem filtros na URL
  if (urlQuery.genre) {
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE genre = "${urlQuery.genre}"`;
  }

  if (urlQuery.artist) {
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE artist = "${urlQuery.artist}"`;
  }

  if (urlQuery.genre && urlQuery.artist) {
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE genre = "${urlQuery.genre}" AND artist = "${urlQuery.artist}"`;
  }

  if (urlQuery.likes && urlQuery.op === "above") {
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE likes > ${urlQuery.likes}`;
  } else if (urlQuery.likes && urlQuery.op === "below") {
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE likes < ${urlQuery.likes}`;
  } else if (urlQuery.likes && urlQuery.op === "equal") {
    myQuery = `SELECT * FROM ${NOME_TABELA} WHERE likes = ${urlQuery.likes}`;
  }

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar músicas: " + err.message);
    }

    res.json(results);
  });
});

// Rota para adicionar uma música
app.post("/api/songs", (req, res) => {
  const { title, artist, album, genre, duration_secs, release_date, likes } =
    req.body;

  // Validação dos campos obrigatórios
  if (!title || !artist) {
    return res.status(400).send("Campos obrigatórios: title, artist");
  }

  const query = `INSERT INTO ${NOME_TABELA} (title, artist, album, genre, duration_secs, release_date, likes) VALUES ("${title}", "${artist}", "${album}", "${genre}", "${duration_secs}", "${release_date}", "${likes}")`;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao adicionar música: " + err.message);
    }
    res.sendStatus(200);
  });
});

// Rota para atualizar uma música pelo ID
app.put("/api/songs/:id", (req, res) => {
  const id = req.params.id;

  // Validação do ID da música
  if (!id || isNaN(id)) {
    return res.status(400).send("ID da música não é válido");
  }

  const { title, artist, album, genre, duration_secs, release_date, likes } =
    req.body;

  // Validação dos campos obrigatórios
  if (!title || !artist) {
    return res.status(400).send("Campos obrigatórios: title, artist");
  }

  const query = `UPDATE ${NOME_TABELA} SET title = "${title}", artist = "${artist}", album = "${album}", genre = "${genre}", duration_secs = "${duration_secs}", release_date = "${release_date}", likes = "${likes}" WHERE id = "${id}"`;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao atualizar música: " + err.message);
    }
    res.sendStatus(200);
  });
});

// Rota para apagar uma música pelo ID
app.delete("/api/songs/:id", (req, res) => {
  const id = req.params.id;

  // Validação do ID da música
  if (!id || isNaN(id)) {
    return res.status(400).send("ID da música não é válido");
  }

  const query = `DELETE FROM ${NOME_TABELA} WHERE id = ${id}`;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao remover música: " + err.message);
    }
    res.send("Música removida com sucesso!");
  });
});

// Rota para listar uma música
app.get("/api/songs/:id", (req, res) => {
  // Obter o id da música a partir do parâmetro ID da URL
  const id = req.params.id;

  // Validar o ID da música
  if (!id || isNaN(id)) {
    return res.status(400).send("ID da música não é válido");
  }

  const myQuery = `SELECT * FROM ${NOME_TABELA} WHERE id=${id};`;

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar música: " + err.message);
    }

    // Validar se a música foi encontrada
    if (results.length == 0) {
      return res.status(404).send("Música não encontrada");
    }

    res.json(results);
  });
});

// Rota para obter o preço por like atual
app.get("/api/price", (req, res) => {
  res.json({ price: pricePerLike });
});

// Rota para obter o preço por like atual
app.put("/api/price", (req, res) => {
  // Validações do preço por like recebido
  if (!req.body.price) {
    return res.status(400).send("Preço por like não foi fornecido");
  } else if (isNaN(req.body.price)) {
    return res.status(400).send("Preço por like deve ser um número");
  } else if (req.body.price < 0) {
    return res.status(400).send("Preço por like deve ser um número positivo");
  }

  pricePerLike = req.body.price;

  res.sendStatus(200);
});

// Rota para obter dinheiro gerado por música.
// Deve ir buscar nº de likes e depois multiplicar pelo preço de cada like
app.get("/api/songs/:id/revenue", (req, res) => {
  // Obter o id da música a partir do parâmetro ID da URL
  const id = req.params.id;

  // Validação do ID da música
  if (!id || isNaN(id)) {
    return res.status(400).send("ID da música não é válido");
  }

  const myQuery = `SELECT * FROM ${NOME_TABELA} WHERE id=${id};`;

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar música: " + err.message);
    }

    // Validar se a música foi encontrada
    if (results.length == 0) {
      return res.status(404).send("Música não encontrada");
    }

    // Retornar o dinheiro gerado pela música
    res.json({ revenue: results[0].likes * pricePerLike });
  });
});

// Rota para listar os membros de uma banda de uma música
app.get("/api/songs/:id/band", (req, res) => {
  // Obter o id da música a partir do parâmetro ID da URL
  const id = req.params.id;

  // Validação do ID da música
  if (!id || isNaN(id)) {
    return res.status(400).send("ID da música não é válido");
  }

  const myQuery = `SELECT * FROM ${NOME_TABELA} WHERE id=${id};`;

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar músicas: " + err.message);
    }

    // Validar se a música foi encontrada
    if (results.length > 0) {
      // Obter o artista da música
      const artist = results[0].artist;

      // Iterar sobre as bandas
      for (let band of bands) {
        // Verificar se a banda tem o artista
        if (band.artist == artist) {
          return res.json({
            artist: band.artist,
            band_members: band.band_members,
          });
        }
      }

      // Se não encontrar a banda
      return res
        .status(404)
        .send(
          "Não encontrado membros de bandas para o artista: " +
            results[0].artist
        );
    } else {
      // Se não encontrar a música na BD
      res
        .status(404)
        .send("Música com o seguinte id não foi encontrada: " + id);
    }
  });
});

// Rota para adicionar uma banda
app.post("/api/songs/:id/band", (req, res) => {
  // Obter o id da música a partir do parâmetro ID da URL
  const id = req.params.id;

  // Validação do ID da música
  if (!id || isNaN(id)) {
    return res.status(400).send("ID da música não é válido");
  }

  const band_members = req.body.band_members;

  // Validação do array de membros da banda recebido no corpo do pedido
  if (!Array.isArray(band_members) || band_members.length === 0) {
    return res
      .status(400)
      .json({ error: "Band members should be an array and cannot be empty" });
  }

  const myQuery = `SELECT * FROM ${NOME_TABELA} WHERE id=${id};`;

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar músicas: " + err.message);
    }

    // Validar se a música foi encontrada
    if (results.length > 0) {
      // Obter o artista da música
      const artist = results[0].artist;

      // Iterar sobre as bandas
      for (let band of bands) {
        // Verificar se a banda tem o artista
        if (band.artist == artist) {
          return res
            .status(400)
            .send("Banda já existe para o artista: " + results[0].artist);
        }
      }
      // Adicionar a nova banda
      bands.push({ artist: artist, band_members: band_members });

      // Se não encontrar o artista na lista de bandas, adicionar a nova banda
      return res
        .status(200)
        .send("Banda adicionada com sucesso para o artista: " + artist);
    } else {
      // Se não encontrar a música na BD
      res
        .status(404)
        .send("Música com o seguinte id não foi encontrada: " + id);
    }
  });
});

// Rota para atualizar uma banda
app.put("/api/songs/:id/band", (req, res) => {
  // Obter o id da música a partir do parâmetro ID da URL
  const id = req.params.id;

  // Validação do ID da música
  if (!id || isNaN(id)) {
    return res.status(400).send("ID da música não é válido");
  }

  const band_members = req.body.band_members;

  // Validação do array de membros da banda recebido no corpo do pedido
  if (!Array.isArray(band_members) || band_members.length === 0) {
    return res
      .status(400)
      .json({ error: "Band members should be an array and cannot be empty" });
  }

  const myQuery = `SELECT * FROM ${NOME_TABELA} WHERE id=${id};`;

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar músicas: " + err.message);
    }

    // Validar se a música foi encontrada
    if (results.length > 0) {
      // Obter o artista da música
      const artist = results[0].artist;

      // Iterar sobre as bandas
      for (let band of bands) {
        // Verificar se a banda tem o artista
        if (band.artist == artist) {
          // Atualizar os membros da banda
          band.band_members = band_members;

          return res
            .status(200)
            .send("Banda atualizada com sucesso para o artista: " + artist);
        }
      }

      // Se não encontrar a banda
      return res
        .status(404)
        .send(
          "Não encontrado membros de bandas para o artista: " +
            results[0].artist
        );
    } else {
      // Se não encontrar a música na BD
      res
        .status(404)
        .send("Música com o seguinte id não foi encontrada: " + id);
    }
  });
});

// Rota para apagar uma banda
app.delete("/api/songs/:id/band", (req, res) => {
  // Obter o id da música a partir do parâmetro ID da URL
  const id = req.params.id;

  // Validação do ID da música
  if (!id || isNaN(id)) {
    return res.status(400).send("ID da música não é válido");
  }

  const myQuery = `SELECT * FROM ${NOME_TABELA} WHERE id=${id};`;

  connection.query(myQuery, (err, results) => {
    if (err) {
      return res.status(500).send("Erro ao buscar músicas: " + err.message);
    }

    // Validar se a música foi encontrada
    if (results.length > 0) {
      // Obter o artista da música
      const artist = results[0].artist;

      // Iterar sobre as bandas
      for (let i = 0; i < bands.length; i++) {
        // Verificar se a banda tem o artista
        if (bands[i].artist == artist) {
          // Remover a banda
          bands.splice(i, 1);

          return res
            .status(200)
            .send("Band removida com sucesso para o artista: " + artist);
        }
      }

      // Se não encontrar a banda
      return res
        .status(404)
        .send(
          "Não encontrado membros de bandas para o artista: " +
            results[0].artist
        );
    } else {
      // Se não encontrar a música na BD
      res
        .status(404)
        .send("Música com o seguinte id não foi encontrada: " + id);
    }
  });
});

// Rota para adicionar várias músicas de uma só vez
app.post("/api/songs/bulk", (req, res) => {
  const newSongs = req.body;

  // Validação do array de músicas recebido no corpo do pedido
  if (!Array.isArray(newSongs) || newSongs.length === 0) {
    return res
      .status(400)
      .json({ error: "Songs should be an array and cannot be empty" });
  }

  for (let i = 0; i < newSongs.length; i++) {
    // Obter os campos da música 1 a 1
    const { title, artist, album, genre, duration_secs, release_date, likes } =
      newSongs[i];

    // Validação dos campos obrigatórios
    if (!title || !artist) {
      return res.status(400).send("Campos obrigatórios: title, artist");
    }

    const query = `INSERT INTO ${NOME_TABELA} (title, artist, album, genre, duration_secs, release_date, likes) VALUES ("${title}", "${artist}", "${album}", "${genre}", "${duration_secs}", "${release_date}", "${likes}")`;

    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).send("Erro ao adicionar música: " + err.message);
      }
    });
  }

  // Retornar a resposta depois de adicionar todas as músicas
  res.status(201).send("Músicas adicionadas com sucesso!");
});

// ENDPOINTS DE FRONTEND

/*** 

PARA ADICIONAR PARTE 2

***/

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/lista", (req, res) => {
  axios
    .get("http://localhost:3001/api/songs")
    .then((response) => {
      console.log("Success:", response.data);
      res.render("lista", { songs: response.data });
    })
    .catch((error) => {
      console.error("Error", error);
    });
});

app.get("/newsong", (req, res) => {
  res.render("newsong");
});

app.get("/price", (req, res) => {
  res.render("price", { price: pricePerLike });
});

app.get("/song/:id", (req, res) => {
  const id = req.params.id;
  axios
    .get(`http://localhost:3001/api/songs/${id}`)
    .then((response) => {
      console.log("Success:", response.data);
      res.render("song", { songs: response.data, price: pricePerLike });
    })
    .catch((error) => {
      console.error("Error", error);
    });
});
