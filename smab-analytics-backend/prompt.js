based on the provided schema we wish to generate sample documents 
- give mongoshell command to generate the sample docs
- give only one doc to see the result if it meets my expectations


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
  warehouse: { // Eather: MED or MAG
    type: String, 
    required: true
  }
});

// Main order schema
const orderSchema = new mongoose.Schema({
  orderNumber: {// between 1000 and 2000
    type: String, 
    required: true,
    unique: true,
    index: true // Adding index for search
  },
  orderDate: { // iso date
    type: Date,
    required: true,
    set: function(value) {
      if (typeof value === 'string' && value.includes('/')) {
        const [day, month, year] = value.split('/');
        return new Date(`${year}-${month}-${day}`);
      }
      return value;
    }
  },
  paymentMethod: { // eather "Virement" or "Cash" or null
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
  updatedAt: { // iso date or null
    type: Date,
    default: null
  },
  salesAgent: { // Sales Agent4 or Sales Agent3 or Sales Agent1 or Sales Agent2
    type: String,
    default: null
  },
  customerName: String, // person or company name
  prixttc: String, // string number example "20000" not including any character or currency
  isConfirmed: { // eather true of false (mostly true)
    type: Boolean,
    default: false
  },
  notes: String // notes about the order, custumer wish about delivery or something, support information ... generally its note added by the sales agent | can be null
});

example of a sample doc:
{
  "_id": {
    "$oid": "68adcc2ed7af387852c60ad4"
  },
  "orderNumber": "1446",
  "orderDate": {
    "$date": "2025-08-06T00:00:00.000Z"
  },
  "paymentMethod": null,
  "products": [
    {
      "name": "Etiqueteuse automatique pour bouteilles cylindriques",
      "quantity": 1,
      "barcode": "000.000.926",
      "warehouse": "MED",
      "_id": {
        "$oid": "68add65606815dd895551a76"
      }
    },
    {
      "name": "Rouleau de papier filtrant pour ensacheuse de thé",
      "quantity": 1,
      "barcode": "000.000.1063",
      "warehouse": "MAG",
      "_id": {
        "$oid": "68add64a06815dd895551a65"
      }
    },
    {
      "name": "Rouleau des tags pour ensacheuse de thé L40",
      "quantity": 1,
      "barcode": "000.000.1224",
      "warehouse": "MAG",
      "_id": {
        "$oid": "68add64a06815dd895551a66"
      }
    },
    {
      "name": "Ensacheuse verticale a vis pour produits poudreux 100-1000g",
      "quantity": 1,
      "barcode": "000.000.1252",
      "warehouse": "MAG",
      "_id": {
        "$oid": "68add64a06815dd895551a67"
      }
    },
    {
      "name": "Fil en Coton pour ensacheuse de thé",
      "quantity": 1,
      "barcode": "000.000.1223",
      "warehouse": "MAG",
      "_id": {
        "$oid": "68add64a06815dd895551a68"
      }
    }
  ],
  "updatedAt": {
    "$date": "2025-08-26T15:44:22.368Z"
  },
  "salesAgent": "Sales Agent3",
  "customerName": "ANIR PRO STE",
  "prixttc": null,
  "isConfirmed": false,
  "__v": 0
}