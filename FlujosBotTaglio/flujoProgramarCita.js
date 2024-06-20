const {addKeyword} = require('@bot-whatsapp/bot')
const { delay } = require('@whiskeysockets/baileys')
const axios = require('axios').default;

//////////////////////////////////////// FUNCIONES ELABORADAS

const conversacion = require('../Funciones/conversacion.js')
const mensajes = require('../Configuracion/mensajes')
const fechas = require('../Funciones/fechas')
const configuracion = require('../Funciones/configuracion')
const calendarioGoogle = require('../Funciones/google/calendarioGoogle')
const temporizador = require('../Funciones/temporizador')

////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoDespedida = require('./flujoDespedida')
const flujoCrearCita = require('./flujoCrearCita')

////////////////////////////////////////////////////////////////////////////////

const ExpRegCita = '/((progra[mar]*|a[gj]end[arem]*|(apart[arem]*))[a-z ]*([cs]ita|turno)*)/gmi';
const ExpRegNombre = new RegExp("[a-z áéíóúÁÉÍÓÚñÑ]{4,}", "i");
const ExpRegRespuestas = new RegExp("[h]*o[yi]|ma[ñn]ana|pasado ma[ñn]ana", "i");
const ExpRegConfirmarTurno = new RegExp("^S[íiIÍ]+$|^N[oóOÓ]$|^Can[cs]el[ar]*$", "i");
const ExpRegConfirmarAfirmativo = new RegExp("^S[íiIÍ]+$", "i");
const ExpRegConfirmarNegativo = new RegExp("^N[oóOÓ]+$", "i");
const ExpRegConfirmarCancelar = new RegExp("^Can[cs]el[ar]*$", "i");

var DiaCita = "";
var HorarioDiaCita = [["",""]];
var FechaCita = "";
var TurnosDisponibles = "";
var OpcionesTurnos = ""
var DiasMes = ""

module.exports = flujoProgramarCita = addKeyword(ExpRegCita, { regex: true })
    .addAction(async (ctx, ctxFn) => {
        
        //Registrar el mensaje
        try {

            //Registrar la conversación
            await conversacion.Guardar(ctx, 'El flujo flujoProgramarCita se disparó por el texto: ')
            
            //Variable para alacenar la lista de números permitidos            
            let datosConfiguracion = await configuracion.LeerConfiguracion()
            
            //Si el calendario se encuentra ocupado
            if(datosConfiguracion[0].calendarioocupado == 'Si'){

                //Detener el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)

                //Ir al flujo de despedida
                return ctxFn.gotoFlow(require('./flujoCalendarioOcupado.js'))

            }

            //Ocupar el calendario
            configuracion.OcuparCalendario()
            
        } catch (error) {

            //Solicitar una respuesta valida
            console.log('Error al registrar la conversación en el flujo flujoTipoFalla, el sistema respondió: ' + error)

        } 
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer(mensajes.NOMBRE_FLUJO_PROGRAMAR_CITA, {delay:1000, capture: true}, async (ctx, ctxFn) => {

        //Registrar la conversación
        await conversacion.Guardar(ctx, mensajes.NOMBRE_FLUJO_PROGRAMAR_CITA)

        //Si la respuesta no es 
        if(ExpRegNombre.test(ctx.body) == false){

            //Registrar el inicio de la conversación
            try {

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.NOMBRE_FLUJO_PROGRAMAR_CITA)

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.NOMBRE_FLUJO_PROGRAMAR_CITA)

            } catch (error) {

                //Mostrar el mensaje de error en la consola
                console.log('Error al registrar la conversación en el flujo flujoProgramarCita, el sistema respondió: ' + error)

            }

        }

        //Configurar el dia de la cita
        ctxFn.state.update({nombre_cliente: ctx.body})
        ctxFn.state.update({notificar_agenda_disponible: "Si"})
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    //.addAnswer(mensajes.PREGUNTA_FLUJO_PROGRAMAR_CITA + '\n\n' + mensajes.MENU_OPCIONES_FLUJO_PROGRAMAR_CITA, {delay:1000, capture: true}, async (ctx, ctxFn) => {
    .addAnswer(mensajes.PREGUNTA_FLUJO_PROGRAMAR_CITA, {delay:1000, capture: true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {
            
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.PREGUNTA_FLUJO_PROGRAMAR_CITA)

            //Elaborar la conadena de validación de los días del mes para la expresión regular
            for (var i = 1; i < 32; i++) {
                DiasMes = DiasMes + i + '|'
            }

            //Remover el último separador para que no ingrese cualquier caracter en la expresion regular
            DiasMes = DiasMes.slice(0, -1)

            //console.log('Los días del mes son: ' + DiasMes)
            //Obtener la expresión regular con la cual se evaluará el día indicado
            const ExpRegDiasMes = new RegExp(DiasMes, "i");

            //Si la respuesta no es válida
            if(ExpRegDiasMes.test(ctx.body) == false){

                //Registrar el inicio de la conversación
                try {

                    //Registrar la conversación
                    await conversacion.Guardar(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_PROGRAMAR_CITA + '\n\n' + mensajes.MENU_OPCIONES_FLUJO_PROGRAMAR_CITA)

                } catch (error) {

                    //Mostrar el mensaje de error en la consola
                    console.log('Error al registrar la conversación en el flujo flujoProgramarCita, el sistema respondió: ' + error)

                }

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.PREGUNTA_FLUJO_PROGRAMAR_CITA + '\n\n' + mensajes.MENU_OPCIONES_FLUJO_PROGRAMAR_CITA)

            }

            //Configurar el dia de la cita
            DiaCita = ctx.body;

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoProgramarCita, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer(mensajes.MENSAJE_CONSULTANDO_AGENDA_FLUJO_PROGRAMAR_CITA, {delay:1000, capture: false}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_CONSULTANDO_AGENDA_FLUJO_PROGRAMAR_CITA)

            //Declaración de variables
            let Horario = [
                {turno: "1", hora: "08:00", estado: "Disponible"},
                {turno: "2", hora: "08:30", estado: "Disponible"},
                {turno: "3", hora: "09:00", estado: "Disponible"},
                {turno: "4", hora: "09:30", estado: "Disponible"},
                {turno: "5", hora: "10:00", estado: "Disponible"},
                {turno: "6", hora: "10:30", estado: "Disponible"},
                {turno: "7", hora: "11:00", estado: "Disponible"},
                {turno: "8", hora: "11:30", estado: "Disponible"},
                {turno: "9", hora: "12:00", estado: "Disponible"},
                {turno: "10", hora: "13:30", estado: "Disponible"},
                {turno: "11", hora: "14:00", estado: "Disponible"},
                {turno: "12", hora: "14:30", estado: "Disponible"},
                {turno: "13", hora: "15:00", estado: "Disponible"},
                {turno: "14", hora: "15:30", estado: "Disponible"},
                {turno: "15", hora: "16:00", estado: "Disponible"},
                {turno: "16", hora: "16:30", estado: "Disponible"},
                {turno: "17", hora: "17:00", estado: "Disponible"},
                {turno: "18", hora: "17:30", estado: "Disponible"},
                {turno: "19", hora: "18:00", estado: "Disponible"},
                {turno: "20", hora: "18:30", estado: "Disponible"},
                {turno: "21", hora: "19:00", estado: "Disponible"},
                {turno: "22", hora: "19:30", estado: "Disponible"}
            ];
            
            let HorarioMarSab = [
                {turno: "1", hora: "08:00", estado: "Disponible"},
                {turno: "2", hora: "08:45", estado: "Disponible"},
                {turno: "3", hora: "09:30", estado: "Disponible"},
                {turno: "4", hora: "10:15", estado: "Disponible"},
                {turno: "5", hora: "11:00", estado: "Disponible"},
                {turno: "6", hora: "14:00", estado: "Disponible"},
                {turno: "7", hora: "14:45", estado: "Disponible"},
                {turno: "8", hora: "15:30", estado: "Disponible"},
                {turno: "9", hora: "16:15", estado: "Disponible"},
                {turno: "10", hora: "17:00", estado: "Disponible"},
                {turno: "11", hora: "17:45", estado: "Disponible"},
                {turno: "12", hora: "18:30", estado: "Disponible"},
                {turno: "13", hora: "19:15", estado: "Disponible"},
                {turno: "14", hora: "20:00", estado: "Disponible"},
                {turno: "15", hora: "20:45", estado: "Disponible"}
            ];
            
            let HorarioDomFes = [
                {turno: "1", hora: "09:00", estado: "Disponible"},
                {turno: "2", hora: "09:45", estado: "Disponible"},
                {turno: "3", hora: "10:30", estado: "Disponible"},
                {turno: "4", hora: "11:15", estado: "Disponible"},
                {turno: "5", hora: "14:00", estado: "Disponible"},
                {turno: "6", hora: "14:45", estado: "Disponible"},
                {turno: "7", hora: "15:30", estado: "Disponible"},
                {turno: "8", hora: "16:15", estado: "Disponible"},
                {turno: "9", hora: "17:00", estado: "Disponible"},
                {turno: "10", hora: "17:45", estado: "Disponible"},
                {turno: "11", hora: "18:30", estado: "Disponible"},
                {turno: "12", hora: "19:15", estado: "Disponible"},
                {turno: "13", hora: "20:00", estado: "Disponible"},
                {turno: "14", hora: "20:45", estado: "Disponible"}
            ];

            //Declaración de variables
            var FechaHoy = new Date()
            
            //Construir la fecha de la cita a partir del día indicado por el cliente
            FechaCita = FechaHoy.getFullYear() + '/' + (FechaHoy.getMonth() + 1) + '/' + DiaCita

            //Si la fecha de la cita es mayor a la fecha actual
            if(Date.parse(FechaCita) > FechaHoy){

                console.log('Esta en el futuro')

            }
            else{

                console.log('NO Está en el futuro')

            }

            //Obtener el horario de trabajo del día de la cita
            HorarioDiaCita = Horario;
            

            // ### FUNCION PARA ELIMINAR LOS TURNOS QUE YA HAYAN PASADO
            // //Declaracion de variables
            // var FechaTurno = new Date();
            // var TurnosEliminar = 0;

            // //Recorrer la lista de turnos
            // for (let turno of HorarioDiaCita.keys()){

            //     //Configurar el año mes y día de la fecha del turno
            //     FechaTurno.setFullYear(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate());
            //     //Configurar la hora del turno
            //     FechaTurno.setHours(HorarioDiaCita[turno]['hora'].substr(0,2));
            //     //Configurar los minutos del turno
            //     FechaTurno.setMinutes(HorarioDiaCita[turno]['hora'].substr(3,2));

            //     //Si la hora del turno es anterior a la hora actual
            //     if(FechaTurno < FechaHoy){
                    
            //         //Ponerlo en la lista de turnos a eliminar
            //         TurnosEliminar = TurnosEliminar + 1;
    
            //     };

            // }

            // console.log('Voy a eliminar turnos ' + TurnosEliminar)

            // //Eliminar los turnos anteriores a la fecha actual
            // HorarioDiaCita.splice(0, TurnosEliminar);
            

            /*var FechaManana = new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate() + 1);
            var FechaPasadoManana = new Date(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate() + 2);
            var HoraActual = FechaHoy.getHours() + ":" + FechaHoy.getMinutes();

            //Evaluar la variable DiaCita
            switch (DiaCita) {

                //En caso que el cliente haya seleccionado para hoy
                case "Hoy":

                    //Obtener a fecha en el formato para consultar el calendario
                    FechaCita = FechaHoy.getFullYear() + '/' + (FechaHoy.getMonth() + 1) + '/' + fechaBruta.getDate();

                    //Si el día de hoy es 0 es decir domingo
                    if (FechaHoy.getDay() == 0){

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = HorarioDomFes;

                    }
                    //De lo contratio Si el día de hoy es 1 es decir lunes
                    else if (FechaHoy.getDay() == 1){

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = Horario;
                        
                    }
                    //De lo contratio
                    else{

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = HorarioMarSab;
                        
                    }

                    //Declaracion de variables
                    var FechaTurno = new Date();
                    var TurnosEliminar = 0;

                    //Recorrer la lista de turnos
                    for (let turno of HorarioDiaCita.keys()){

                        //Configurar el año mes y día de la fecha del turno
                        FechaTurno.setFullYear(FechaHoy.getFullYear(), FechaHoy.getMonth(), FechaHoy.getDate());
                        //Configurar la hora del turno
                        FechaTurno.setHours(HorarioDiaCita[turno]['hora'].substr(0,2));
                        //Configurar los minutos del turno
                        FechaTurno.setMinutes(HorarioDiaCita[turno]['hora'].substr(3,2));

                        //Si la hora del turno es anterior a la hora actual
                        if(FechaTurno < FechaHoy){
                            
                            //Ponerlo en la lista de turnos a eliminar
                            TurnosEliminar = TurnosEliminar + 1;
            
                        };

                    }

                    //Eliminar los turnos anteriores a la fecha actual
                    HorarioDiaCita.splice(0, TurnosEliminar);
                    
                    break;
                //En caso que el cliente haya seleccionado para mañana
                case "Mañana":

                    //Obtener a fecha en el formato para consultar el calendario
                    FechaCita = FechaManana.getFullYear() + '/' + (FechaManana.getMonth() + 1) + '/' + FechaManana.getDate();

                    //Si el día de hoy es 0 es decir domingo
                    if (FechaManana.getDay() == 0){

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = HorarioDomFes;
                    }
                    //De lo contratio Si el día de hoy es 1 es decir lunes
                    else if (FechaManana.getDay() == 1){

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = Horario;

                    }
                    //De lo contratio
                    else{

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = HorarioMarSab;

                    }
                    
                    break;
                //En caso que el cliente haya seleccionado para pasado mañana
                case "Pasado mañana":

                    //Obtener a fecha en el formato para consultar el calendario
                    FechaCita = FechaPasadoManana.getFullYear() + '/' + (FechaPasadoManana.getMonth() + 1) + '/' + FechaPasadoManana.getDate();
                    
                    //Si el día de hoy es 0 es decir domingo
                    if (FechaPasadoManana.getDay() == 0){

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = HorarioDomFes;

                    }
                    //De lo contratio Si el día de hoy es 1 es decir lunes
                    else if (FechaPasadoManana.getDay() == 1){

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = Horario;

                    }
                    //De lo contratio
                    else{

                        //Configurar el horario con el cual se trabajará
                        HorarioDiaCita = HorarioMarSab;

                    }
                    
                    break;

            }
            */

            //Obtener las citas progrmadas para el día elegido por el cliente
            let citas = await calendarioGoogle.obtenerCitas(FechaCita + " 01:00", FechaCita + " 23:00")
            
            //Realizar una pausa de dos segundos
            await delay(2000)

            //Expresión regular para encontrar la ora de la cita
            const ExpRegHoraCita = new RegExp("T[0-9]+:[0-9]+:[0-9]+", "i")
            var mensajeCitas = ''
            var fila = 0
            var columna = 0
            var hora = ''

            //Recorrer la lista de citas
            for (const cita of citas){
                
                //Obtener la hora de la cita
                hora = cita.start.dateTime || cita.start.date;
                
                //Si la cita contiene datos
                if (hora != null){

                    //Si no se tiene ninguna actividad o descanso programado para todo el día
                    if (ExpRegHoraCita.test(hora) == false){

                        //Recorrer todos los turnos
                        HorarioDiaCita.forEach(function(turno) {

                            //Marcarlos turnos como ocupados por descanso
                            turno.estado = 'Descanso';

                        })

                        //Salir del ciclo
                        break
                    }
                    else{

                        //Obtener la hora y reemplazar los indicadores de zona horaria
                        horaCita = hora.substr(11,5)

                        //Si la hora de la cita existe en el horario
                        if (HorarioDiaCita.find(({ hora }) => hora == horaCita) != null){

                            //Buscar en la lista de turnos la hora y obtener el índice de la fila
                            fila = HorarioDiaCita.find(({ hora }) => hora == horaCita)['turno']

                            //Poner en el estado del turno el nombre del evento
                            HorarioDiaCita.find(({ hora }) => hora == horaCita)['estado'] = cita.evento

                        }
                    
                    }

                }

            }

            //Reinicializar la variable que contrendrá los turnos disponibles
            TurnosDisponibles = ""

            //Reinicializar la variable que contendrá los turnos disponibles con los que se realizará la expresión regular
            OpcionesTurnos = '^[ck]an[cs]ela[r]*$|'

            //Si hay turnos disponibles
            if(HorarioDiaCita.length > 0 && HorarioDiaCita.filter(i => i['estado'] == "Disponible").length > 0){
                
                //Recorrer el horario del día seleccionado
                HorarioDiaCita.forEach((cita) => {

                    //Si ese horario está vacío es decir está disponible
                    if(cita['estado'] == 'Disponible'){
                        
                        //Ponerlo en la lista de turnos disponibles para mostrarle al cliente
                        TurnosDisponibles = TurnosDisponibles + "\n\n👉🏼 *" + cita['turno'] + "*. _" + fechas.horaAMPM(cita['hora']) + '_'

                        //Armar la cadena de turnos para la expresión regular de validación
                        OpcionesTurnos = OpcionesTurnos + '^' + cita['turno'] + '$|'

                    };

                });

                //Remover el último separador para que no ingrese cualquier caracter en la expresion regular
                OpcionesTurnos = OpcionesTurnos.slice(0, -1)

                console.log('Los tunos disponibles son: ' + OpcionesTurnos)
                
                //Guardar en el estado global de la conversación los turnos disponibles
                ctxFn.state.update({turnosDisponibles: TurnosDisponibles})

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.TURNOS_DISPONIBLES_FLUJO_PROGRAMAR_CITA.replace('{FECHA_CITA}', new Date(FechaCita).toLocaleDateString('es-es', { weekday:"long", year:"numeric", month:"long", day:"numeric"}))/* + TurnosDisponibles*/)

                //FechaCita = new Date(FechaCita).toLocaleDateString('es-es', { weekday:"long", year:"numeric", month:"long", day:"numeric"})

                //Enviar lista de turnos disponibles al cliente
                ctxFn.flowDynamic(mensajes.TURNOS_DISPONIBLES_FLUJO_PROGRAMAR_CITA.replace('{FECHA_CITA}', new Date(FechaCita).toLocaleDateString('es-es', { weekday:"long", year:"numeric", month:"long", day:"numeric"})) + TurnosDisponibles)

            }
            else{

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.NO_HAY_TURNOS_DISPONIBLES_FLUJO_PROGRAMAR_CITA + ' ' + new Date(FechaCita).toLocaleDateString('es-es', { weekday:"long", year:"numeric", month:"long", day:"numeric"}) + '*')
                
                //Enviar mensaje informando que no hay turnos disponibles
                await ctxFn.flowDynamic(mensajes.NO_HAY_TURNOS_DISPONIBLES_FLUJO_PROGRAMAR_CITA + ' *' + new Date(FechaCita).toLocaleDateString('es-es', { weekday:"long", year:"numeric", month:"long", day:"numeric"}) + '*')


                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)

                //Obtener el parámero de notificar al cliente la disponibilidad para agendar citas
                let cliente_cita = ctxFn.state.get('notificar_agenda_disponible')

                //Si se encontró el parametro
                if(cliente_cita != null && cliente_cita != "" && cliente_cita == "Si"){
                    
                    //Ir al flujo de despedida
                    return ctxFn.gotoFlow(require('./flujoNotificarAgendaDisponible.js'))

                }


                /*
                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.MENSAJE_FLUJO_DESPEDIDA)

                //Enviar mensaje informando que no hay turnos disponibles
                await ctxFn.flowDynamic(mensajes.MENSAJE_FLUJO_DESPEDIDA)
                
                //Desocupar el calendario
                configuracion.DesocuparCalendario()

                //Detener el temporizador
                temporizador.detenerTemporizador(ctx)

                //Terminar el flujo
                return ctxFn.endFlow()
                */

            }

            //Iniciar el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)
            temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')


        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoProgramarCita, el sistema respondió: ' + error)

        }

    })
    .addAnswer(mensajes.NUMERO_TURNO_FLUJO_PROGRAMAR_CITA, {delay:2000, capture: true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {
            
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.NUMERO_TURNO_FLUJO_PROGRAMAR_CITA)

            //Expresión regular para las opciones de pago
            const ExpRegOpcionesTurnos = new RegExp(OpcionesTurnos, "i")
            const ExpRegOpcionCancelar = new RegExp('^[ck]an[cs]ela[r]*$', "i");

            //Si la respuesta no coincide con la expresión regular
            if(ExpRegOpcionesTurnos.test(ctx.body) == false){

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.TURNOS_DISPONIBLES_FLUJO_PROGRAMAR_CITA + TurnosDisponibles + '\n\n' + mensajes.NUMERO_TURNO_FLUJO_PROGRAMAR_CITA)

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.TURNOS_DISPONIBLES_FLUJO_PROGRAMAR_CITA + TurnosDisponibles + '\n\n' + mensajes.NUMERO_TURNO_FLUJO_PROGRAMAR_CITA)

            }
            else{
                
                //Si el cliente envió cancelar
                if (ExpRegOpcionCancelar.test(ctx.body) == true){

                    //Iniciar el temporizador de espera de respuesta del cliente
                    temporizador.detenerTemporizador(ctx)

                    //Obtener el parámero de notificar al cliente la disponibilidad para agendar citas
                    let cliente_cita = ctxFn.state.get('notificar_agenda_disponible')

                    //Si se encontró el parametro
                    if(cliente_cita != null && cliente_cita != "" && cliente_cita == "Si"){
                        
                        //Ir al flujo de despedida
                        return ctxFn.gotoFlow(require('./flujoNotificarAgendaDisponible.js'))

                    }

                }
                else{

                    //Guardar en el estado global de la conversación el turno elegido
                    ctxFn.state.update({turno_elegido_cliente: ctx.body})

                    //Armar los detalles de la cita
                    //let detallesCita = '\n\n*' + DiaCita + '* ' + fechas.fechaLegible(FechaCita) + " a las *" + fechas.horaAMPM(HorarioDiaCita.find(({ turno }) => turno == ctx.body)['hora']) + "*"
                    let detallesCita = '\n\n el próximo *' + new Date(FechaCita).toLocaleDateString('es-es', { weekday:"long", year:"numeric", month:"long", day:"numeric"}) + "* a las *" + fechas.horaAMPM(HorarioDiaCita.find(({ turno }) => turno == ctx.body)['hora']) + "*"

                    //Guardar en el estado global de la conversación el turno elegido
                    ctxFn.state.update({detalles_cita: detallesCita})

                    //Registrar la conversación
                    await conversacion.Guardar(ctx, mensajes.MENSAJE_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA + detallesCita)

                    //Enviar mensaje para la confirmación de la cita por parte del cliente
                    ctxFn.flowDynamic(mensajes.MENSAJE_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA + detallesCita)

                }
                
            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoProgramarCita, el sistema respondió: ' + error)

        }
        
        //Iniciar el temporizador de espera de respuesta del cliente
        temporizador.detenerTemporizador(ctx)
        temporizador.iniciarTemporizador(ctx, ctxFn, 'flujoNoTengoRespuesta.js')

    })
    .addAnswer(mensajes.MENU_OPCIONES_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA, {capture: true}, async (ctx, ctxFn) => {

        //Registrar el inicio de la conversación
        try {

            //Detener el temporizador de espera de respuesta del cliente
            temporizador.detenerTemporizador(ctx)

            //Obtener el nombre del comprobante de pago
            let detallesCita = ctxFn.state.get('fecha_cita_cliente')
            
            //Registrar la conversación
            await conversacion.Guardar(ctx, mensajes.MENSAJE_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA + detallesCita + mensajes.MENU_OPCIONES_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA)

            //Si la respuesta del cliente no coincide con la expresión regular
            if(ExpRegConfirmarTurno.test(ctx.body) == false){

                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA + detallesCita + mensajes.MENU_OPCIONES_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA)

                //Solicitar una respuesta valida
                return ctxFn.fallBack(mensajes.ARGUMENTO_RESPUESTA_INVALIDA + '\n\n' + mensajes.MENSAJE_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA + detallesCita + mensajes.MENU_OPCIONES_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA)

            }
            else if(ExpRegConfirmarCancelar.test(ctx.body) == true){

                //Iniciar el temporizador de espera de respuesta del cliente
                temporizador.detenerTemporizador(ctx)

                //Obtener el parámero de notificar al cliente la disponibilidad para agendar citas
                let cliente_cita = ctxFn.state.get('notificar_agenda_disponible')

                //Si se encontró el parametro
                if(cliente_cita != null && cliente_cita != "" && cliente_cita == "Si"){
                    
                    //Ir al flujo de despedida
                    return ctxFn.gotoFlow(require('./flujoNotificarAgendaDisponible.js'))

                }

                /*
                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.MENU_OPCIONES_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA)

                //Ir al flujo de despedida
                ctxFn.gotoFlow(flujoDespedida)
                */

            }
            else if(ExpRegConfirmarNegativo.test(ctx.body) == true){

                //Ir al flujo de despedida
                return ctxFn.gotoFlow(require('./flujoProgramarCita.js'), 2)

                /*
                //Registrar la conversación
                await conversacion.Guardar(ctx, mensajes.MENU_OPCIONES_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA)

                //Ir al flujo de despedida
                ctxFn.gotoFlow(flujoDespedida)
                */

            }
            else{
                
                //Obtener el turno elegido
                let TurnoElegido = ctxFn.state.get('turno_elegido_cliente')
                let fecha_cita = FechaCita + ' ' + HorarioDiaCita.find(({ turno }) => turno == TurnoElegido)['hora']

                //Guardar en el estado global de la conversación los datos de la cita
                ctxFn.state.update({fecha_cita_cliente: FechaCita + ' ' + HorarioDiaCita.find(({ turno }) => turno == TurnoElegido)['hora']})

            }

        } catch (error) {

            //Mostrar el mensaje de error en la consola
            console.log('Error al registrar la conversación en el flujo flujoProgramarCita, el sistema respondió: ' + error)

        }
        
    }, [flujoCrearCita])
    