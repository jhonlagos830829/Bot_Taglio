const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys')

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const configuracion = require('../Funciones/configuracion')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoDespedida = require('./flujoDespedida')
const flujoConfigurarDescanso = require('./flujoConfigurarDescanso')

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoConfiguracion = addKeyword(['ControlPanel'])
    .addAction(async (ctx, ctxFn) => {
            
        //Declaracion de variables
        idConversacion = ctx.key.id
        nombreCliente = ctx.pushName
        telefonoCliente = ctx.from

        //Registrar el mensaje
        try {
            
            //Registrar la conversación
            await conversacion.Guardar('Latin Barber', idConversacion, nombreCliente, telefonoCliente, 'El flujo flujoSaludo se disparó por el texto: ', ctx.body)

            //Variable para alacenar la lista de números permitidos            
            let numerosPermitidos = ""

            //Obtener la lista de números permitidos para modificar la configuración del bot
            numerosPermitidos  = await configuracion.consultarNumerosPermitidos()

            //Realizar una pausa de 2 segundos
            delay (2000)

            //Si el resultado contiene número desde el cual se está escribiendo
            if(numerosPermitidos.includes(telefonoCliente)){

                //Enviar mensaje preguntando que desea hacer
                ctxFn.flowDynamic('*¿Qué desea hacer?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏾 Configurar un descanso')

            }
            else{

                //Enviar mensaje informando que no está autorizado para realizar configuraciones
                ctxFn.flowDynamic('Usted no está autorizado para realizar configuraciones…')

                //Realizar una pausa de 2 segundos
                delay(2000)

                //Ir al flujo de despedida
                ctxFn.gotoFlow(flujoDespedida)

            }
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoSaludo, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAction({capture: true}, async (ctx, ctxFn) => {

        //Declaracion de variables
        idConversacion = ctx.key.id
        nombreCliente = ctx.pushName
        telefonoCliente = ctx.from

        //Registrar la conversación
        await conversacion.Guardar('Latin Barber', idConversacion, nombreCliente, telefonoCliente, '*¿Qué desea hacer?*\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏾 Configurar un descanso', ctx.body)

        if(ExpRegNombre.test(ctx.body) == false){

            //Registrar el inicio de la conversación
            try {

                //Registrar la conversación
                await conversacion.Guardar('Latin Barber', idConversacion, nombreCliente, telefonoCliente, mensajes.NOMBRE_FLUJO_PROGRAMAR_CITA, ctx.body)

            } catch (error) {

                //Mostrar el mensaje de error en la consola
                console.log('Error al registrar la conversación en el flujo flujoProgramarCita, el sistema respondió: ' + error)

            }

            //Solicitar una respuesta valida
            return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.NOMBRE_FLUJO_PROGRAMAR_CITA)

        }

        //Configurar el dia de la cita
        ctxFn.state.update({nombre_cliente: ctx.body})
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    }, [flujoConfigurarDescanso])