import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Username
    email: { type: String, required: true, unique: true }, // Email
    password: { type: String, required: true } // Password SHA256 
});

export default mongoose.model('User', userSchema);