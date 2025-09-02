// =============================
// Importando Firebase
// =============================
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";

import { 
  getFirestore, collection, doc, deleteDoc, updateDoc, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// =============================
// Configuração do Firebase
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyA7jUMn4ip8aDy3xxyJysq1wJRGiIrjZIQ",
  authDomain: "agenda-78087.firebaseapp.com",
  projectId: "agenda-78087",
  storageBucket: "agenda-78087.firebasestorage.app",
  messagingSenderId: "929555741792",
  appId: "1:929555741792:web:66bd9aa8ac67cff6f29705"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const agendaRef = collection(db, "agenda"); // referência para a coleção "agenda"

// =============================
// Função: Listar Compromissos
// =============================
async function listTasks() {
  const querySnapshot = await getDocs(agendaRef);
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const taskId = docSnap.id;

    // Criar item da lista
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    // Texto (nome + dados extras)
    const taskText = document.createElement("span");
    taskText.innerHTML = `
      <strong>${task.nome}</strong><br>
      Data: ${task.data} <br>
      Saída: ${task.localSaida || "Não informado"} às ${task.horarioSaida || "Não informado"} <br>
      Destino: ${task.destino || "Não informado"}
    `;

    if (task.concluido) {
      taskText.style.textDecoration = "line-through";
      taskText.style.color = "gray";
    }

    // Checkbox de concluído
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.concluido;
    checkbox.classList.add("form-check-input", "me-2");
    checkbox.addEventListener("change", async () => {
      await updateDoc(doc(db, "agenda", taskId), { concluido: checkbox.checked });
      listTasks();
    });

    // Botões (editar/excluir)
    const btnRow = document.createElement("div");
    btnRow.classList.add("d-flex", "gap-1");

    // Botão Editar
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btn", "btn-sm", "btn-warning");
    btnEdit.innerHTML = '<i class="bi bi-pencil-square"></i>';
    btnEdit.title = "Editar";
    btnEdit.addEventListener("click", async () => {
      const newNome = prompt("Edite o nome do compromisso:", task.nome) ?? task.nome;
      const newData = prompt("Edite a data do compromisso:", task.data) ?? task.data;
      const newLocal = prompt("Edite o local de saída:", task.localSaida || "") ?? task.localSaida;
      const newHorario = prompt("Edite o horário de saída:", task.horarioSaida || "") ?? task.horarioSaida;
      const newDestino = prompt("Edite o destino:", task.destino || "") ?? task.destino;

      await updateDoc(doc(db, "agenda", taskId), { 
        nome: newNome, 
        data: newData,
        localSaida: newLocal,
        horarioSaida: newHorario,
        destino: newDestino
      });
      listTasks();
    });

    // Botão Excluir
    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btn", "btn-sm", "btn-danger");
    btnDelete.innerHTML = '<i class="bi bi-trash3-fill"></i>';
    btnDelete.title = "Excluir";
    btnDelete.addEventListener("click", async () => {
      if (confirm("Tem certeza que deseja excluir este compromisso?")) {
        await deleteDoc(doc(db, "agenda", taskId));
        listTasks();
      }
    });

    btnRow.appendChild(btnEdit);
    btnRow.appendChild(btnDelete);

    // Montagem final do item
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("d-flex", "align-items-start");
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(taskText);

    listItem.appendChild(leftDiv);
    listItem.appendChild(btnRow);

    taskList.appendChild(listItem);
  });
}

// =============================
// Função: Adicionar Compromisso
// =============================
async function addTask() {
  const nome = prompt("Digite o nome do compromisso:");
  if (!nome) return;

  const data = prompt("Digite a data do compromisso (ex: 09/10/2025):");
  if (!data) return;

  const localSaida = prompt("Digite o local de saída:") || "Não informado";
  const horarioSaida = prompt("Digite o horário de saída (ex: 07:30):") || "Não informado";
  const destino = prompt("Digite o destino:") || "Não informado";

  await addDoc(agendaRef, {
    nome,
    data,
    concluido: false,
    localSaida,
    horarioSaida,
    destino
  });

  alert("Compromisso adicionado com sucesso!");
  listTasks();
}

// =============================
// Inicialização
// =============================
document.getElementById("btnAddTask").addEventListener("click", addTask);
listTasks();
