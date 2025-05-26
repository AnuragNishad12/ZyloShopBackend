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



router.put('/updateQuantity/:itemId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    const userId = req.user._id;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be a positive number greater than 0' 
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = new Date();

    await cart.save();

    // Populate the cart items with product details for response
    const updatedCart = await Cart.findOne({ user: userId }).populate('items.product');

    res.status(200).json({ 
      success: true, 
      message: 'Quantity updated successfully', 
      cart: updatedCart,
      updatedItem: updatedCart.items.find(item => item._id.toString() === itemId)
    });

  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
});

// PUT /api/cart/decreaseQuantity/:itemId
router.put('/decreaseQuantity/:itemId', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const { decreaseBy = 1 } = req.body;

  
    if (decreaseBy < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Decrease value must be a positive number greater than 0' 
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

  
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    const currentQuantity = cart.items[itemIndex].quantity;
    const newQuantity = currentQuantity - decreaseBy;

   
    if (newQuantity <= 0) {
      cart.items.splice(itemIndex, 1);
      
      await cart.save();

     
      const updatedCart = await Cart.findOne({ user: userId }).populate('items.product');

      return res.status(200).json({ 
        success: true, 
        message: 'Item removed from cart (quantity reached 0)', 
        cart: updatedCart,
        removedItem: true,
        previousQuantity: currentQuantity
      });
    }

   
    cart.items[itemIndex].quantity = newQuantity;
    cart.updatedAt = new Date();

    await cart.save();

    const updatedCart = await Cart.findOne({ user: userId }).populate('items.product');

    res.status(200).json({ 
      success: true, 
      message: 'Quantity decreased successfully', 
      cart: updatedCart,
      updatedItem: updatedCart.items.find(item => item._id.toString() === itemId),
      previousQuantity: currentQuantity,
      newQuantity: newQuantity,
      decreasedBy: decreaseBy
    });

  } catch (error) {
    console.error('Error decreasing cart quantity:', error);
    res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
});



export default router;
