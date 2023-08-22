const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const ExcelJS = require("exceljs");
const ExcelSave = require('./guardarExcel');
const app = express();
const port = 5000;
const client = new Client({
    authStrategy: new LocalAuth()
});

    
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Se inicio sesion correctamente');
    client.sendMessage('5215614562120@c.us', "Estoy listo Gustavo");
});

client.on('message', async message => {
	if(message.body === '1') {
    if(!validaNumero(message.from)){
      ExcelSave.main(1,message.from, message.body);
      message.reply( `Gracias por tu respuesta eligiste ${message.body}`);
      message.react('❤️');
      numeros.push(message.from)
    }
	}else if(message.body === '2'){
    if(!validaNumero(message.from)){
      ExcelSave.main(2,message.from, message.body);
      message.reply( `Gracias por tu respuesta eligiste ${message.body}`);
      message.react('👍');
      numeros.push(message.from)
    }
    }else if(message.body === '3'){
      if(!validaNumero(message.from)){
        ExcelSave.main(3,message.from, message.body);
        message.reply( `Gracias por tu respuesta eligiste ${message.body}`);
        message.react('😢');
        numeros.push(message.from)
      }
    }
});

const numeros = [];

function validaNumero(n){
    for(let i = 0; i<numeros.length; i++){
        if(numeros[i] === n) return true;
      }
      return false;
};

function Espera(numbers, text) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.sendMessage(numbers, text)
          .then(() => resolve( console.log()))
          .catch((error) => reject(error));
      }, 3000);
    });
  };
let datos;
app.get('/whatsapp', async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile('Reporte.xlsx');

        const hoja1 = workbook.getWorksheet(1);
        const columA = hoja1.getColumn('A');
        let registros = 0;

        columA.eachCell(cell => {
            registros++;
        });

        datos = hoja1.getRows(2, registros - 1);

        for (let i = 0; i < datos.length; i++) {
            num = datos[i].values[2] + '@c.us';
            msg = `_*¿Como evaluaria nuestro servicio?*_\n\nElige el numero de las siguientes opciones\n\n1️⃣ Bueno\n\n2️⃣ Regular\n\n3️⃣ Malo\n`;
            console.log("nombres :", datos[i].values[1], "Numeros: ", num);

            try {
                await Espera(num, msg);
            } catch (error) {
                console.log("Ocurrio un error al ejecutar la funcion de envio");
            }
        }

        const jsonData = datos.map(dato => ({
            nombre: dato.values[1],
            numero: dato.values[2] + '@c.us'
        }));
        
        // Enviar la respuesta
        res.json(jsonData);
    } catch (error) {
        console.error("Error al leer el archivo excel", error);
        res.status(500).send("Error en el servidor");
    }
});

client.initialize();
app.listen(port, () => {
    console.log(`Express ejecutando en el puerto : ${port}`)
});




