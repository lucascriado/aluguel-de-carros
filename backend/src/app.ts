import express from 'express';
import router from '../src/routes/routes';
import cors from 'cors'
import { setupSwagger } from './swagger';

const app = express();
setupSwagger(app);

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
