import mongoose from 'mongoose';


// Product sub-schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  barcode: {
    type: String,
    required: true
  },
  warehouse: {
    type: String,
    required: true
  }
});

// Main order schema
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true // Adding index for search
  },
  orderDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    default: ''
  },
  products: {
    type: [productSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Products array cannot be empty'
    }
  },
  updatedAt: {
    type: Date,
    default: null
  },
  salesAgent: {
    type: String,
    default: null
  },
  isConfirmed: {
    type: Boolean,
    default: false
  }
});

// Create index on orderNumber for search
orderSchema.index({ orderNumber: 1 });

// Pre-save hook to convert orderDate string to Date object if needed
orderSchema.pre('save', function(next) {
  if (typeof this.orderDate === 'string') {
    const [day, month, year] = this.orderDate.split('/');
    this.orderDate = new Date(`${year}-${month}-${day}`);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
