const {addKeyword, EVENTS} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys');

// NO OLVIDAR PROBAR strapi, excalidraw, dialogflow, railway

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const temporizador = require('../Funciones/temporizador')
const cliente = require('../Funciones/cliente.js')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoImagenes = require('./flujoImagenes')
const flujoPrecios = require('./flujoPrecios')
const flujoProgramarCita = require('./flujoProgramarCita')
const flujoCancelarCita = require('./flujoCancelarCita')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// EXPRESIONES REGULARES QUE SE USARAN

const ExpRegFlujo = '/[h]*(ola)+|(buen)+[aos ]*((d)[íi]+(a)[s]*|(tarde)[s]*|(noche)[s]*)/gmi'
const ExpRegRespuestas = new RegExp("pre[cs]+ios|((progra[mar]*|a[gj]end[arem]*|(apart[arem]*))[a-z ]*([cs]ita|turno)*)|(([ck]an[cs]+elar)[a-z ]*([cs]ita|turno)*)|tra[bv]ajos", "i")

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// VARIABLES QUE SE USARAN

////////////////////////////////////////////////////////////////////////////////

module.exports = flujoSaludo = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await conversacion.Guardar(ctx, 'El flujo flujoSaludo se disparó por el texto: ')
            
            //Consultar si ya está registrado en el cliente en el sistema
            let datosCliente = await cliente.obtenerCliente(ctx.from)
            
            //Si el ciente ya se encuentra registrado en el sistema
            if(Object.keys(datosCliente.data).length > 0){
                
                //Actualizar el estado con la existencia del cliente
                ctxFn.state.update({cliente_registrado: 'Si'})
                ctxFn.state.update({id_registrado: datosCliente.data[0].id})
                ctxFn.state.update({nombre_registrado: datosCliente.data[0].attributes.nombre})
                ctxFn.state.update({telefono_registrado: datosCliente.data[0].attributes.telefono})
                //ctxFn.state.update({direcciones_registradas: datosCliente.data[0].attributes.cl_direcciones_clientes.data})
                
                // //Si el cliente tiene una sola dirección registrda
                // if(Object.keys(datosCliente.data[0].attributes.cl_direcciones_clientes.data).length = 1){
                    
                //     //Actualizar el estado con la dirección registrada
                //     ctxFn.state.update({direccion_registrada: datosCliente.data[0].attributes.cl_direcciones_clientes.data[0].attributes.direccion})

                // }
                
                //Extraer solo el primer nombre
                let primerNombre = datosCliente.data[0].attributes.nombre.split(' ')
                
                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.SALUDO_INICIAL.replace("{NOMBRE_CLIENTE}", primerNombre[0]))

            }
            else{

                //Actualizar el estado con la existencia del cliente
                ctxFn.state.update({cliente_registrado: 'No'})

                //Obtener el nombre para mostrar de Whatsapp
                let nombreWhatsApp = ctx.pushName.replace('~', '')
                let primerNombre = nombreWhatsApp.split(' ')

                //Si el nombre para mostrar en Whatsapp tiene más de 2 caracteres
                if(primerNombre[0].length > 2){

                    //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                    await ctxFn.flowDynamic(mensajes.SALUDO_INICIAL.replace("{NOMBRE_CLIENTE}", primerNombre[0]))

                }
                else{

                    //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                    await ctxFn.flowDynamic(mensajes.SALUDO_INICIAL.replace("*{NOMBRE_CLIENTE}* ", ''))

                }
                
            }
        
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoSaludo, el sistema respondió: ' + error)

        } 

    })
    /*.addAnswer(mensajes.SALUDO_INICIAL, {capture: false}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Regisrar la conversacion
            await conversacion.Guardar(ctx, mensajes.SALUDO_INICIAL)

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoSaludo, el sistema respondió: ' + error)

        }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })*/
    .addAnswer([mensajes.PREGUNTA_FLUJO_BIENVENIDA + mensajes.MENU_OPCIONES_FLUJO_BIENVENIDA], {delay:1000, capture:true}, async (ctx, ctxFn) => {
        
        //Registrar el inicio de la conversación
        try {
           
            //Evaluar si el usuario envió una nota de voz
            if(ctx.body.includes('event_voice_note')==true){
                
                //Hacer una pausa de 2 segundos
                await delay(2000)

                //Informar al cliente que en el momento no se pueden procesar sus notas de voz
                await ctxFn.flowDynamic(mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_FLUJO_NOTA_DE_VOZ)
                
                //Hacer una pausa de 2 segundos
                await delay(2000)
                
                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.PREGUNTA_FLUJO_BIENVENIDA + mensajes.MENU_OPCIONES_FLUJO_BIENVENIDA)

                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

                //Mostrar las opciones de nuevo
                ctxFn.fallBack(mensajes.PREGUNTA_FLUJO_BIENVENIDA + mensajes.MENU_OPCIONES_FLUJO_BIENVENIDA)

            }
            else if(ExpRegRespuestas.test(ctx.body) == false){

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + mensajes.MENU_OPCIONES_FLUJO_BIENVENIDA)
                
                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)
                temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
                
                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + mensajes.MENU_OPCIONES_FLUJO_BIENVENIDA)
                
            }
            else{

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.PREGUNTA_FLUJO_BIENVENIDA + mensajes.MENU_OPCIONES_FLUJO_BIENVENIDA)
                    
            }

       } catch (error) {
           
           //Mostrar el mensaje de error en la consola
           console.log('Error al registrar la conversación en el flujo flujoSaludo, el sistema respondió: ' + error)

       }

        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')
        
    }, [flujoImagenes, flujoPrecios, flujoProgramarCita, flujoCancelarCita])
