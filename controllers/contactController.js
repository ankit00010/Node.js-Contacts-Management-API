
const asyncHandler = require('express-async-handler');
const Contact = require("../Models/contactModels");

//@desc GET ALL CONTACTS
//@route GET /api/contacts
//@access private

const getAllContact = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

//@desc CREATE NEW CONTACTS
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {

    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        name, email, phone, user_id: req.user.id,
    });
    res.status(201).json(contact);
    // res.status(200).json({ message: `Create` });

});


//@desc GET  CONTACT
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contactID = req.params.id;
    if (!/^[0-9a-fA-F]{24}$/.test(contactID)) {
        // Invalid ObjectId format
        res.status(400).json({ message: "Invalid contact ID format" });
        return;
    }
    const contact = await Contact.findById(contactID);

    if (!contact) {
        console.log("Here in the error")
        res.status(404);
        throw new Error("Contacts not found");
    }
    res.status(200).json(contact);
});


//@desc UPDATE  CONTACT
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contactID = req.params.id;
    if (!/^[0-9a-fA-F]{24}$/.test(contactID)) {
        // Invalid ObjectId format
        res.status(400).json({ message: "Invalid contact ID format" });
        return;
    }
    const contact = await Contact.findById(contactID);

    if (!contact) {
        console.log("Here in the error")
        res.status(404);
        throw new Error("Contacts not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User dont have permission to update other user contacts")
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,


        { new: true }

    );




    res.status(201).json(updatedContact);
});


//@desc DELETE CONTACT
//@route GET /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contactID = req.params.id;
    if (!/^[0-9a-fA-F]{24}$/.test(contactID)) {
        // Invalid ObjectId format
        return res.status(400).json({ message: "Invalid contact ID format" });
    }

    const contact = await Contact.findById(contactID);

    if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts")
    }
    // Attempt to remove the contact
    const result = await Contact.deleteOne({ _id: contactID });



    return res.status(200).json({ message: "Contact removed successfully" });
});






module.exports = { getAllContact, getContact, createContact, updateContact, deleteContact };