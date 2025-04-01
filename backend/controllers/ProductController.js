// Handle different possible export structures
const ProductModule = require('../models/Products');
const Product = ProductModule.Product; // If exported as { Product }
const SHOE_CATEGORIES = ProductModule.SHOE_CATEGORIES;
const SHOE_BRANDS = ProductModule.SHOE_BRANDS;
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.getAllProducts = async (req, res) => {
  try {
    // Debug log to check what Product is
    console.log("Product model type:", typeof Product);
    console.log("Product model:", Product);
    
    // Check if Product is available and has find method
    if (!Product) {
      return res.status(500).json({ error: "Product model not found" });
    }
    
    // Try to access the model directly if Product is an object with a model property
    const ProductModel = typeof Product.model === 'function' ? Product.model('Product') : Product;
    
    const products = await ProductModel.find({});
    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (err) {
    console.error("Error in getAllProducts:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      stock, 
      category, 
      brand, 
      size, 
      color, 
      gender, 
      material, 
    } = req.body;

    // Check required fields
    if (!name || !description || !price || !stock || !category || !brand || !size || !color || !gender) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Validate category and brand against enums
    if (!Object.values(SHOE_CATEGORIES).includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    if (!Object.values(SHOE_BRANDS).includes(brand)) {
      return res.status(400).json({ error: "Invalid brand" });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
          width: 150,
          crop: "scale",
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image: imageUrls,
      category,
      brand,
      size: Array.isArray(size) ? size : [size],
      color: Array.isArray(color) ? color : [color],
      gender,
      material,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    description, 
    price, 
    stock, 
    category, 
    brand, 
    size, 
    color, 
    gender, 
    material, 
  } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Validate category and brand if provided
    if (category && !Object.values(SHOE_CATEGORIES).includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    if (brand && !Object.values(SHOE_BRANDS).includes(brand)) {
      return res.status(400).json({ error: "Invalid brand" });
    }

    let updatedImageUrls = [];

    if (req.files && req.files.length > 0) {
      if (product.image && product.image.length > 0) {
        for (const imageUrl of product.image) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
          width: 150,
          crop: "scale",
        });
        updatedImageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    } else {
      updatedImageUrls = product.image;
    }

    // Update product fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (size) product.size = Array.isArray(size) ? size : [size];
    if (color) product.color = Array.isArray(color) ? color : [color];
    if (gender) product.gender = gender;
    if (material !== undefined) product.material = material;
    
    product.image = updatedImageUrls;

    await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(400).json({ error: 'Delete error: product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Additional filter functions

exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!Object.values(SHOE_CATEGORIES).includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }
    
    const products = await Product.find({ category });
    
    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    
    if (!Object.values(SHOE_BRANDS).includes(brand)) {
      return res.status(400).json({ error: "Invalid brand" });
    }
    
    const products = await Product.find({ brand });
    
    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { 
      query, 
      category, 
      brand, 
      gender, 
      minPrice, 
      maxPrice, 
      size, 
      color, 
    } = req.query;

    const searchCriteria = {};
    
    // Text search
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Filters
    if (category) searchCriteria.category = category;
    if (brand) searchCriteria.brand = brand;
    if (gender) searchCriteria.gender = gender;
    if (size) searchCriteria.size = size;
    if (color) searchCriteria.color = { $regex: color, $options: 'i' };

    
    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      searchCriteria.price = {};
      if (minPrice !== undefined) searchCriteria.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) searchCriteria.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(searchCriteria);
    
    res.status(200).json({
      message: "Products fetched successfully",
      count: products.length,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};