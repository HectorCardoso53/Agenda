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
const agendaRef = collection(db, "agenda");

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

    // Item da lista
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start", "mb-2", "shadow-sm");

    // Texto
    const taskText = document.createElement("div");
    taskText.innerHTML = `
      <div>
        <strong>${task.diaSemana || "Dia não informado"}</strong> - ${task.nome} - 
        <span style="color:#d30f7e;">${task.horarioSaida || ""}</span>
      </div>
      <small class="text-muted">
        📅 ${task.data || ""} | 🚏 Saída: ${task.localSaida || ""} às ${task.horarioSaida || ""} | 🎯 Destino: ${task.destino || ""}
      </small>
    `;

    if (task.concluido) {
      taskText.style.textDecoration = "line-through";
      taskText.style.color = "gray";
    }

    // Checkbox concluído
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.concluido;
    checkbox.classList.add("form-check-input", "me-2");
    checkbox.addEventListener("change", async () => {
      await updateDoc(doc(db, "agenda", taskId), { concluido: checkbox.checked });
      listTasks();
    });

    // Botões editar/excluir
    const btnRow = document.createElement("div");
    btnRow.classList.add("d-flex", "gap-1");

    // Editar
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btn", "btn-sm", "btn-warning");
    btnEdit.innerHTML = '<i class="bi bi-pencil-square"></i>';
    btnEdit.title = "Editar";
    btnEdit.addEventListener("click", async () => {
      const newDiaSemana = prompt("Dia da Semana:", task.diaSemana) ?? task.diaSemana;
      const newNome = prompt("Nome do compromisso:", task.nome) ?? task.nome;
      const newData = prompt("Data:", task.data) ?? task.data;
      const newHorario = prompt("Horário de saída:", task.horarioSaida || "") ?? task.horarioSaida;
      const newLocal = prompt("Local de saída:", task.localSaida || "") ?? task.localSaida;
      const newDestino = prompt("Destino:", task.destino || "") ?? task.destino;

      await updateDoc(doc(db, "agenda", taskId), { 
        diaSemana: newDiaSemana,
        nome: newNome, 
        data: newData,
        horarioSaida: newHorario,
        localSaida: newLocal,
        destino: newDestino
      });
      listTasks();
    });

    // Excluir
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

    // Montagem final
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
// Adicionar Compromisso
// =============================
async function addTask() {
  const diaSemana = prompt("Dia da Semana:");
  if (!diaSemana) return;

  const nome = prompt("Nome do compromisso:");
  if (!nome) return;

  const data = prompt("Data (ex: 06/09/2026):");
  if (!data) return;

  const horarioSaida = prompt("Horário de saída (ex: 6h):") || "";
  const localSaida = prompt("Local de saída:") || "";
  const destino = prompt("Destino:") || "";

  await addDoc(agendaRef, {
    diaSemana,
    nome,
    data,
    concluido: false,
    horarioSaida,
    localSaida,
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
