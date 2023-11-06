const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const contactSchema = require("../schemas/contactValidation");

const { ctrlWrapper, HttpError } = require("../helpers");

const listOfContacts = async (__, res) => {
  const result = await listContacts();
  res.status(200).json(result);
};

const contactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const { error } = contactSchema.validate(req.body, { abortEarly: false });

  if (typeof error !== "undefined") {
    throw HttpError(
      400,
      `missing required name field: ${error.details.map((err) => err.message).join(", ")}`
    );
  }
  const result = await addContact(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};
const updContact = async (req, res) => {
  const { error } = contactSchema.validate(req.body, { abortEarly: false });

  if (typeof error !== "undefined") {
    throw HttpError(
      400,
      `missing required name field: ${error.details.map((err) => err.message).join(", ")}`
    );
  }
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};
module.exports = {
  listOfContacts: ctrlWrapper(listOfContacts),
  contactById: ctrlWrapper(contactById),
  createContact: ctrlWrapper(createContact),
  deleteContact: ctrlWrapper(deleteContact),
  updContact: ctrlWrapper(updContact),
};
