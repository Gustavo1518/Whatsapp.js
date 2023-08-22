const ExcelJS = require("exceljs");
const ExcelSave = require('./guardarExcel');
console.log("inicio")
function excelRead(ruta){
const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile(ruta).then(() => {
    const hoja1 = workbook.getWorksheet(1);
    const columA = hoja1.getColumn('A');
    let registros = 0;
    columA.eachCell(cell => {
        registros++;
    });
    let datos = hoja1.getRows(2,registros-1);
    for(let i = 0; i<datos.length; i++){
        console.log("nombres :",datos[i].values[1]);
    }
}).catch(error => {
    console.log("ocurrio el error:", error);
})
};

const Excel = {
    excelRead
};

module.exports = Excel;


