const mongoose = require('mongoose');
const slugify = require('slugify');

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

const GENDER_OPTIONS = ['men', 'women', 'unisex', 'kids'];

const COMMON_COLORS = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 
  'Brown', 'Gray', 'Purple', 'Pink', 'Orange', 'Beige', 
  'Tan', 'Navy', 'Teal', 'Gold', 'Silver', 'Multicolor'
];

const COMMON_SIZES = [
  '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', 
  '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'
];

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
    index: true, // Explicit index for performance
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
  size: {
    type: [String], 
    required: true,
    enum: COMMON_SIZES 
  },
  color: {
    type: [String],
    required: true,
    enum: COMMON_COLORS 
  },
  gender: {
    type: String,
    required: true,
    enum: Object.values(GENDER_OPTIONS)
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

productSchema.methods.updateStock = async function (quantity) {
  if (quantity > this.stock) {
    throw new Error('Not enough stock available');
  }
  this.stock = this.stock - quantity;
  await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = {
  Product,
  SHOE_CATEGORIES,
  SHOE_BRANDS,
  COMMON_SIZES,
  COMMON_COLORS,
  GENDER_OPTIONS
};