import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { addSavedItem, getSavedItems, deleteSavedItem } from '../controllers/savedItemsController.js';

router.route('/')
    .post(protect, addSavedItem)  // Save an item
    .get(protect, getSavedItems); // Get all saved items

router.route('/:itemId')
    .delete(protect, deleteSavedItem); // Delete a saved item

export default router;
