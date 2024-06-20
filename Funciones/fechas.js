const { MENU_OPCIONES_FLUJO_BIENVENIDA } = require("../Configuracion/mensajes");

//Funcion para leer el mensaje de caidas
function extraerFecha(texto) {
    
    const ExpRegFecha = /(\d{1,2}) (\d{1,2}) *([a-z]*) *(\d{4}) *([0-9: .amp]+)/gmi;

    //console.log('Aqui esta ->' + texto);

    //Reemplazar los datos que no hacen parte de la fecha y los nombres de los meses por numeros
    texto = texto.replaceAll('Fecha y hora', '');
    texto = texto.replaceAll('Fecha', '');
    texto = texto.replaceAll('/', '');
    texto = texto.replaceAll(',', '');
    texto = texto.replaceAll('a las', '');
    texto = texto.replaceAll('alas', '');

    //console.log('Aqui esta ->' + texto);

    texto = texto.replaceAll(' de ', ' ');
    texto = texto.replaceAll(' a las ', ' ');
    texto = texto.replaceAll('enero', '01');
    texto = texto.replaceAll('febrero', '02');
    texto = texto.replaceAll('marzo', '03');
    texto = texto.replaceAll('abril', '04');
    texto = texto.replaceAll('mayo', '05');
    texto = texto.replaceAll('junio', '06');
    texto = texto.replaceAll('julio', '07');
    texto = texto.replaceAll('agosto', '08');
    texto = texto.replaceAll('septiembre', '09');
    texto = texto.replaceAll('octubre', '10');
    texto = texto.replaceAll('noviembre', '11');
    texto = texto.replaceAll('diciembre', '12');

    //console.log('Aqui tamos ->' + texto);

    //Obtener los datos de la fecha a partir de la expresión regular
    var datosFecha = texto.matchAll(ExpRegFecha);
    var fecha = '';
    var dia = '';
    var mes = '';
    var año = '';
    var tiempo = '';

    

    //Recorrer las coincidencias de la fecha
    for (const dato of datosFecha) {
        
        //Obtener en cada variable cada dato de la fecha
        año = dato[4];
        mes = dato[2];
        dia = dato[1];
        tiempo = dato[5];

        // console.log('El año -> ' + año);
        // console.log('El mes -> ' + mes);
        // console.log('El dia -> ' + dia);
        // console.log('El tiempo -> ' + tiempo);

    }

    //console.log('El tiempo -> ' + tiempo);

    //Extraer los datos de la hora a partir de la expresion regular
    var horas = Number(tiempo.match(/^(\d+)/)[1]);
    var minutos = Number(tiempo.match(/:(\d+)/)[1]);
    //var AMPM = tiempo.match(/\s(.*)$/)[1];
    var AMPM = tiempo.match(/[amp. ]+/)[0];

    //Remover los espacios en la variable
    AMPM = AMPM.replace(' ', '');

    //Si la hora contiene PM
    if((AMPM == "p. m." || AMPM == "p.m.") && horas<12){
        
        //Sumarle 12 a las horas
        horas = horas+12;

    }

    //Si la hora contiene AM
    if((AMPM == "a. m." || AMPM == "a.m.") && horas==12) {
        
        //Si son las 12 de la noche restarle 12 horas
        horas = horas-12;

    }

    //Convertir en cadena las horas y los minutos
    var sHoras = horas.toString();
    var sMinutos = minutos.toString();

    //Si la hora o los minutos son de un solo digito, agregar el cero
    if(horas<10) sHoras = "0" + sHoras;
    if(minutos<10) sMinutos = "0" + sMinutos;

    //Concatenar la fecha completa
    fecha = año + '-' + mes + '-' + dia + ' ' + sHoras + ':' + sMinutos;

    //console.log('La fecha completa sería: ' + fecha);

    //Retornar si lo incluye
    return fecha;
}

function horaAMPM(texto) {
    
    const hora = texto.split(':');
    var horaFormateada = "";

    //Si la hora es mayor o igual a 12
    if (parseInt(hora[0]) >= 12){
        horaFormateada = (parseInt(hora[0]) - 12) + ":" + hora[1] + " PM"
    }
    else{
        horaFormateada = hora[0] + ":" + hora[1] + " AM"
    }

    //console.log("La hora es: " + horaFormateada);
    
    //Devolver la hora formateada
    return horaFormateada;
}

function fechaLegible(texto) {
    
    var fecha = new Date(texto);
    var fechaFormateada ="";

    //console.log(fecha)

    switch (fecha.getDay()){
        case 0:
            fechaFormateada = "domingo ";
            break;
        case 1:
            fechaFormateada = "lunes ";
            break;
        case 2:
            fechaFormateada = "martes ";
            break;
        case 3:
            fechaFormateada = "miércoles ";
            break;
        case 4:
            fechaFormateada = "jueves ";
            break;
        case 5:
            fechaFormateada = "viernes ";
            break;
        case 6:
            fechaFormateada = "sábado ";
            break;
    }

    fechaFormateada = fechaFormateada + fecha.getDate() + ' de ';

    switch ((fecha.getMonth() + 1)){
        case 1:
            fechaFormateada = fechaFormateada + 'enero ';
            break;
        case 2:
            fechaFormateada = fechaFormateada + 'febrero ';
            break;
        case 3:
            fechaFormateada = fechaFormateada + 'marzo ';
            break;
        case 4:
            fechaFormateada = fechaFormateada + 'abril ';
            break;
        case 5:
            fechaFormateada = fechaFormateada + 'mayo ';
            break;
        case 6:
            fechaFormateada = fechaFormateada + 'junio ';
            break;    
        case 7:
            fechaFormateada = fechaFormateada + 'julio ';
            break;
        case 8:
            fechaFormateada = fechaFormateada + 'agosto ';
            break;
        case 9:
            fechaFormateada = fechaFormateada + 'septiembre ';
            break;
        case 10:
            fechaFormateada = fechaFormateada + 'octubre ';
            break;
        case 11:
            fechaFormateada = fechaFormateada + 'noviembre ';
            break;
        case 12:
            fechaFormateada = fechaFormateada + 'diciembre ';
            break;
    }

    fechaFormateada = fechaFormateada + 'del ' + fecha.getFullYear();

    //Devolver la fecha formateada
    return fechaFormateada;
}

function fechaHoraLegible(texto) {
    
    var fecha = new Date(texto);
    var fechaFormateada ="";

    //console.log(fecha)

    switch (fecha.getDay()){
        case 0:
            fechaFormateada = "domingo ";
            break;
        case 1:
            fechaFormateada = "lunes ";
            break;
        case 2:
            fechaFormateada = "martes ";
            break;
        case 3:
            fechaFormateada = "miércoles ";
            break;
        case 4:
            fechaFormateada = "jueves ";
            break;
        case 5:
            fechaFormateada = "viernes ";
            break;
        case 6:
            fechaFormateada = "sábado ";
            break;
    }

    fechaFormateada = fechaFormateada + fecha.getDate() + ' de ';

    switch ((fecha.getMonth() + 1)){
        case 1:
            fechaFormateada = fechaFormateada + 'enero ';
            break;
        case 2:
            fechaFormateada = fechaFormateada + 'febrero ';
            break;
        case 3:
            fechaFormateada = fechaFormateada + 'marzo ';
            break;
        case 4:
            fechaFormateada = fechaFormateada + 'abril ';
            break;
        case 5:
            fechaFormateada = fechaFormateada + 'mayo ';
            break;
        case 6:
            fechaFormateada = fechaFormateada + 'junio ';
            break;    
        case 7:
            fechaFormateada = fechaFormateada + 'julio ';
            break;
        case 8:
            fechaFormateada = fechaFormateada + 'agosto ';
            break;
        case 9:
            fechaFormateada = fechaFormateada + 'septiembre ';
            break;
        case 10:
            fechaFormateada = fechaFormateada + 'octubre ';
            break;
        case 11:
            fechaFormateada = fechaFormateada + 'noviembre ';
            break;
        case 12:
            fechaFormateada = fechaFormateada + 'diciembre ';
            break;
    }

    fechaFormateada = fechaFormateada + 'del ' + fecha.getFullYear() + ' a las ' + this.horaAMPM(fecha.getHours() + ':' + fecha.getMinutes());

    //Devolver la fecha formateada
    return fechaFormateada;
}

module.exports.extraerFecha = extraerFecha;
module.exports.horaAMPM = horaAMPM;
module.exports.fechaLegible = fechaLegible;
module.exports.fechaHoraLegible = fechaHoraLegible;