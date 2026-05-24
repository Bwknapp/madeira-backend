const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const { createClient } =
  require('@supabase/supabase-js');

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================
   MERCADO PAGO
========================================= */

mercadopago.configure({
  access_token:
    'APP_USR-1771978546796941-051617-38ba5e0efe6897805c17f8ea1d731a1c-3407518652'
});

/* =========================================
   SUPABASE
========================================= */

const supabase = createClient(
  'https://xyekjiwxhlptjwdfslbi.supabase.co',
  'sb_publishable_H5NDENC2f2MnNfW1Xm9H3Q_diGGKXH_'
);

/* =========================================
   CRIAR PAGAMENTO
========================================= */

app.post('/create_preference', async (req, res) => {

  try {

    const {
      items,
      cliente
    } = req.body;

    /* =====================================
       SALVAR PEDIDO
    ===================================== */

    const { error } =
      await supabase
        .from('pedidos')
        .insert([
          {
            nome: cliente.nome,
            telefone: cliente.telefone,
            endereco: cliente.endereco,
            cidade: cliente.cidade,
            cep: cliente.cep,
            items: items
          }
        ]);

    if (error) {

      console.log(
        'Erro Supabase:',
        error
      );

    }

    /* =====================================
       MERCADO PAGO
    ===================================== */

    const preference = {
      items: items
    };

    const response =
      await mercadopago.preferences.create(
        preference
      );

    res.json({
      init_point:
        response.body.init_point
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        'Erro ao criar pagamento'
    });

  }

});

/* =========================================
   TESTE
========================================= */

app.get('/', (req, res) => {

  res.send('Backend online');

});

/* =========================================
   SERVIDOR
========================================= */

app.listen(3000, () => {

  console.log('Servidor rodando');

});
