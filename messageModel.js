import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: String,
    text: String,
    timestamp: String,
    
})

export default mongoose.model('messages', messageSchema)