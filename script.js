let carrinho = [];

/* =========================================
   ADICIONAR PRODUTOS MANUALMENTE
========================================= */

function adicionarCarrinho(nome, preco) {

  carrinho.push({
    nome,
    preco
  });

  atualizarCarrinho();

  alert(nome + ' adicionado ao carrinho!');

}

/* =========================================
   ATUALIZAR CONTADOR
========================================= */

function atualizarCarrinho() {

  document.getElementById('cart-count').innerText =
    carrinho.length;

}

/* =========================================
   ABRIR CARRINHO
========================================= */

function abrirCarrinho() {

  const modal =
    document.getElementById('cart-modal');

  const items =
    document.getElementById('cart-items');

  const total =
    document.getElementById('cart-total');

  items.innerHTML = '';

  let valorTotal = 0;

  carrinho.forEach(produto => {

    valorTotal += produto.preco;

    items.innerHTML += `

      <p style="
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
      ">

        ${produto.nome}
        -
        R$ ${produto.preco}

      </p>

    `;

  });

  total.innerText = valorTotal;

  modal.style.display = 'flex';

}

/* =========================================
   FECHAR CARRINHO
========================================= */

function fecharCarrinho() {

  document.getElementById('cart-modal')
    .style.display = 'none';

}

/* =========================================
   FINALIZAR COMPRA
========================================= */

async function finalizarCompra() {

  if (carrinho.length === 0) {

    alert('Carrinho vazio');
    return;

  }

  const items = carrinho.map(produto => ({
    title: produto.nome,
    quantity: 1,
    unit_price: Number(produto.preco),
    currency_id: 'BRL'
  }));

  try {

    const response = await fetch(
      'https://madeira-backend.vercel.app/create_preference',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
      }
    );

    const data = await response.json();

    if (data.init_point) {

      window.location.href = data.init_point;

    } else {

      alert('Erro ao criar pagamento');

    }

  } catch (error) {

    console.log(error);

    alert('Erro conectando backend');

  }

}
