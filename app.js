const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
require('dotenv').config();

const mongoose = require('mongoose');
const Food = require('./model/food');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err)
);

const router = express.Router();
app.use('/api/foods', router);

router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', getFood, (req, res) => {
  res.json(res.food);
});

router.post('/', async (req, res) => {
    const food = new Food({
      id: req.body.id,
      name: req.body.name,
      category: req.body.category,
      quantity: req.body.quantity,
      expirationDate: req.body.expirationDate,
      price: req.body.price
    });
    try {
      const newFood = await food.save();
      res.status(201).json(newFood);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

router.put('/:id', getFood, async (req, res) => {
  if (req.body.name != null) {
    res.food.name = req.body.name;
  }
  if (req.body.category != null) {
    res.food.category = req.body.category;
  }
  if (req.body.quantity != null) {
    res.food.quantity = req.body.quantity;
  }
  if (req.body.expirationDate != null) {
    res.food.expirationDate = req.body.expirationDate;
  }
  if (req.body.price != null) {
    res.food.price = req.body.price;
  }
  try {
    const updatedFood = await res.food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getFood, async (req, res) => {
    try {
      await Food.deleteOne({ _id: res.food._id });
      res.json({ message: 'Alimento removido' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
async function getFood(req, res, next) {
    let food;
    try {
      food = await Food.findById(req.params.id);
      if (food == null) {
        return res.status(404).json({ message: 'Alimento não encontrado' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.food = food;
    next();
  }

module.exports = router;

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erro');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
