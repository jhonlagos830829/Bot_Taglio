const { addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

//////////////////////////////////////// FUNCIONES ELABORADAS

const mensajes = require('../Configuracion/mensajes')
const conversacion = require('../Funciones/conversacion.js')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoNotaDeVozEnviada = addKeyword(EVENTS.VOICE_NOTE)
    .addAction(async (ctx, { flowDynamic, endFlow }) => {
            
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await conversacion.Guardar(ctx, 'El flujo flujoNotaDeVozEnviada se disparó por el texto: ')

            //Realizar una pausa de 1 segundo
            await delay(1000)

            //Enviar mensaje de saludo inicial
            flowDynamic(mensajes.SALUDO_INICIAL)

            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.SALUDO_INICIAL)

            //Realizar una pausa de 1 segundo
            await delay(1000)

            //Enviar mensaje de no se reciben notas de voz
            flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

            //Salir del flujo
            return endFlow
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoNotaDeVozEnviada, el sistema respondió: ' + error)

        } 

    })
    /*
    .addAnswer(mensajes.SALUDO_INICIAL, {delay:2000})
    .addAnswer(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ, {delay:3000}, async (ctx, { endflow }) => {
        return endflow
    })
    */

