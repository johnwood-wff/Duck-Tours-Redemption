/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function connectFailure(err)
{
	alert("connect failure! " + err);
}

function decode(byteArray) {
	var ba = byteArray.split(",");
	var text = "";
	for (var n in ba) {
		text += String.fromCharCode(parseInt(ba[n]));
	}
	return text;
}

function printOutReceipt(text) {

    bluetoothSerial.list(function(devices) {
    	//alert('listing devices');
        devices.forEach(function(device) {
            // add a header and footer for space to tear off
            var data = "\r\n\r\n\r\n" + text + "\r\n\r\n\r\n\r\n\r\n\r\n\r\n";
            //alert('sending to ' + device.address);
            bluetoothSerial.connect(device.address, function() {
                //alert('connect complete');
                bluetoothSerial.write(data, function() { bluetoothSerial.disconnect(); }, function() { alert('send error!'); bluetoothSerial.disconnect(); });
            }, connectFailure);
        }
      )
    }, connectFailure);
}

window.onerror = function(message, url, lineNumber) {
    alert("Error: "+message+" in "+url+" at line "+lineNumber);
}

var returnData;
var app = {  
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', app.backPressed, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent();
        console.log("device ready!");
        app.receivedEvent('deviceready');
        
        // Test Bluetooth Serial Plugin
        bluetoothSerial.isEnabled(
            function() { 
                alert("Bluetooth is enabled");
            },
            function() { 
                alert("Bluetooth is *not* enabled");
            }
        ); 
    },
    // Update DOM on a Received Event
    receivedEvent: function() {
        var menuOpen = false;
        var menuDiv = "";
        //app.doLogin();
        //app.loadHomeScreen("http://ducktours.workflowfirst.net/TMS/?m=1&");
    },

    backPressed: function(){
        window.history.back();
    },

    loadHomeScreen: function(url){
        //MUST GET homeScreen be sets
        alert("Load Home Screen URL: " + url);
        
        $.ajax({
            url: "record.html",
            cache: false,
            success: function(result) {
                var body = jQuery('<body>').html(result);
                var homeScreen = body.find("#homeScreen");
                alert("Home Screen: " + homeScreen.attr('src'));
                
                var link = "http://ducktours.workflowfirst.net/TMS";
                var src = "http://ducktours.workflowfirst.net/TMS/?m=1&";

                if (url!=""){
                    src = url;
                }
                
                alert(src);
                homeScreen.attr('src', src);
                homeScreen.src = src;
                
                alert("Home Screen: " + homeScreen.attr('src'));
                alert(homeScreen.src);
                
                //homeScreen.attr('src', function(i, val){ return val;});
                //homeScreen.attr('src', homeScreen.attr('src'));
                //super.loadUrl("file:///android_asset/www/record.html);
            },
        });
        
    },
    
    doLogin: function(){
        var link = "http://ducktours.workflowfirst.net/tms/";
        var returnValue = false;
        
        //getting username and password
        var loginInfo = "";
        if (localStorage.length > 0){
            var key = localStorage.key(localStorage.length - 1);
            var index = 2;
            var value = localStorage.getItem(key);
            if (value!==""){
                loginInfo = key.concat(",",value);
            }
        }
        
        loginInfo = loginInfo.split(",");
        console.log("Login Info: " + loginInfo);
        
        var username = loginInfo[0];
        var password = loginInfo[1];

        if (loginInfo!==""){
            if (username!=="" && password!==""){
                link += "verifylogin.aspx?";
                link += "&username=" + username;
                link += "&password=" + encodeURIComponent(Base64.encode(password));
                link += "&format=json";
                console.log("Login link: " + link);
                
                $.ajax({
                     url: link,
                     dataType: 'json',
                     async: false,
                     statusCode: {
                         404: function() {
                             console.log( "Error with login");
                             returnValue = false;
                         },
                         200: function(json){
                             console.log("Login success: " + JSON.stringify(json));
                             returnValue = true;
                         }
                     }
                });           
            }else{
                console.log("No login information found"); 
                returnValue = false;
            }
        }else{
            console.log("No login information found");
            returnValue = false;
        }
        
        return returnValue;
    },
    
    //checking connection
    checkConnection: function () {
        //localStorage.setItem("lastApprovalNumber", 8);
        if (localStorage.getItem("debug")!==""){
            localStorage.removeItem("debug");
        }

        var networkState = navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';
        if (networkState==="No network connection") {
            app.showAlert("You are off-line. Please turn on network for getting notification.", "Connection", 0);
        }
    },

    //exit from app
    exitFromApp: function ()
    {
        navigator.notification.confirm(
            "Do you want to exit the app?", 
            function (button) {
              if (button==1) {
                navigator.app.exitApp();
              }
            },"EXIT",["OK","Cancel"]
        );
    },

    showAlert: function (message, title, duration) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
            if (duration > 0){
                navigator.notification.vibrate(duration);
            }
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    saveInfo: function (key, value) {
        console.log("Save Data with key: " + key + " and value: " + value);
        var removeItem = false;
        for (var i = 0; i < localStorage.length; i++){
            //alert(localStorage.key(i));
            // && (localStorage.key(i)!=="lastApprovalNumber") && (localStorage.key(i)!=="enableLocation") && (localStorage.key(i)!=="locationTimer"))
            if (localStorage.key(i)!=key){
                localStorage.removeItem(key);
                removeItem = true;
            }
        }
        
        if (removeItem===true){
            $.ajax({
                url: 'http://ducktours.workflowfirst.net/TMS/login.aspx?from=',
                dataType: 'json',
                async: false,
                statusCode: {
                     404: function() {
                         console.log( "Error with logout");
                     },
                     200: function(json){
                         console.log("Logout success: " + JSON.stringify(json));
                     }
                }
            });
        }
        localStorage.setItem(key, value); 
        app.showAlert("Data was saved", "Save", 0);
        app.loadHomeScreen();
    },

    getSaveData: function(key){
        console.log("Get Save Data with key: " + key);
        var data;
        var value = localStorage.getItem(key);
        if (value!==null){
            data = key.concat(",",value); 
            console.log("Data: " + data);
            return data;
        }else{
            return null;
        }
    },

    getLoginInfo: function () {
        console.log("Get Login Information");
        
        var dataStored;
        for (var i = 0; i < localStorage.length; i++){
            var itemKey = localStorage.key(i);
            dataStored += "Key: " + localStorage.key(i) + ", Value: " + localStorage.getItem(localStorage.key(i)) + "\n";
        }
        
        //alert("Stored Data: \n" + dataStored);
        
        var data = "";
        if (localStorage.getItem("debug")!==""){
            localStorage.removeItem("debug");
        }
        
        if (localStorage.length > 0){
            username = document.getElementById("username");
            password = document.getElementById("password");
            var key = localStorage.key(localStorage.length - 1);
            var index = 2;
            var value = localStorage.getItem(key);
            if (value!==""){
                username.value = key;
                password.value = value;
                data = key.concat(",",value);
            }
        }
        return data;
    },

    eraseData: function(){
        navigator.notification.confirm(
            "Do you want to clear all login data from the app?", 
            function (button) {
              if (button==1) {
                localStorage.clear();
                username = document.getElementById("username");
                password = document.getElementById("password");
                username.value = "";
                password.value = "";
                app.showAlert("All saved data was cleared", "Clear data", 0);
                  
                $.ajax({
                     url: 'http://ducktours.workflowfirst.net/TMS/login.aspx?from=',
                     dataType: 'json',
                     async: false,
                     statusCode: {
                         404: function() {
                             console.log( "Error with logout");
                         },
                         200: function(json){
                             console.log("Logout success: " + JSON.stringify(json));
                         }
                     }
                }); 
        
              }
            },"Clear Data",["OK","Cancel"]
        );
    },
    
    //checking with the server
    checkQrCode: function(){
        var qrCode = document.getElementById("QRCode").value;
        //qrCode = "92885048";
         
        app.doLogin();
         
        var link = "http://ducktours.workflowfirst.net/tms/";
        var funcId = "Functions:_ScanQRCode";
        var record = {  "QRCode": qrCode
                     };
        
        var url = link + "runfunction.aspx?id=" + encodeURIComponent(funcId) + "&_format=json&json=" + encodeURIComponent(JSON.stringify(record));
    
        $.ajax({
            url: url,
            dataType: 'json',
            async: false,
            success: function(data){
                //app.checkResult(data, qrCode);
                returnData = data;
            },
            error: function(x,s,ss){
                app.showAlert("Error with connecting to the server. Please check your wifi/cellular connection: " + s + " - " + ss, "Error", 0);
            }
        });
        
        app.checkResult(returnData, qrCode);
        
        //$.post(link + "runfunction.aspx?id=" + encodeURIComponent(funcId) + "&_format=json&json=" + encodeURIComponent(JSON.stringify(record)), app.checkResult);
       
        //alert("Done");
    },
    
    checkResult: function(data, qrCode) { 
        //app.showAlert(qrCode, "Scanned QR Code", 0);
        var printReceipt = "";
        var referenceTicket = "";
        var obj = JSON.parse(JSON.stringify(data));
        for (var i in obj) {
            if (obj[i].OrderID!="" && obj[i].OrderID!=undefined){
                if (obj[i].ExchangeForTicket===true){
                    //app.showAlert("The Order has already been redeemed for tickets", "Error", 0);
                    navigator.notification.confirm(
                        "The Order has already been redeemed for tickets", 
                        function (button) {
                            if(button==1){
                                alert("URL: " + obj[i].URL);
                                app.loadHomeScreen(obj[i].URL);
                                window.location="record.html";
                            }
                        },"Error",["View Order","Cancel"]
                    );
                }else{
                    //printing the Transaction Receipt
                    printReceipt += "Transaction Receipt - Order Number to Duck Tours ticket\r\n";
                    printReceipt += decode(obj[i].TRQrCode) + "\r\n";
                    printReceipt += "Transaction Receipt Number: " + obj[i].TRNo.match(/.{1,4}/g).join(" ") + "\r\n";
                    printReceipt += "Date: " + app.timeConverter(obj[i].Date) + "\r\n";
                    printReceipt += "-------------------------------\r\n";
                    printReceipt += "\r\n";
                    printReceipt += "Order Number: " + obj[i].OrderID.match(/.{1,4}/g).join(" ") + "\r\n";
                    printReceipt += "Customer Name: " + obj[i].CustomerName + "\r\n";
                    printReceipt += "Purchased Product (Product Name - Quantity):\r\n";
                    printReceipt += obj[i].PurchasedProduct + "\r\n";

                    //TODO: Printing script for transaction receipt is here
                    //app.showAlert(printReceipt, "Transaction Receipt", 0);
                    
                    navigator.notification.confirm(
                        "Please select if the order should be redeemed as normal ticket or Premium Cards?", 
                        function (button) {
                            if(button==1){
                                var ticketBreakdown = JSON.parse(JSON.stringify(obj[i].TicketBreakdown));
                                for(var j in ticketBreakdown){
                                    var ticket = "";
                                    ticket += "Duck Tours Ticket\r\n";
                                    ticket += decode(ticketBreakdown[j].QRCode) + "\r\n";
                                    ticket += "Date: " + app.timeConverter(ticketBreakdown[j].Date) + "\r\n";
                                    ticket += "Customer Name: " + ticketBreakdown[i].CustomerName + "\r\n";
                                    ticket += "Ticket Number: " + ticketBreakdown[j].TicketNumber.match(/.{1,4}/g).join(" ") + "\r\n";
                                    ticket += "Ticket Type: " + ticketBreakdown[j].TicketType + "\r\n";
                                    ticket += "Number of entrance ticket can be issued: " + ticketBreakdown[j].Balance + "\r\n";

                                    //TODO: printing the Duck Tours ticket with QR code here
                                    //app.showAlert(ticket, "Duck Tours Ticket", 0);
                                    printReceipt += ticket;
                                }
                                app.showAlert(printReceipt, "Transaction Receipt + Tickets", 0);
                                //printOutReceipt(printReceipt);
                            }else{
                                if(button==2){
                                    app.loadHomeScreen(obj[i].Action);
                                    window.location = "record.html";
                                }
                            }
                        },"Error",["Normal Ticket", "Premium Cards"]
                    );                 
                }
            }else{
                if (obj[i].TicketNumber!="" && obj[i].TicketNumber!=undefined){
                    if (obj[i].Error!="" && obj[i].Error!=undefined){
                        //app.showAlert(obj[i].Error, "Error", 0);
                        navigator.notification.confirm(
                            ticketRedeemedErr, 
                            function (button) {
                                if(button==1){
                                    alert("Ticket URL: " + obj[i].URL)
                                    app.loadHomeScreen(obj[i].URL);
                                    window.location="record.html";
                                }
                            },"Error",["View Visit","Cancel"]
                        );
                    }else{
                        referenceTicket += obj[i].Attraction + " - Venue Reference Transaction Ticket\r\n";
                        referenceTicket += decode(obj[i].ReferenceTicketNoQrCode) + "\r\n";
                        referenceTicket += "Reference Number: " + obj[i].ReferenceTicketNo.match(/.{1,4}/g).join(" ") + "\r\n";
                        referenceTicket += "Date: " + app.timeConverter(obj[i].Date) + "\r\n";
                        referenceTicket += "-------------------------------\r\n";
                        referenceTicket += "\r\n";
                        if (obj[i].ProductName!=="" && obj[i].ProductName!==undefined){
                            referenceTicket += "Product Name: " + obj[i].ProductName + "\r\n";
                            referenceTicket += "Merchant: " + obj[i].Merchant + "\r\n";
                            referenceTicket += "Attraction: " + obj[i].Attraction + "\r\n";
                        }
                        if (obj[i].Attraction!=="" && obj[i].Attraction!==undefined && (obj[i].ProductName==""||obj[i].ProductName==undefined)){
                            referenceTicket += "Merchant: " + obj[i].Merchant + "\r\n";
                            referenceTicket += "Attraction: " + obj[i].Attraction + "\r\n";
                        }
                        if (obj[i].EntranceTicketNo!=="" && obj[i].EntranceTicketNo!==undefined){
                            referenceTicket += "Entrance Ticket Number: " + obj[i].EntranceTicketNo + "\r\n";
                        }

                        //TODO: printing the Reference Ticket here
                        app.showAlert(referenceTicket, obj[i].Attraction + " - Venue Reference Transaction Ticket", 0);
                        //printOutReceipt(referenceTicket);
                    }
                }else{
                    if (obj[i].Error!="" && obj[i].Error!=undefined){
                        app.showAlert(obj[i].Error, "Error", 0);
                    }  
                }
            }     
        }
        return true;
    },
    
    timeConverter: function (UNIX_timestamp){
        //convert timestamp to Singapore timezone and change to 12 hours format
        var date = new Date(UNIX_timestamp);
        var offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - (offset - 60));
        var year = date.getUTCFullYear();
        var month = date.getUTCMonth() + 1; // getMonth() is zero-indexed, so we'll increment to get the correct month number
        var day = date.getUTCDate();
        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();
        var seconds = date.getUTCSeconds();
        
        month = (month < 10) ? '0' + month : month;
        day = (day < 10) ? '0' + day : day;
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds: seconds;
        var date = day + '/' + month + '/' + year;
        
        var time = hours + ':' + minutes + ':' + seconds;
  		time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [t];

  		if (time.length > 1) { // If time format correct
            time = time.slice (1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
  		}
  		time = time.join(''); 
        return date + ' ' + time;
        
        //convert timestamp to local timezone
        //var a = new Date(UNIX_timestamp);
        //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        //var year = a.getFullYear();
        //var month = months[a.getMonth()];
        //var date = a.getDate();
        //var hour = a.getHours();
        //var min = a.getMinutes();
        //var sec = a.getSeconds();
        //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        //return time;
    }
};