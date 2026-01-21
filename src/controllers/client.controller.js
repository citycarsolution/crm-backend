const Client = require("../models/Client");

exports.getClients = async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
};

exports.createClient = async (req, res) => {
  const client = await Client.create(req.body);
  res.json(client);
};
