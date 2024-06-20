const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys')

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const temporizador = require('../Funciones/temporizador')
const calendario = require('../Funciones/calendario')
const calendarioGoogle = require('../Funciones/google/calendarioGoogle')
const fechas = require('../Funciones/fechas')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoDespedida = require('./flujoDespedida')
const configuracion = require('../Configuracion/configuracion')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/^S[iíÍ]$/gmi'
const ExpRegRespuestas = new RegExp("[\\w]{26}", "i");

module.exports = flujoRecibirRadicado = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
            
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await conversacion.Guardar(ctx, 'El flujo flujoRecibirRadicado se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoRecibirRadicado, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer(mensajes.MENSAJE_SOLICITAR_RADICADO_FLUJO_CANCELAR_CITA, {capture: true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {
            
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_SOLICITAR_RADICADO_FLUJO_CANCELAR_CITA)

            //Si la respuesta no está entre la las posibles de la expresión regular
            if(ExpRegRespuestas.test(ctx.body) == false){

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n' + mensajes.MENSAJE_SOLICITAR_RADICADO_FLUJO_CANCELAR_CITA)

                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
    
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n' + mensajes.MENSAJE_SOLICITAR_RADICADO_FLUJO_CANCELAR_CITA)
    
            }

            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)

            //Eliminar la cita del calendario
            let citas = await calendarioGoogle.eliminarCita(ctx.body)

            //Obtener de la base de datos los datos de la cita
            let datosCita = await registrarConversacion.obtenerCita(ctx.body)

            //Armar el mensaje de notificación
            let detallesCita = '\n\n*Cliente:* ' + datosCita.data[0].attributes.nombreCliente + '\n*Fecha:* ' + fechas.fechaHoraLegible(datosCita.data[0].attributes.fecha) + '\n*Teléfono:* ' + datosCita.data[0].attributes.telefonoCliente

            //Enviar mensaje de notificación de cita cancelada
            await ctxFn.provider.sendText(configuracion.NUMERO_NOTIFICAR_CITA, mensajes.MENSAJE_NOTIFICACION_CANCELACION_CITA + detallesCita)

            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_NOTIFICACION_CANCELACION_CITA + detallesCita)

            //Realizar una pausa de 1 segundo
            await delay(1000)

            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_CONFIRMACION_CITA_CANCELADA)

            //Enviar mensaje de confiración de cancelación de la cita
            ctxFn.flowDynamic(mensajes.MENSAJE_CONFIRMACION_CITA_CANCELADA)

            //Realizar una pausa de 1 segundo
            await delay(1000)

            //Ir al flujo de despedida
            ctxFn.gotoFlow(flujoDespedida)

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoRecibirRadicado, el sistema respondió: ' + error)

        }

    })