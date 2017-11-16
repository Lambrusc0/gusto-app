// global variable to open the web SQL database
var db = openDatabase('gusto_db', '1.0', 'Gusto DB', 2 * 1024 * 1024);


// This function is to disable zoom for double click on iOS safari touch
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});



////////////////////////////////////////////////////////
//// VALIDATE LOGIN FUNCTION
////////////////////////////////////////////////////////
$('#login').click(function(){
    
    event.preventDefault();
    
    // Here I get the values of the form
    var uname = document.forms['login-form']['user-name'].value;
    var companyId = document.forms['login-form']['company-id'].value;
    var password = document.forms['login-form']['password'].value;
    
    localStorage.setItem('uname', uname);
    localStorage.setItem('companyId', companyId);
    //localStorage.setItem('password', password);
    
    //console.log(companyId);
    //console.log(uname);
    //console.log(password);
    
    
    var loginData = 'uname=' + uname + '&companyId=' + companyId + '&password=' + password;
    
    if(companyId==""||uname==""||password==""){
        document.getElementById("error").innerHTML = "Please fill all fields";
    }else{
        $.ajax({
            url     : "https://gaborjuhasz.co.uk/gusto-connection/login.php",
            data    : loginData,
            crossDomain: true,
            type    : "POST",
            cache   : false,
            beforeSend: function(){ $("#login").val('Checking...');},
            success : function(data){
				
				//console.log(data);
				
                
                
				// Function to open the web SQL and create tables
				db.transaction(function (tx) {
                    
                        tx.executeSql('CREATE TABLE IF NOT EXISTS category (category_id unique, category_name text)');
						tx.executeSql('CREATE TABLE IF NOT EXISTS user (user_id unique, user_name text, access integer, user_position text, app_code integer)');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS item (item_id unique, category_id integer,item_name text, item_price decimal(5,2), item_description text)');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS settings (VAT_number integer, service_charge decimal(4,2), phone integer, message text, company text)');
                    
                     });
				
				// if answer from database is false than user was not found
                if(data==false){
                    $('#error').html("User data was not found");
                }else{
                    data = $.parseJSON(data);
                    //console.log(data);
                    var categoryData = data[Object.keys(data)[0]];
					var userData = data[Object.keys(data)[1]];
                    var itemData = data[Object.keys(data)[2]];
                    var settingsData = data[Object.keys(data)[3]];
                    var company = data[Object.keys(data)[4]];
                    //console.log(settingsData);
					
					db.transaction(function (tx) {
                            
                            // for loop for the categories
                            for(var i = 0; i<categoryData.length; i++){

                                var category = categoryData[i];


                                for(var x=0;x<category.length;x++){

                                    var categoryId = category[x].category_id;
                                    var categoryName = category[x].category_name;

                                    tx.executeSql('INSERT INTO category (category_id, category_name) VALUES ('+categoryId+', "'+categoryName+'")');

                                    console.log(categoryId+" "+categoryName);
                                }
                            }
                        
                        
                        // for loop for the users
                        for(var i2 = 0; i2<userData.length; i2++){

                            var user = userData[i2];

                            for(var x2 = 0; x2<user.length; x2++){
                                
                                // variables of each user
                                var userName = user[x2].user_name;
                                var userId = user[x2].user_id;
                                var access = user[x2].access;
                                var appCode = user[x2].app_code;
                                var userPosition = user[x2].user_position;
                                
                                // see if they exist
                                //console.log(userName+" "+userId+" "+access+" "+appCode+" "+userPosition);

                                // Put them into the database
                                tx.executeSql('INSERT INTO user (user_id , user_name , access , user_position , app_code ) VALUES ('+userId+',"'+userName+'",'+access+',"'+userPosition+'",'+appCode+')');
                            }
                        }
                            
						// for loop for the items
                        for(var i3 = 0; i3<itemData.length; i3++){
                            
                            var item = itemData[i3];
                            //console.log(item);
                            
                            for(var x3 = 0; x3<item.length; x3++){
                                
                                var itemId = item[x3].item_id;
                                var itemName = item[x3].item_name;
                                var price = item[x3].item_price;
                                var categoryId = item[x3].category_id;
                                var itemDescription = item[x3].item_description;
                                
                                //console.log(itemId+" "+itemName+" "+price+" "+categoryId+" "+itemDescription);
                                
                                // put items in the database
                                tx.executeSql('INSERT INTO item (item_id, category_id, item_name, item_price, item_description) VALUES ('+itemId+', '+categoryId+', "'+itemName+'", '+price+', "'+itemDescription+'")');
                            }
                        } 
                        
				    
                        
                        // for loop for the settings
                        for(var i4 = 0; i4<settingsData.length; i4++){
                            
                            var item = settingsData[i4];
                            //console.log(item);
                            
                            for(var x4 = 0; x4<item.length; x4++){
                                
                                var VATNumber = item[x4].VAT_number;
                                var serviceCharge = item[x4].service_charge;
                                var phone = item[x4].phone;
                                var message = item[x4].message;
                                var companyN = "HELLO";
                                
                                //console.log(itemId+" "+itemName+" "+price+" "+categoryId+" "+itemDescription);
                                
                                // put items in the database
                                tx.executeSql('INSERT INTO settings (VAT_number, service_charge, phone, message, company) VALUES ('+VATNumber+', '+serviceCharge+', '+phone+', "'+message+'", "'+companyN+'")');
                            }
                        }
                        
                        // for loop for the company name
                        for(var i5 = 0; i5<company.length; i5++){
                            
                            var item = company[i5];
                            //console.log(item);
                            
                            for(var x5 = 0; x5<item.length; x5++){
                                
                                var companyName = item[x5].company_name;
                                
                                console.log(companyName);
                                
                                // put items in the database
                                tx.executeSql("UPDATE settings SET company = '"+companyName+"'");
                            }
                        }
                        
                    
					}, function (err) {
                        console.log("error: "+ err.message);
                    });

                     /*db.transaction(function (tx) {
                        tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) {
                           var len = results.rows.length, i;
                           msg = "<br><p>Found rows: " + len + "</p><br>";
                           console.log(msg);
                            //$('#error').html("<br>"+msg);

                           for (i = 0; i < len; i++){
                              msg = "<p><b>" + results.rows.item(i).log + "</b></p><br>";
                              console.log(msg);
                                //$('#error').html("<br>"+msg);
                           }
                        }, null); 
                     });*/
					 
                    // call the next page
                    window.location.replace("application.html");
                }
            }
        });
        
    }
    
});



////////////////////////////////////////////////////////
//// NUMBER KEYBOARD FUNCTION
////////////////////////////////////////////////////////
var code = [];
var codeJoin ="";
$( "#keyboard" ).on( "click", "input[type=button]", function(){
    
    // This is the user input from the numerical keyboard
    var number = $( this ).attr('id');
    if(number=="back"){
        code.pop();
    }else if(number=="delete"){
        code = [];
    }else if(number=="enter"){ 
        
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM user WHERE app_code='+codeJoin+' ', [], function (tx, results) {
                var len = results.rows.length, i;
                
                
                
                // if there is 1 row found in the database than do this
                if(len===1){
                    
                    for(var i = 0; i<len; i++){
                        var userName = results.rows.item(i).user_name;
                        var userId = results.rows.item(i).user_id;
                        var access = results.rows.item(i).access;
                        var userPosition = results.rows.item(i).user_position;
                    }
                    
                    localStorage.setItem("user_id", userId);
                    localStorage.setItem("user_name", userName);
                    localStorage.setItem("user-position", userPosition);
                    localStorage.setItem("access", access);
                    
                    window.location.replace("pos.html");
                }else{
                    $("#code-display").html("Wrong user code");
                    code = [];
                }
            }, null); 
        })
        
    }else if(number=="refresh"){
             db.transaction(function (tx){
                 
                 tx.executeSql('DROP TABLE category');
                 tx.executeSql('DROP TABLE item');
                 tx.executeSql('DROP TABLE user');
                 tx.executeSql('DROP TABLE settings');
                 

             });
        
        
        //////////////////////////////////////////////////////////////////////////////////
        // REFRESHING THE DATABASE
        //////////////////////////////////////////////////////////////////////////////////
        var uname = localStorage.getItem('uname');
        var companyId = localStorage.getItem('companyId');
        var password = localStorage.getItem('password');
        var loginData = 'uname=' + uname + '&companyId=' + companyId + '&password=' + password;
        
        $.ajax({
            url     : "https://gaborjuhasz.co.uk/gusto-connection/login.php",
            data    : loginData,
            crossDomain: true,
            type    : "POST",
            cache   : false,
            beforeSend: function(){ $("#enter").val('DATA IS REFRESHED...');},
            success : function(data){
				
				
				
				// Function to open the web SQL and create tables
				db.transaction(function (tx) {
                    
                        tx.executeSql('CREATE TABLE IF NOT EXISTS category (category_id unique, category_name text)');
						tx.executeSql('CREATE TABLE IF NOT EXISTS user (user_id unique, user_name text, access integer, user_position text, app_code integer)');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS item (item_id unique, category_id integer,item_name text, item_price decimal(5,2), item_description text)');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS settings (VAT_number integer, service_charge decimal(4,2), phone integer, message text, company text)');
                    
                     });
				
				// if answer from database is false than user was not found
                if(data==false){
                    $('#error').html("User data was not found");
                }else{
                    data = $.parseJSON(data);
                    console.log(data);
                    var categoryData = data[Object.keys(data)[0]];
					var userData = data[Object.keys(data)[1]];
                    var itemData = data[Object.keys(data)[2]];
                    var settingsData = data[Object.keys(data)[3]];
                    var company = data[Object.keys(data)[4]];
                    console.log(settingsData);
					
					db.transaction(function (tx) {
                        
                        // for loop for the categories
                        for(var i = 0; i<categoryData.length; i++){

                            var category = categoryData[i];



                                for(var x=0;x<category.length;x++){

                                    var categoryId = category[x].category_id;
                                    var categoryName = category[x].category_name;

                                    tx.executeSql('INSERT INTO category (category_id, category_name) VALUES ('+categoryId+', "'+categoryName+'")');

                                }
                            }
                        
                        // for loop for the users
                        for(var i2 = 0; i2<userData.length; i2++){

                            var user = userData[i2];

                            for(var x2 = 0; x2<user.length; x2++){
                                
                                // variables of each user
                                var userName = user[x2].user_name;
                                var userId = user[x2].user_id;
                                var access = user[x2].access;
                                var appCode = user[x2].app_code;
                                var userPosition = user[x2].user_position;
                                
                                // see if they exist
                                //console.log(userName+" "+userId+" "+access+" "+appCode+" "+userPosition);

                                // Put them into the database
                                tx.executeSql('INSERT INTO user (user_id , user_name , access , user_position , app_code ) VALUES ('+userId+',"'+userName+'",'+access+',"'+userPosition+'",'+appCode+')');
                            }
                        }
                            
						// for loop for the items
                        for(var i3 = 0; i3<itemData.length; i3++){
                            
                            var item = itemData[i3];
                            //console.log(item);
                            
                            for(var x3 = 0; x3<item.length; x3++){
                                
                                var itemId = item[x3].item_id;
                                var itemName = item[x3].item_name
                                var price = item[x3].item_price;
                                var categoryId = item[x3].category_id;
                                var itemDescription = item[x3].item_description;
                                
                                //console.log(itemId+" "+itemName+" "+price+" "+categoryId+" "+itemDescription);
                                
                                // put items in the database
                                tx.executeSql('INSERT INTO item (item_id, category_id, item_name, item_price, item_description) VALUES ('+itemId+', '+categoryId+', "'+itemName+'", '+price+', "'+itemDescription+'")');
                            }
                        } 
				    
                        // for loop for the settings
                        for(var i4 = 0; i4<settingsData.length; i4++){
                            
                            var item = settingsData[i4];
                            console.log(item);
                            
                            for(var x4 = 0; x4<item.length; x4++){
                                
                                var VATNumber = item[x4].VAT_number;
                                var serviceCharge = item[x4].service_charge;
                                var phone = item[x4].phone;
                                var message = item[x4].message;
                                
                                console.log(VATNumber+" "+serviceCharge+" "+phone+" "+message);
                                
                                // put items in the database
                                tx.executeSql('INSERT INTO settings (VAT_number, service_charge, phone, message) VALUES ('+VATNumber+', '+serviceCharge+', '+phone+', "'+message+'")');
                            }
                        }
                        
                        // for loop for the company name
                        for(var i5 = 0; i5<company.length; i5++){
                            
                            var item = company[i5];
                            //console.log(item);
                            
                            for(var x5 = 0; x5<item.length; x5++){
                                
                                var companyName = item[x5].company_name;
                                
                                console.log(companyName);
                                
                                // put items in the database
                                tx.executeSql('UPDATE settings SET company = "'+companyName+'" ');
                            }
                        }
                        
                    
					});
                }
            }
        });
        
        
        
    } else {
        code.push(number);
    }
    
    codeJoin = code.join("");
    if(codeJoin!==""){
        $("#code-display").html(codeJoin);
    //var clicked = $(this.id);
    }else{
        $("#code-display").html("Login code");
    }
    
    console.log(codeJoin);
});



/////////////////////////////////////////////////////////////////////
// onload function for POS.HTML
/////////////////////////////////////////////////////////////////////
// Number board function global variables
    var TableCode = [];
    var TableCodeJoin ="";
    var TableNumber = "";

function pos(){
	
    var userName = localStorage.getItem("user_name");
    var userPosition = localStorage.getItem("user-position");
    var access = localStorage.getItem("access");
    var userId = localStorage.getItem("user_id");
    var customers = 0;
    
    $("#name").html(userName);
    $("#position").html(userPosition);
    
    
    if(access==2){
        $("#top-menu").append("<input type='button' class='red' value='CLOSE DAY' id='close-day'>");
    }
    
    db.transaction(function (tx) {
        tx.executeSql('SELECT rowid, * FROM open_table WHERE open = 1 ', [], function (tx, results) {
            
            var len = results.rows.length, i;
            $("#open-tables").html(len)

            for (i = 0; i < len; i++){
                var tableRowId = results.rows.item(i).rowid;
                var customerNumber = results.rows.item(i).customer_number;
                var tableNumber = results.rows.item(i).table_number;
                var userId = results.rows.item(i).user_id;
                //$('#error').html("<br>"+msg);
                
                // To show the sum customers
                customers += customerNumber;
                $("#customers").html(customers);
                
                //console.log(customers);
                var table = $('<input class="green" type="button" value="'+tableNumber+'" id="'+tableRowId+'">')
                $("#tables").append(table);
                
            }
        }, null);
    })
    
    $( "#number-board" ).on( "click", "input[type=button]", function(){
        // This is the user input from the numerical keyboard
        TableNumber = $( this ).attr('id'); 
        if(TableNumber=="back"){
            TableCode.pop();
        }else{
            TableCode.push(TableNumber);
        }
        
        console.log(TableCode);
        
        TableCodeJoin = TableCode.join("");
        if(TableCodeJoin!==""){
            $("#code-display").html(TableCodeJoin);
        //var clicked = $(this.id);
        }else{
            $("#code-display").html("Table Number");
        }
        
        $("#number-board-display").html(TableCodeJoin);
    });
} 

// OPEN AN EXISTING TABLE BY CLICKING ON THE TABLE BUTTON
$( "#tables" ).on( "click", "input[type=button]", function(){
    var openTable = $( this ).attr('value');
    localStorage.setItem('table-id', openTable);
    
    window.location.replace("open-table.html");
})


// OPEN A TABLE WITH NUMBERS AND OPEN TABLE BUTTON
$('#top-menu').on('click', '#open-table', function(){
    
    $('#enter').attr('id','open');
    $('#open').val("OPEN TABLE");
    
    if(TableCodeJoin == ""){
        
        
        $('#hide').show();
        
        
    } else {
        console.log(TableCodeJoin);
        
        db.transaction(function (tx){
            
            tx.executeSql('SELECT rowid, * FROM open_table WHERE table_number = '+TableCodeJoin+' AND open = 1 ', [], function (tx, results){
                
                // CHECK IF THE TABLE IS ALREADY OPEN
                var len = results.rows.length, i;
                
                // IF THERE IS A TABLE OPEN, THAN RELOAD THE OPEN-TABLE.HTML PAGE WITH THE TABLE NUMBER
                if(len == 1){
                    
                    var openTable = TableCodeJoin;
                    localStorage.setItem('table-id', openTable);

                    window.location.replace("open-table.html");
                    
                }
                
            }, null)
            
        }, null);
        
        
    }
    
})


// TO OPEN EXISTING TABLE BY USING THE NUMBER BOARD
$('#number-board-wrap').on('click', '#open', function(){
    
    console.log(TableNumber)
    
            db.transaction(function (tx){  
        
            tx.executeSql('SELECT rowid, * FROM open_table WHERE table_number = '+TableCodeJoin+' AND open = 1 ', [], function (tx, results){
                // CHECK IF THE TABLE IS ALREADY OPEN
                var len = results.rows.length, i;
                console.log(len)
                // IF THERE IS A TABLE OPEN, THAN RELOAD THE OPEN-TABLE.HTML PAGE WITH THE TABLE NUMBER
                if(len == 1){
                    
                    var openTable = TableCodeJoin;
                    localStorage.setItem('table-id', openTable);

                    window.location.replace("open-table.html");
                    
                }
                
            }, null)
            
        }, null);
        
    
    
})


////////////////////////////////////////////////////////////////////////
// LOGOUT FUNCTION
////////////////////////////////////////////////////////////////////////
$( "#top-menu" ).on("click", "#back-button", function(){
    
    localStorage.removeItem('user_id');
    window.location.replace("application.html");
    
});



////////////////////////////////////////////////////////////////////////
// CLOSE DAY FUNCTION
////////////////////////////////////////////////////////////////////////

    var cash = 0;
    var amex = 0;
    var otherCard = 0;
    var serviceCharge = 0;
    var subtotal = 0;
    var total = 0;
    var dateTime = "";

$( "#sum-buttons" ).on("click", "#sum-close-day", function(){
    
    var companyId = localStorage.getItem('companyId');
    
    // This is to delete all the data from webSQL
    db.transaction(function (tx){
        
        tx.executeSql('SELECT rowid, * FROM open_table', [], function (tx, results){
            
            
            var len = results.rows.length, i;
            
            
            var rowid = 0;
            var tableNumber = 0;
            var userId = 0;
            var customerNumber = 0;
            var payment = "";
            var total = 0;
            var subtotal = 0;
            var serviceCharge = 0;
            var openDate = "";
            var openTableData = "";
            
            for(i = 0; i < len; i++){
                
                rowid = results.rows.item(i).rowid;
                tableNumber = results.rows.item(i).table_number;
                userId = results.rows.item(i).user_id;
                customerNumber = results.rows.item(i).customer_number;
                payment = results.rows.item(i).payment;
                total = results.rows.item(i).total;
                subtotal = results.rows.item(i).subtotal;
                serviceCharge = results.rows.item(i).service_charge;
                openDate = results.rows.item(i).open_date;
                
                openTableData = "rowid="+rowid+"&companyId="+companyId+"&tableNumber="+tableNumber+"&userId="+userId+"&customerNumber="+customerNumber+"&payment="+payment+"&total="+total+"&subtotal="+subtotal+"&serviceCharge="+ serviceCharge+"&opendate="+openDate;
                
                $.ajax({
                    
                    url     : "https://gaborjuhasz.co.uk/gusto-connection/open-table.php",
                    data    : openTableData,
                    crossDomain : true,
                    type    :   "POST",
                    catche  :   false,
                    success :   function(data){
                        
                        if(data=="false"){
                            alert("There was a problem with the data");
                        }else if(data=="true"){
                            alert("Table is saved to database");
                        }
                        
                    }
                    
                })
                
                console.log(openTableData);
                
            }
            
            
            
            
            
        })
        
        
        tx.executeSql('SELECT rowid, * FROM order_item', [], function (tx, results){
            
            var len = results.rows.length, i;
            
            var rowid = 0;
            var tableId = 0;
            var userId = 0;
            var itemId = 0;
            var itemData = "";
            
            for(i = 0; i < len; i++){
                
                rowid = results.rows.item(i).rowid;
                tableId = results.rows.item(i).table_id;
                tableRowid = results.rows.item(i).table_rowid;
                userId = results.rows.item(i).user_id;
                itemId = results.rows.item(i).item_id;
                
                itemData = "rowid="+rowid+"&tableId="+tableId+"&tableRowid="+tableRowid+"&userId="+userId+"&itemId="+itemId+"&companyId="+companyId;
                
                console.log(itemData);
                
                $.ajax({
                    
                    url     : "https://gaborjuhasz.co.uk/gusto-connection/item.php",
                    data    : itemData,
                    crossDomain : true,
                    type    :   "POST",
                    catche  :   false,
                    success :   function(data){
                        
                        if(data=="false"){
                            alert("There was a problem");
                        }else if(data=="true"){
                            alert("Item is saved to database");
                        }
                        
                    }
                    
                })
                
            }
            
        }, null);
        
        
        
        
        

    });
        
    
    var customers = $('#customer-numbers').val();
    var tableNumber = $('#table-numbers').val();
    
    var closedata = "";
    var closeDate = "";
    
    db.transaction(function (tx){
        
        // GET THE DATE FROM THE FIRST OPENED TABLE
        tx.executeSql('SELECT open_date FROM open_table WHERE rowid = 1 ', [], function (tx, results){
            
            var len = results.rows.length, i;
            
            
            for (i = 0; i < len; i++){
                closeDate = results.rows.item(i).open_date;
                console.log(closeDate);
            }
            
            closedata = "companyId="+companyId+"&cash="+cash+"&amex="+amex+"&other="+otherCard+"&serviceCharge="+serviceCharge+"&subtotal="+subtotal+"&total="+total+"&customers="+customers+ "&tableNumber="+tableNumber+"&serevedDate="+closeDate;
    console.log(closeDate);
        $.ajax({
            
            url     : "https://gaborjuhasz.co.uk/gusto-connection/closed_day.php",
                    data    : closedata,
                    crossDomain : true,
                    type    :   "POST",
                    catche  :   false,
                    success :   function(data){
                        
                        db.transaction(function (tx) {
        
                            tx.executeSql('DROP TABLE IF EXISTS category');
                            tx.executeSql('DROP TABLE IF EXISTS item');
                            tx.executeSql('DROP TABLE IF EXISTS user');
                            tx.executeSql('DROP TABLE IF EXISTS settings');
                            tx.executeSql('DROP TABLE IF EXISTS open_table');
                            tx.executeSql('DROP TABLE IF EXISTS order_item');

                            localStorage.removeItem('user_id');
                            window.location.replace("index.html");

                        })
                        
                    }
            
        })
            
        }, null)
    })
    
    
    
    
    
});

$( "#top-menu" ).on("click", "#close-day", function(){
    
    
        
        //localStorage.removeItem('user_id');
        window.location.replace("sum.html");
    
    
});


$('#sum-buttons').on('click', '#sum-cancel', function(){
    window.location.replace("pos.html");
})

function summary(){
    
    var customers = 0;
    
    
    
    db.transaction(function (tx){
        
        // GET THE DATE FROM THE FIRST OPENED TABLE. THE STRFTIME('','') will FORMAT THE TIME
        tx.executeSql('SELECT strftime("%d-%m-%Y",open_date) AS formatted_timestamp FROM open_table WHERE rowid = 1 ', [], function (tx, results){
            
            var len = results.rows.length, i;
            
            
            for (i = 0; i < len; i++){
                dateTime = results.rows.item(i).formatted_timestamp;
                console.log(dateTime);
                
                $('#sum-date').html(dateTime);
            }
            
        }, null)
        
        tx.executeSql('SELECT customer_number FROM open_table', [], function(tx, results){
            
            var len = results.rows.length, i;
                
            var customers_numbers = 0;
            
            for (i = 0; i < len; i++){
                customers_numbers = results.rows.item(i).customer_number;
                
                customers += customers_numbers;
                
                console.log(customers);
                
                
            }
            
            $('#sum-customers').html(customers);
            $('#customer-numbers').val(customers);
            $('#sum-tables').html(len);
            $('#table-numbers').val(len);
            
        }, null)
        
    
        tx.executeSql('SELECT total, subtotal, service_charge FROM open_table', [], function(tx, results){
            
            var len = results.rows.length, i;
            
            var sumTotal = 0;
            var sumSubtotal = 0;
            var sumServiceCharge = 0;
            
            for (i = 0; i < len; i++){
                
                sumTotal = results.rows.item(i).total;
                sumSubtotal = results.rows.item(i).subtotal;
                sumServiceCharge = results.rows.item(i).service_charge;
                
                total += sumTotal;
                subtotal += sumSubtotal;
                serviceCharge += sumServiceCharge;
                
                
            }
            
            total = total.toFixed(2);
            subtotal = subtotal.toFixed(2);
            serviceCharge = serviceCharge.toFixed(2);
            
            console.log(total);
            
            $('#sum-total').html("£"+total);
            $('#sum-subtotal').html("£"+subtotal);
            $('#sum-service-charge').html("£"+serviceCharge);
            
        }, null)
        
        
        tx.executeSql('SELECT total, payment FROM open_table', [], function(tx, results){
            
            var len = results.rows.length, i;
            
            var cashSum = 0;
            var amexSum = 0;
            var otherCardSum = 0;
            
            var payType = "";
            
            for (i = 0; i < len; i++){
                
                payType = results.rows.item(i).payment;
                console.log(payType);
                
                
                if(payType==="cash"){
                    
                    cashSum = results.rows.item(i).total;
                    cash += cashSum;
                    
                } else if (payType==="amex"){
                    
                    amexSum = results.rows.item(i).total;
                    amex += amexSum;
                    
                } else if (payType==="card"){
                    
                    otherCardSum = results.rows.item(i).total;
                    otherCard += otherCardSum;
                    
                }
                
            }
            
            //console.log(cash);
            //console.log(amex);
            //console.log(otherCard);
            //console.log(cash+amex+otherCard);
            
            $('#sum-cash').html("£"+cash);
            $('#sum-amex').html("£"+amex);
            $('#sum-other').html("£"+otherCard);
            
        }, null)
        
    }, null)
    
    
    
}

// PRINT REPORT
$('#sum-buttons').on('click','#print-sum-report', function(){
    
    
    window.print();
    
})


////////////////////////////////////////////////////////////////////////
// FUNCTION TO CREATE NEW TABLE OR OPEN EXISTING ONE
////////////////////////////////////////////////////////////////////////
$("#top-menu").on("click", "#new-table", function(){
    
    
    $('#open').attr('id','enter');
    $('#enter').val("OPEN NEW TABLE");
    
    var userId = localStorage.getItem("user_id");
    //console.log(userId);
    $('#hide').show();
    if(TableCodeJoin!==""){
        $("#text-box").html(TableCodeJoin);
    }else{
        $("#text-box").html("Table Number");
    }
})
    
    $( "#number-board-wrap" ).on( "click", "input[type=button]", function(){
        
        TableNumber = $( this ).attr('id'); 
        console.log(TableNumber);
        
        var userId = localStorage.getItem("user_id");
        
        if(TableNumber=="back"){
            TableCode.pop();
        }else if(TableNumber=="cancel"){
            TableCode = [];
            $("#number-board-display").html("");
            $('#hide').hide();     
        }else if(TableNumber=="open"){
            
        }else if(TableNumber=="delete"){
            TableCode = [];
            $("#code-display").html("Open new table");
        }else if(TableNumber == "enter"){
            
            localStorage.setItem( 'table-id', TableCodeJoin )
            // Function to open the web SQL and create tables
            db.transaction(function (tx) {
                
                // TABLES NEED TO BE CREATED IF DO NOT EXIST YET
                tx.executeSql('CREATE TABLE IF NOT EXISTS open_table ( table_number INTEGER, user_id, open INTEGER, customer_number INTEGER, payment TEXT, total DECIMAL(5,2), subtotal DECIMAL(5,2), service_charge DECIMAL(5,2), open_date TEXT)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS order_item (table_id INTEGER, table_rowid INTEGER, user_id INTEGER,item_id INTEGER, item_name TEXT, item_price DECIMAL(5,2), sent INTEGER)');
                
                tx.executeSql('SELECT * FROM open_table WHERE table_number = '+TableCodeJoin+' AND open = 1 ', [], function (tx, results){
                    var len = results.rows.length;
                    console.log(len);
                    
                    
                
                // Check if the table is already open. 1 == table exists, 0 == table is not open yet
                if(len == 0){
                    
                        tx.executeSql('INSERT INTO open_table (table_number, user_id, open) VALUES ('+TableCodeJoin+','+userId+', 1)');
                 
                    
                    // Changing the ID of enter will allow to use the same number box to submit
                    $('#enter').attr('id','customers');
                    $('#cancel').attr('id','cancel-table');
                    $('#enter').attr('value','customers');
                    $('#customers').val("CUSTOMERS");
                    $("#text-box").html("Customers Number");
                    TableCode = [];
                }else if(len == 1){
                    
                    TableCode = [];
                    $("#text-box").html("Table is already open");
                    
                }
                        
                }); 
            })
                
            
        }else if(TableNumber == "customers"){
            
            var d = new Date();         //timestamp
            var da = d.getDate();       //day
            var mon = d.getMonth() + 1; //month
            var yr = d.getFullYear();   //year
            var dateStamp = yr + "-0" + mon + "-" + da;
            console.log(dateStamp);
            
            var tableId = localStorage.getItem('table-id');
            db.transaction(function (tx){
                tx.executeSql('UPDATE open_table SET customer_number = '+TableCodeJoin+', open_date = "'+dateStamp+'" WHERE table_number = '+tableId+' AND open = 1 ');
                
                console.log("Customer number: "+TableCodeJoin+" table number: "+ tableId);
            })
            
            window.location.replace("open-table.html");
            
        } else if(TableNumber == "cancel-table"){
                  
            var tableId = localStorage.getItem( 'table-id');
            console.log(tableId);
            
            db.transaction(function (tx){
                tx.executeSql('DELETE FROM open_table WHERE table_number = '+tableId+' AND open = 1 ');
            });
            
            
            // Set the id of the enter and the cancel button back to original and hide the number board
            $('#customers').attr('id','enter');
            $('#cancel-table').attr('id','cancel');
            $('#enter').val("OPEN NEW TABLE");
            $("#text-box").html("Table Number");
            TableCode = [];
            $("#number-board-display").html("");
            $('#hide').hide();   
            
        }else if(TableNumber !== NaN){
            
            TableCode.push(TableNumber);
            console.log(TableNumber);
            
        }
        
        //console.log(TableCode);
        
        TableCodeJoin = TableCode.join("");
        //console.log(TableCodeJoin);
        
        if(TableCodeJoin!==""){
            $("#text-box").html(TableCodeJoin);
        }else{
            $("#text-box").html("Open new table");
        }
        
    
}); 



//////////////////////////////////////////////////////////////////////////////////////////////
// MENU OPTIONS --OPEN-TABLE.HTML--
//////////////////////////////////////////////////////////////////////////////////////////////
function openTable(){
    
    $('#close-day').hide();
    
    var tableId = localStorage.getItem( 'table-id');
    //console.log(tableId)
    var userName = localStorage.getItem("user_name");
    var userPosition = localStorage.getItem("user-position");
    var access = localStorage.getItem("access");
    var userId = localStorage.getItem("user_id");
    
    $("#name").html(userName);
    $("#position").html(userPosition);
    
    $('#total-input').val(0);
    $('#subtotal-input').val(0);
    
    $( "#number-board" ).on( "click", "input[type=button]", function(){
        // This is the user input from the numerical keyboard
        TableNumber = $( this ).attr('id'); 
        if(TableNumber=="back"){
            TableCode.pop();
        }else{
            TableCode.push(TableNumber);
        }
        
        console.log(TableCode);
        
        TableCodeJoin = TableCode.join("");
        if(TableCodeJoin!==""){
            $("#code-display").html(TableCodeJoin);
        //var clicked = $(this.id);
        }else{
            $("#code-display").html("Table Number");
        }
        
        $("#number-board-display").html(TableCodeJoin);
    });

    
    
    
    
    // NEED TO GET ALL THE DATA FROM THE WEBSQL
    
    
    db.transaction(function (tx) {
        
        var subtotal = 0;
        var total = 0;
        var serviceCharge = 0;
        
        tx.executeSql('SELECT rowid, * FROM open_table WHERE table_number = '+tableId+' AND open = 1 ', [], function (tx, results) {
            
            var len = results.rows.length, i;
            for (i = 0; i < len; i++){
                var tableRowId = results.rows.item(i).rowid;
                var customerNumber = results.rows.item(i).customer_number;
                var tableNumber = results.rows.item(i).table_number;
                var userId = results.rows.item(i).user_id;
                localStorage.setItem('table-rowid', tableRowId);
                
                //console.log("table rowid="+tableRowId+", customers="+customerNumber+", table number="+tableNumber);
                //$('#error').html("<br>"+msg);
                
                $('#table-number').html(tableNumber);
                $('#customers').html(customerNumber);
                
            }
            
            
            console.log(tableRowId+" "+tableId)
            tx.executeSql('SELECT rowid, * FROM order_item WHERE table_id = '+tableId+' AND table_rowid = '+tableRowId+' ', [], function (tx, results) {
                var len = results.rows.length, i;
                console.log(len)
                
                for (i = 0; i < len; i++){
                    
                    var itemId = results.rows.item(i).rowid;
                    var itemName = results.rows.item(i).item_name;
                    var itemPrice = results.rows.item(i).item_price;
                    var send = results.rows.item(i).sent;
                    console.log(itemName +" "+ itemPrice);

                    subtotal += itemPrice;
                    $('#subtotal-input').val(subtotal);
                    $("#subtotal-price").html("£"+subtotal.toFixed(2));
                    
                    var tr = "<tr id='"+itemId+"'><td>1</td><td style='text-align:left;'>"+itemName+"</td><td style='text-align:right;'>"+itemPrice+"</td><td>*</td></tr>";
                    
                    $(' #item-table ').append(tr);

                }
                tx.executeSql("SELECT * FROM SETTINGS", [], function(tx, results){
                    var serviceChargeNum = results.rows.item(0).service_charge;
                    //console.log("hello"+serviceChargeNum);
                    //console.log(subtotal);
                    var result = (serviceChargeNum / 100) * subtotal;
                    var serviceChargeAmount =  result.toFixed(2);
                    var message = results.rows.item(0).message;
                    var phone = results.rows.item(0).phone;
                    var VAT = results.rows.item(0).VAT_number;
                    var restaurant = results.rows.item(0).company;
                    
                    // put the message on the website for printing
                    $('#message').html(message);
                    $('#phone').html("+"+phone);
                    $('#vat-number').html(VAT);
                    $('#restaurant-name').html(restaurant);
                    
                    // set value to hold the data
                    $('#service-charge-input').val(serviceChargeNum);
                    console.log(serviceChargeAmount);
                    
                    $( '#service-charge' ).html("£"+serviceChargeAmount);
                    
                    total = +serviceChargeAmount + +subtotal;
                    total = total.toFixed(2)
                    $('#total-input').val(total);
                    console.log(total);
                    $( '#total' ).html("£"+total);
                    
                })
                
            }, null);
            
            
            
        }, null);
        
        
        
        
        tx.executeSql('SELECT rowid, * FROM category', [], function (tx, results) {
            
            var rowId = [];
            var len = results.rows.length, i;
            var categoryId = [];
            var categoryIdi = 0; 
            for (var i = 0; i < len; i++){
                var categoryRowId = results.rows.item(i).rowid;
                categoryId.push(results.rows.item(i).category_id)
                var categoryName = results.rows.item(i).category_name;
                
                
                
                var r= $('<input type="button" class="green" value="'+categoryName+'" id="'+categoryRowId+'"/>');
                //$("#top-menu").append(r);
                
                // Use inserBefore() function to have the cancel button on the left side
                $( r ).insertBefore( "#cancel-order" );
                
                // Making a div for each category
                var categorys = $('<div id="c'+categoryRowId+'" class="hide"></div>')
                $("#right-menu-wrap").append(categorys);
                
                // GET ITEMS
                tx.executeSql('SELECT * FROM item WHERE category_id = '+categoryId[i]+' ' , [], function (tx, results){
                    var lenCategory = results.rows.length, x;
                    //console.log(lenCategory);
                    for(x=0; x < lenCategory; x++){
                        var itemName = results.rows.item(x).item_name;
                        var itemId = results.rows.item(x).item_id;
                        var itemDescription = results.rows.item(x).item_description;
                        categoryIdi = results.rows.item(x).category_id;
                        console.log(categoryId[2]);
                        console.log(categoryIdi);
                        var cid = 0;
                        if(categoryIdi == categoryId[0]){
                            cid = 1;
                        }else if(categoryIdi == categoryId[1]){
                            cid = 2;
                        }else if(categoryIdi == categoryId[2]){
                            cid = 3;
                        }else if(categoryIdi == categoryId[3]){
                            cid = 4;
                        }
                        
                        // Button color class can be green, red or blue
                        var item = $('<input class="blue hide" type="button" value="'+itemName+'" id="'+itemId+'">')
                        $("#c"+cid+"").append(item);
                        //console.log(itemName);
                    }
                    
                    $("#c1").removeClass("hide");
                    $('#c1').children().removeClass("hide");
                });
                
                
                //$('#error').html("<br>"+msg);
            }
            
            
            
        }, null);
        
        
        
    });
            
            
            
}

// To show only one categroy which is clicked
$( "#top-menu" ).on("click", "input[type=button]", function(){
    var id = $( this ).attr('id'); 
    
    var tableId = localStorage.getItem( 'table-id');
    
    // CANCEL ALL THE ITEMS HAVE NOT BEEN POSTED YET
    if(id == "cancel-order"){
        
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM order_item WHERE table_id = '+tableId+' AND sent = 0 ')
            console.log("delete")
        }, null)
        
        localStorage.removeItem('table-id');
        window.location.replace("pos.html");
        
    }else{
        
        
        for(x=1;x<=4;x++){
            $("#c"+x+"").children().addClass('hide');
            $("#c"+x+"").addClass('hide');
        }
    
        $("#c"+id+"").removeClass("hide");
        $("#c"+id+"").children().removeClass("hide");
        
    }
    
    
});



//////////////////////////////////////////////////////////////////////////////////////////////
// POST ITEMS --OPEN-TABLE.HTML--
//////////////////////////////////////////////////////////////////////////////////////////////
$( "#right-menu-wrap" ).on("click", "input[type=button]", function(){
    var itemId = $( this ).attr('id'); 
    var tableId = localStorage.getItem( 'table-id');
    var userId = localStorage.getItem("user_id");
    var tableRowId = localStorage.getItem('table-rowid', tableRowId);
    
    //console.log(itemId);
    db.transaction(function (tx, results) {
        
        
        tx.executeSql('SELECT * FROM item WHERE item_id = '+itemId+' ', [], function (tx, results){
            
            var len = results.rows.length, i;
            
            
                
            
            
            for(i=0;i<len;i++){
                
                var itemName = results.rows.item(i).item_name;
                var itemId = results.rows.item(i).item_id;
                var price = results.rows.item(i).item_price;
                var rowId = 0
                //console.log(itemName+" "+itemId+" "+price);
                
            }
            tx.executeSql('INSERT INTO order_item (table_id, table_rowid, user_id,item_id, item_name, item_price, sent) VALUES ('+tableId+', '+tableRowId+','+userId+','+itemId+',"'+itemName+'",'+price+', 0) ', [], function(tx, results){
                rowId = results.insertId;
                console.log(rowId)
                
                var tr = "<tr id='"+rowId+"'><td>1</td><td style='text-align:left;'>"+itemName+"</td><td style='text-align:right;'>"+price+"</td><td></td></tr>";
                $('#item-table  ').append(tr);
                
            }, null);
            
            
            
            var serviceCharge = parseInt($('#service-charge-input').attr('value'));
            var subtotal = parseFloat($('#subtotal-input').attr('value')).toFixed(2);
            var newSubtotal = +subtotal + +price;
            newSubtotal = newSubtotal.toFixed(2);
            //console.log(price);
            //console.log(subtotal);
            //console.log(newSubtotal);
            //var result = (serviceChargeNum / 100) * subtotal;
            var result = (serviceCharge / 100)*newSubtotal;
            console.log(result)
            var serviceChargeAmount =  result.toFixed(2);
            var totalDue = +serviceChargeAmount + +newSubtotal;
            totalDue = totalDue.toFixed(2);
            console.log("Total: "+totalDue);
            
            $('#total-input').val(totalDue);
            $( '#total' ).html("£"+totalDue);
            
            $( '#service-charge' ).html("£"+serviceChargeAmount);            

            $('#subtotal-input').val(newSubtotal);
            $("#subtotal-price").html("£"+newSubtotal);
            
        });
        
        
    })
    
});


// SET THE tr TO ANOTHER COLOR AND PUT THE ID IN A VAR
var deleteItem = 0;
$('#item-table').on('click', 'tr', function(){
    var itemId = $( this ).attr('id'); 
    deleteItem = itemId;
    console.log(itemId)
    
    $('#item-cancel').prop('disabled', false);
    
    $("#item-table tr").css("background-color","white");
    $(this).css("background-color","blue");
    
})

// SEND ITEM AND CHENGE SENT TO 1
$( "#send-button" ).on("click", "input[type=button]", function(){
    
    var itemId = $( this ).attr('id'); 
    var tableId = localStorage.getItem( 'table-id');
    var userId = localStorage.getItem("user_id");
    var tableRowId = localStorage.getItem('table-rowid', tableRowId);
    var subPrice = 0;
    var price = 0
    
    if(itemId=="item-cancel"){
        
        $('tr').remove('#'+deleteItem+'');
		
		
        db.transaction(function (tx, results) {
            tx.executeSql('DELETE FROM order_item WHERE rowid = '+deleteItem+' ', [], function(tx, result){
                console.log(result);
            }, null)
            
            
        }, null)
        
        db.transaction(function (tx, results){
            
            //console.log(tableId);
            tx.executeSql('SELECT item_price FROM order_item WHERE table_id = '+tableId+' AND table_rowid = '+tableRowId+'  ', [], function(tx, results){
                
                var len = results.rows.length, i;
                //console.log(len);
                var service = $('#service-charge-input').val();
                //console.log(len);
            
                for(i=0;i<len;i++){

                    price = results.rows.item(i).item_price;
                    
                    subPrice += price;
                    console.log(subPrice);

                }
                console.log(price);
                $('#subtotal-price').html("£"+(subPrice).toFixed(2));
                $('#subtotal-input').val(subPrice);
                
                var serviceCharge = ((service / 100) * subPrice).toFixed(2);
                //console.log(serviceCharge);
                $('#service-charge').html("£"+serviceCharge);
                
                var total = (subPrice + +serviceCharge).toFixed(2);
                $('#total').html(total);
                $('#total-input').val(total)
                
            }, null)
            
        }, null)
        
        console.log("CANCEL ITEM")
        
    }else if(itemId=="item-send"){
        
        db.transaction(function (tx) {
            tx.executeSql('UPDATE order_item SET sent = 1 WHERE table_id = '+tableId+' AND sent = 0 ')
            console.log("UPDATED")
        }, null)
        console.log("SEND")
        
        
        localStorage.removeItem('table-id');
        window.location.replace("pos.html");
        
    }else if(itemId=="table-pay"){
        
        $('#payment').show();
        
        
    }
    
})


//////////////////////// PAYMENT METHODS //////////////////////////////////////////

$('#payment-content').on('click', 'input[type=button]', function(){
    
    var type = $( this ).attr('id');
    var tableId = localStorage.getItem( 'table-id');
    var totalDue = $('#total-input').val();
    var subtotal = $('#subtotal-input').val();
    var serviceCharge = (totalDue - subtotal).toFixed(2);
    
    console.log(subtotal+", "+serviceCharge);
    
    db.transaction(function (tx){
        
        if(type == "cancel" ){
                $('#payment').hide();
            } else {
                
                console.log(type)
                tx.executeSql('UPDATE open_table SET open = 0, payment = "'+type+'", total = '+totalDue+', subtotal = '+subtotal+', service_charge = '+serviceCharge+'  WHERE table_number = '+tableId+' AND open = 1 ');
            
                
                
            console.log("PAY");
                
                localStorage.removeItem('table-id');
                window.location.replace("pos.html");
                
            }
        
        
    }, null);
    
    
    
})

//////////////////////////////////////////////////////////////////////////////////////////////////
// SETUP TO PRINT BILL
//////////////////////////////////////////////////////////////////////////////////////////////////
$('#send-button').on('click', '#print', function(){
    
    var x = document.getElementById('items');
    
    window.print();
    
})



