const {addKeyword} = require('@bot-whatsapp/bot')

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const configurar = require('../Funciones/configuracion')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoDespedida = require('./flujoDespedida')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoNoTengoRespuesta = addKeyword(['79bVwChBZc16ID9Oj8lRcgtnqKX4VXJ9U8uuDQOktAlXqEgs82'])
    .addAnswer(mensajes.MENSAJE_FLUJO_SIN_RESPUESTA, {delay:100}, async (ctx, ctxFn) => {
    
        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_FLUJO_SIN_RESPUESTA)
            
            //Obtener el parámero de notificar al cliente la disponibilidad para agendar citas
            let cliente_cita = ctxFn.state.get('notificar_agenda_disponible')

            //Si se encontró el parametro
            if(cliente_cita != null && cliente_cita != "" && cliente_cita == "Si"){
                
                //Ir al flujo de despedida
                return ctxFn.gotoFlow(require('./flujoNotificarAgendaDisponible.js'))

            }

        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoNoTengoRespuesta, el sistema respondió: ' + error)
    
        }

        //Ir al flujo de despedida
        return ctxFn.gotoFlow(require('./flujoDespedida.js'))
        
    })

 