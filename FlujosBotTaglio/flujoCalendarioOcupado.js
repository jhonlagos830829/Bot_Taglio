const {addKeyword} = require('@bot-whatsapp/bot')

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const configurar = require('../Funciones/configuracion')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegRespuestas = new RegExp("^S[íiIÍ]+$|^N[oóOÓ]+$", "i")
const ExpRegRespuestaAfirmativa = new RegExp("^S[íiIÍ]+$", "i")
const ExpRegRespuestaNegativa = new RegExp("^N[oóOÓ]+$", "i")

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoCalendarioOcupado = addKeyword(['D3KL1oUYEdGmIido0H7TlsrXjWooBmeslTjrF7afV6eCat3Yeq'])
    .addAction(async (ctx) => {
            
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await conversacion.Guardar(ctx, 'El flujo flujoCalendarioOcupado se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoCalendarioOcupado, el sistema respondió: ' + error)

        } 

    })
    .addAnswer(mensajes.MENSAJE_CALENDARIO_OCUPADO_FLUJO_PROGRAMAR_CITA, {delay:100}, async (ctx, ctxFn) => {
    
        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_CALENDARIO_OCUPADO_FLUJO_PROGRAMAR_CITA)
            
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_INFORMAR_DISPONIBLE_FLUJO_PROGRAMAR_CITA)

            //Ofrecer la opción de avisar si desea que se le avise cuando pueda agendar la cita
            ctxFn.flowDynamic(mensajes.MENSAJE_INFORMAR_DISPONIBLE_FLUJO_PROGRAMAR_CITA)

            
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoCalendarioOcupado, el sistema respondió: ' + error)
    
        } 
        
    })
    .addAction({capture: true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {
           
            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){
                
                //Hacer una pausa de 2 segundos
                await delay(1000)

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(1000)
                
                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.PREGUNTA_FLUJO_BIENVENIDA + mensajes.MENU_OPCIONES_FLUJO_BIENVENIDA)

                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

                //Mostrar las opciones de nuevo
                ctxFn.fallBack(mensajes.MENSAJE_INFORMAR_DISPONIBLE_FLUJO_PROGRAMAR_CITA)

            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + mensajes.MENSAJE_INFORMAR_DISPONIBLE_FLUJO_PROGRAMAR_CITA)
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
                
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_INFORMAR_DISPONIBLE_FLUJO_PROGRAMAR_CITA)
                
            }
            else if(ExpRegRespuestaAfirmativa.test(ctx.body) == true){

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.MENSAJE_INFORMAR_DISPONIBLE_FLUJO_PROGRAMAR_CITA)

                //Registrar la solicitud de notificación del cliente
                await registrarConversacion.guardarSolicitudNotificacion(ctx)
                    
            }

            //Ir al flujo de despedida
            return ctxFn.gotoFlow(require('./flujoDespedida.js'))

       } catch (error) {
           
           //Mostrar el mensaje de error en la consola
           console.log('Error al registrar la conversación en el flujo flujoCalendarioOcupado, el sistema respondió: ' + error)

       }

    })