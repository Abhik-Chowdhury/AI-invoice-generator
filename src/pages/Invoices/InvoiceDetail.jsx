import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
    Loader2,
    Edit,
    Printer,
    AlertCircle,
    Mail
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import CreateInvoice from "./CreateInvoice";
import Button from "../../components/ui/Button";
import ReminderModal from "../../components/invoices/ReminderModal";
import { useAuth } from "../../context/AuthContext";

const InvoiceDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

    const invoiceRef = useRef();

    const { user } = useAuth();
    const businessLogo = user?.businessLogo;
    const businessUpiId = user?.businessUpiId || "";
    const businessName = user?.businessName || "Business";
    const isSinglePage = invoice?.items?.length <= 6;

    const upiPaymentString = businessUpiId
        ? `upi://pay?pa=${encodeURIComponent(businessUpiId)}&pn=${encodeURIComponent(
            businessName
        )}&am=${encodeURIComponent(Number(invoice?.total || 0).toFixed(2))}&cu=INR&tn=${encodeURIComponent(
            `Invoice ${invoice?.invoiceNumber || ""}`
        )}`
        : "";

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axiosInstance.get(
                    API_PATHS.INVOICE.GET_INVOICE_BY_ID(id)
                );

                setInvoice(response.data);

            } catch (error) {
                toast.error("Failed to fetch invoice");
                console.error(error);

            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();

    }, [id]);

    const handleUpdate = async (formData) => {
        try {

            const response = await axiosInstance.put(
                API_PATHS.INVOICE.UPDATE_INVOICE(id),
                formData
            );

            toast.success("Invoice updated successfully");

            setIsEditing(false);
            setInvoice(response.data);

        } catch (error) {
            toast.error("Failed to update invoice.");
            console.error(error);
        }
    };

    /* =========================
       PRINT FUNCTION
    ========================= */

    // const handlePrint = () => {
    //     const source = invoiceRef.current;

    //     if (!source) {
    //         window.print();
    //         return;
    //     }

    //     document.getElementById("print-root")?.remove();

    //     const printRoot = document.createElement("div");
    //     printRoot.id = "print-root";
    //     document.body.appendChild(printRoot);

    //     const headerHTML =
    //         source.querySelector(".invoice-print-header")?.outerHTML || "";

    //     const theadHTML =
    //         source.querySelector("thead")?.outerHTML || "";

    //     const summaryHTML =
    //         source.querySelector(".invoice-summary-section")?.outerHTML || "";

    //     const rows = Array.from(source.querySelectorAll("tbody tr"));

    //     const ITEMS_PER_PAGE = 6;
    //     const pages = [];

    //     for (let i = 0; i < rows.length; i += ITEMS_PER_PAGE) {
    //         pages.push(rows.slice(i, i + ITEMS_PER_PAGE).map((row) => row.outerHTML));
    //     }

    //     const totalPages = pages.length;
    //     const isSinglePage = totalPages === 1;

    //     printRoot.className = isSinglePage ? "single-page-print" : "";

    //     printRoot.innerHTML = pages
    //         .map((pageRows, index) => {
    //             const isLastPage = index === pages.length - 1;
    //             const pageNumber = index + 1;

    //             return `
    //     <div class="print-page">
    //       ${headerHTML}

    //       <div class="print-table-wrapper">
    //         <table class="print-table">
    //           ${theadHTML}
    //           <tbody>
    //             ${pageRows.join("")}
    //           </tbody>
    //         </table>
    //       </div>

    //       ${isLastPage
    //                     ? `
    //             <div class="print-summary-wrapper">
    //               ${summaryHTML}
    //             </div>
    //           `
    //                     : ""
    //                 }

    //       ${!isSinglePage
    //                     ? `
    //             <div class="print-page-footer">
    //               Page ${pageNumber} of ${totalPages}
    //             </div>
    //           `
    //                     : ""
    //                 }
    //     </div>
    //   `;
    //         })
    //         .join("");

    //     requestAnimationFrame(() => {
    //         requestAnimationFrame(() => {
    //             printRoot.offsetHeight;
    //             window.print();

    //             const cleanup = () => {
    //                 document.getElementById("print-root")?.remove();
    //                 window.removeEventListener("afterprint", cleanup);
    //             };

    //             window.addEventListener("afterprint", cleanup);
    //             setTimeout(cleanup, 1000);
    //         });
    //     });
    // };

    // Clean up function 
    const clearOldPrintState = async () => {
        // remove old print roots
        document.querySelectorAll("#print-root").forEach((el) => {
            el.remove();
        });

        // clear browser selection memory
        if (window.getSelection) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
        }

        // force layout recalculation
        document.body.offsetHeight;

        // wait 2 frames so mobile compositor resets
        await new Promise((resolve) =>
            requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            )
        );

        // mobile browsers need tiny cooldown
        await new Promise((resolve) =>
            setTimeout(resolve, 300)
        );
    };
    // The latest handlePrint
    // const handlePrint = async () => {
    //     const isMobile =
    //         /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    //     if (isMobile) {
    //         await clearOldPrintState();
    //     }

    //     const source = invoiceRef.current;

    //     if (!source) {
    //         window.print();
    //         return;
    //     }

    //     // Remove any old print root
    //     document.getElementById("print-root")?.remove();

    //     const printRoot = document.createElement("div");
    //     printRoot.id = "print-root";
    //     printRoot.style.visibility = "hidden";
    //     document.body.appendChild(printRoot);

    //     const headerHTML =
    //         source.querySelector(".invoice-print-header")?.outerHTML || "";

    //     const theadHTML = source.querySelector("thead")?.outerHTML || "";

    //     const summaryHTML =
    //         source.querySelector(".invoice-summary-section")?.outerHTML || "";

    //     const rows = Array.from(source.querySelectorAll("tbody tr"));

    //     const ITEMS_PER_PAGE = 6;
    //     const pages = [];

    //     for (let i = 0; i < rows.length; i += ITEMS_PER_PAGE) {
    //         pages.push(rows.slice(i, i + ITEMS_PER_PAGE).map((row) => row.outerHTML));
    //     }

    //     const totalPages = pages.length;
    //     const isSinglePage = totalPages === 1;

    //     printRoot.className = isSinglePage ? "single-page-print" : "";

    //     printRoot.innerHTML = pages
    //         .map((pageRows, index) => {
    //             const isLastPage = index === pages.length - 1;
    //             const pageNumber = index + 1;

    //             return `
    //     <div class="print-page">
    //       ${headerHTML}

    //       <div class="print-table-wrapper">
    //         <table class="print-table">
    //           ${theadHTML}
    //           <tbody>
    //             ${pageRows.join("")}
    //           </tbody>
    //         </table>
    //       </div>

    //       ${isLastPage
    //                     ? `
    //             <div class="print-summary-wrapper">
    //               ${summaryHTML}
    //             </div>
    //           `
    //                     : ""
    //                 }

    //       ${!isSinglePage
    //                     ? `
    //             <div class="print-page-footer">
    //               Page ${pageNumber} of ${totalPages}
    //             </div>
    //           `
    //                     : ""
    //                 }
    //     </div>
    //   `;
    //         })
    //         .join("");

    //     // const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    //     let cleanedUp = false;
    //     const cleanup = () => {
    //         if (cleanedUp) return;
    //         cleanedUp = true;

    //         document.getElementById("print-root")?.remove();
    //         window.removeEventListener("afterprint", onAfterPrint);
    //         document.removeEventListener("visibilitychange", onVisibilityChange);
    //     };

    //     const onAfterPrint = () => {
    //         // Mobile browsers often need extra time to finish "Save as PDF"
    //         setTimeout(cleanup, isMobile ? 2500 : 500);
    //     };

    //     const onVisibilityChange = () => {
    //         if (document.visibilityState === "visible") {
    //             setTimeout(cleanup, 500);
    //         }
    //     };

    //     window.addEventListener("afterprint", onAfterPrint, { once: true });
    //     document.addEventListener("visibilitychange", onVisibilityChange);

    //     try {
    //         // Wait for layout/fonts so print rendering is stable on mobile
    //         if (document.fonts?.ready) {
    //             await document.fonts.ready.catch(() => { });
    //         }

    //         await new Promise((resolve) =>
    //             requestAnimationFrame(() => requestAnimationFrame(resolve))
    //         );

    //         printRoot.style.visibility = "visible";
    //         window.print();
    //         if (isMobile) {
    //             await new Promise((resolve) =>
    //                 setTimeout(resolve, 800)
    //             );
    //         }

    //         window.print();
    //     } finally {
    //         // Final fallback cleanup, but not too early
    //         setTimeout(cleanup, isMobile ? 8000 : 3000);
    //     }
    // };

    // New handle print 
    const handlePrint = async () => {
        const source = invoiceRef.current;

        if (!source) {
            const printWindow = window.open("", "_blank");

            if (!printWindow) {
                alert("Please allow popups for printing.");
                return;
            }

            printWindow.document.open();

            printWindow.document.write(`
  <html>
    <head>
      <title>Invoice</title>

      <style>
        ${Array.from(document.styleSheets)
                    .map((sheet) => {
                        try {
                            return Array.from(sheet.cssRules)
                                .map((rule) => rule.cssText)
                                .join("\n");
                        } catch {
                            return "";
                        }
                    })
                    .join("\n")}
      </style>
    </head>

    <body>
      ${printRoot.innerHTML}
    </body>
  </html>
`);

            printWindow.document.close();

            const doPrint = async () => {
                try {
                    await printWindow.document.fonts?.ready;

                    setTimeout(() => {
                        printWindow.focus();
                        printWindow.print();

                        setTimeout(() => {
                            printWindow.close();
                        }, 1000);
                    }, isMobile ? 1200 : 300);
                } catch (e) {
                    printWindow.print();

                    setTimeout(() => {
                        printWindow.close();
                    }, 1000);
                }
            };

            doPrint();
            return;
        }

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        const clearOldPrintState = async () => {
            document.getElementById("print-root")?.remove();

            if (window.getSelection) {
                window.getSelection()?.removeAllRanges();
            }

            // Let the browser release old print/layout work
            await new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve))
            );
        };

        if (isMobile) {
            await clearOldPrintState();
        }

        document.getElementById("print-root")?.remove();

        const printRoot = document.createElement("div");
        printRoot.id = "print-root";
        document.body.appendChild(printRoot);

        const headerHTML =
            source.querySelector(".invoice-print-header")?.outerHTML || "";

        const theadHTML = source.querySelector("thead")?.outerHTML || "";

        const summaryHTML =
            source.querySelector(".invoice-summary-section")?.outerHTML || "";

        const rows = Array.from(source.querySelectorAll("tbody tr"));

        const ITEMS_PER_PAGE = 6;
        const pages = [];

        for (let i = 0; i < rows.length; i += ITEMS_PER_PAGE) {
            pages.push(rows.slice(i, i + ITEMS_PER_PAGE).map((row) => row.outerHTML));
        }

        const totalPages = pages.length;
        const isSinglePage = totalPages === 1;

        printRoot.className = isSinglePage ? "single-page-print" : "";

        printRoot.innerHTML = pages
            .map((pageRows, index) => {
                const isLastPage = index === pages.length - 1;
                const pageNumber = index + 1;

                return `
        <div class="print-page">
          ${headerHTML}

          <div class="print-table-wrapper">
            <table class="print-table">
              ${theadHTML}
              <tbody>
                ${pageRows.join("")}
              </tbody>
            </table>
          </div>

          ${isLastPage
                        ? `
                <div class="print-summary-wrapper">
                  ${summaryHTML}
                </div>
              `
                        : ""
                    }

          ${!isSinglePage
                        ? `
                <div class="print-page-footer">
                  Page ${pageNumber} of ${totalPages}
                </div>
              `
                        : ""
                    }
        </div>
      `;
            })
            .join("");

        let cleanedUp = false;

        const cleanup = () => {
            if (cleanedUp) return;
            cleanedUp = true;

            document.getElementById("print-root")?.remove();
            window.removeEventListener("afterprint", onAfterPrint);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };

        const onAfterPrint = () => {
            setTimeout(cleanup, isMobile ? 3000 : 800);
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                setTimeout(cleanup, 800);
            }
        };

        window.addEventListener("afterprint", onAfterPrint);
        document.addEventListener("visibilitychange", onVisibilityChange);

        try {
            if (document.fonts?.ready) {
                await document.fonts.ready.catch(() => { });
            }

            await new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve))
            );

            if (isMobile) {
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            window.print();
        } finally {
            setTimeout(cleanup, isMobile ? 12000 : 4000);
        }
    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    /* =========================
       NOT FOUND
    ========================= */

    if (!invoice) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg">

                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Invoice Not Found
                </h3>

                <p className="text-slate-500 mb-6 max-w-md">
                    The invoice you are looking for does not exist or could not be loaded.
                </p>

                <Button onClick={() => navigate("/invoices")}>
                    Back to All Invoices
                </Button>

            </div>
        );
    }

    if (isEditing) {
        return (
            <CreateInvoice
                existingInvoice={invoice}
                onSave={handleUpdate}
            />
        );
    }

    return (
        <>
            {isReminderModalOpen && (
                <ReminderModal
                    isOpen={isReminderModalOpen}
                    onClose={() => setIsReminderModalOpen(false)}
                    invoiceId={id}
                />
            )}

            {/* TOP ACTION BAR */}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">

                <h1 className="text-2xl font-semibold text-slate-900 mb-4 sm:mb-0">
                    Invoice{" "}
                    <span className="font-mono text-slate-500">
                        {invoice.invoiceNumber}
                    </span>
                </h1>

                <div className="flex items-center gap-2">

                    {invoice.status !== "Paid" && (
                        <Button
                            variant="secondary"
                            onClick={() => setIsReminderModalOpen(true)}
                            icon={Mail}
                        >
                            Generate Reminder
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        onClick={() => setIsEditing(true)}
                        icon={Edit}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handlePrint}
                        icon={Printer}
                    >
                        Print or Download
                    </Button>

                </div>
            </div>

            {/* MAIN INVOICE */}

            <div id="invoice-content-wrapper">

                <div
                    ref={invoiceRef}
                    id="invoice-preview"
                    className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-md border border-slate-200 print:p-0 print:shadow-none print:border-0"
                >

                    {/* =========================
              HEADER
          ========================= */}

                    <div className="invoice-print-header">

                        <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b border-slate-200">

                            <div>
                                <div className="flex flex-col">

                                    {businessLogo && businessLogo.trim() !== "" && (
                                        <img
                                            src={businessLogo}
                                            alt="Business Logo"
                                            className="mt-0.1 max-w-50 max-h-30 object-contain"
                                        />
                                    )}

                                    <h2 className="text-3xl font-bold text-slate-900">
                                        INVOICE
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        # {invoice.invoiceNumber}
                                    </p>

                                </div>
                            </div>

                            <div className="text-left sm:text-right mt-4 sm:mt-0">

                                <p className="text-sm text-slate-500 mb-1">
                                    Status
                                </p>

                                <div className="flex sm:justify-end">

                                    <span
                                        className={`flex items-center justify-center rounded-full text-xs font-medium h-6
                    ${invoice.status === "Paid"
                                                ? "bg-emerald-100 text-emerald-800 px-3 -mx-1"
                                                : invoice.status === "Pending"
                                                    ? "bg-amber-100 text-amber-800 px-3 min-w-[70px]"
                                                    : "bg-red-100 text-red-800 px-5 pr-5 -mx-5"
                                            }`}
                                    >
                                        {invoice.status}
                                    </span>

                                </div>
                            </div>
                        </div>

                        {/* BILL FROM / TO */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-4">

                            <div>

                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    Bill From
                                </h3>

                                <p className="font-semibold text-slate-800">
                                    {invoice.billFrom.businessName}
                                </p>

                                <p className="text-slate-600">
                                    {invoice.billFrom.address}
                                </p>

                                <p className="text-slate-600">
                                    {invoice.billFrom.email}
                                </p>

                                <p className="text-slate-600">
                                    {invoice.billFrom.phone}
                                </p>

                            </div>

                            <div className="sm:text-right">

                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    Bill To
                                </h3>

                                <p className="font-semibold text-slate-800">
                                    {invoice.billTo.clientName}
                                </p>

                                <p className="text-slate-600">
                                    {invoice.billTo.address}
                                </p>

                                <p className="text-slate-600">
                                    {invoice.billTo.email}
                                </p>

                                <p className="text-slate-600">
                                    {invoice.billTo.phone}
                                </p>

                            </div>
                        </div>

                        {/* DATES */}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">

                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    Invoice Date
                                </h3>

                                <p className="font-medium text-slate-800">
                                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    Due Date
                                </h3>

                                <p className="font-medium text-slate-800">
                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                    Payment Terms
                                </h3>

                                <p className="font-medium text-slate-800">
                                    {invoice.paymentTerms}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* =========================
              PRODUCT TABLE
          ========================= */}

                    <div className="mt-0.6 bg-white border border-slate-200 rounded-lg overflow-hidden">

                        <div className="w-full max-sm:overflow-x-auto max-sm:overscroll-x-contain max-sm:[-webkit-overflow-scrolling:touch]">

                            <table className="w-full min-w-[600px] divide-y divide-slate-200">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Product
                                        </th>

                                        <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Qty
                                        </th>

                                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Price
                                        </th>

                                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Total
                                        </th>

                                    </tr>

                                </thead>

                                <tbody className="bg-white divide-y divide-slate-200">

                                    {invoice.items.map((item, index) => (

                                        <tr key={index}>

                                            <td className="p-3 px-4 sm:px-6 py-4 text-sm font-medium text-slate-900">
                                                {item.name}
                                            </td>

                                            <td className="p-3 px-4 sm:px-6 py-4 text-center font-medium text-slate-600">
                                                {item.quantity}
                                            </td>

                                            <td className="p-3 px-4 sm:px-6 py-4 text-right font-medium text-slate-600">
                                                ₹{item.unitPrice.toFixed(2)}
                                            </td>

                                            <td className="p-3 px-4 sm:px-6 py-4 text-right font-medium text-slate-900">
                                                ₹{item.total.toFixed(2)}
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    </div>

                    {/* =========================
              SUMMARY
          ========================= */}

                    <div className="invoice-summary-section mt-6 break-inside-avoid">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mt-5">

                            {businessUpiId && (
                                <div className="w-full sm:w-auto flex flex-col items-start">
                                    <div className="border border-slate-200 rounded-lg p-3 bg-white">
                                        <QRCodeSVG
                                            value={upiPaymentString}
                                            size={isSinglePage ? 108 : 140}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-slate-500">
                                        Scan to pay ₹{Number(invoice.total).toFixed(2)}
                                    </p>

                                    <p className="text-[11px] text-slate-400 break-all mt-1">
                                        {businessUpiId}
                                    </p>
                                </div>
                            )}

                            <div className="w-full max-w-sm space-y-3 sm:ml-auto">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{invoice.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tax</span>
                                    <span>₹{invoice.taxTotal.toFixed(2)}</span>
                                </div>

                                {Number(invoice.discount) > 0 && (
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Discount</span>
                                        <span>₹{Number(invoice.discount).toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between font-semibold text-lg text-slate-900 border-t border-slate-200 pt-3 mt-3">
                                    <span>Total</span>
                                    <span>₹{invoice.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {invoice.notes && (
                            <div className="mt-4 pt-5 border-t border-slate-200">
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Notes
                                </h3>
                                <p className="text-sm text-slate-600">{invoice.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* =========================
          PRINT STYLES
      ========================= */}

            <style>
                {`
@page {
  size: A4;
  margin: 8mm;
}

@media print {

  html,
  body {
    width: 210mm;
    background: #fff;
  }

  body > *:not(#print-root) {
  display: none !important;
}

  #print-root {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm;
    min-width: 210mm;
    max-width: 210mm;
    background: #fff;
  }

  /* =========================
     PAGE
  ========================= */

  .print-page {
    position: relative;

    width: 184mm;
    min-width: 184mm;
    max-width: 184mm;

    margin: 0 auto;

    box-sizing: border-box;

    display: block;
  }

  /* ONLY MULTI PAGE SHOULD BREAK */

  #print-root:not(.single-page-print) .print-page {
    page-break-after: always;
    break-after: page;
  }

  #print-root:not(.single-page-print) .print-page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }

  /* SINGLE PAGE = NO BREAK */

  #print-root.single-page-print .print-page {
  page-break-after: auto !important;
  break-after: auto !important;

  height: auto !important;
  min-height: unset !important;

  overflow: visible !important;

  transform: scale(0.96);
  transform-origin: top center;

  width: 104.2%;
}
#print-root.single-page-print {
  overflow: hidden !important;
}
  /* =========================
     TABLE
  ========================= */

  .print-table {
    width: 100%;

    border-collapse: collapse;
    table-layout: fixed;

    border: 1px solid #e2e8f0 !important;
  }

  .print-table thead {
    display: table-header-group;
  }

  .print-table thead th {
    background: #f8fafc !important;
  }

  .print-table tr,
  .print-table td,
  .print-table th {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .print-table td,
  .print-table th {
    overflow-wrap: break-word;
    word-break: break-word;

    border-bottom: 1px solid #e2e8f0 !important;
  }

  .print-table tbody tr:last-child td {
    border-bottom: none !important;
  }

  .print-table-wrapper {
    width: 100%;
  }

  /* =========================
     SUMMARY
  ========================= */

  .print-summary-wrapper {
    margin-top: 16px;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* =========================
     PAGE FOOTER
  ========================= */

  .print-page-footer {
    margin-top: 6mm;

    padding-top: 2mm;

    font-size: 10px;
    color: #64748b;

    text-align: right;

    display: block !important;
  }

  /* HIDE FOOTER FOR SINGLE PAGE */

  #print-root.single-page-print .print-page-footer {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* =========================
     SINGLE PAGE COMPACT FIX
  ========================= */

  #print-root.single-page-print .invoice-print-header {
    padding-bottom: 8px !important;
  }

  #print-root.single-page-print .invoice-print-header .grid {
    margin-top: 8px !important;
    margin-bottom: 8px !important;
    gap: 10px !important;
  }

  #print-root.single-page-print .invoice-summary-section {
    overflow: hidden !important;
  }

  #print-root.single-page-print .invoice-summary-section .flex {
    gap: 10px !important;
  }

  /* SMALLER QR */

  #print-root.single-page-print .invoice-summary-section svg {
    width: 92px !important;
    height: 92px !important;
  }

  #print-root.single-page-print .invoice-summary-section .w-full.max-w-sm {
    max-width: 14rem !important;
  }

  #print-root.single-page-print .invoice-summary-section .text-xs {
    font-size: 9px !important;
    line-height: 1.1 !important;
  }

  #print-root.single-page-print .invoice-summary-section .text-[11px] {
    font-size: 8px !important;
    line-height: 1.1 !important;
  }

  /* REDUCE NOTES SPACE */

  #print-root.single-page-print .invoice-summary-section .mt-4 {
    margin-top: 7px !important;
  }

  #print-root.single-page-print .invoice-summary-section .pt-5 {
    padding-top: 8px !important;
  }

  /* REDUCE TABLE CELL HEIGHT */

  #print-root.single-page-print .print-table td {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }

  #print-root.single-page-print .print-table th {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
  }

  /* REMOVE EXTRA BOTTOM SPACE */

  #print-root.single-page-print .print-page {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }
}
`}
            </style>
        </>
    );
};

export default InvoiceDetail;