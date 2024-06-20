module.exports = Object.freeze({
    
    /*
        1. ZONA HORARIA: Para que la asignación de turnos funcione correctamente se debe configurar la zona hoaria en el servidor donde se ejecuta el bot
        se debe configurar como zona horaria America/Bogota, para ello se puede realizar desde la consola con el siguiente comando.
    */

    //Constantes de configuración
    NOMBRE_BOT: 'Taglio',
    URL_API: 'http://127.0.0.1:1337/api/',
    TOKEN_STRAPI: 'c81ef3c104424e76fc0942bd69ad291be84d273ef9507b57d5ae4056e8174035f8667c8322e18dea33daf3ff773472db7238de14c299084cf38f19c5b1eff93e48a15e9c561d791bf9a1d465ddc16c5e849de9aa69cd3274a891557aab58fbbc42dff70aa85309c5a623a2fb55e8ae88c590b9471dc4395c9d892294e188cffd',
    TIEMPO_ESPERA_RESPUESTA: 45,
    NUMERO_NOTIFICAR_CITA: '573013584693' + '@s.whatsapp.net', //
    TABLA_CONVERSACIONES: 'tg-conversaciones',
    TABLA_CLIENTES: 'tg-clientes',
    URL_BUSCAR_CLIENTE: 'tg-clientes?filters[numeroWhatsapp][$contains]=',
    URL_BUSCAR_CITA: 'lb-citas?filters[idCalendarioCita][$eq]=',
    TABLA_SOLICITUDES_NOTIFICACION_CLIENTES: 'lb-clientes-notificars',
    URL_OBTENER_NOTIFICACIONES_PENDIENTES: 'lb-clientes-notificars?filters[notificado][$eq]=false',

});