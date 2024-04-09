const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    expirationDate: {
      type: Date,
    
    },
    price: {
      type: Number,
      required: true
    }
  });
  

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
