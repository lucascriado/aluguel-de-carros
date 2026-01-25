import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("entrar", "routes/entrar.tsx"),
  route("cadastrar", "routes/cadastrar.tsx"),
  route("usuarios", "routes/usuarios.tsx")
] satisfies RouteConfig;
