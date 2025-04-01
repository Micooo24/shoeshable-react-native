const mongoose = require('mongoose');
const slugify = require('slugify');

// Define enums for shoe categories
const SHOE_CATEGORIES = {
  ATHLETIC: 'athletic',
  RUNNING: 'running',
  BASKETBALL: 'basketball',
  CASUAL: 'casual',
  FORMAL: 'formal',
  BOOTS: 'boots',
  SANDALS: 'sandals',
  SNEAKERS: 'sneakers',
  HIKING: 'hiking',
  WALKING: 'walking',
  TRAINING: 'training',
  SOCCER: 'soccer',
  SKATEBOARDING: 'skateboarding',
  TENNIS: 'tennis',
  SLIP_ONS: 'slip-ons'
};

// Define enums for shoe brands
const SHOE_BRANDS = {
  NIKE: 'nike',
  ADIDAS: 'adidas',
  PUMA: 'puma',
  REEBOK: 'reebok',
  NEW_BALANCE: 'new-balance',
  ASICS: 'asics',
  CONVERSE: 'converse',
  VANS: 'vans',
  UNDER_ARMOUR: 'under-armour',
  JORDAN: 'jordan',
  TIMBERLAND: 'timberland',
  SKECHERS: 'skechers',
  FILA: 'fila',
  BROOKS: 'brooks',
  CROCS: 'crocs',
  CLARKS: 'clarks',
  BIRKENSTOCK: 'birkenstock',
  HOKA: 'hoka',
  ON_RUNNING: 'on-running',
  SALOMON: 'salomon'
};

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  image: [String],
  category: {
    type: String,
    required: true,
    enum: Object.values(SHOE_CATEGORIES)
  },
  brand: {
    type: String,
    required: true,
    enum: Object.values(SHOE_BRANDS)
  },
  // Additional shoe-specific fields
  size: {
    type: [String], // Array of available sizes
    required: true
  },
  color: {
    type: [String], // Array of available colors
    required: true
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex', 'kids'],
    required: true
  },
  material: {
    type: String
  },
}, { timestamps: true });

productSchema.statics.SHOE_CATEGORIES = SHOE_CATEGORIES;
productSchema.statics.SHOE_BRANDS = SHOE_BRANDS;

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Add a method to update the stock
productSchema.methods.updateStock = async function (quantity) {
  this.stock = this.stock - quantity;
  await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = {
  Product,
  SHOE_CATEGORIES,
  SHOE_BRANDS
};