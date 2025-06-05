const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/role.middleware');

// All routes require auth and admin role
router.use(auth, requireAdmin);

router.get('/coins', adminController.getAllCoins);
router.post('/coins', adminController.createCoin);
router.put('/coins/:id', adminController.updateCoin);
router.delete('/coins/:id', adminController.deleteCoin);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/promote', adminController.promoteUser);

module.exports = router;
