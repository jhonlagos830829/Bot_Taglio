const {addKeyword} = require('@bot-whatsapp/bot')

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const configurar = require('../Funciones/configuracion')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoDespedida = addKeyword(['D3KL1oUYEdGmIido0H7TlsrXjWooBmeslTjrF7afV6eCat3Yeq'])
    .addAnswer(mensajes.MENSAJE_FLUJO_DESPEDIDA, {delay:100}, async (ctx, { endFlow }) => {
    
        //Registrar el mensaje
        try {
    
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_FLUJO_DESPEDIDA)
            
            //OJO NO DEBERIA QUEDAR ACA PORQUE CUANDO UN UN CLIENTE
            //Desocupar el calendario
            //configurar.DesocuparCalendario()
            
        } catch (error) {
    
            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoFallaMasiva, el sistema respondió: ' + error)
    
        } 
        
        //Finalizar flujo
        return endFlow
    
    })
 