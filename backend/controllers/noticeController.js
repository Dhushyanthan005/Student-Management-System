const Notice = require('../models/Notice');

exports.getNotices = async (req, res) => {
  try {
    const role = req.user?.role;
    const filter = role ? { $or: [{ audience: 'all' }, { audience: role }] } : {};
    const notices = await Notice.find(filter).populate('createdBy', 'name role').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
