const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoSaludo = require('./flujoSaludo')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/pre[cs]+ios/gmi'

module.exports = flujoPrecios = addKeyword(ExpRegFlujo, { regex: true })
.addAction(async (ctx, { endflow }) => {
    
    //Registrar el mensaje
    try {

        //Registrar la conversación
        await conversacion.Guardar(ctx, 'El flujo flujoPrecios se disparó por el texto: ')
        
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoPrecios, el sistema respondió: ' + error)

    } 

})
.addAnswer(mensajes.MENSAJE_FLUJO_PRECIOS, {capture:false}, async (ctx, {gotoFlow}) => {
    
    //Registrar el mensaje
    try {

        //Registrar la conversación
        await conversacion.Guardar(ctx, mensajes.MENSAJE_FLUJO_PRECIOS)

        //Esperar unos segundos
        await delay(4000)
        
        //Volver al flujo principal
        return gotoFlow(require('./flujoSaludo.js'), 2)
                
    } catch (error) {

        //Solicitar una respuesta valida
        console.log('Error al registrar la conversación en el flujo flujoPrecios, el sistema respondió: ' + error)

    } 

})
