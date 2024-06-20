const configuracion = require('../Configuracion/configuracion');
const configurar = require('../Funciones/configuracion')

// Arreglo para almacenar los temporizadores
const timers = {};

// Variable global para el tiempo de espera
const globalIdle = configuracion.TIEMPO_ESPERA_RESPUESTA * 1000;

// Function to start the timer
function iniciarTemporizador(ctx, ctxFn, flujo) {

    let rutaFlujo = '../FlujosBotTaglio/' + flujo;

    // Si se terminó el temporizador
    timers[ctx.from] = setTimeout(() => {

        //Reportar en la consola
        console.log(`¡Tiempo agotado para el cliente ${ctx.from}!` + ' han pasado ' + (globalIdle/1000) + ' segundos');

        //Desocupar el calendario
        configurar.DesocuparCalendario()

        //Ir al flujo especificado
        return ctxFn.gotoFlow(require(rutaFlujo));
        
    }, globalIdle);

}

// Function para reiniciar el temporizador
function reiniciarTemporizador(ctx, ctxFn) {

    // Si hay algún temporizador ya corriendo, detenerlo
    detenerTemporizador(ctx);

    // Iniciar el temporizador
    iniciarTemporizador(ctx, ctxFn);

    //Mostrar mensaje
    console.log('Teproizador reiniciado')
}

// Function detener el temporizador
function detenerTemporizador(ctx) {

    // Si hay algun temporizador en ejecución, detenerlo
    if (timers[ctx.from]) {

        //Remover el temporizador de la lista
        clearTimeout(timers[ctx.from]);
        
    }

}

module.exports.iniciarTemporizador = iniciarTemporizador;
module.exports.reiniciarTemporizador = reiniciarTemporizador;
module.exports.detenerTemporizador = detenerTemporizador;