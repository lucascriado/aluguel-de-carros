export type Usuario = {
  id?: number;
  cpf: string;
  nome: string;
  email: string;
  cargo: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  usuario: Usuario;
};
