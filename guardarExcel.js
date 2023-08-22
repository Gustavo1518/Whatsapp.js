const ExcelJS = require('exceljs');

const filename = 'datos.xlsx';

async function cargarRegistrosDesdeExcel() {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filename);
    const worksheet = workbook.getWorksheet('Sheet1');
    const registros = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) { // Omitir el encabezado (fila 1)
        const registro = {};
        row.eachCell((cell, colNumber) => {
          registro[worksheet.getRow(1).getCell(colNumber).value] = cell.value;
        });
        registros.push(registro);
      }
    });

    return registros;
  } catch (error) {
    console.error('Error al cargar los registros desde Excel:', error);
    return [];
  }
};

async function guardarRegistrosEnExcel(registros, id, tel, nom) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sheet1');
  
      // Encabezados
      worksheet.addRow(Object.keys(registros[0]));
  
      // Datos existentes
      registros.forEach((registro) => {
        worksheet.addRow(Object.values(registro));
      });
  
      // Agregar nuevos registros (simulados)
      const nuevoRegistro1 = { Nombre: id, Edad: tel, Ciudad: nom };
      worksheet.addRow(Object.values(nuevoRegistro1));
  
      // Guardar el archivo actualizado
      await workbook.xlsx.writeFile(filename);
      console.log('Registros actualizados y guardados en el archivo.');
    } catch (error) {
      console.error('Error al guardar los registros en Excel:', error);
    }
  };
  
  async function main(id, tel, nom) {
    const registros = await cargarRegistrosDesdeExcel();
    guardarRegistrosEnExcel(registros, id, tel, nom);
  };
  const ExcelSave = {
    main
  };

  module.exports = ExcelSave;