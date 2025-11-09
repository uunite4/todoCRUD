import { readDB, readCateg } from '../db/dbController.js';

// @dec     Get all categories
// @route   GET /api/categories
export const getCategs = async (req, res, next) => {
  const allCateg = await readCateg();
  res.status(200).json(allCateg);
};

// @dec     Get category by id
// @route   GET /api/categories/:id
export const getCateg = async (req, res, next) => {
  const allCateg = await readCateg();
  const categId = req.params.id;
  const categItem = allCateg.find((item) => item.id == categId);
  if (!categItem) {
    return res.status(404).json({ msg: '[ ERROR ]: Category not found' });
  }
  res.status(200).json(categItem);
};
