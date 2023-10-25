import express from "express";
import customErrorDictionary from "../middleware/customErrorDictionary.js";  //Importa el diccionario de errores del proyecto
import { getProductByIdService, updateProductService } from "../services/productService.js";

const router = express.Router();

router.post('/:id/purchase', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body; 

        // Obtén el producto por ID
        const product = await getProductByIdService(id);

        if (!product) {
            return res.status(404).json({ error: customErrorDictionary.PRODUCT_NOT_FOUND });
        }

        // Verifica si hay suficiente stock
        if (product.stock < quantity) {
            return res.status(400).json({ error: customErrorDictionary.INSUFFICIENT_STOCK });
        }

        // Actualiza el stock del producto
        const newStock = product.stock - quantity;
        const updatedProduct = await updateProductService(id, { stock: newStock });

        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ error });
    }
});

export default router;
