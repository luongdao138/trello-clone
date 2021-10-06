const router = require('express').Router();
const userController = require('../controllers/users');

router.route('/').get(userController.getUser);
router.get('/search', userController.searchUser);

module.exports = router;
