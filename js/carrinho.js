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
    Passo 2 - Adicionar um evento de escuta no tbody.
    Passo 3 - Remover o produto do LocalStorage.
    Passo 4 - Atualizar o HTML do carrinho removendo o produto.
    Passo 5 - Atualizar o valor total do carrinho.

Objetivo 3 - Atualizar os valores do carrinho.
    Passo 1 - adicionar evento de escuta no input do tbody.
    Passo 2 - Atualizar o valor total do produto.
    Passo 3 - Atualizar o valor total do carrinho.
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
        atualizarCarrinhoETabela();
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


//Passo 5 - Renderizar a tabela do carrinho de compras
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector("#modal-1-content tbody");

    corpoTabela.innerHTML = ""; // Limpar tabela antes de renderizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="td-produto">
        <img
         src="${produto.imagem}"
         alt="${produto.nome}"
         />
         </td>
         <td>${produto.nome}</td>
         <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
         <td class="td-quantidade">
          <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1" />
         </td>
         <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
         <td><button class="btn-remover" data-id="${produto.id}" Remover></button></td>`;
        corpoTabela.appendChild(tr);
    });
}

// Objetivo 2 - Remover produtos do carrinho.
//     Passo 1 - Pegar o botão de excluir do HTML.
const corpoTabela = document.querySelector("#modal-1-content table tbody");

//passo 2 -adicionar evento de escuta no tbody
corpoTabela.addEventListener("click", evento => {

    if (evento.target.classList.contains("btn-remover")) {
        const id = evento.target.dataset.id;
        //passo 3 - remover o produto do localStorage
        removerProdutoDoCarrinho(id);
    }

});

// Passo 1 - adicionar evento de escuta no input do tbody.
corpoTabela.addEventListener("input", evento => {
    //  Passo 2 - Atualizar o valor total do produto.
    if (evento.target.classList.contains("input-quantidade")) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto) {
            produto.quantidade = novaQuantidade;
        }
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
});

//  Passo 4 - Atualizar o HTML do carrinho removendo o produto.
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();

    //filtrar os produtos que nao tem o id passado por parametro
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);

    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}
// Passo 3 - Atualizar o valor total do carrinho.
function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    document.querySelector("#total-carrinho").textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
}

function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalCarrinho();
}

atualizarCarrinhoETabela();
