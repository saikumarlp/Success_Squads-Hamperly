package com.hamperly.luxurygifthampers.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long id;

    @Column(name = "order_id", nullable = false, length = 255)
    private String orderId;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 255)
    private String invoiceNumber;

    @Column(name = "pdf_path", nullable = false, length = 255)
    private String pdfPath;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    public Invoice() {
    }

    public Invoice(Long id, String orderId, String invoiceNumber, String pdfPath, LocalDateTime generatedAt) {
        this.id = id;
        this.orderId = orderId;
        this.invoiceNumber = invoiceNumber;
        this.pdfPath = pdfPath;
        this.generatedAt = generatedAt != null ? generatedAt : LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public static InvoiceBuilder builder() {
        return new InvoiceBuilder();
    }

    public static class InvoiceBuilder {
        private Long id;
        private String orderId;
        private String invoiceNumber;
        private String pdfPath;
        private LocalDateTime generatedAt;

        public InvoiceBuilder id(Long id) { this.id = id; return this; }
        public InvoiceBuilder orderId(String orderId) { this.orderId = orderId; return this; }
        public InvoiceBuilder invoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; return this; }
        public InvoiceBuilder pdfPath(String pdfPath) { this.pdfPath = pdfPath; return this; }
        public InvoiceBuilder generatedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; return this; }

        public Invoice build() {
            return new Invoice(id, orderId, invoiceNumber, pdfPath, generatedAt);
        }
    }
}
