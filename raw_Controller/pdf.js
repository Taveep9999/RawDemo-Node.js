const fs = require('fs');
const knex = require('../db/dbnaja');
const PDFDocument = require('pdfkit');

async function getUsers() {
  return await knex('infous')
    .select('id', 'email', 'username', 'name', 'lastname', 'permis');
}

function generatePDF(users) {
  const doc = new PDFDocument();
  let pageNumber = 1;

  const tableHeaders = ['ID', 'Name', 'Lastname', 'Email'];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    if ((i + 1) % 10 === 1 && i !== 0) {
      doc.addPage();
      pageNumber++;

      // Draw table headers on each new page
      drawTable(doc, tableHeaders);
    }

    // Draw user information in the table
    const rowData = [user.id, `${user.name} ${user.lastname}`, user.email];
    drawTable(doc, rowData);
  }

  const pdfFileName = `users_page_${pageNumber}.pdf`;
  const writeStream = fs.createWriteStream(pdfFileName);
  doc.pipe(writeStream);
  doc.end();

  console.log(`PDF generated successfully: ${pdfFileName}`);
}

// Function to draw a table
function drawTable(doc, data) {
  const cellWidth = 150;
  const cellPadding = 10;

  doc.font('Helvetica-Bold');
  data.forEach((cell, i) => {
    doc.text(cell, i * cellWidth + cellPadding, doc.y, { width: cellWidth });
  });

  doc.moveDown();
  doc.font('Helvetica');
}

async function main() {
  try {
    const users = await getUsers();
    generatePDF(users);
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = main;