const Doctor = require("../models/Doctor");
const getAllDoctor = async (req, res) => {
  try {
    const { specialty } = req.query;
    let filter = {};
    if (specialty) {
      filter.specialty = specialty;
    }
    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = getAllDoctor;
