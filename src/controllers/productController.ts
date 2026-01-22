import express, {Request, Response} from "express";
// import product model from productSchema in models folder
import { ProductModel } from "../models/productSchema";
import e from "express";
 
// finction to get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json({
        success: true,
        data: products
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error});
  }
};
 // get product based on id
 export const getProductById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const product = await ProductModel.findById({_id: id});
        res.status(200).json({
            success: true,
            data: product
        })
    } catch (error) {
        res.status (500).json(`Failed to fetch product with id: ${req.params.id}`);
    }
 }

// function to create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
    return res.status(400).json({ message: "Product image is required" });
  }

  // safely parse numeric fields from form-data
  const price = req.body.price ? parseFloat(req.body.price) : undefined;
  const stock = req.body.stock ? parseInt(req.body.stock, 10) : 0;
  
  // parse inStock: convert string "true"/"false" to boolean
  const inStockValue = String(req.body.inStock).toLowerCase().trim();
  const inStock = inStockValue === "true" || inStockValue === "1";

  if (!price || isNaN(price)) {
    return res.status(400).json({ message: "Valid price is required" });
  }

  const product = await ProductModel.create({
    name: req.body.name,
    category: req.body.category,
    price,
    description: req.body.description,
    imageUrl: `/uploads/${req.file.filename}`,
    inStock,
    stock,
  });

  res.status(201).json({
    message: "product created successful",
    data: product
  });
  } catch (error) {
    res.status(400).json({message: "failed to create product", error})
    console.log(`failed to create product because of this ${error}`)
  }
};


// function to update a product by id

export const updateProductById = async(req:Request, res: Response) =>{
    try {
        const {id} = req.params;
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {new: true});

        if(!updatedProduct){
            return res.status(404).json(`Product with id: ${req.params.id} not found`);
        }

        res.status(200).json({
            success: `update product with id: ${req.params.id} successfully`,
            data: updatedProduct
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json(`Failed to update product with id: ${req.params.id} and your error is: ${error}`);
    }
};

// function to delete a product by id
export const deleteProductById = async(req:Request, res: Response) =>{
    try {
        const {id} = req.params;
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        
        if(!deletedProduct){
            return res.status(404).json(`Product with id: ${req.params.id} not found`);
        }

        res.status(200).json({
            success: `Product with id: ${req.params.id} deleted successfully`,
            data: deletedProduct
        })
    } catch (error) {
        res.status(500).json(`Failed to delete product with id: ${req.params.id}`);
    }
}

// product statistics

export const getProductStats = async (req : Request, res : Response) => {
  const stats = await ProductModel.aggregate([
    {
      $group: {
        _id: "$category",
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    }
  ]);

  res.json(stats);
};

//dispaly top 10 expensive product
export const topProducts = async (req : Request, res: Response) => {
  const products = await ProductModel.find()
    .sort({ price: -1 })
    .limit(10);

  res.json(products);
};

// lower in stock

export const lowerInStock = async(req: Request, res: Response) =>{

  // current schema uses `inStock: boolean` — return products that are out of stock
  const lowerProduct = await ProductModel.find({ inStock: false });

  res.json({ product: lowerProduct });

}

// pagenation
export const getProducts = async (req: Request, res: Response) => {
  // parse and coerce query params to proper types
  const pageNum = Number(req.query.page) || 1;
  const limitNum = Number(req.query.limit) || 10;
  const sortBy = (req.query.sort as string) || "createdAt";
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const minPriceNum = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPriceNum = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const query: any = {};
  if (category) query.category = category;

  if (minPriceNum != null || maxPriceNum != null) {
    query.price = {
      ...(minPriceNum != null && { $gte: minPriceNum }),
      ...(maxPriceNum != null && { $lte: maxPriceNum })
    };
  }

  if (search) query.$text = { $search: search };

  const products = await ProductModel.find(query)
    .sort(sortBy)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json(products);
};
