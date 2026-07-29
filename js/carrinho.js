/*
Objetivo 1 - Quando clicar no botão "Adicionar ao Carrinho", devemos atualizar o contador, adicionar o produto ao LocalStorage e atualizar o HTML do carrinho.
    Parte 1 - Adicionar +1 ao ícone do carrinho.
        Passo 1 - Pegar os botões "Adicionar ao Carrinho" do HTML.
        Passo 2 - Adicionar um evento de escuta nesses botões para que, ao clicar, uma ação seja executada.
        Passo 3 - Pegar as informações do produto clicado e adicioná-las ao LocalStorage.
        Passo 4 - Atualizar o contador do carrinho de compras.
        Passo 5 - Renderizar a tabela do carrinho de compras.

Objetivo 2 - Remover produtos do carrinho.
    Passo 1 - Pegar o botão de excluir do HTML.
    Passo 2 - Adicionar um evento de escuta nesse botão.
    Passo 3 - Remover o produto do LocalStorage.
    Passo 4 - Atualizar o HTML do carrinho removendo o produto.
    Passo 5 - Atualizar o valor total do carrinho.

Objetivo 3 - Atualizar os valores do carrinho.
    Passo 1 - Pegar o input de quantidade do carrinho.
    Passo 2 - Adicionar um evento de escuta nesse input.
    Passo 3 - Atualizar o valor total do produto.
    Passo 4 - Atualizar o valor total do carrinho.
*/

// Objetivo 1 - Quando clicar no botão "Adicionar ao Carrinho", devemos atualizar o contador, adicionar o produto ao LocalStorage e atualizar o HTML do carrinho
//     Parte 1 - Adicionar +1 ao ícone do carrinho.
//         Passo 1 - Pegar os botões "Adicionar ao Carrinho" do HTML.

const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');


// Passo 2 - Adicionar um evento de escuta nesses botões para que, ao clicar, uma ação seja executada.
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener("click", (evento) => {
        //Passo 3 - Pegar as informações do produto clicado e adicioná-las ao LocalStorage.
        const elementoProduto = evento.target.closest(".produto");
        const produtoId = elementoProduto.getAttribute("data-id");
        const produtoNome = elementoProduto.querySelector(".nome").textContent;
        const produtoImagem = elementoProduto.querySelector("img").getAttribute("src");
        const produtoPreco = parseFloat(
            elementoProduto.querySelector(".preco").textContent.replace("R$", "").replace(",", ".").trim());

        //buscar a lista de produtos no localStorage
        const carrinho = obterProdutosDoCarrinho();
        //testar se o produto já existe no carrinho
        const produtoExiste = carrinho.find(produto => produto.id === produtoId);
        //se existe produto, incrementar a quantidade
        if (produtoExiste) {
            produtoExiste.quantidade += 1;
        } else {
            //se nao existe, adicionar o produto com quantidade 1
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
        atualizarContadorCarrinho();
        renderizarTabelaDoCarrinho();
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const Produtos = localStorage.getItem("carrinho");
    return Produtos ? JSON.parse(Produtos) : [];
};

// Passo 4 - Atualizar o contador do carrinho de compras.
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let Total = 0;

    produtos.forEach(produto => {
        Total += produto.quantidade;
    });

    document.getElementById("contador-carrinho").textContent = Total;
}

atualizarContadorCarrinho();

//Passo 5 - Renderizar a tabela do carrinho de compras
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("modal-1-content tbody");

    corpoTabela.innerHTML = ""; // Limpar tabela antes de renderizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-produto>
        <img
         src="${produto.imagem}"
         alt="${produto.nome}"
         />
         </td>
         <td>${produto.nome}</td>
         <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
         <td class="td-quantidade">
          <input type="number" value="${produto.quantidade}" min="1" />
         </td>
         <td class="td-preco-total">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
         <td><buttom class="btn-remover" data-id="${produto.id} id="deletar"></buttom></td>`;
        corpoTabela.appendChild(tr);
    });
}

renderizarTabelaDoCarrinho;