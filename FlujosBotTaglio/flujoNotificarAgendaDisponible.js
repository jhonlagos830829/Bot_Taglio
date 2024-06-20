const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys')

//////////////////////////////////////// FUNCIONES ELABORADAS

const registrarConversacion = require('../Funciones/registrarConversacion.js')
const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const configurar = require('../Funciones/configuracion.js')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoNotificarAgendaDisponible = addKeyword(['D3KL1oUYEdGmIido0H7TlsrXjWooBmeslTjrF7afV6eCat3Yeq'])
    .addAction(async (ctx, ctxFn) => {
    
        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            await conversacion.Guardar(ctx, "Notificando a los clientes que ya se puede agendar citas")
            
            //Desocupar el calendario
            configurar.DesocuparCalendario()

            //Registrar la conversación
            let clientesNotificar = await registrarConversacion.obtenerSolicitudesNotificacion()

            //Recorrer la lista de opciones devuelta
            for (const cliente of clientesNotificar.data){

                //Enviar mensaje de notificación de agenda disponible
                await ctxFn.provider.sendText(cliente.attributes.numeroWhatsapp + '@s.whatsapp.net', mensajes.MENSAJE_AGENDA_DISPONIBLE_FLUJO_PROGRAMAR_CITA)

                //Actualizar el estado de la notificación
                let respuesta = await registrarConversacion.actualizarSolicitudNotificacion(cliente.id)

                //Realizar una pausa
                await delay(1000)

            }

            //Desactivar la notificación de agenda disponible a los clientes
            ctxFn.state.update({notificar_agenda_disponible: "No"})
            
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoNotificarAgendaDisponible, el sistema respondió: ' + error)
    
        } 
        
        //Ir al flujo de despedida
        return ctxFn.gotoFlow(require('./flujoDespedida.js'))
    
    })