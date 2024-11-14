const { Router } = require('express');
const router = Router();
const controller = require('../controllers/controller');

router.get('/', controller.indexGet);
router.get('/register', controller.registerGet);
router.post('/register', controller.registerPost);
router.get('/login', controller.loginGet);
router.post('/login', controller.validate, controller.loginPost)
router.get('/logout', controller.logoutGet);

router.get('/profile/:username', controller.profileGet);
router.get('/userSearch', controller.userSearchGet);
router.get('/sendFriendRequest/:userId', controller.sendFriendRequestGet);
router.get('/acceptRequest/:requestUserId', controller.acceptRequestGet);
router.get('/rejectRequest/:requestUserId', controller.rejectRequestGet);
router.post('/writeOnWall', controller.writeOnWallPost);
router.post('/likePost', controller.likePostPost);
router.post('/unlikePost', controller.unlikePostPost);
// router.get('/userSearch?search=:search', controller.userSearchGet);

// router.get('/allMessages', controller.allMessagesGet);
// router.get('/message/:authorId', controller.messageGet);

// router.post('/newMessage', controller.newMessagePost);

// router.get('/newConversation', controller.newConversationGet);

// router.post('/register', controller.registerPost);
// router.get('/login', controller.loginGet);
// router.post('/login', controller.validate, controller.loginPost);

module.exports = router;