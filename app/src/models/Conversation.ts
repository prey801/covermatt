import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    sessionId: string;
    userId?: mongoose.Types.ObjectId;
    customerName?: string;
    status: 'active' | 'closed';
    lastMessageAt: Date;
    createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String },
    status: { type: String, enum: ['active', 'closed'], default: 'active', index: true },
    lastMessageAt: { type: Date, default: Date.now, index: true }
}, {
    timestamps: true
});

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
