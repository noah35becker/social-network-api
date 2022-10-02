
// IMPORTS
const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    mutualAddFriends,
    mutualRemoveFriends
} = require('../../controllers/user-controller');


// ROUTING

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router.route('/:userId/friends/:friendId')
    .post(mutualAddFriends)
    .delete(mutualRemoveFriends);


// EXPORT
module.exports = router;