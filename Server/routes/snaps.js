const express = require('express');
const multer = require('multer');
const fsp = require('fs/promises');
const Snap = require('../models/Snap');
const auth = require('../middleware/auth'); // tumhara existing auth middleware

const router = express.Router();

const upload = multer({
    dest: 'private_uploads/',
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) =>
        cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype))
});

// 1) Snap bhejo
router.post('/', auth, upload.single('image'), async (req, res) => {
  const uid = req.user.userId || req.user.id;   // jo naam tumhare middleware mein chala tha

  console.log('Received snap upload request from user:', uid);

  if (!req.file) return res.status(400).json({ success: false, message: 'Valid image do (jpg/png/webp, max 5MB)' });
  if (!req.body.receiverId) {
    await fsp.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ success: false, message: 'receiverId chahiye' });
  }

  const snap = await Snap.create({
    sender: uid,
    receiver: req.body.receiverId,
    chatId: req.body.chatId || undefined,
    filePath: req.file.path,
    mimeType: req.file.mimetype
  });
  res.json({ success: true, id: snap._id });
});

router.get('/:id/status', auth, async (req, res) => {
  const uid = String(req.user.userId || req.user.id);
  const snap = await Snap.findById(req.params.id).select('sender receiver viewed');
  if (!snap) return res.json({ exists: false });            // delete ho chuka = opened

  const isSender = String(snap.sender) === uid;
  const isReceiver = String(snap.receiver) === uid;
  if (!isSender && !isReceiver) return res.status(403).json({ message: 'Not allowed' });

  res.json({ exists: true, isSender, isReceiver, viewed: snap.viewed });
});

// 2) Mere received unopened snaps ki list
router.get('/inbox', auth, async (req, res) => {
    const uid = String(req.user.userId || req.user.id);
    const snaps = await Snap.find({ receiver: uid, viewed: false })
        .select('_id sender createdAt')
        .populate('sender', 'username')
        .sort({ createdAt: -1 });
    res.json(snaps);
});

// 3) View once
router.get('/:id/view', auth, async (req, res) => {

    const check = await Snap.findById(req.params.id);
    console.log('Snap in DB =', check);
    console.log('Logged-in user =', req.user.userId || req.user.id);


    const snap = await Snap.findOneAndUpdate(
        { _id: req.params.id, receiver: req.user.userId, viewed: false },
        { viewed: true, viewedAt: new Date() },
        { new: true }
    );
    if (!snap) return res.status(410).json({ message: 'Snap already opened ya exist nahi karta' });

    try {
        const data = await fsp.readFile(snap.filePath);
        await fsp.unlink(snap.filePath);
        res.set({ 'Content-Type': snap.mimeType, 'Cache-Control': 'no-store, private' });
        res.send(data);
    } catch (e) {
        res.status(500).json({ message: 'Snap load nahi hua' });
    }
});

module.exports = router;