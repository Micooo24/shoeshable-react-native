const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify');

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
  // category: {
  //   type: ObjectId,
  //   ref: 'Category',  // Refers to the Category model
  //   required: true,
  // },
  // brand: {
  //   type: ObjectId,
  //   ref: 'Brand',  // Refers to the Brand model
  //   required: true,
  // }
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Add a method to update the stock
productSchema.methods.updateStock = async function (quantity) {
  this.stock = this.stock - quantity;
  await this.save();
};

module.exports = mongoose.model('Product', productSchema);