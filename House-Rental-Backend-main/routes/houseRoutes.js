const express = require('express');
const router = express.Router();

// 1. Import ALL controller functions (including vacateHouse)
const {
  addHouse,
  getMyHouses,
  getAllHouses,
  requestBooking,
  acceptRequest,
  declineRequest,
  toggleRent,
  editHouse,
  deleteHouse,
  updateTenantDetails,
  vacateHouse,
  confirmPayment,
  addMessage,
  addReminder,
  deleteReminder,
  addTodo,
  toggleTodo,
  deleteTodo,
  getWorkspace,
  requestVacate,
  respondVacate
} = require('../controllers/houseController');

// 2. Import the security middleware
const { protect } = require('../middleware/authMiddleware');
const { cancelRequest } = require('../controllers/cancelController');

// --- Public Route ---
router.get('/', getAllHouses);

// --- Protected Routes ---
router.post('/', protect, addHouse);
router.get('/my-houses', protect, getMyHouses);
router.put('/:id/request', protect, requestBooking);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/decline', protect, declineRequest);
router.put('/:id/rent', protect, toggleRent);
router.delete('/:id', protect, deleteHouse);
router.put('/:id/edit', protect, editHouse);
router.put('/:id/tenant-details', protect, updateTenantDetails);

// 3. The Fixed Vacate Route
router.put('/:id/vacate', protect, vacateHouse);
router.put('/:id/request-vacate', protect, requestVacate);
router.put('/:id/respond-vacate', protect, respondVacate);
router.put('/:id/confirm-payment', protect, confirmPayment);
router.delete('/:houseId/cancel-request', protect, cancelRequest);

// --- Workspace Routes ---
router.get('/:id/workspace', protect, getWorkspace);
router.post('/:id/messages', protect, addMessage);
router.post('/:id/reminders', protect, addReminder);
router.delete('/:id/reminders/:reminderId', protect, deleteReminder);
router.post('/:id/todos', protect, addTodo);
router.put('/:id/todos/:todoId', protect, toggleTodo);
router.delete('/:id/todos/:todoId', protect, deleteTodo);

module.exports = router;