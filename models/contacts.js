// Iніціалізація модулів
const fs = require("node:fs/promises");
const path = require("node:path");
const { nanoid } = require("nanoid");

// Визначення змінної для зберігання шляху до файлу з контактами
const contactsPath = path.join(__dirname, "contacts.json");

// Функції-хелпери для зчитування та перезаписування контактів

async function readContacts() {
  const data = await fs.readFile(contactsPath);

  return JSON.parse(data);
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

// Функції для роботи з колекцією контактів

const listContacts = async () => {
  const contacts = await readContacts();
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
};

const addContact = async (body) => {
  const contacts = await readContacts();
  const newContact = { id: nanoid(), ...body };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const newContacts = [...contacts.slice(0, index), ...contacts.slice(index + 1)];
  await writeContacts(newContacts);
  return contacts[index];
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const newContact = { id: nanoid(), ...body };
  const newContacts = [...contacts.slice(0, index), newContact, ...contacts.slice(index + 1)];

  await writeContacts(newContacts);

  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
