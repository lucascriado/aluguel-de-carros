import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'aluguel-de-carros',
      version: '1.0.0',
      description: 'gestão e aluguel de veículos para diversos usuários.',
    },
    servers: [
      {
        url: 'http://localhost:3000'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ListaUsuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'id do usuário',
              example: '1'
            },
            cpf: {
              type: 'string',
              description: 'cpf do usuário',
              example: '110.100.001-11'
            },
            nome: {
              type: 'string',
              description: 'nome do usuário',
              example: 'lucas'
            },
            email: {
              type: 'string',
              description: 'e-mail do usuário',
              example: 'lucas@email.com'
            },
          },
        },
        EncontraUsuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'id do usuário',
              example: '1'
            },
            cpf: {
              type: 'string',
              description: 'cpf do usuário',
              example: '110.100.001-11'
            },
            nome: {
              type: 'string',
              description: 'nome do usuário',
              example: 'lucas'
            },
            email: {
              type: 'string',
              description: 'e-mail do usuário',
              example: 'lucas@email.com'
            },
          },

        },
        CadastroUsuario: {
          type: 'object',
          required: ['cpf', 'nome', 'email', 'senha'],
          properties: {
            cpf: {
              type: 'string',
              description: 'cpf do usuário',
              example: '110.100.001-11'
            },
            nome: {
              type: 'string',
              description: 'nome do usuário',
              example: 'lucas'
            },
            email: {
              type: 'string',
              description: 'e-mail do usuário',
              example: 'lucas@email.com'
            },
            senha: {
              type: 'string',
              description: 'senha do usuário',
              example: 'senha@123',
            },
          },
        },
        Entrar: {
          type: 'object',
          required: ['cpf', 'senha'],
          properties: {
            cpf: {
              type: 'string',
              example: '110.100.001-11',
            },
            senha: {
              type: 'string',
              example: 'senha@123',
            },
          },
        },
        Erro: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'falha ao se conectar com servidor'
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/routes.ts'], 
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
};