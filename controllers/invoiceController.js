const Invoice = require("../models/Invoice");

// @desc    Create new Invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items = [],
            notes,
            paymentTerms,
        } = req.body;

        let subtotal = 0;
        let taxTotal = 0;

        const processedItems = items.map((item) => {
            const unitPrice = Number(item.unitPrice);
            const quantity = Number(item.quantity);
            const taxPercent = Number(item.taxPercent) || 0;

            if (isNaN(unitPrice) || isNaN(quantity)) {
                throw new Error("Invalid unitPrice or quantity");
            }

            const itemTotal = unitPrice * quantity;
            subtotal += itemTotal;
            taxTotal += (itemTotal * taxPercent) / 100;

            return {
                ...item,
                unitPrice,
                quantity,
                taxPercent,
                total: itemTotal + (itemTotal * taxPercent) / 100,
            };
        });

        const total = subtotal + taxTotal;

        const invoice = await Invoice.create({
            user: userId,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items: processedItems,
            notes,
            paymentTerms,
            subtotal,
            taxTotal,
            total,
        });

        // ✅ POPULATE USER HERE
        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate("user", "-password");

        res.status(201).json(populatedInvoice);

    } catch (error) {
        res.status(500).json({
            message: "Error creating invoice",
            error: error.message,
        });
    }
};



// @desc    Get all invoices of logged-in user
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({user: req.user.id}).populate("user", "name email");
        res.json(invoices)
    } catch (error) {
        res
           .status(500)
           .json({ message: "Error fetching invoice", error: error.message});
    }
};


// @desc    Get single invoices by ID
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoicesById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        if (!invoice) return res.status(404).json({ message: "invoice not found"});
        
        // Check if the invoice belong the user
        if (invoice.user._id.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized"});
        }
        
        res.json(invoice);
    } catch (error) {
        res
           .status(500)
           .json({ message: "Error fetching invoice", error: error.message});
    }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            status,
        } = req.body;

        let subtotal;
        let taxTotal;
        let total;

        // Recalculate only if items are provided
        if (Array.isArray(items) && items.length > 0) {
            subtotal = 0;
            taxTotal = 0;

            items.forEach((item) => {
                const unitPrice = Number(item.unitPrice);
                const quantity = Number(item.quantity);
                const taxPercent = Number(item.taxPercent) || 0;

                if (isNaN(unitPrice) || isNaN(quantity)) {
                    throw new Error("Invalid unitPrice or quantity");
                }

                const itemTotal = unitPrice * quantity;
                subtotal += itemTotal;
                taxTotal += (itemTotal * taxPercent) / 100;

                // keep item total updated
                item.total = itemTotal + (itemTotal * taxPercent) / 100;
            });

            total = subtotal + taxTotal;
        }

        const updateInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                invoiceNumber,
                invoiceDate,
                dueDate,
                billFrom,
                billTo,
                items,
                notes,
                paymentTerms,
                status,
                ...(subtotal !== undefined && {
                    subtotal,
                    taxTotal,
                    total,
                }),
            },
            { new: true }
        ).populate("user", "-password");

        if (!updateInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.json(updateInvoice);

    } catch (error) {
        res.status(500).json({
            message: "Error updating invoice",
            error: error.message,
        });
    }
};


// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.json({ message: "Invoice deleted successfully"});
    } catch (error) {
        res
           .status(500)
           .json({ message: "Error deleting invoice", error: error.message});
    }
};