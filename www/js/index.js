// (c) 2013-2015 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton, statusDiv */
/* global detailPage, resultDiv, messageInput, sendButton, disconnectButton */
/* global cordova, bluetoothSerial  */
/* jshint browser: true , devel: true*/
'use strict';
var app = {
    initialize: function () {
        this.bindEvents();
        this.showMainPage();
    },
    bindEvents: function () {

        var TOUCH_START = 'touchstart';
        if (window.navigator.msPointerEnabled) { // windows phone
            TOUCH_START = 'MSPointerDown';
        }
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener(TOUCH_START, this.refreshDeviceList, false);
        disconnectButton.addEventListener(TOUCH_START, this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false);
    },
    onDeviceReady: function () {
        app.refreshDeviceList();
    },
    refreshDeviceList: function () {
        bluetoothSerial.list(app.onDeviceList, app.onError);
    },
    onDeviceList: function (devices) {
        var option;

        // remove existing devices
        deviceList.innerHTML = "";
        app.setStatus("");

        devices.forEach(function (device) {

            var listItem = document.createElement('li'),
                html = '<b>' + device.name + '</b><br/>' + device.id;

            listItem.innerHTML = html;

            if (cordova.platformId === 'windowsphone') {
                // This is a temporary hack until I get the list tap working
                var button = document.createElement('button');
                button.innerHTML = "Desconectado";
                var x = document.getElementById("div1");
                x.innerHTML = "DESCONECTADO"
                button.addEventListener('click', app.connect, false);
                button.dataset = {};
                button.dataset.deviceId = device.id;
                listItem.appendChild(button);
            } else {
                listItem.dataset.deviceId = device.id;
            }
            deviceList.appendChild(listItem);
        });

        if (devices.length === 0) {

            option = document.createElement('option');
            option.innerHTML = "Sin dispositivos Bluetooth";
            deviceList.appendChild(option);
            var x = document.getElementById("div1");
            x.innerHTML= '<h4 style=" text-align: center; color= "ff0000";>DESCONECTADO</h4> <h4 style=" text-align: center; color= "ff0000";>Conecte al dispositio bluetooth</h4><i style= "margin-left: 100px; margin-top: 100px; font-size: 160px;" class="fa-brands fa-bluetooth"></i>'+
            '<i style=" margin-top: 80px; position: absolute; font-size:80px ;" class="fa-solid fa-x"></i> ';
            x.style.width="360px";
            x.style.height="655px";
            x.style.background="rgb(238, 160, 160)";
            const menu= document.getElementById("btn");
            const opcLab= document.getElementById("opcLab");
            const check= document.getElementById("check");
            check.id="nuevo";
            menu.addEventListener('click', function(){
                menu.disabled=true;
                x.style.opacity=0.7;
                setTimeout(function(){
                    x.style.opacity=1;
                    x.style.background="rgb(238, 160, 160)";
                },200);
            });
            opcLab.addEventListener('click', function(){
                opcLab.disabled=true;
                x.style.opacity=0.7;
                setTimeout(function(){
                    x.style.opacity=1;
                    x.style.background="rgb(238, 160, 160)";
                },200);
            });

            if (cordova.platformId === "ios") { // BLE
                app.setStatus("No Bluetooth Peripherals Discovered.");
            } else { // Android or Windows Phone
                app.setStatus("Empareje un dispositivo Bluetooth.");
                var x = document.getElementById("div1");
                x.innerHTML = "DESCONECTADO"
            }

        } else {
            app.setStatus("Encontrando " + devices.length + " dispositivos" + (devices.length === 1 ? "." : "s."));
        }

    },
    connect: function (e) {
        var onConnect = function () {
            // subscribe for incoming data
            bluetoothSerial.subscribe('\n', app.onData, app.onError);

            resultDiv.innerHTML = "";
            app.setStatus("Conectado");
            app.showDetailPage();
        };

        var deviceId = e.target.dataset.deviceId;
        if (!deviceId) { // try the parent
            deviceId = e.target.parentNode.dataset.deviceId;
        }

        bluetoothSerial.connect(deviceId, onConnect, app.onError);
    },
    sendToArduino: function (c) {
        bluetoothSerial.write(c);
    },
    onData: function (data) { // data received from Arduino
        console.log(data);

        const splitString = data.split(" ");

        console.log(splitString);
        gassr.innerHTML = "Gas <br>" + splitString[0];
        humedad.innerHTML = "Humedad <br>" + splitString[2];
        temperatura.innerHTML = "Flama <br>" + splitString[4];
        ;
    },

    disconnect: function (event) {
        bluetoothSerial.disconnect(app.showMainPage, app.onError);
    },
    showMainPage: function () {
        mainPage.style.display = "";
        detailPage.style.display = "none";
    },
    showDetailPage: function () {
        mainPage.style.display = "none";
        detailPage.style.display = "";
    },
    setStatus: function (message) {
        console.log(message);

        window.clearTimeout(app.statusTimeout);
        statusDiv.innerHTML = message;
        statusDiv.className = 'fadein';

        // automatically clear the status with a timer
        app.statusTimeout = setTimeout(function () {
            statusDiv.className = 'fadeout';
        }, 5000);
    },
    onError: function (reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};

///////

/*    
      id="puerta"
            */
$("#vel1").click(function () {
    app.sendToArduino("1");
});
$("#vel2").click(function () {
    app.sendToArduino("2");
});
$("#vel3").click(function () {
    app.sendToArduino("3");
});
$("#off").click(function () {
    app.sendToArduino("4");
});


$("#iluminacion").on("input", function () {
    var nIlu;
    nIlu = iluminacion.value;
    if (nIlu == 0) {
        app.sendToArduino("5");

    } else if (nIlu == 1) {
        app.sendToArduino("6");
    } else if (nIlu == 2) {
        app.sendToArduino("7");
    } else if (nIlu == 3) {
        app.sendToArduino("8");
    }
});



$("#extra").on("input", function () {
    var vEx;
    vEx = extra.value;
    if (vEx == 0) {
        app.sendToArduino("9");

    } else {
        app.sendToArduino("a");
    }
});

$("#aspe").on("input", function () {
    var vaspe;
    vaspe = aspe.value;
    if (vaspe == 0) {
        app.sendToArduino("b");

    } else {
        app.sendToArduino("c");
    }
});

$("#puerta").on("input", function () {
    var vpuerta;
    vpuerta = puerta.value;
    if (vpuerta == 0) {
        app.sendToArduino("d");

    } else {
        app.sendToArduino("e");
    }
});
// var x = document.getElementById("div1");
// x.innerHTML= '<h4 style=" text-align: center; color= "ff0000";>DESCONECTADO</h4> <h4 style=" text-align: center; color= "ff0000";>Conecte al dispositio bluetooth</h4><i style= "margin-left: 100px; margin-top: 100px; font-size: 160px;" class="fa-brands fa-bluetooth"></i>'+
// '<i style=" margin-top: 80px; position: absolute; font-size:80px ;" class="fa-solid fa-x"></i> ';
// x.style.width="360px";
// x.style.height="655px";
// x.style.background="rgb(238, 160, 160)";
// const menu= document.getElementById("btn");
// const opcLab= document.getElementById("opcLab");
// const check= document.getElementById("check");
// check.id="nuevo";
// menu.addEventListener('click', function(){
//     menu.disabled=true;
//     x.style.opacity=0.7;
//     setTimeout(function(){
//         x.style.opacity=1;
//         x.style.background="rgb(238, 160, 160)";
//     },200);
// });
// opcLab.addEventListener('click', function(){
//     opcLab.disabled=true;
//     x.style.opacity=0.7;
//     setTimeout(function(){
//         x.style.opacity=1;
//         x.style.background="rgb(238, 160, 160)";
//     },200);
// });
function logo(){
    var cuerpo = document.getElementById("cuerpoTotal");
            setTimeout(function(){
                cuerpo.style.opacity=1;
                cuerpo.innerHTML=' <img id="logoApp" src="./css//Captura de pantalla_20221125_073050.png" alt=""> ';
            },1000);
} 