const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { createClient } = require('@supabase/supabase-js');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-1771978546796941-051617-38ba5e0efe6897805c17f8ea1d731a1c-3407518652'
});

// Supabase
const supabase = createClient(
  'https://xyekjiwxhlptjwdfslbi.supabase.co',
  'sb_secret_4v3XvA9qlznbCc3_GJjK3Q_wclhgUnR'
);

app.post('/create_preference', async (req, res) => {
  try {
    const { items, cliente } = req.body;

    if (!items || !cliente) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Salvar no Supabase
    await supabase.from('pedidos').insert([{
      nome: cliente.nome,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      cep: cliente.cep,
      items: items,
      status: 'pendente',
      created_at: new Date().toISOString()
    }]);

    // Mercado Pago
    const preference = new Preference(client);
    
    const response = await preference.create({
      body: {
        items: items,
        back_urls: {
          success: "https://madeiradeart.vercel.app",
          failure: "https://madeiradeart.vercel.app",
          pending: "https://madeiradeart.vercel.app"
        },
        auto_return: "approved",
      }
    });

    res.json({ init_point: response.init_point });

  } catch (error) {
    console.error('Erro completo:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => res.send('Backend online'));

app.listen(3000, () => console.log('Servidor rodando'));
