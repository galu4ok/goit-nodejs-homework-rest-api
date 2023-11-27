const express = require("express");

const {
  listOfContacts,
  contactById,
  createContact,
  updateContact,
  updateStatusContact,
  deleteContact,
} = require("../../controllers/contacts");

const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();
const parseJSON = express.json();

// Get all contacts
router.get("/", authenticate, listOfContacts);

// Get contact by ID
router.get("/:contactId", authenticate, isValidId, contactById);

// Create a contact
router.post("/", authenticate, parseJSON, validateBody(schemas.addSchema), createContact);

// Update a contact
router.put(
  "/:contactId",
  authenticate,
  parseJSON,
  isValidId,
  validateBody(schemas.addSchema),
  updateContact
);

// Update a contact status favorite
router.patch(
  "/:contactId/favorite",
  authenticate,
  parseJSON,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  updateStatusContact
);

// Delete a contact
router.delete("/:contactId", authenticate, isValidId, deleteContact);

module.exports = router;
