const ProductModule = require('../models/Product');
const { 
  Product, 
  SHOE_CATEGORIES, 
  SHOE_BRANDS, 
  COMMON_SIZES, 
  COMMON_COLORS, 
  GENDER_OPTIONS 
} = ProductModule;
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

exports.getEnumValues = async (req, res) => {
  try {
    res.status(200).json({
      message: "Enum values fetched successfully",
      data: {
        categories: SHOE_CATEGORIES,
        brands: SHOE_BRANDS,
        sizes: COMMON_SIZES,
        colors: COMMON_COLORS,
        genders: GENDER_OPTIONS
      }
    });
  } catch (err) {
    console.error("Error in getEnumValues:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
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

    // Validate category against enum
    if (!Object.values(SHOE_CATEGORIES).includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // Validate brand against enum
    if (!Object.values(SHOE_BRANDS).includes(brand)) {
      return res.status(400).json({ error: "Invalid brand" });
    }

    // Validate gender against enum
    if (!GENDER_OPTIONS.includes(gender)) {
      return res.status(400).json({ error: "Invalid gender" });
    }

    // Parse and validate size
    const sizeArray = Array.isArray(size) ? size : [size];
    if (!sizeArray.every(s => COMMON_SIZES.includes(s))) {
      return res.status(400).json({ error: "Invalid size" });
    }

    // Parse and validate color
    const colorArray = Array.isArray(color) ? color : [color];
    if (!colorArray.every(c => COMMON_COLORS.includes(c))) {
      return res.status(400).json({ error: "Invalid color" });
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
      size: sizeArray,
      color: colorArray,
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

    // Validate category if provided
    if (category && !Object.values(SHOE_CATEGORIES).includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // Validate brand if provided
    if (brand && !Object.values(SHOE_BRANDS).includes(brand)) {
      return res.status(400).json({ error: "Invalid brand" });
    }

    // Validate gender if provided
    if (gender && !GENDER_OPTIONS.includes(gender)) {
      return res.status(400).json({ error: "Invalid gender" });
    }

    // Validate size if provided
    const sizeArray = size ? (Array.isArray(size) ? size : [size]) : null;
    if (sizeArray && !sizeArray.every(s => COMMON_SIZES.includes(s))) {
      return res.status(400).json({ error: "Invalid size" });
    }

    // Validate color if provided
    const colorArray = color ? (Array.isArray(color) ? color : [color]) : null;
    if (colorArray && !colorArray.every(c => COMMON_COLORS.includes(c))) {
      return res.status(400).json({ error: "Invalid color" });
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
    if (sizeArray) product.size = sizeArray;
    if (colorArray) product.color = colorArray;
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
    
    // Filters - validate all inputs
    if (category) {
      if (!Object.values(SHOE_CATEGORIES).includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }
      searchCriteria.category = category;
    }
    
    if (brand) {
      if (!Object.values(SHOE_BRANDS).includes(brand)) {
        return res.status(400).json({ error: "Invalid brand" });
      }
      searchCriteria.brand = brand;
    }
    
    if (gender) {
      if (!GENDER_OPTIONS.includes(gender)) {
        return res.status(400).json({ error: "Invalid gender" });
      }
      searchCriteria.gender = gender;
    }
    
    if (size) {
      if (!COMMON_SIZES.includes(size)) {
        return res.status(400).json({ error: "Invalid size" });
      }
      searchCriteria.size = size;
    }
    
    if (color) {
      if (!COMMON_COLORS.map(c => c.toLowerCase()).includes(color.toLowerCase())) {
        return res.status(400).json({ error: "Invalid color" });
      }
      searchCriteria.color = { $regex: new RegExp(color, 'i') };
    }
    
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

// Add a new method to update stock
exports.updateProductStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  try {
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    try {
      await product.updateStock(quantity);
      
      res.status(200).json({
        message: 'Product stock updated successfully',
        product,
      });
    } catch (stockError) {
      return res.status(400).json({ error: stockError.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};