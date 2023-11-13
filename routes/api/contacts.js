const express = require("express");

const {
  listOfContacts,
  contactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

// Get all contacts
router.get("/", listOfContacts);

// Get contact by ID
router.get("/:contactId", isValidId, contactById);

// Create a contact
router.post("/", validateBody(schemas.addSchema), createContact);

// Update a contact
router.put("/:contactId", isValidId, validateBody(schemas.addSchema), updateContact);

// Delete a contact
router.delete("/:contactId", isValidId, deleteContact);

module.exports = router;
