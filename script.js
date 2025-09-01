// Importando Firebase
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";

import { 
  getFirestore, collection, doc, deleteDoc, updateDoc, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Configuração do Firebase
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

// Referência da coleção "agenda"
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

    // Cria item da lista
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    // Texto com nome + data
    const taskText = document.createElement("span");
    taskText.textContent = `${task.nome} - ${task.data}`;
    if (task.concluido) {
      taskText.style.textDecoration = "line-through";
      taskText.style.color = "gray";
    }

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.concluido;
    checkbox.classList.add("form-check-input", "me-2");
    checkbox.addEventListener("change", async () => {
      await updateDoc(doc(db, "agenda", taskId), { concluido: checkbox.checked });
      listTasks();
    });

    // Botões Editar e Excluir em row
    const btnRow = document.createElement("div");
    btnRow.classList.add("d-flex", "gap-1");

    // Botão Editar com ícone
    const btnEdit = document.createElement("button");
    btnEdit.classList.add("btn", "btn-sm", "btn-warning");
    btnEdit.innerHTML = '<i class="bi bi-pencil-square"></i>';
    btnEdit.title = "Editar";
    btnEdit.addEventListener("click", async () => {
      const newNome = prompt("Edite o nome do compromisso:", task.nome);
      if (!newNome) return;
      const newData = prompt("Edite a data do compromisso:", task.data);
      if (!newData) return;

      await updateDoc(doc(db, "agenda", taskId), { nome: newNome, data: newData });
      listTasks();
    });

    // Botão Excluir com ícone
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

    // Montagem do item
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("d-flex", "align-items-center");
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

  await addDoc(agendaRef, {
    nome,
    data,
    concluido: false
  });

  alert("Compromisso adicionado com sucesso!");
  listTasks();
}

// =============================
// Inicialização
// =============================
document.getElementById("btnAddTask").addEventListener("click", addTask);
listTasks();
