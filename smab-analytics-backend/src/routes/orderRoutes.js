import { Router } from 'express';
import { createOrUpdateOrder } from '../controllers/orderControllers.js';
import { protect, verifiedAccess}  from '../controllers/authController.js';


const router = Router();

// router.use(protect, verifiedAccess)

router.post('/new', createOrUpdateOrder);

/**
 * Mock API endpoint that returns product details for given barcodes
 * POST /api/products/details
 * Body: { barcodes: string[] }
 * Response: { data: Array<{ref: string, prix_ttc: number}> }
*/
router.post('/sample/products/details', (req, res) => {
    try {
        const { barcodes } = req.body;
        console.log('br', barcodes);
        
        // Validate request body
        if (!barcodes || !Array.isArray(barcodes)) {
            return res.status(400).json({
                error: 'Invalid request body. Expected { barcodes: string[] }'
            });
        }
        
        if (barcodes.length === 0) {
            return res.status(400).json({
                error: 'Barcodes array cannot be empty'
            });
        }
        
        // Generate mock product details
        const productDetails = barcodes.map(barcode => {
            // Generate random price between 1000 and 15000
            const randomPrice = Math.floor(Math.random() * (15000 - 1000 + 1)) + 1000;
            
            return {
                ref: barcode, // Using the barcode as ref as per your requirement
                prix_ttc: randomPrice
            };
        });
        
        // Simulate API processing delay (50-500ms)
        const delay = Math.floor(Math.random() * 450) + 50;
        
        setTimeout(() => {
            res.json({
                data: productDetails,
                message: `Found ${productDetails.length} product(s)`,
                timestamp: new Date().toISOString()
    });
}, delay);

  } catch (error) {
    console.error('Error in product details endpoint:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
}
});

export default router;