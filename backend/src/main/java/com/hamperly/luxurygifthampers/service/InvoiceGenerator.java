package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.entity.Order;
import com.hamperly.luxurygifthampers.entity.OrderItem;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.File;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceGenerator {

    public String generateInvoicePdf(Order order) {
        try {
            // Create uploads directory if not exists
            String uploadDir = "uploads/invoices";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName = "Invoice_" + order.getOrderId() + ".pdf";
            String filePath = uploadDir + "/" + fileName;

            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, new FileOutputStream(filePath));

            document.open();

            // Font configurations
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(212, 175, 55)); // Gold
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(51, 65, 85)); // Slate
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font regularFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.GRAY);

            // 1. Header Table
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{60, 40});

            // Company info (Left)
            PdfPCell cellLeft = new PdfPCell();
            cellLeft.setBorder(Rectangle.NO_BORDER);
            cellLeft.addElement(new Paragraph("LUXURY GIFT HAMPERS", titleFont));
            cellLeft.addElement(new Paragraph("Premium Gifting & Handcrafted Hampers", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY)));
            cellLeft.addElement(new Paragraph("\nSupport: support@hamperly.com\nWeb: www.hamperly.com", regularFont));
            headerTable.addCell(cellLeft);

            // Invoice details (Right)
            PdfPCell cellRight = new PdfPCell();
            cellRight.setBorder(Rectangle.NO_BORDER);
            cellRight.setHorizontalAlignment(Element.ALIGN_RIGHT);
            Paragraph invTitle = new Paragraph("INVOICE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.BLACK));
            invTitle.setAlignment(Element.ALIGN_RIGHT);
            cellRight.addElement(invTitle);
            
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm");
            String invoiceNo = "INV-" + order.getOrderId().substring(Math.max(0, order.getOrderId().length() - 8)).toUpperCase();
            
            Paragraph details = new Paragraph(
                "Invoice Number: " + invoiceNo + "\n" +
                "Date: " + LocalDateTime.now().format(dtf) + "\n" +
                "Order ID: " + order.getOrderId() + "\n" +
                "Payment ID: " + (order.getPaymentId() != null ? order.getPaymentId() : "N/A") + "\n" +
                "Payment Status: " + (order.getPaymentStatus() != null ? order.getPaymentStatus().toUpperCase() : "PAID"),
                regularFont
            );
            details.setAlignment(Element.ALIGN_RIGHT);
            cellRight.addElement(details);
            headerTable.addCell(cellRight);

            document.add(headerTable);

            // Add visual spacing
            document.add(new Paragraph("\n"));
            
            // Draw horizontal dividing line
            PdfPTable line = new PdfPTable(1);
            line.setWidthPercentage(100);
            PdfPCell lineCell = new PdfPCell(new Phrase(""));
            lineCell.setBorder(Rectangle.BOTTOM);
            lineCell.setBorderWidth(1f);
            lineCell.setBorderColor(new Color(212, 175, 55)); // Gold line
            line.addCell(lineCell);
            document.add(line);
            
            document.add(new Paragraph("\n"));

            // 2. Billing & Delivery Info
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{50, 50});

            // Customer details
            PdfPCell customerCell = new PdfPCell();
            customerCell.setBorder(Rectangle.NO_BORDER);
            customerCell.addElement(new Paragraph("BILLED TO:", subTitleFont));
            customerCell.addElement(new Paragraph(order.getUser().getFullName(), boldFont));
            customerCell.addElement(new Paragraph(order.getUser().getEmail(), regularFont));
            customerCell.addElement(new Paragraph("Phone: " + order.getUser().getMobileNumber(), regularFont));
            infoTable.addCell(customerCell);

            // Shipping address details
            PdfPCell shippingCell = new PdfPCell();
            shippingCell.setBorder(Rectangle.NO_BORDER);
            shippingCell.addElement(new Paragraph("SHIPPING ADDRESS:", subTitleFont));
            shippingCell.addElement(new Paragraph(
                (order.getShippingAddress() != null ? order.getShippingAddress() : "N/A") + "\n" +
                (order.getCity() != null ? order.getCity() : "") + ", " + (order.getState() != null ? order.getState() : "") + "\n" +
                (order.getCountry() != null ? order.getCountry() : "") + " - " + (order.getPostalCode() != null ? order.getPostalCode() : ""),
                regularFont
            ));
            infoTable.addCell(shippingCell);

            document.add(infoTable);

            document.add(new Paragraph("\n"));

            // 3. Products Table
            PdfPTable productsTable = new PdfPTable(5);
            productsTable.setWidthPercentage(100);
            productsTable.setWidths(new float[]{40, 15, 10, 15, 20});

            // Headers
            String[] headers = {"Product Name", "Price (INR)", "Qty", "GST (18%)", "Subtotal"};
            for (String header : headers) {
                PdfPCell headerCell = new PdfPCell(new Phrase(header, headerFont));
                headerCell.setBackgroundColor(new Color(51, 65, 85)); // Slate
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setPadding(8);
                productsTable.addCell(headerCell);
            }

            // Products data
            for (OrderItem item : order.getOrderItems()) {
                // Name
                PdfPCell nameCell = new PdfPCell(new Phrase(item.getProduct().getName(), regularFont));
                nameCell.setPadding(6);
                productsTable.addCell(nameCell);

                // Price per unit
                PdfPCell priceCell = new PdfPCell(new Phrase("₹" + item.getPricePerUnit().setScale(2).toString(), regularFont));
                priceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                priceCell.setPadding(6);
                productsTable.addCell(priceCell);

                // Quantity
                PdfPCell qtyCell = new PdfPCell(new Phrase(item.getQuantity().toString(), regularFont));
                qtyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                qtyCell.setPadding(6);
                productsTable.addCell(qtyCell);

                // GST (18% included or added, let's display it clearly)
                // Assuming price includes GST, display the component
                BigDecimal gstComponent = item.getTotalPrice().multiply(new BigDecimal("0.18")).divide(new BigDecimal("1.18"), 2, BigDecimal.ROUND_HALF_UP);
                PdfPCell gstCell = new PdfPCell(new Phrase("₹" + gstComponent.toString(), regularFont));
                gstCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                gstCell.setPadding(6);
                productsTable.addCell(gstCell);

                // Subtotal
                PdfPCell subtotalCell = new PdfPCell(new Phrase("₹" + item.getTotalPrice().setScale(2).toString(), regularFont));
                subtotalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                subtotalCell.setPadding(6);
                productsTable.addCell(subtotalCell);
            }

            document.add(productsTable);

            document.add(new Paragraph("\n"));

            // 4. Summary Table
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(40);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            summaryTable.setWidths(new float[]{60, 40});

            // Item Total
            summaryTable.addCell(createSummaryLabelCell("Item Total:", regularFont));
            summaryTable.addCell(createSummaryValueCell("₹" + order.getItemTotal().setScale(2).toString(), regularFont));

            // Discount
            summaryTable.addCell(createSummaryLabelCell("Discount:", regularFont));
            summaryTable.addCell(createSummaryValueCell("-₹" + order.getDiscount().setScale(2).toString(), regularFont));

            // Coupon
            summaryTable.addCell(createSummaryLabelCell("Coupon Disc:", regularFont));
            summaryTable.addCell(createSummaryValueCell("-₹" + order.getCouponDiscount().setScale(2).toString(), regularFont));

            // Shipping
            summaryTable.addCell(createSummaryLabelCell("Shipping:", regularFont));
            summaryTable.addCell(createSummaryValueCell("₹" + order.getShippingCharge().setScale(2).toString(), regularFont));

            // Tax
            summaryTable.addCell(createSummaryLabelCell("Tax (GST):", regularFont));
            summaryTable.addCell(createSummaryValueCell("₹" + order.getTax().setScale(2).toString(), regularFont));

            // Grand Total
            PdfPCell grandTotalLabel = new PdfPCell(new Phrase("Grand Total:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(212, 175, 55))));
            grandTotalLabel.setHorizontalAlignment(Element.ALIGN_RIGHT);
            grandTotalLabel.setBorder(Rectangle.NO_BORDER);
            grandTotalLabel.setPadding(4);
            summaryTable.addCell(grandTotalLabel);

            PdfPCell grandTotalValue = new PdfPCell(new Phrase("₹" + order.getGrandTotal().setScale(2).toString(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, new Color(212, 175, 55))));
            grandTotalValue.setHorizontalAlignment(Element.ALIGN_RIGHT);
            grandTotalValue.setBorder(Rectangle.NO_BORDER);
            grandTotalValue.setPadding(4);
            summaryTable.addCell(grandTotalValue);

            document.add(summaryTable);

            document.add(new Paragraph("\n\n"));

            // 5. Payment details & terms
            Paragraph footerTitle = new Paragraph("Thank you for shopping with Luxury Gift Hampers!", subTitleFont);
            footerTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(footerTitle);

            Paragraph footerTerms = new Paragraph(
                "\nTerms & Conditions:\n" +
                "1. All hampers are hand-wrapped and inspected for maximum quality.\n" +
                "2. Goods once delivered can only be returned in case of damage during transit.\n" +
                "3. For queries, contact us at support@hamperly.com.",
                footerFont
            );
            footerTerms.setAlignment(Element.ALIGN_LEFT);
            document.add(footerTerms);

            document.close();

            return filePath;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF invoice: " + e.getMessage(), e);
        }
    }

    private PdfPCell createSummaryLabelCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(3);
        return cell;
    }

    private PdfPCell createSummaryValueCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(3);
        return cell;
    }
}
