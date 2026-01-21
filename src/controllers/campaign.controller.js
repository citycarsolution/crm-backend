const Campaign = require("../models/Campaign");
const Invoice = require("../models/Invoice");

exports.getCampaigns = async (req, res) => {
  const campaigns = await Campaign.find();

  const invoices = await Invoice.find();

  const data = campaigns.map((c) => {
    const spend = invoices
      .filter((i) => i.campaign === c.name)
      .reduce((s, i) => s + Number(i.total || 0), 0);

    return {
      ...c.toObject(),
      spend,
    };
  });

  res.json(data);
};
