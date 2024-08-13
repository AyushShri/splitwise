const express = require('express');
const router = express.Router();
const { createGroupWithUsers, getAllGroups , addUserToGroup} = require('../controllers/groupController');

router.post('/groups', createGroupWithUsers);
router.get('/groups', getAllGroups);
router.put('/:groupId/user', addUserToGroup);
module.exports = router; 