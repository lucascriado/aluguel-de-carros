import { useState } from "react";
import { api } from "../services/api";

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para formatar CPF
  function formatCPF(value: string) {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    return value;
  }

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const { data } = await api.post("/usuarios/entrar", { cpf, senha });
      localStorage.setItem("token", data.token);
      
      // Feedback visual antes de redirecionar
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMsg.textContent = 'Login realizado com sucesso!';
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        successMsg.remove();
        // Redirecionar para página de usuários
        window.location.href = "/usuarios";
      }, 2000);
      
    } catch (err: any) {
      setErro(err.response?.data?.error || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Bem-vindo</h1>
            <p className="text-gray-500 mt-2">Entre com suas credenciais</p>
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium text-center">{erro}</p>
            </div>
          )}

          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-gray-800"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none text-gray-800"
                placeholder="Digite sua senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Botão */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>

          {/* Link para esqueceu senha (opcional) */}
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>

          {/* Link para cadastro */}
          <div className="mt-6 text-center border-t pt-6">
            <p className="text-sm text-gray-600">
              Não possui uma conta?{" "}
              <a
                href="/cadastrar"
                className="text-blue-600 font-medium hover:underline"
              >
                Cadastrar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}