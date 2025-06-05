const express = require('express');
const router = express.Router();
const adController = require('../controllers/ad.controller');
const auth = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');


router.use(auth);

router.get('/', adController.listAds);
router.post('/', adController.createAd);
router.post('/', auth, upload.single('paymentImage'), adController.createAd);
router.get('/:id', adController.getAdById);


module.exports = router;
