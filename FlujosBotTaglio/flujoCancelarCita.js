const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys')

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const calendario = require('../Funciones/calendario')
const fechas = require('../Funciones/fechas')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoDespedida = require('./flujoDespedida')
const flujoRecibirRadicado = require('./flujoRecibirRadicado')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/(([ck]an[cs]+elar)[a-z ]*([cs]ita|turno)*)/gmi'
const ExpRegRespuestas = new RegExp("^S[iíÍ]$|^No$", "i");

module.exports = flujoCancelarCita = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
         
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await conversacion.Guardar(ctx, 'El flujo flujoCancelarCita se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoCancelarCita, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer(mensajes.PREGUNTA_FLUJO_CANCELAR_CITA + mensajes.MENU_OPCIONES_FLUJO_CANCELAR_CITA, {capture: true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {
            
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.PREGUNTA_FLUJO_CANCELAR_CITA + mensajes.MENU_OPCIONES_FLUJO_CANCELAR_CITA)

            //Si la respuesta no está entre la las posibles de la expresión regular
            if(ExpRegRespuestas.test(ctx.body) == false){

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n' + mensajes.PREGUNTA_FLUJO_CANCELAR_CITA + mensajes.MENU_OPCIONES_FLUJO_CANCELAR_CITA)
    
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n' + mensajes.PREGUNTA_FLUJO_CANCELAR_CITA + mensajes.MENU_OPCIONES_FLUJO_CANCELAR_CITA)
    
            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoCancelarCita, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    }, [flujoRecibirRadicado])