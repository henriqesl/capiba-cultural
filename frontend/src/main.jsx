import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);

/*
  [O QUE FALTA]
  O backend (authMiddleware.js) bloqueia tudo que não tiver token.
  Precisamos criar um <AuthProvider> aqui em volta do <App>.
  Ele vai ser responsável por pegar o token do Login e colocar no cabeçalho de todas as requisições.
*/
