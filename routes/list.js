const router = require('express').Router();
const listController = require('../controllers/lists');

router.route('/:boardId').get(listController.getListsOfBoard);
router.post('/', listController.createNewList);
router.patch('/dragAndDrop', listController.handleDragAndDrop);
router.patch('/:listId', listController.updateList);

module.exports = router;
