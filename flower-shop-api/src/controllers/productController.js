import { Product } from "../models/Product.js"

const productsModel = new Product()

export const getAllProducts = async (req, res) => {
  try {
    const products = await productsModel.findAll();

    if (!products) {
      return res.status(404).send({ error: "Could not fetch products" });
    }
    res.send(products);
  } catch (error) {
    console.error("Error");
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await productsModel.findById(productId);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send(product);
  } catch (error) {
    console.error("Error");
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { title, stock, description, price } = req.body;
  console.log("createProduct is running")

  if (!title || !stock || !description || !price) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const newProduct = {
    title,
    stock,
    description,
    price,
  };

  console.log("createProduct is running", newProduct)

  try {
    const result = await productsModel.save(null, newProduct);
    console.log("createProduct is running", result)
    res.send({ message: "Product created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await productsModel.delete(productId);

    if (result.deletedCount === 0) {
      return res.status(400).send({ error: "Could not find product" });
    }
    res.send({ "Product deleted": result });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { price, description, stock, title} = req.body;


  try {
    const result = await productsModel.save(productId,{ price, description, stock, title});
    const product = await productsModel.findById(productId);

    if (typeof stock !== "number" || stock < 0) {
      return res
        .status(400)
        .send({ error: "Stock must be a non-negative number" });
    }

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send({ "Product updated": product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};