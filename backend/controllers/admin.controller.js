import { timingSafeEqual } from 'node:crypto';
import AdminImage from '../models/adminImage.model.js';

export const getAdminImage = async (_req, res) => {
  try {
    const image = await AdminImage.findOne({ key: 'showcase' }).select('imageData updatedAt');
    res.status(200).json(image || { imageData: null });
  } catch (error) {
    console.error('Could not load the showcase image:', error.message);
    res.status(500).json({ error: 'Could not load the image right now.' });
  }
};

export const saveAdminImage = async (req, res) => {
  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  const suppliedPassword = String(req.body?.adminPassword || '');
  const expected = Buffer.from(expectedPassword);
  const supplied = Buffer.from(suppliedPassword);
  if (expected.length < 20) {
    return res.status(503).json({ error: 'The administrator image feature has not been configured on the server.' });
  }
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    return res.status(401).json({ error: 'Administrator password did not match.' });
  }

  const imageData = req.body?.imageData;
  if (typeof imageData !== 'string' || imageData.length > 1_700_000 || !/^data:image\/(png|jpeg|webp|gif);base64,[a-z\d+/=]+$/i.test(imageData)) {
    return res.status(400).json({ error: 'Choose a PNG, JPG, WEBP, or GIF image smaller than 1.2 MB.' });
  }

  try {
    const image = await AdminImage.findOneAndUpdate(
      { key: 'showcase' },
      { $set: { imageData } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).select('imageData updatedAt');
    return res.status(200).json(image);
  } catch (error) {
    console.error('Could not save the showcase image:', error.message);
    return res.status(500).json({ error: 'Could not save the image right now.' });
  }
};
