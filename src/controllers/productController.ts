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
export const createProduct = async(req:Request, res: Response) =>{
    try {
        const product = await ProductModel.create(req.body);
        res.status(201).json({
            created: "product created successfull",
            data:product
        })
    } catch (err) {
        res.status(500).json({
            message: "Failed to create product",
            error: err
        })
        
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