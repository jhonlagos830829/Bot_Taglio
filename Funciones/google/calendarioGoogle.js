const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
var start_Date = new Date();
var end_Date = new Date();
var event_Id = '';
var event_Name = '';
var event_Datetime = new Date();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];
//const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: start_Date.toISOString(),
    timeMax: end_Date.toISOString(),
    maxResults: 50,
    singleEvents: true,
    orderBy: 'startTime',
    timeZone: 'America/Bogota',
  });
  const events = res.data.items;

  //Devolver la lista de eventos
  return events;

}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function createEvent(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  
  var event = {
    'summary': event_Name,
    'start': {
      'dateTime': event_Datetime.toISOString(),
      'timeZone': 'America/Bogota',
    },
    'end': {
      'dateTime': new Date(event_Datetime.setHours(event_Datetime.getHours(), event_Datetime.getMinutes() + 30)).toISOString(),
      'timeZone': 'America/Bogota',
    },
  };
  
  const res = await calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  });
    
  return res;
  
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function deleteEvent(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.delete({
    calendarId: 'primary',
    eventId: event_Id,
  });
  const result = res.data.items;
  
  return result;

}

async function obtenerCitas(fechaInicial, fechaFinal) {
  
  start_Date = new Date(fechaInicial);
  end_Date = new Date(fechaFinal);
  
  const citas = authorize().then(listEvents).catch(console.error);

  return citas;

}

async function crearCita(nombre, fecha) {
  
  event_Name = nombre;
  event_Datetime = new Date(fecha);

  const citas = authorize().then(createEvent).catch(console.error);

  return citas;

}

async function eliminarCita(idCita) {
  
  event_Id = idCita;

  const citas = authorize().then(deleteEvent).catch(console.error);

  return citas;

}

  module.exports.obtenerCitas = obtenerCitas;
  module.exports.crearCita = crearCita;
  module.exports.eliminarCita = eliminarCita;