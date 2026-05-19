const express = require('express');
const cors = require('cors');

const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-8349612901208870-051617-eda5ad193a6918638267d4f58bd1ea92-77180248'
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
app.get('/', (req, res) => {
  res.send('Backend online');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
