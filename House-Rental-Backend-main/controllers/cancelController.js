const House = require('../models/House');

const cancelRequest = async (req, res) => {
  try {
    const { houseId } = req.params;
    const userId = req.user._id;

    const house = await House.findById(houseId);
    if (!house) return res.status(404).json({ message: 'House not found' });

    house.requests = house.requests.filter(r => r.userId.toString() !== userId.toString());
    await house.save();

    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { cancelRequest };
