const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys')

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const cita = require('../Funciones/cita.js')
const mensajes = require('../Configuracion/mensajes')
const configurar = require('../Funciones/configuracion.js')
const calendarioGoogle = require('../Funciones/google/calendarioGoogle.js')
const fechas = require('../Funciones/fechas.js')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoDespedida = require('./flujoDespedida.js')
const configuracion = require('../Configuracion/configuracion.js')

////////////////////////////////////////////////////////////////////////////////

const ExpRegFlujo = '/^S[íiÍ]+$/gmi'

module.exports = flujoCrearCita = addKeyword(ExpRegFlujo, { regex: true })
    .addAction(async (ctx, ctxFn) => {
            
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await conversacion.Guardar(ctx, 'El flujo flujoCrearCita se disparó por el texto: ')
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoCrearCita, el sistema respondió: ' + error)

        }

    })
    .addAction(async (ctx, ctxFn) => {

        //Obtener el nombre del comprobante de pago
        let fecha_cita = ctxFn.state.get('fecha_cita_cliente')
        let cliente_cita = ctxFn.state.get('nombre_cliente')
        
        //Registrar el inicio de la conversación
        try {
            
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_FLUJO_CREAR_CITA)
            
            //Enviar mensaje de espera al cliente
            await ctxFn.flowDynamic(mensajes.MENSAJE_FLUJO_CREAR_CITA)
            
            //Crear la cita y almacenar el resultado
            let citaCalendario = await calendarioGoogle.crearCita(/*'Corte para ' + */cliente_cita + ' ' + ctx.from, fecha_cita)

            //Registrar la cita en la base de datos
            await cita.Guardar(ctx, cliente_cita, fecha_cita, citaCalendario.data.id, 'Pendiente')

            //Enviar mensaje de notificación de nueva cita creada
            await ctxFn.provider.sendText(configuracion.NUMERO_NOTIFICAR_CITA, mensajes.MENSAJE_NOTIFICACION_NUEVA_CITA + '\n\n' + '*Fecha:* ' + fechas.fechaHoraLegible(fecha_cita) + '\n*Cliente:* ' + cliente_cita)

            //Realizar una pausa de 1 segundo
            await delay(1000)

            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_RADICADO_FLUJO_CREAR_CITA + ' ' + citaCalendario.data.id)

            //Enviar mensaje de confirmación al cliente
            ctxFn.flowDynamic(mensajes.MENSAJE_RADICADO_FLUJO_CREAR_CITA)

            //Realizar una pausa de 1 segundo
            await delay(1000)

            //Enviar mensaje de confirmación al cliente
            ctxFn.flowDynamic(citaCalendario.data.id)

            //Realizar una pausa de 1 segundo
            await delay(1000)

            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_NO_PIERDA_RADICADO_FLUJO_CREAR_CITA)

            //Enviar mensaje de confirmación al cliente
            ctxFn.flowDynamic(mensajes.MENSAJE_NO_PIERDA_RADICADO_FLUJO_CREAR_CITA)

            //Realizar una pausa de 1 segundo
            await delay(1000)
            
            //Ocupar el calendario
            configurar.DesocuparCalendario()

            //Ir al flujo de notificación de agenda disponible
            return ctxFn.gotoFlow(require('./flujoNotificarAgendaDisponible.js'))
            

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoCrearCita, el sistema respondió: ' + error)

        }

        gotoFlow(flujoDespedida)

    })