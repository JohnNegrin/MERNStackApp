import mongoose from 'mongoose';

const savedItemsSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        dateSaved: {
            type: Date,
            default: Date.now,
        }
    }],
}, {
    timestamps: true,
});

const SavedItems = mongoose.model('SavedItems', savedItemSchema);

export default SavedItems;
