const express = require("express");
const router = express.Router();
const { getAllContact, getContact, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

//      api / contacts /   1.Get all the contacts  2.Post create the contacts
router.route('/').get(getAllContact).post(createContact);



//      api / contacts  / :id  1.Get a  contact  2. Update the contact  3.Delete the contact
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);










module.exports = router;