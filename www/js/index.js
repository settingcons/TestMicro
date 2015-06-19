//Location content
var lc;
//PhoneGap Ready variable
var pgr = false;
var path = '';


/**************************************** GLOBAL VARIABLE ****************************************/
var startTime, endTime;
var flag = false;
var timeToTouch = 10;
var timeToRec = 10;
/**************************************** GLOBAL VARIABLE ****************************************/
// Audio player
//
var my_media = null;
var mediaTimer = null;
var myFileName = "myfile001.wav";
var meFileRecord = null;
var recInterval = null;
var setInt = 10;
var recStatus = 0;
var playStatus = 0;



/**************************************** WINDOW EVENTS ****************************************/
/**************************************** WINDOW EVENTS ****************************************/
/**************************************** WINDOW EVENTS ****************************************/

window.addEventListener('load', function () {
    document.getElementById('playAudio_Push').style.visibility="hidden";
    document.getElementById('recImg').style.visibility="hidden";
    document.addEventListener("deviceReady", onDeviceReady, false);
}, false);


function onDeviceReady() {
    try {
        //Get a handle we'll use to adjust the accelerometer
        //content
        lc = document.getElementById("locationInfo");
        //Set the variable that lets other parts of the program
        //know that PhoneGap is initialized
        pgr = true;

        // window.requestFileSystem is recognized, so far so good.
        window.requestFileSystem(1, 0, function(fileSystem){
        }, function(e){
            // 'e' is an object, {code: 'Class not found'}
            alert('Error accessing local file system');
        });
    }
    catch (ex) {
        alert("deviceReady error: "+ex.message);
    }
}

var requestFileSystem = function(type, size, successCallback, errorCallback) {
    argscheck.checkArgs('nnFF', 'requestFileSystem', arguments);
    var fail = function(code) {
        errorCallback && errorCallback(new FileError(code));
    };

    if (type < 0) {
        fail(FileError.SYNTAX_ERR);
    } else {
        // if successful, return a FileSystem object
        var success = function(file_system) {
            if (file_system) {
                if (successCallback) {
                    // grab the name and root from the file system object
                    var result = new FileSystem(file_system.name, file_system.root);
                    successCallback(result);
                }
            }
            else {
                // no FileSystem object returned
                fail(FileError.NOT_FOUND_ERR);
            }
        };
        // The error happens in exec()
        exec(success, fail, "File", "requestFileSystem", [type, size]);
    }
};

/* ------------- TOUCH START -------------*/
document.getElementById('recordAudio_Push').addEventListener('touchstart',function(event) {
    startTime = new Date().getTime();
    flag = false;

    document.getElementById('divlegend').style.visibility="visible";
    document.getElementById('recImg').style.visibility="visible";
    document.getElementById('recordAudio_Push').src="img/micro_push_rec.png";
    document.getElementById('playAudio_Push').style.visibility="hidden";

    recStatus=0;
    recordAudioPush();

},false);

/* ------------- TOUCH MOVE (CANCELAR) -------------*/
document.getElementById('recordAudio_Push').addEventListener('touchmove',function(event) {

    //Limpiamos etiquetas de segundos
    setAudioPosition("", 0);

    //Provocamos parar la grabación
    meFileRecord = null
    clearInterval(recInterval);
    //meFileRecord.stopRecord();
    recStatus = 0;

    //Ocultamos leyenda de Cancelar
    document.getElementById('divlegend').style.visibility="hidden";

    // Ocultamos el icono de grabacion que parpadea
    document.getElementById('recImg').style.visibility="hidden";

    // Ponemos el botón de Graba en inicio (en negro)
    document.getElementById('recordAudio_Push').src="img/micro_push.png";

    // Ocultamos el boton de PLAY
    document.getElementById('playAudio_Push').style.visibility="hidden";
    playStatus=0;

    flag = true;

    alert('Se ha cancelado la grabación');

},false);

/* ------------- TOUCH END -------------*/
document.getElementById('recordAudio_Push').addEventListener('touchend',function(event) {

    //Provocamos parar la grabación
    clearInterval(recInterval);
    meFileRecord.stopRecord();
    recStatus = 0;


    endTime = new Date().getTime();

    //Limpiamos etiquetas de segundos
    setAudioPosition("", 0);

    if(!flag) {
        // ha ido bien

        //Ocultamos leyenda de Cancelar
        document.getElementById('divlegend').style.visibility="hidden";

        // Ocultamos el icono (pequeño) de grabacion que parpadea
        document.getElementById('recImg').style.visibility="hidden";
        document.getElementById('recImg').src="img/micro_push_rec.png";

        // Ponemos el botón de Graba en inicio (en negro)
        document.getElementById('recordAudio_Push').src="img/micro_push.png";

        // Mostramos el boton de PLAY
        document.getElementById('playAudio_Push').style.visibility="visible";
        document.getElementById('playAudio_Push').src="img/play.png";
        playStatus=0;
    }
    else{
        //No ha ido bien

        //Ocultamos leyenda de Cancelar
        document.getElementById('divlegend').style.visibility="hidden";

        // Ocultamos el icono de grabacion que parpadea
        document.getElementById('recImg').style.visibility="hidden";
        document.getElementById('recImg').src="img/micro_push_rec.png";

        // Ponemos el botón de Graba en inicio (en negro)
        document.getElementById('recordAudio_Push').src="img/micro_push.png";

        // Ocultamos el boton de PLAY
        document.getElementById('playAudio_Push').style.visibility="hidden";
        document.getElementById('playAudio_Push').src="img/play.png";
        playStatus=0;

    }

    startTime = null;
    endTime = null;
    flag = false;

},false);

/**************************************** WINDOW EVENTS ****************************************/
/**************************************** WINDOW EVENTS ****************************************/
/**************************************** WINDOW EVENTS ****************************************/


/***************************   AUDIO - INI   ***************************/
/***************************   AUDIO - INI   ***************************/
/***************************   AUDIO - INI   ***************************/


/*************************** PLAY AUDIO PUSH - INI ***************************/

function gotFS(fileSystem) {
    fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry, onError);
}

function gotFileEntry(fileEntry) {

    var fileUri = fileEntry.toURI();
    var scr = fileEntry.toURI();

    my_media = new Media(scr, onSuccess('Play'), onError);

    // Play audio
    my_media.play();

    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        var iPos = parseInt(position);
                        if (iPos < 10) {
                            setAudioPosition("0:0" + (iPos), 0);
                        }
                        else
                        {
                            setAudioPosition("0:" + (iPos), 0);
                        }
                        if (iPos==0){
                            setAudioPosition("", 0);
                            document.getElementById('playAudio_Push').src="img/play.png";
                        }
                        else{
                            document.getElementById('playAudio_Push').src="img/stop.png";
                        }
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e, 1);
                }
            );
        }, setInt * 100);
    }
}

function iniPlayAudio(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);
    fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry(), onError);
}

function stopAudio() {
    clearInterval(recInterval);
    my_media.stop();
    document.getElementById('playAudio_Push').src="img/play.png";
}
/*************************** PLAY AUDIO PUSH - END ***************************/
/*****************************************************************************/



function recordAudioPush() {
    if (recStatus == 0){
        iniRecordAudioPush();
    }
    else{
        stopRecordAudioPull();
    }
}

function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
    alert(buttonIndex(0));
    alert(buttonIndex[0]);
}

function iniRecordAudioPush() {

    //var meFileRecord = new Media(myFileName, onSuccess('Record'), onError);
    meFileRecord = new Media(myFileName, onSuccess('Record'), onError);

    // Record audio
    meFileRecord.startRecord();
    recStatus = 1;
}


function stopRecordAudioPull(){

    recStatus = 0;
    clearInterval(recInterval);
    meFileRecord.stopRecord();
    document.getElementById('recordAudio_Push').src="img/micro_push.png";

    playStatus=0;
    document.getElementById('playAudio_Push').style.visibility="visible";
}


function playAudioPush(){

    if (playStatus == 0)
    {
        // Inicia el play del Audio
        playStatus = 1;
        iniPlayAudio();
    }
    else if (playStatus == 1)
    {
        // para el play del audio
        playStatus = 0;
        stopAudio();
    }

}




/*************************** LABEL SUCCESS/ERROR - INI ***************************/
// onSuccess Callback
//
function onSuccess(action) {
    console.log(action + " :Audio Success");
}

// onError Callback
//
function onError(error) {
    if (error >0){
        alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
    }
}
/*************************** LABEL SUCCESS/ERROR - END ***************************/




/*************************** LABEL AUDIO - INI ***************************/
// Set audio position
//
function setAudioPosition(position, iColor) {
    document.getElementById('audio_position').innerHTML = position;
    if (iColor == 0) {
        // Negro
        document.getElementById('audio_position').style.color='#000000';
    }
    else{
        // Rojo
        document.getElementById('audio_position').style.color='#FF0000';
    }
}

/*************************** LABEL AUDIO - END ***************************/



/*************************** EXIT APP - INI ***************************/
function exitApp() {

    clearInterval(recInterval);
    if (recStatus == 1){
        meFileRecord.stopRecord();
    }
    if (playStatus == 1){
        my_media.stop();
    }
    navigator.app.exitApp();
}
/*************************** EXIT APP - END ***************************/
