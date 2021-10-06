const router = require('express').Router();
const commentController = require('../controllers/comments');

router
  .route('/')
  .get(commentController.getAllCommentsOfCard)
  .post(commentController.createComment);
router
  .route('/:commentId')
  .patch(commentController.editComment)
  .delete(commentController.deleteComment);

module.exports = router;
