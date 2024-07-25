import { useState, useEffect } from "react"; // Importa hooks useState e useEffect do React
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importa o componente FontAwesomeIcon
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa o ícone faTrash
import './home.css'; // Importa o arquivo de estilos CSS

// Define o componente Home
function Home() {
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
        <div>
            <div className="container"> {/* Div principal com a classe CSS "container" */}
                {activeScreen === "inicio" && (
                    <div className="card active"> {/* Div com a classe CSS "card active" se a tela ativa for "inicio" */}
                        <h1>Início</h1> {/* Título da tela "Início" */}
                    </div>
                )}
                {activeScreen === "tarefas" && (
                    <div className="card active"> {/* Div com a classe CSS "card active" se a tela ativa for "tarefas" */}
                        <h1>Tarefas</h1> {/* Título da tela "Tarefas" */}
                        {sortedTasks.map((task, index) => ( // Mapeia as tarefas ordenadas e renderiza cada uma
                            <div key={index} className={`task ${getTaskClass(task)}`}> {/* Div para cada tarefa com a classe CSS obtida */}
                                <div className="task-header"> {/* Div para o cabeçalho da tarefa */}
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleCheckboxChange(index)} // Altera o estado do checkbox ao mudar
                                    />
                                    <span className={task.completed ? "task-name completed" : "task-name"}> {/* Span para o nome da tarefa */}
                                        {task.name}
                                    </span>
                                    <button onClick={() => toggleExpandTask(index)}> {/* Botão para expandir ou esconder os detalhes da tarefa */}
                                        {expandedTaskIndex === index ? "Esconder" : "Detalhar"}
                                    </button>
                                </div>
                                {expandedTaskIndex === index && ( // Renderiza detalhes da tarefa se estiver expandida
                                    <div className="task-details"> {/* Div para os detalhes da tarefa */}
                                        <span className="task-date"> {/* Span para a data e hora da tarefa */}
                                            {task.dueDate} {task.dueTime}
                                        </span>
                                        <p className="task-desc">{task.description}</p> {/* Parágrafo para a descrição da tarefa */}
                                        <button className="delete-button" onClick={() => handleDeleteTask(index)}> {/* Botão para excluir a tarefa */}
                                            <FontAwesomeIcon icon={faTrash} className="icon" /> {/* Ícone de lixeira */}
                                            Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="floating-button" onClick={toggleForm}></div> {/* Botão flutuante para mostrar ou esconder o formulário */}
            {isFormVisible && ( // Renderiza o formulário se estiver visível
                <div className="form-overlay"> {/* Div para a sobreposição do formulário */}
                    <div className="form-container"> {/* Div para o contêiner do formulário */}
                        <h2>Cadastrar Tarefa</h2> {/* Título do formulário */}
                        <form onSubmit={handleSubmit}> {/* Formulário para cadastrar tarefa */}
                            <div>
                                <label>Nome da Tarefa</label> {/* Rótulo para o campo "Nome da Tarefa" */}
                                <input type="text" name="task" required /> {/* Campo de entrada para o nome da tarefa */}
                            </div>
                            <div>
                                <label>Data de Conclusão</label> {/* Rótulo para o campo "Data de Conclusão" */}
                                <input type="date" name="dueDate" required /> {/* Campo de entrada para a data de conclusão */}
                            </div>
                            <div>
                                <label>Hora de Conclusão</label> {/* Rótulo para o campo "Hora de Conclusão" */}
                                <input type="time" name="dueTime" required /> {/* Campo de entrada para a hora de conclusão */}
                            </div>
                            <div>
                                <label>Descrição</label> {/* Rótulo para o campo "Descrição" */}
                                <textarea name="description" required></textarea> {/* Área de texto para a descrição */}
                            </div>
                            <div>
                                <div>
                                    <button type="submit">Salvar</button> {/* Botão para enviar o formulário */}
                                    <button type="button" onClick={toggleForm} className="cancel-button"> {/* Botão para cancelar e esconder o formulário */}
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home; // Exporta o componente Home como padrão
