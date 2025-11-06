import express from 'express';
import { getCategs, getCateg } from '../controllers/categoriesController.js';

const router = express.Router();

// GET ALL CATEGORIES
router.get('/', getCategs);

// GET CATEGORY BY ID
router.get('/:id', getCateg);

export default router;
