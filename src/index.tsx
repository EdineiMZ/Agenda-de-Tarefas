import React from 'react'; // Importa a biblioteca React
import ReactDOM from 'react-dom/client'; // Importa a biblioteca para manipulação do DOM com React
import './index.css'; // Importa o arquivo de estilos CSS global
import App from './App'; // Importa o componente principal da aplicação
import reportWebVitals from './reportWebVitals'; // Importa função para reportar métricas de performance
import Header from "./components/header/header"; // Importa o componente Header

import {
    createBrowserRouter, // Importa a função para criar um roteador
    RouterProvider, // Importa o provedor de roteador
} from "react-router-dom"; // Importa biblioteca de roteamento para React

// Cria a raiz do React DOM
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement // Seleciona o elemento HTML com id 'root' como raiz
);

// Define as rotas da aplicação
const router = createBrowserRouter([
    {
        path: "/", // Define a rota raiz
        element: <App/>, // Renderiza o componente App na rota raiz
    },
    {
        path: "/home", // Define a rota "/home"
        element: <div>Home</div>, // Renderiza um div com texto "Home" na rota "/home"
    }
]);

// Renderiza a aplicação na raiz do React DOM
root.render(
    <React.StrictMode> {/* Habilita o modo estrito do React para detectar problemas no código */}
        <Header /> {/* Renderiza o componente Header */}
        <RouterProvider router={router} /> {/* Provedor de roteador com as rotas definidas */}
    </React.StrictMode>
);

reportWebVitals(); // Chama a função para reportar métricas de performance
