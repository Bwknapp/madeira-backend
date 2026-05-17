const express = require('express');
const cors = require('cors');

const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-1771978546796941-051617-38ba5e0efe6897805c17f8ea1d731a1c-3407518652'
});

app.post('/create_preference', async (req, res) => {

  try {

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: req.body.items
      }
    });

    res.json({
      init_point: response.init_point
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Erro ao criar pagamento'
    });

  }

});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
