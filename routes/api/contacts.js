const express = require("express");

const {
  listOfContacts,
  contactById,
  createContact,
  updateContact,
  updateStatusContact,
  deleteContact,
} = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();
const parseJSON = express.json();

// Get all contacts
router.get("/", listOfContacts);

// Get contact by ID
router.get("/:contactId", isValidId, contactById);

// Create a contact
router.post("/", parseJSON, validateBody(schemas.addSchema), createContact);

// Update a contact
router.put("/:contactId", parseJSON, isValidId, validateBody(schemas.addSchema), updateContact);

// Update a contact status favorite
router.patch(
  "/:contactId/favorite",
  parseJSON,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  updateStatusContact
);

// Delete a contact
router.delete("/:contactId", isValidId, deleteContact);

module.exports = router;
