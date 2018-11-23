const link = 'https://api.spotify.com/v1/playlists';
const link2 = 'https://api.spotify.com/v1/audio-features';

let idsCanciones = [];
let audioFeatures = [];

//Corre todo el procedimiento
function runScript() {
    let token = document.querySelector('#token').value;
    let playlistId = document.querySelector('#idlista').value;

    //Promesa que trae las canciones de una playlist
    let pet = new Promise((resolve, reject) => {
        fetch(link + '/' + playlistId + '?market=MX', {
                method: 'GET', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => response.json())
            .then(json => {
                resolve(json);
            })
            .catch(error => {
                reject(error);
            })
    });

    //Ejecutamos la promesa que trae las canciones
    pet.then(res => {
            console.log(res)
            let playlist = res;
            playlist['tracks'].items.forEach(element => {
                //Agregamos los ids de las canciones en un array
                idsCanciones.push(element.track.id);
            });
            getAudioFeatures();
        })
        .catch(error => console.error(error));
}

//Función que se encarga de realizar la petición de los datos de las canciones
function getAudioFeatures() {
    let token = document.querySelector('#token').value;

    //Promesa que trae los datos de varias canciones según su id
    let petc = new Promise((resolve, reject) => {
        fetch(link2 + '?ids=' + idsCanciones.join(','), {
                method: 'GET', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(response => response.json())
            .then(json => {
                resolve(json);
            })
            .catch(error => {
                reject(error);
            })
    });

    //Ejecutamos la promesa
    petc.then(json => {
            console.log(json);
            let clase = document.querySelector('#clase').value;
            let csv = 'acousticness,danceability,duration_ms,energy,id,instrumentalness,key,liveness,loudness,mode,speechiness,tempo,time_signature,valence,clase\n';
            json.audio_features.forEach(element => {
                csv += element.acousticness + ',';
                csv += element.danceability + ',';
                csv += element.duration_ms + ',';
                csv += element.energy + ',';
                csv += element.id + ',';
                csv += element.instrumentalness + ',';
                csv += element.key + ',';
                csv += element.liveness + ',';
                csv += element.loudness + ',';
                csv += element.mode + ',';
                csv += element.speechiness + ',';
                csv += element.tempo + ',';
                csv += element.time_signature + ',';
                csv += element.valence + ',';
                csv += clase + '\n';
            });
            setTimeout(() => {
                generateCSV(csv);
            }, 100);
        })
        .catch(error => {
            return error;
        })
}

//Función que genera un archivo CSV
function generateCSV(csvFile) {
    let filename = 'AudioFeatures';
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}