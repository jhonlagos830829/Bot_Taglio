const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion.js')
const mensajes = require('../Configuracion/mensajes.js')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoSaludo = require('./flujoSaludo.js')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/trabajos/gmi'

module.exports = flujoImagenes = addKeyword(ExpRegFlujo, { regex: true })
.addAction(async (ctx, { endflow }) => {
    
    //Registrar el mensaje
    try {

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)

        //Registrar la conversación
        await conversacion.Guardar(ctx, 'El flujo flujoImagenes se disparó por el texto: ')
        
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoImagenes, el sistema respondió: ' + error)

    } 

})
.addAnswer(mensajes.MENSAJE_FLUJO_IMAGENES, {capture:false}, async (ctx, {gotoFlow}) => {
    
    //Registrar el mensaje
    try {

        //Registrar la conversación
        await conversacion.Guardar(ctx, mensajes.MENSAJE_FLUJO_IMAGENES)

        //Esperar unos segundos
        await delay(1000)
        
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoImagenes, el sistema respondió: ' + error)

    } 

})
.addAction(async (ctx, ctxFn) => {

    //Registrar el inicio de la conversación
    try {

        //Enviar imagen 1
        await ctxFn.flowDynamic([{body:"Diseño 1", media:mensajes.URL_IMAGEN_1_FLUJO_IMAGENES, delay: 1000,}])
        
        //Enviar imagen 2
        await ctxFn.flowDynamic([{body:"Diseño 2", media:mensajes.URL_IMAGEN_2_FLUJO_IMAGENES, delay: 1000,}])

        //Enviar imagen 3
        await ctxFn.flowDynamic([{body:"Diseño 3", media:mensajes.URL_IMAGEN_3_FLUJO_IMAGENES, delay: 1000,}])

        //Enviar imagen 4
        await ctxFn.flowDynamic([{body:"Diseño 4", media:mensajes.URL_IMAGEN_4_FLUJO_IMAGENES, delay: 1000,}])

        //Esperar unos segundos
        await delay(4000)

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
        
        //Volver al flujo principal
        return ctxFn.gotoFlow(require('./flujoSaludo.js'), 2)

    } catch (error) {

        //Mostrar el mensaje de error en la consola
        console.log('Error al registrar la conversación, el sistema respondió: ' + error)

    }

})