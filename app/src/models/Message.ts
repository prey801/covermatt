import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    sender: 'customer' | 'admin';
    content: string;
    read: boolean;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender: { type: String, enum: ['customer', 'admin'], required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
