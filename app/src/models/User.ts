import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    role: 'customer' | 'admin';
    phone?: string;
    addresses: {
        isDefault: boolean;
        street: string;
        city: string;
        zip: string;
    }[];
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    emailVerificationToken?: string;
    phoneOtp?: string;
    otpExpiry?: Date;
    otpAttempts: number;
    otpLockedUntil?: Date;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    tokenVersion: number;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema({
    isDefault: { type: Boolean, default: false },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: false, default: '' },
}, { _id: true });

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false }, // Optional - Google users won't have one
    googleId: { type: String, required: false, unique: true, sparse: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String, required: false },
    addresses: { type: [AddressSchema], default: [] },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, required: false },
    phoneOtp: { type: String, required: false },
    otpExpiry: { type: Date, required: false },
    otpAttempts: { type: Number, default: 0 },
    otpLockedUntil: { type: Date, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpiry: { type: Date, required: false },
    tokenVersion: { type: Number, default: 0 }
}, {
    timestamps: true,
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
