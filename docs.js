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

// Inicializar
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Categoria ativa
let categoriaAtual = "requerimentos";

// Mostrar documentos de uma categoria
function showDocs(categoria) {
  categoriaAtual = categoria;
  carregarDocumentos(categoria);
}

// Adicionar documento
document.getElementById("btnAddDoc").addEventListener("click", () => {
  const titulo = prompt("Digite o título do documento:");
  if (!titulo) return;

  db.collection("documentos")
    .doc(categoriaAtual)
    .collection("itens")
    .add({
      titulo: titulo,
      atendido: false,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      carregarDocumentos(categoriaAtual);
    })
    .catch((err) => console.error("Erro ao adicionar documento:", err));
});

// Carregar documentos
function carregarDocumentos(categoria) {
  const lista = document.getElementById("docList");
  lista.innerHTML = "";

  db.collection("documentos")
    .doc(categoria)
    .collection("itens")
    .orderBy("criadoEm", "desc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        // Checkbox + título
        const label = document.createElement("label");
        label.className = "form-check-label d-flex align-items-center";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input me-2";
        checkbox.checked = data.atendido;
        checkbox.addEventListener("change", () => {
          db.collection("documentos")
            .doc(categoria)
            .collection("itens")
            .doc(docSnap.id)
            .update({ atendido: checkbox.checked });
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(data.titulo));

        // Botões lado a lado
        const btnGroup = document.createElement("div");
        btnGroup.className = "d-flex gap-1";

        // Botão editar
        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-sm btn-warning";
        btnEdit.innerHTML = '<i class="bi bi-pencil-square"></i>';
        btnEdit.addEventListener("click", () => {
          const novoTitulo = prompt("Edite o título do documento:", data.titulo);
          if (!novoTitulo) return;
          db.collection("documentos")
            .doc(categoria)
            .collection("itens")
            .doc(docSnap.id)
            .update({ titulo: novoTitulo })
            .then(() => carregarDocumentos(categoria));
        });

        // Botão excluir
        const btnDelete = document.createElement("button");
        btnDelete.className = "btn btn-sm btn-danger";
        btnDelete.innerHTML = '<i class="bi bi-trash3-fill"></i>';
        btnDelete.addEventListener("click", () => {
          if (confirm("Deseja excluir este documento?")) {
            db.collection("documentos")
              .doc(categoria)
              .collection("itens")
              .doc(docSnap.id)
              .delete()
              .then(() => carregarDocumentos(categoria));
          }
        });

        // Adiciona os botões ao grupo
        btnGroup.appendChild(btnEdit);
        btnGroup.appendChild(btnDelete);

        li.appendChild(label);
        li.appendChild(btnGroup); // agora label + botões lado a lado
        lista.appendChild(li);
      });
    });
}

// Carregar a primeira categoria automaticamente
carregarDocumentos(categoriaAtual);
