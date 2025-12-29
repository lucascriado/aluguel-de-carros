import connection from '../db/connection';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import crypto from 'crypto';

function normalizarNome(s: string): string {
  return s.trim().toLowerCase();
}

function normalizarPlaca(s: string): string {
  return s.trim().toUpperCase();
}

function gerarChassi(): string {
  const alfabeto = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'; // sem I,O,Q
  const bytes = crypto.randomBytes(17);
  let out = '';
  for (let i = 0; i < 17; i++) out += alfabeto[bytes[i] % alfabeto.length];
  return out;
}

async function gerarChassiUnico(tentativas = 10): Promise<string> {
  for (let i = 0; i < tentativas; i++) {
    const chassi = gerarChassi();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT 1 FROM veiculos WHERE chassi = ? LIMIT 1',
      [chassi]
    );
    if (rows.length === 0) return chassi;
  }
  throw new Error('Falha ao gerar chassi único');
}

async function obterMarcaIdPorNome(nomeMarca: string): Promise<number | null> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT id FROM marcas WHERE nome = ? LIMIT 1',
    [nomeMarca]
  );
  return rows.length ? Number(rows[0].id) : null;
}

async function obterModeloIdPorNome(marcaId: number, nomeModelo: string): Promise<number | null> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT id FROM modelos WHERE marca_id = ? AND nome = ? LIMIT 1',
    [marcaId, nomeModelo]
  );
  return rows.length ? Number(rows[0].id) : null;
}

async function obterCorIdPorNome(marcaId: number, nomeCor: string): Promise<number | null> {
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT id FROM cores WHERE marca_id = ? AND nome = ? LIMIT 1',
    [marcaId, nomeCor]
  );
  return rows.length ? Number(rows[0].id) : null;
}

export default class vehiclesController {
  // POST /marcas  { "nome": "chevrolet" }
  static async CriarMarca(req: any, res: any) {
    try {
      const { nome } = req.body ?? {};
      if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ erro: 'nome é obrigatório (string).' });
      }

      const nomeNorm = normalizarNome(nome);

      const [existe] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM marcas WHERE nome = ? LIMIT 1',
        [nomeNorm]
      );
      if (existe.length) return res.status(409).json({ erro: 'Marca já existe.' });

      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO marcas (nome) VALUES (?)',
        [nomeNorm]
      );

      return res.status(201).json({ id: result.insertId, nome: nomeNorm });
    } catch (err: any) {
      return res.status(500).json({ erro: 'Erro ao criar marca.', detalhes: err?.message });
    }
  }

  // POST /modelos  { "nome": "s10", "marca": "chevrolet" }
  static async CriarModelo(req: any, res: any) {
    try {
      const { nome, marca } = req.body ?? {};
      if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ erro: 'nome é obrigatório (string).' });
      }
      if (!marca || typeof marca !== 'string') {
        return res.status(400).json({ erro: 'marca é obrigatória (string).' });
      }

      const nomeModelo = normalizarNome(nome);
      const nomeMarca = normalizarNome(marca);

      const marcaId = await obterMarcaIdPorNome(nomeMarca);
      if (!marcaId) return res.status(400).json({ erro: 'Marca não existe. Cadastre em /marcas.' });

      const [existe] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM modelos WHERE marca_id = ? AND nome = ? LIMIT 1',
        [marcaId, nomeModelo]
      );
      if (existe.length) return res.status(409).json({ erro: 'Modelo já existe para essa marca.' });

      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO modelos (marca_id, nome) VALUES (?, ?)',
        [marcaId, nomeModelo]
      );

      return res.status(201).json({ id: result.insertId, nome: nomeModelo, marca: nomeMarca });
    } catch (err: any) {
      return res.status(500).json({ erro: 'Erro ao criar modelo.', detalhes: err?.message });
    }
  }

  // POST /cores  { "nome": "preto", "marca": "chevrolet" }
  static async CriarCor(req: any, res: any) {
    try {
      const { nome, marca } = req.body ?? {};
      if (!nome || typeof nome !== 'string') {
        return res.status(400).json({ erro: 'nome é obrigatório (string).' });
      }
      if (!marca || typeof marca !== 'string') {
        return res.status(400).json({ erro: 'marca é obrigatória (string).' });
      }

      const nomeCor = normalizarNome(nome);
      const nomeMarca = normalizarNome(marca);

      const marcaId = await obterMarcaIdPorNome(nomeMarca);
      if (!marcaId) return res.status(400).json({ erro: 'Marca não existe. Cadastre em /marcas.' });

      const [existe] = await connection.execute<RowDataPacket[]>(
        'SELECT id FROM cores WHERE marca_id = ? AND nome = ? LIMIT 1',
        [marcaId, nomeCor]
      );
      if (existe.length) return res.status(409).json({ erro: 'Cor já existe para essa marca.' });

      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO cores (marca_id, nome) VALUES (?, ?)',
        [marcaId, nomeCor]
      );

      return res.status(201).json({ id: result.insertId, nome: nomeCor, marca: nomeMarca });
    } catch (err: any) {
      return res.status(500).json({ erro: 'Erro ao criar cor.', detalhes: err?.message });
    }
  }

  // POST /veiculos  { "placa": "...", "marca": "...", "modelo": "...", "cor": "..." }
  static async CriarVeiculo(req: any, res: any) {
    const conn = await connection.getConnection(); // <- PEGA UMA CONEXÃO DO POOL

    try {
        const { placa, marca, modelo, cor } = req.body ?? {};

        if (!placa || typeof placa !== 'string')
        return res.status(400).json({ erro: 'placa é obrigatória.' });
        if (!marca || typeof marca !== 'string')
        return res.status(400).json({ erro: 'marca é obrigatória.' });
        if (!modelo || typeof modelo !== 'string')
        return res.status(400).json({ erro: 'modelo é obrigatório.' });
        if (!cor || typeof cor !== 'string')
        return res.status(400).json({ erro: 'cor é obrigatória.' });

        const placaNorm = normalizarPlaca(placa);
        const nomeMarca = normalizarNome(marca);
        const nomeModelo = normalizarNome(modelo);
        const nomeCor = normalizarNome(cor);

        await conn.beginTransaction();

        // placa única
        const [placaRows] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM veiculos WHERE placa = ? LIMIT 1',
        [placaNorm]
        );
        if (placaRows.length) {
        await conn.rollback();
        return res.status(409).json({ erro: 'Já existe um veículo com essa placa.' });
        }

        const [marcaRows] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM marcas WHERE nome = ? LIMIT 1',
        [nomeMarca]
        );
        if (!marcaRows.length) {
        await conn.rollback();
        return res.status(400).json({ erro: 'Marca não existe.' });
        }
        const marcaId = Number(marcaRows[0].id);

        const [modeloRows] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM modelos WHERE marca_id = ? AND nome = ? LIMIT 1',
        [marcaId, nomeModelo]
        );
        if (!modeloRows.length) {
        await conn.rollback();
        return res.status(400).json({ erro: 'Modelo não existe para essa marca.' });
        }
        const modeloId = Number(modeloRows[0].id);

        const [corRows] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM cores WHERE marca_id = ? AND nome = ? LIMIT 1',
        [marcaId, nomeCor]
        );
        if (!corRows.length) {
        await conn.rollback();
        return res.status(400).json({ erro: 'Cor não existe para essa marca.' });
        }
        const corId = Number(corRows[0].id);

        const chassi = await gerarChassiUnico();

        const [result] = await conn.execute<ResultSetHeader>(
        `INSERT INTO veiculos (chassi, placa, marca_id, modelo_id, cor_id)
        VALUES (?, ?, ?, ?, ?)`,
        [chassi, placaNorm, marcaId, modeloId, corId]
        );

        await conn.commit();

        return res.status(201).json({
        id: result.insertId,
        chassi,
        placa: placaNorm,
        marca: nomeMarca,
        modelo: nomeModelo,
        cor: nomeCor,
        status: 'disponivel',
        });
    } catch (err: any) {
        await conn.rollback();
        return res.status(500).json({ erro: 'Erro ao criar veículo.', detalhes: err.message });
    } finally {
        conn.release(); // <- MUITO IMPORTANTE
    }
    }
}
