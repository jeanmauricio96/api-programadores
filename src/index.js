const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const { req, res } = require("express");
const porta = 3333;
const app = express();
const programadores = [];

//Validação de ID

function validateID(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Not a valid ID!" });
  }
  next();
}

const logRequests = (req, res, next) => {
  const { method, url } = req;
  const label = `Method used: [${method}] at: (${url})`;
  console.time(label);
  next();
  console.timeEnd(label);
};

//Validação de preenchimento obrigatório

function fieldFillingValidation(request, response, next) {
  const { nome, sobrenome, idade, empresa, tecnologia } = request.body;

  if (!nome || !sobrenome || !idade || !empresa || !tecnologia) {
    return response
      .status(400)
      .json({ error: `Filling in all fields is mandatory!` });
  }

  next();
}

app.use(logRequests);
app.use(express.json());

//CREATE

app.post("/programador", fieldFillingValidation, (req, res) => {
  const id = uuid();
  const { nome, sobrenome, idade, empresa, tecnologia } = req.body;
  const programador = { id, nome, sobrenome, idade, empresa, tecnologia };
  programadores.push(programador);
  return res.json(programador);
});

//READ

app.get("/programadores", (req, res) => {
  const { nome } = req.query;

  const results = nome
    ? programadores.filter((programadores) => programadores.nome.includes(nome))
    : programadores;

  return res.status(200).json(results);
});

//Update

app.put(
  "/programadores/:id",
  validateID,
  fieldFillingValidation,
  (req, res) => {
    const { id } = req.params;
    const { nome, sobrenome, idade, empresa, tecnologia } = req.body;

    const programadorIndex = programadores.findIndex(
      (programador) => programador.id === id
    );

    if (programadorIndex < 0) {
      return res.status(404).json({ error: "programmer not found." });
    }
    const programador = { id, nome, sobrenome, idade, empresa, tecnologia };
    programadores[programadorIndex] = programador;

    return res.status(202).json(programadores[programadorIndex]);
  }
);

//DELETE

app.delete("/programadores/:id", validateID, (req, res) => {
  const { id } = req.params;

  const programadorIndex = programadores.findIndex(
    (programador) => programador.id === id
  );

  if (programadorIndex < 0) {
    return res.status(404).json({ error: "This ID doesn't exist." });
  }

  programadores.splice(programadorIndex, 1);

  return res.status(204).json({ message: "Deletion completed" });
});

//Porta 3333 - Servidor

app.listen(porta, () => {
  console.log(lyrics);
});

//Mensagem de inicialização do servidor

const lyrics = `(leia cantando no ritmo de we are the world)
            🎶 yarnuou 
            yarn nistive 
            yarnuou ce simarake 
            so lesta silvey
            ie simarake
            tusti iomailailai 
            renesi deoiulmarake 
            soii...🎵`;
