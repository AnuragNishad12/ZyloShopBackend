import express, { Router } from 'express'
// dealsroute.js
import dealController from '../controllers/dealController.js';

const { getAllActiveDeals, createDeal } = dealController;

import authMiddleware from '../middlewares/auth.js'


const router = Router();


// GET active deals
router.get('/Getdeals',authMiddleware,getAllActiveDeals);

// POST create deal
router.post('/CreateDeals',authMiddleware,createDeal);




export default router;