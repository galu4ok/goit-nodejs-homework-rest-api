const { Contact } = require("../models/contact");

const { ctrlWrapper, HttpError } = require("../helpers");

const listOfContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };

  if (favorite !== undefined) {
    query.favorite = favorite;
  }

  const result = await Contact.find(query, "-createdAt -updatedAt", { skip, limit })
    .populate("owner", "email")
    .exec();
  res.status(200).json(result);
};

const contactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id } = req.user;

  const result = await Contact.findById(contactId).exec();
  if (result === null) {
    throw HttpError(404);
  }
  if (result.owner.toString() !== _id.toString()) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id } = req.user;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (result === null) {
    throw HttpError(404);
  }
  if (result.owner.toString() !== _id.toString()) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (result === null) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id } = req.user;

  const result = await Contact.findByIdAndDelete(contactId);
  if (result === null) {
    throw HttpError(404);
  }
  if (result.owner.toString() !== _id.toString()) {
    throw HttpError(404);
  }
  res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  listOfContacts: ctrlWrapper(listOfContacts),
  contactById: ctrlWrapper(contactById),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteContact: ctrlWrapper(deleteContact),
};
