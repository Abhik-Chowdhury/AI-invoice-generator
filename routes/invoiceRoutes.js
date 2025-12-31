const express = require("express");
const {
    createInvoice,
    getInvoices,
    getInvoicesById,
    updateInvoice,
    deleteInvoice,
} = require("../controllers/invoiceController");
const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.route("/").post(protect, createInvoice).get(protect, getInvoices);

router
    .route("/:id")
    .get(protect, getInvoicesById)
    .put(protect, updateInvoice)
    .delete(protect, deleteInvoice)

    module.exports = router;
