import mongoose from 'mongoose';

// New Product Model
const productDetailsSchema = new mongoose.Schema({
  ref: {
    type: String,
    required: true,
    unique: true
  },
  prix_ttc: {
    type: Number,
    required: true
  }
});

export const ProductDetails = mongoose.model('ProductDetails', productDetailsSchema);
