const router = require('express').Router();
const boardController = require('../controllers/boards');

router
  .route('/')
  .get(boardController.getAllBoardsOfAnUser)
  .post(boardController.createBoard);
router.post('/joinByCode', boardController.joinBoardByCode);
router
  .route('/:boardId')
  .get(boardController.getSingleBoard)
  .patch(boardController.updateBoard)
  .delete(boardController.deleteBoard);

module.exports = router;
