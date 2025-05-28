
import Deal from '../models/Deals.js'
import Joi from 'joi'

// Validation schema using Joi
const dealSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  discountPercentage: Joi.number().min(0).max(100).required(),
  productIds: Joi.array().items(Joi.string()).required(),
  expiryDate: Joi.date().required(),
  imageUrl: Joi.string().uri().required(),
  isActive: Joi.boolean().required()
});

// GET /api/deals - Get all active deals
const getAllActiveDeals = async (req, res) => {
  try {
    const deals = await Deal.find({
      isActive: true,
      expiryDate: { $gte: new Date() }
    }).sort({ expiryDate: 1 });

    res.status(200).json({
      success: true,
      data: deals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/deals - Create a new deal
const createDeal = async (req, res) => {
  try {
    const { error, value } = dealSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: 'Validation failed', error: error.details[0].message });
    }

    const newDeal = new Deal(value);
    const savedDeal = await newDeal.save();

    res.status(201).json({ success: true, data: savedDeal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// const getAllActiveDeals = async (req, res) => { /*...*/ };
// const createDeal = async (req, res) => { /*...*/ };

export default { getAllActiveDeals, createDeal };