const ExcelJS = require('exceljs');
const fs = require('fs');
const knex = require('../db/dbnaja');


async function exportToExcel(req,res) {
  try {
    const user = await knex('infous')
    .select('id', 'email','username','name','lastname', 'permis');

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

worksheet.columns = [
  { header: 'ID', key: 'id', width: 10 },
  { header: 'Email', key: 'email', width: 20 },
  { header: 'Username', key: 'username', width: 20 },
  { header: 'Name', key: 'name', width: 20 },
  { header: 'Lastname', key: 'lastname', width: 20 },
  { header: 'Permission', key: 'permis', width: 15 },
];

  user.forEach((row) => {
    worksheet.addRow(row);
  });

 await workbook.xlsx.writeFile((`infous.xlsx`))
    console.log('Excel file generated successfully');
    res.status(200).send('Excel export now')
  }catch(error) {
    console.error('Error exporting to Excel:', error);
  }
}


module.exports=exportToExcel


