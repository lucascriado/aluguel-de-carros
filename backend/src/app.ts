import express from 'express';
import router from '../src/routes/routes';
import cors from 'cors'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/backend", router);

app.listen(9000, () => {
  console.log("Servidor rodando na porta 9000");
});
