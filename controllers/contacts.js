const { Contact } = require("../models/contact");

const { ctrlWrapper, HttpError } = require("../helpers");

const listOfContacts = async (__, res) => {
  const result = await Contact.find().exec();
  res.status(200).json(result);
};

const contactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId).exec();
  if (result === null) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (result === null) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (result === null) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  listOfContacts: ctrlWrapper(listOfContacts),
  contactById: ctrlWrapper(contactById),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
