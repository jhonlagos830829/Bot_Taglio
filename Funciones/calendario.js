const axios = require('axios').default;
const configuracion = require('../Configuracion/configuracion');

//Funcion para consultar citas
function ConsultarCitas(FechaInicial, FechaFinal) {

    //console.log('FechaInicial:' + FechaInicial)
    //console.log('FechaFinal:' + FechaFinal)
    
    try {

        //Declaración de variable para consulta
        let data = JSON.stringify({
            "fecha_inicial": FechaInicial,
            "fecha_final": FechaFinal
        });
        
        //Configuración de la consulta
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: configuracion.URL_CONSULTAR_CITAS,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
        //Obtener las cuentas para el registro de los movimientos
        var citas = axios.request(config)

    } catch (error) {


        //Mostrar el mensaje de error
        console.error(error);

    }

    return citas;

}

//Funcion para crear citas
function CrearCita(Fecha, Nombre) {

    //console.log('Fecha:' + Fecha)
    //console.log('Nombre:' + Nombre)
    
    try {

        //Declaración de variable para consulta
        let data = JSON.stringify({
            "nombre": Nombre,
            "fecha": Fecha
        });
        
        //Configuración de la consulta
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: configuracion.URL_CREAR_CITAS,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
        //Obtener las cuentas para el registro de los movimientos
        var cita = axios.request(config)

    } catch (error) {


        //Mostrar el mensaje de error
        console.error(error);

    }

    return cita;
}


//Funcion para eliminar citas
function EliminarCita(radicado) {

    //console.log('Fecha:' + Fecha)
    //console.log('Nombre:' + Nombre)
    
    try {

        //Declaración de variable para consulta
        let data = JSON.stringify({
            "id_evento": radicado
        });
        
        //Configuración de la consulta
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: configuracion.URL_ELIMINAR_CITAS,
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
        //Obtener las cuentas para el registro de los movimientos
        var cita = axios.request(config)

    } catch (error) {


        //Mostrar el mensaje de error
        console.error(error);

    }

    return cita;
}


module.exports.ConsultarCitas = ConsultarCitas;
module.exports.CrearCita = CrearCita;
module.exports.EliminarCita = EliminarCita;