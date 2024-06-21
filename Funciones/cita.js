const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')


async function Guardar (ctx, nombreCliente, fecha, idCalendarioCita, estado){

    let nombreBot = configuracion.NOMBRE_BOT 
    let numeroWhatsapp = ctx.from
    let fechaCita = Date.parse(fecha)
  
    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
                "numeroWhatsapp": numeroWhatsapp,
                "nombreCliente": nombreCliente,
                "fecha": fechaCita,
                "idCalendarioCita": idCalendarioCita,
                "estado": estado
            }
        });

        //Guardar en la base de datos
        salida = await basedatos.Guardar(datos, configuracion.TABLA_CITAS)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return salida;
    
}

/**
 * Obtiene los datos del cliente a partir del numero de WhatsApp del cliente
 * @param {*} numeroWhatsapp - Número de WhatsApp del cliente
 * @returns 
 */
async function obtenerCliente(numeroWhatsapp){
  
    //Variable para obtener los resultados de la búsqueda
    var datosCliente
    
    //Configurar los datos a almacenar
    try {
  
      //Guardar en la base de datos
      datosCliente = await basedatos.Buscar(configuracion.URL_BUSCAR_CLIENTE, numeroWhatsapp + '&populate=*')
  
      //console.log('Dele -> ' + datosCliente)
  
    } catch (err) {
  
      //Mostrar el mensaje de error
      console.error(err);
  
    }
  
    //Retornar los datos
    return datosCliente;
  
  }
  

module.exports = { Guardar, obtenerCliente }