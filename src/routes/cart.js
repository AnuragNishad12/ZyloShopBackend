import express from 'express';
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router();


router.post('/addCart', authMiddleware, async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;
    
    
    if (!userId) {
        return res.status(400).json({ 
            success: "Failed", 
            message: "User ID is missing. Please make sure you're authenticated." 
        });
    }
    
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            cart = new Cart({ 
                user: userId, 
                items: [{ product: productId, quantity }] 
            });
        } else {
            const itemIndex = cart.items.findIndex(item => 
                item.product.toString() === productId);
            
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }
        
        await cart.save();
        res.status(200).json({ 
            success: true,
            message: 'Product added to cart', 
            cart 
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: "Failed",
            message: `Server 500 Error: ${error.message}`
        });
    }
});

// GET /api/cart
router.get('/GetCartItems', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) return res.status(200).json({ items: [], totalItems: 0, totalQuantity: 0 });

    const totalItems = cart.items.length;
    const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.status(200).json({
      items: cart.items,
      totalItems,
      totalQuantity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// DELETE /api/cart/:productId
// Delete an item from cart by its unique item _id (not productId)
router.delete('/CartDELETE/:itemId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();

    res.status(200).json({ message: 'Item removed', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.put('/Cartupdate', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
