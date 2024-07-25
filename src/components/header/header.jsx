import React, {useEffect, useState} from "react"; // Importa React e hooks useEffect e useState
import './header.css'; // Importa o arquivo de estilos CSS

// Define o componente Header
function Header() {
    // Define o estado inicial do componente
    const [activeScreen, setActiveScreen] = useState("inicio"); // Estado para a tela ativa, inicializa com "inicio"
    const [isFormVisible, setIsFormVisible] = useState(false); // Estado para visibilidade do formulário, inicializa com false
    const [tasks, setTasks] = useState([]); // Estado para armazenar tarefas, inicializa com um array vazio
    const [expandedTaskIndex, setExpandedTaskIndex] = useState(null); // Estado para armazenar o índice da tarefa expandida, inicializa com null

    // Carregar tarefas do localStorage ao montar o componente
    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks"); // Obtém tarefas do localStorage
        console.log("Dados do localStorage:", savedTasks); // Log para verificar dados do localStorage
        if (savedTasks) { // Se houver tarefas salvas
            try {
                setTasks(JSON.parse(savedTasks)); // Atualiza o estado das tarefas com os dados do localStorage
            } catch (e) {
                console.error("Erro ao carregar tarefas do localStorage:", e); // Log de erro caso falhe ao carregar tarefas
            }
        }
    }, []); // Executa apenas uma vez ao montar o componente

    // Salvar tarefas no localStorage sempre que forem atualizadas
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Salva o estado das tarefas no localStorage
    }, [tasks]); // Executa sempre que o estado das tarefas mudar

    // Função para mostrar a tela especificada
    const showScreen = (screen) => {
        setActiveScreen(screen); // Atualiza o estado da tela ativa
    };

    // Função para alternar a visibilidade do formulário
    const toggleForm = () => {
        setIsFormVisible(!isFormVisible); // Inverte o estado da visibilidade do formulário
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário
        const newTask = { // Cria uma nova tarefa com os valores do formulário
            name: e.target.task.value,
            dueDate: e.target.dueDate.value,
            dueTime: e.target.dueTime.value,
            description: e.target.description.value,
            completed: false, // Inicializa a nova tarefa como não completada
        };
        setTasks([...tasks, newTask]); // Adiciona a nova tarefa ao estado das tarefas
        e.target.reset(); // Reseta o formulário
        setIsFormVisible(false); // Esconde o formulário
    };

    // Função para lidar com a mudança do estado do checkbox
    const handleCheckboxChange = (index) => {
        const updatedTasks = tasks.map((task, i) =>
            i === index ? { ...task, completed: !task.completed } : task // Atualiza o estado de completado da tarefa
        );
        setTasks(updatedTasks); // Atualiza o estado das tarefas
    };

    // Função para lidar com a exclusão de uma tarefa
    const handleDeleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index); // Filtra a tarefa a ser excluída
        setTasks(updatedTasks); // Atualiza o estado das tarefas
        setExpandedTaskIndex(null); // Fecha a tarefa expandida, se estiver aberta
    };

    // Função para obter a classe CSS da tarefa com base no seu estado
    const getTaskClass = (task) => {
        if (task.completed) return "task-completed"; // Classe para tarefa completada
        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`); // Converte data e hora da tarefa para objeto Date
        const now = new Date(); // Objeto Date com a data e hora atuais
        const tenMinutes = 10 * 60 * 1000; // Dez minutos em milissegundos

        if (dueDateTime < now) return "task-overdue"; // Classe para tarefa atrasada
        if (dueDateTime - now < tenMinutes) return "task-near"; // Classe para tarefa próxima do prazo

        return ""; // Sem classe específica
    };

    // Função para alternar a expansão da tarefa
    const toggleExpandTask = (index) => {
        setExpandedTaskIndex(expandedTaskIndex === index ? null : index); // Alterna o índice da tarefa expandida
    };

    // Ordenar tarefas: pendentes primeiro, seguidas pelas próximas a finalizar
    const sortedTasks = tasks.sort((a, b) => {
        const now = new Date(); // Data e hora atuais
        const aDateTime = new Date(`${a.dueDate}T${a.dueTime}`); // Data e hora da tarefa a
        const bDateTime = new Date(`${b.dueDate}T${b.dueTime}`); // Data e hora da tarefa b
        if (a.completed !== b.completed) return a.completed ? 1 : -1; // Tarefas não completadas primeiro
        if (aDateTime < now && bDateTime >= now) return 1; // Tarefas atrasadas depois das não atrasadas
        if (aDateTime >= now && bDateTime < now) return -1; // Tarefas não atrasadas antes das atrasadas
        return aDateTime - bDateTime; // Ordena por data e hora
    });

    return (
        <div className="header"> {/* Div principal com a classe CSS "header" */}
            <button
                className={activeScreen === "inicio" ? "active" : ""} // Classe "active" se a tela ativa for "inicio"
                onClick={() => showScreen("inicio")} // Define tela ativa para "inicio" ao clicar
            >
                Início
            </button>
            <button
                className={activeScreen === "tarefas" ? "active" : ""} // Classe "active" se a tela ativa for "tarefas"
                onClick={() => showScreen("tarefas")} // Define tela ativa para "tarefas" ao clicar
            >
                Tarefas
            </button>
        </div>
    );
}

export default Header; // Exporta o componente Header como padrão
