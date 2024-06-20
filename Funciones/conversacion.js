//const express = require('express')
//const routes = require('./routes/chathoot-hook')
const configuracion = require('../Configuracion/configuracion');
const basedatos = require('./basedatos')

/**
 * Guarda una conversación en la base de datos
 * @param {ctx} ctx - Contexto de la conversacion
 * @param {string} mensajeBot - Mensaje enviado por el bot
 */
async function Guardar (ctx, mensajeBot){

    //Declaración de variables que contendrán los datos
    let nombreBot = configuracion.NOMBRE_BOT 
    let idConversacion = ctx.key.id
    let nombreWhatsappCliente = ctx.pushName
    let telefonoCliente = ctx.from
    let mensajeCliente = ctx.body
    
    //Remover los emojis que hayan en los mensajes
    nombreWhatsappCliente = nombreWhatsappCliente.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    mensajeBot = mensajeBot.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    mensajeCliente = mensajeCliente.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')

    //Obtener la fecha del sistema
    fechaBruta = new Date()
    fechaFormateada = fechaBruta.getFullYear() + '-' + (fechaBruta.getMonth() + 1) + '-' + fechaBruta.getDate() + ' ' + fechaBruta.getHours() + ':' + fechaBruta.getMinutes() + ':' + fechaBruta.getSeconds()

    //Configurar los datos a almacenar
    try {

        //Armar la estructura JSON con los datos a almacenar
        let datos = JSON.stringify({
            "data": {
            "fecha": fechaBruta,
            "nombreBot": nombreBot,
            "idConversacion": idConversacion,
            "nombreWhatsappCliente": nombreWhatsappCliente,
            "telefonoCliente": telefonoCliente,
            "mensajeBot": mensajeBot,
            "mensajeCliente": mensajeCliente
            }
        });

        //Guardar en la base de datos
        basedatos.Guardar(datos, configuracion.TABLA_CONVERSACIONES)

    } catch (err) {

        //Mostrar el mensaje de error
        console.error(err);

    }

    return true;
    
}

module.exports = { Guardar }