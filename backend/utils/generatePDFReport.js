import PDFDocument from 'pdfkit';
import fs from 'fs';

// Utility function to generate the PDF report
const generatePDFReport = (data, filePath) => {
  const doc = new PDFDocument();

  // Pipe the document to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Add content to the PDF
  doc.fontSize(20).text('Waste Management Report', { align: 'center' });
  doc.moveDown();

  // Report Type
  doc.fontSize(16).text(`Report Type: ${data.reportType}`);
  doc.moveDown();

  // Criteria
  doc.fontSize(16).text(`Criteria: ${data.criteria}`);
  doc.moveDown();

  // Add sections for Payments, Users, and Collection Schedules
  doc.fontSize(14).text('Payments:', { underline: true });
  data.payments.forEach((payment) => {
    doc.text(`User: ${payment.user}, Amount: ${payment.amount}, Date: ${payment.date}`);
  });

  doc.moveDown();
  doc.fontSize(14).text('Users:', { underline: true });
  data.users.forEach((user) => {
    doc.text(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
  });

  doc.moveDown();
  doc.fontSize(14).text('Collection Schedules:', { underline: true });
  data.schedules.forEach((schedule) => {
    doc.text(`Date: ${schedule.date}, Location: ${schedule.location}, Status: ${schedule.status}`);
  });

  // Finalize the PDF and end the stream
  doc.end();
};

export default generatePDFReport;
