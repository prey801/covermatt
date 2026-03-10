import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    reviews: number;
    stockLevel: 'in-stock' | 'low-stock' | 'out-of-stock';
    isNewItem: boolean;
    features: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true, default: 5.0 },
    reviews: { type: Number, required: true, default: 0 },
    stockLevel: { 
        type: String, 
        enum: ['in-stock', 'low-stock', 'out-of-stock'], 
        default: 'in-stock' 
    },
    isNewItem: { type: Boolean, default: false },
    features: { type: [String], default: [] }
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
