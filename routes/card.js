const router = require('express').Router();
const cardController = require('../controllers/cards');

router
  .route('/:cardId')
  .get(cardController.getSingleCard)
  .patch(cardController.updateCard);
router.post('/', cardController.createNewCard);

module.exports = router;
