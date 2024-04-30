import asyncHandler from '../middleware/asyncHandler.js';
import SavedItems from '../models/savedItemsModel.js';

// @desc    Add item to saved for later
// @route   POST /api/savedItems
// @access  Private
const addSavedItem = asyncHandler(async (req, res) => {
    const { product } = req.body;

    const existingSavedItems = await SavedItems.findOne({ user: req.user._id });

    if (existingSavedItems) {
        const alreadySaved = existingSavedItems.items.find(item => item.product.toString() === product);

        if (alreadySaved) {
            res.status(400);
            throw new Error('Item already saved');
        }

        existingSavedItems.items.push({ product });
        await existingSavedItems.save();
        res.status(201).json(existingSavedItems);
    } else {
        const newSavedItem = new SavedItems({
            user: req.user._id,
            items: [{ product }]
        });
        await newSavedItem.save();
        res.status(201).json(newSavedItem);
    }
});

// @desc    Get saved items for logged in user
// @route   GET /api/savedItems
// @access  Private
const getSavedItems = asyncHandler(async (req, res) => {
    const savedItems = await SavedItems.findOne({ user: req.user._id }).populate('items.product');
    res.json(savedItems);
});

// @desc    Delete item from saved
// @route   DELETE /api/savedItems/:itemId
// @access  Private
const deleteSavedItem = asyncHandler(async (req, res) => {
    const savedItems = await SavedItems.findOne({ user: req.user._id });
    if (!savedItems) {
        res.status(404);
        throw new Error('No saved items found');
    }
    savedItems.items = savedItems.items.filter(item => item._id.toString() !== req.params.itemId);
    await savedItems.save();
    res.status(204).send();
});

export { addSavedItem, getSavedItems, deleteSavedItem };
