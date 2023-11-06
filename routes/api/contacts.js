const express = require("express");

const {
  listOfContacts,
  contactById,
  createContact,
  deleteContact,
  updContact,
} = require("../../controllers/contacts");

const validateBody = require("../../middlewares");
const schemas = require("../../schemas/contactValidation");

const router = express.Router();

router.get("/", listOfContacts);

router.get("/:contactId", contactById);

router.post("/", validateBody(schemas.contactSchema), createContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", validateBody(schemas.contactSchema), updContact);

module.exports = router;
