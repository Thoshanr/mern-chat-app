import mongoose from 'mongoose';

const adminImageSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'showcase' },
  imageData: { type: String, required: true },
}, { timestamps: true });

const AdminImage = mongoose.model('AdminImage', adminImageSchema);
export default AdminImage;
