module.exports = Object.freeze({
    
    //Mensajes flujoSaludo 
    SALUDO_INICIAL: '👩🏻 Hola *{NOMBRE_CLIENTE}* bienvenido(a) *Taglio* _Más que un corte una experiencia_',
    ARGUMENTO_FLUJO_BIENVENIDA: 'Aquí cuidamos de su imagen',
    PREGUNTA_FLUJO_BIENVENIDA: '*¿Qué desea hacer?*',
    MENU_OPCIONES_FLUJO_BIENVENIDA: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Programar una cita\n👉🏼 Cancelar una cita',
    
    //Mensaje respuesta invalida
    ARGUMENTO_RESPUESTA_INVALIDA: '👩🏻 Por favor *lea con atención* y *responda correctamente*\n\nIntente de nuevo por favor',
    
    //Mensaje nota de voz enviada
    ARGUMENTO_FLUJO_NOTA_DE_VOZ: '👩🏻 Por favor excúsenos, en este momento no podemos escuchar sus notas de voz, solo podremos atenderle por mensajes de texto',
    
    //Mensajes del flujo flujoPrecios
    MENSAJE_FLUJO_PRECIOS: '💵 *Nuestros precios son:*\n\n✂️ Corte *15 mil*\n✂️ Barba *5 mil*\n✂️ Cejas *5 mil*\n✂️ Corte y barba *20 mil*',
    
    //Mensajes del flujo flujoProgramarCita
    NOMBRE_FLUJO_PROGRAMAR_CITA: '👩🏻 ¿Podría indicarme su *nombre completo* por favor?',
    MENSAJE_CALENDARIO_OCUPADO_FLUJO_PROGRAMAR_CITA: '👩🏻 Por favor excúseme, en este momento *estoy agendando una cita para otro cliente*, debo terminar para saber que turnos quedan disponibles',
    MENSAJE_INFORMAR_DISPONIBLE_FLUJO_PROGRAMAR_CITA: '👩🏻 ¿Desea que le *informe cuando esté disponible* y pueda agendar su cita?\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    MENSAJE_AGENDA_DISPONIBLE_FLUJO_PROGRAMAR_CITA: '👩🏻 Apreciado cliente, ya me encuentro disponible y puedo agendar su cita',
    PREGUNTA_FLUJO_PROGRAMAR_CITA: '👩🏻 Por favor envíenos *solamente* el número del *día de este mes* en el cual desea agendar su cita',
    MENU_OPCIONES_FLUJO_PROGRAMAR_CITA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Hoy\n👉🏼 Mañana\n👉🏼 Pasado mañana',
    MENSAJE_CONSULTANDO_AGENDA_FLUJO_PROGRAMAR_CITA: '👩🏻 Un momento por favor, voy a consultar la agenda...',
    TURNOS_DISPONIBLES_FLUJO_PROGRAMAR_CITA: 'Para el próximo *{FECHA_CITA}* tenemos los siguientes turnos disponibles:',
    NO_HAY_TURNOS_DISPONIBLES_FLUJO_PROGRAMAR_CITA: '👩🏻 Desafortunadamente *no tengo turnos disponibles* para el día ',
    NUMERO_TURNO_FLUJO_PROGRAMAR_CITA: '👩🏻 Por favor envíeme *el número* del turno que desea.\n\nSi no desea ninguno de los turnos disponibles, envíeme la palabra *Cancelar*',
    MENSAJE_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA: '👩🏻 *Le confirmo*\n\nDesea programar su cita para:',
    MENU_OPCIONES_CONFIRMACION_TURNO_FLUJO_PROGRAMAR_CITA: '_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No\n👉🏼 Cancelar',
    
    //Mensajes del flujo flujoCrearCita
    MENSAJE_FLUJO_CREAR_CITA: '👩🏻 Un momento por favor, estoy agendando su cita...',
    MENSAJE_RADICADO_FLUJO_CREAR_CITA: '👩🏻 Su cita *fue agendada* con el siguiente radicado',
    MENSAJE_NO_PIERDA_RADICADO_FLUJO_CREAR_CITA: '👩🏻 Por favor *no pierda* el código de radicado anterior, ☝🏼 lo necesitará en caso que desee cancelar la cita',
    MENSAJE_NOTIFICACION_NUEVA_CITA: '👩🏻 Se *programó* una nueva cita con los siguientes datos:',

    //Mensajes del flujo flujoDespedida
    MENSAJE_FLUJO_DESPEDIDA: '👩🏻 Ha sido un placer servirle, espero que mi atención haya sido de su agrado, le deseo un feliz resto de día',

    //Mensajes del flujo flujoNoTengoRespuesta
    MENSAJE_FLUJO_SIN_RESPUESTA: '👩🏻 No tengo respuesta suya, terminaré esta conversación, si desea retomarla no dude en escribirme de nuevo',

    //Mensajes del flujo flujoCancelarCita
    PREGUNTA_FLUJO_CANCELAR_CITA: '👩🏻 ¿Tiene con usted el *código del radicado* de la cita que desea cancelar?',
    MENU_OPCIONES_FLUJO_CANCELAR_CITA: '\n\n_Por favor responda con una de las siguientes opciones:_\n\n👉🏼 Sí\n👉🏼 No',
    MENSAJE_SOLICITAR_RADICADO_FLUJO_CANCELAR_CITA: '👩🏻 Por favor envíeme *el código del radicado* que le envié al momento de crear la cita, es un conjunto de letras y números, 26 en total',
    MENSAJE_CONFIRMACION_CITA_CANCELADA: '👩🏻 Su cita ha sido cancelada, recuerde que si lo desea podrá iniciar nuevamente el proceso para solicitar una nueva cita',
    MENSAJE_NOTIFICACION_CANCELACION_CITA: '👩🏻 Se *canceló* la siguiente cita:',

    //Mensajes del flujo flujoImagenes
    MENSAJE_FLUJO_IMAGENES: '👩🏻 A continuación, algunos de mis trabajos...',
    URL_IMAGEN_1_FLUJO_IMAGENES: 'http://innotik.com.co/Bots/LatinBarber/Diseno01.jpg',
    URL_IMAGEN_2_FLUJO_IMAGENES: 'http://innotik.com.co/Bots/LatinBarber/Diseno02.jpg',
    URL_IMAGEN_3_FLUJO_IMAGENES: 'http://innotik.com.co/Bots/LatinBarber/Diseno03.jpg',
    URL_IMAGEN_4_FLUJO_IMAGENES: 'http://innotik.com.co/Bots/LatinBarber/Diseno04.jpg',

});