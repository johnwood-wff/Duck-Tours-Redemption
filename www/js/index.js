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
        app.receivedEvent();
    },
    // Update DOM on a Received Event
    receivedEvent: function() {
        var menuOpen = false;
        var menuDiv = "";
        var homeScreen = document.getElementById("homeScreen");
        //app.doLogin();
    },

    backPressed: function(){
        window.history.back();
    },

    doLogin: function(){
        var link = "http://ducktours.workflowfirst.net/tms/";
        
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
                    dataType: 'jsonp',
                    async: false,
                    statusCode: {
                        404: function() {
                            console.log( "Error with login");
                        },
                        200: function(json){
                            console.log("Login success: " + JSON.stringify(json));
                        }
                    }
                });           
            }else{
               console.log("No login information found"); 
            }
        }else{
           console.log("No login information found"); 
        }  
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
              if (button==2) {
                navigator.app.exitApp();
              }
            },"EXIT",["Cancel","OK"]
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
                dataType: 'jsonp',
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
        
        alert("Stored Data: \n" + dataStored);
        
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
              if (button==2) {
                localStorage.clear();
                username = document.getElementById("username");
                password = document.getElementById("password");
                username.value = "";
                password.value = "";
                app.showAlert("All saved data was cleared", "Clear data", 0);
                  
                $.ajax({
                    url: 'http://ducktours.workflowfirst.net/TMS/login.aspx?from=',
                    dataType: 'jsonp',
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
            },"Clear Data",["Cancel","OK"]
        );
    },

    //checking with the server
//    checkQrCode: function(){
//        alert("Check QR Code");
//        var qrCode = document.getElementById("QRCode").value;
//        alert(qrCode);
//        //qrCode = "92885048";
//        
//        app.doLogin();
//        
//        var link = "http://ducktours.workflowfirst.net/tms/";
//        var funcId = "Functions:_ScanQRCode";
//        var record = {  "QRCode": qrCode
//                     };
//        
//        alert("Run function: " + link + "runfunction.aspx?id=" + encodeURIComponent(funcId) + "&_format=json&json=" + encodeURIComponent(JSON.stringify(record)));
//
//        //var printReceipt = "";
//        $.post(link + "runfunction.aspx?id=" + encodeURIComponent(funcId) + "&_format=json&json=" + encodeURIComponent(JSON.stringify(record)), function(data, status, xhr) { 
//            alert("Data: " + data);
//            //Length of JSON object
//            //alert(Object.keys(obj.employees[0]).length);
//            
//            var obj = JSON.parse(data);
//            alert(obj[0]);
//            for (var i in obj) {
//                if (obj[i].OrderID!=="" && obj[i].OrderID!==undefined){
//                    alert("Order: " + obj[i].OrderID);
////                    printReceipt += "Transaction Receipt\r\n";
////                    printReceipt += "--------------------\r\n";
////                    printReceipt += "\r\n";
////                    printReceipt += "Order Number: " + obj[i].OrderID + "\r\n";
////                    printReceipt += "Customer Name: " + obj[i].CustomerName + "\r\n";
////                    printReceipt += "Purchased Product:\r\n";
////                    printReceipt += obj[i].PurchasedProduct + "\r\n";
////                    alert(printReceipt);
//                }
//                if (obj[i].TicketNumber!=="" && obj[i].TicketNumber!==undefined){
//                    alert ("Ticket Number: " + obj[i].TicketNumber);
////                    printReceipt += "Venue Reference Transaction Ticket \r\n";
////                    printReceipt += "Reference Number: " + obj[i].ReferenceTicketNo + "\r\n";
////                    printReceipt += "Date: " + obj[i].Date + "\r\n";
////                    printReceipt += "--------------------\r\n";
////                    printReceipt += "\r\n";
////                    if (obj[i].ProductName!=="" && obj[i].ProductName!==undefined){
////                        printReceipt += "Product Name: " + obj[i].ProductName + "\r\n";
////                        printReceipt += "Merchant: " + obj[i].Merchant + "\r\n";
////                        printReceipt += "Attraction: " + obj[i].Attraction + "\r\n";
////                    }
////                    if (obj[i].Attraction!=="" && obj[i].Attraction!==undefined){
////                        printReceipt += "Merchant: " + obj[i].Merchant + "\r\n";
////                        printReceipt += "Attraction: " + obj[i].Attraction + "\r\n";
////                    }
////                    if (obj[i].EntranceTicketNo!=="" && obj[i].EntranceTicketNo!==undefined){
////                        printReceipt += "Entrance Ticket Number: " + obj[i].EntranceTicketNo + "\r\n";
////                    }
////                    alert(printReceipt);
//                }
//                if (obj[i].Error!=="" && obj[i].Error!==undefined){
//                     alert("There is an error with the order number/ticket number: " + obj[i].Error);
//                }       
//            }
////            alert("Status: " + status);
////            alert("XHR: " + JSON.stringify(xhr));
//        });
//        //return printReceipt;
//        alert("DONE");
//    },
    
    //checking with the server
    checkQrCode: function(){
        alert("Check QR Code");
        var qrCode = document.getElementById("QRCode").value;
        alert(qrCode);
        //qrCode = "92885048";
         
        app.doLogin();
         
        var link = "http://ducktours.workflowfirst.net/tms/";
        var funcId = "Functions:_ScanQRCode";
        var record = {  "QRCode": qrCode
                     };
         
        var printReceipt = "";
        var referenceTicket = "";
        alert("Run function: " + link + "runfunction.aspx?id=" + encodeURIComponent(funcId) + "&_format=json&json=" + encodeURIComponent(JSON.stringify(record)));
 
        $.post(link + "runfunction.aspx?id=" + encodeURIComponent(funcId) + "&_format=json&json=" + encodeURIComponent(JSON.stringify(record)), function(data, status, xhr) { 
            alert("Data: " + data);
            //alert(Object.keys(obj.employees[0]).length);
             
            var obj = JSON.parse(data);
            //alert("Result: " + obj[0]);
            for (var i in obj) {
                if (obj[i].OrderID!="" && obj[i].OrderID!=undefined){
                    alert("Order: " + obj[i].OrderID);
                    if (obj[i].ExchangeForTicket===true){
                        alert("Error: The Order has already been redeemed for tickets");
                    }else{
                        //printing the Transaction Receipt
                        printReceipt += "Transaction Receipt\r\n";
                        printReceipt += "--------------------\r\n";
                        printReceipt += "\r\n";
                        printReceipt += "Order Number: " + obj[i].OrderID + "\r\n";
                        printReceipt += "Customer Name: " + obj[i].CustomerName + "\r\n";
                        printReceipt += "Purchased Product (Product Name - Quantity):\r\n";
                        printReceipt += obj[i].PurchasedProduct + "\r\n";
                        
                        //TODO: Printing script for transaction receipt is here
                        alert(printReceipt);
                        
                        var ticketBreakdown = JSON.parse(obj[i].TicketBreakdown);
                        for(var j in ticketBreakdown.TicketBreakdown){
                            var ticket = "";
                            ticket += "Duck Tours Ticket \r\n";
                            ticket += ticketBreakdown.TicketBreakdown[j].QRCode + "\r\n";
                            ticket += ticketBreakdown.TicketBreakdown[j].TicketNumber + "\r\n";
                            ticket += ticketBreakdown.TicketBreakdown[j].TicketType + "\r\n";
                            ticket += ticketBreakdown.TicketBreakdown[j].Balance + "\r\n";
                            
                            //TODO: printing the Duck Tours ticket with QR code here
                            alert(ticket);
                        }                  
                    }
                }else{
                    if (obj[i].TicketNumber!="" && obj[i].TicketNumber!=undefined){
                        alert ("Ticket Number: " + obj[i].TicketNumber);
                        if (obj[i].Error!="" && obj[i].Error!=undefined){
                            alert("Error: " + obj[i].Error);
                        }else{
                            referenceTicket += "Venue Reference Transaction Ticket \r\n";
                            referenceTicket += obj[i].ReferenceTicketNoQrCode + "\r\n";
                            referenceTicket += "Reference Number: " + obj[i].ReferenceTicketNo + "\r\n";
                            referenceTicket += "Date: " + obj[i].Date + "\r\n";
                            referenceTicket += "--------------------\r\n";
                            referenceTicket += "\r\n";
                            if (obj[i].ProductName!=="" && obj[i].ProductName!==undefined){
                                referenceTicket += "Product Name: " + obj[i].ProductName + "\r\n";
                                referenceTicket += "Merchant: " + obj[i].Merchant + "\r\n";
                                referenceTicket += "Attraction: " + obj[i].Attraction + "\r\n";
                            }
                            if (obj[i].Attraction!=="" && obj[i].Attraction!==undefined){
                                referenceTicket += "Merchant: " + obj[i].Merchant + "\r\n";
                                referenceTicket += "Attraction: " + obj[i].Attraction + "\r\n";
                            }
                            if (obj[i].EntranceTicketNo!=="" && obj[i].EntranceTicketNo!==undefined){
                                referenceTicket += "Entrance Ticket Number: " + obj[i].EntranceTicketNo + "\r\n";
                            }else{
                                navigator.notification.prompt("Please enter/scan the value on Entrance Ticket", function(results){
                                    if (results.buttonIndex==2) {
                                        referenceTicket += "Entrance Ticket Number: " + results.input1;
                                    }
                                }, "Enter Entrance Ticket Number", ["Cancel", "OK"]);
                            }
                            
                            //TODO: printing the Reference Ticket here
                            alert(referenceTicket);
                        }
                    }else{
                        if (obj[i].Error!="" && obj[i].Error!=undefined){
                             alert("Error: " + obj[i].Error);
                        }  
                    }
                }     
            }
//            alert("Status: " + status);
//            alert("XHR: " + JSON.stringify(xhr));
        });
        alert("Done");
    },
    
    timeConverter: function (UNIX_timestamp){
      var d = new Date(UNIX_timestamp);
      return d.toString();
    }
};