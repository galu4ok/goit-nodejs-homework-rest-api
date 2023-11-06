const express = require("express");

const {
  listOfContacts,
  contactById,
  createContact,
  deleteContact,
  updContact,
} = require("../../controllers/contacts");

// const {
//   listContacts,
//   getContactById,
//   addContact,
//   removeContact,
//   updateContact,
// } = require("../../models/contacts");

// const contactSchema = require("../../schemas/contactValidation");

// const { HttpError } = require("../../helpers");

const router = express.Router();

router.get("/", listOfContacts);

router.get("/:contactId", contactById);

router.post("/", createContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", updContact);

module.exports = router;
