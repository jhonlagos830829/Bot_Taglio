const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const { flowInactividad, startInactividad, resetInactividad, stopInactividad} = require("./Funciones/tiempito");

//////////////////////////////////////// IMPORTACION DE LOS FLUJOS QUE SE USARAN

const flujoSaludo = require('./FlujosBotTaglio/flujoSaludo')
const flujoPrecios = require('./FlujosBotTaglio/flujoPrecios')
const flujoProgramarCita = require('./FlujosBotTaglio/flujoProgramarCita')
const flujoNotaDeVozEnviada = require('./FlujosBotTaglio/flujoNotaDeVozEnviada')
const flujoConfiguracion = require('./FlujosBotTaglio/flujoConfiguracion')
const flujoNoTengoRespuesta = require('./FlujosBotTaglio/flujoNoTengoRespuesta')
const flujoDespedida = require('./FlujosBotTaglio/flujoDespedida')
const flujoCalendarioOcupado = require('./FlujosBotTaglio/flujoCalendarioOcupado')
const flujoNotificarAgendaDisponible = require('./FlujosBotTaglio/flujoNotificarAgendaDisponible')

////////////////////////////////////////////////////////////////////////////////

var clienteSaludado = false

const imagenEnviada = addKeyword(EVENTS.MEDIA)
    .addAnswer('¿Hola, qué tal?', {delay:2000})
    .addAnswer('¿Está enviando un comprobante de pago?', {delay:2000})
    .addAnswer('Recuerde que por aquí solo podemos atender solicitudes o reportes de fallas técnicas', {delay:3000})
    .addAnswer('Para todo lo relacionado con *información de nuestros servicios, cuentas y pagos*\n\nPor favor pulse sobre el siguiente número 👉 *315 342 0526*\n\nY luego seleccione\n\n*Chatear con +57 315 3420526*', {delay:6000})
    .addAnswer('Allí uno de nuestros agentes le atenderá', {delay:10000})

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoSaludo, flujoPrecios, flujoProgramarCita, flujoCalendarioOcupado, flujoNotaDeVozEnviada, flujoConfiguracion, flujoNoTengoRespuesta, flujoNotificarAgendaDisponible, flujoDespedida])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb({port:3001})
}

main()
