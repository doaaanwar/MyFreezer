
$(document).ready(function(){
                  
    var next;
    var id ;       
    var dbCreated = false;
    var item;
    var db;
    document.addEventListener("deviceready",onDeviceReady,false);
    //jQuery(document).on("pagebeforecreate","#detailPage",jQuery.proxy(this.getItem, this))
   
    jQuery(document).on("load","#pagelist",getList);
    jQuery(document).on("pagebeforeshow","#detailPage",getDetails);
    jQuery(document).on("click","#createButton", createItem);
    jQuery(document).on("pagebeforeshow","#zeroListPage",getZeroList);
    
    jQuery(document).on("click","#minusPack",removeOnePack);
    jQuery(document).on("click","#plusPack",plusOnePack);

    var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });
    
    
    
    function getZeroList()
    {
        console.log("opening database");
        db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
        console.log("database opened");
        db.transaction(getZeroItems, transaction_error);
    }
    
    function getList()
    {
        console.log("opening database");
        db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
        console.log("database opened");
        db.transaction(getItems, transaction_error);
    }
    
    
    function getDetails()
    {
        console.log("opening database");
        db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
        console.log("database opened");
        db.transaction(getItem, transaction_error);
    }

    function onDeviceReady() {
        db =  = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
        if (dbCreated)
            db.transaction(getItems, transaction_error);
        else
            db.transaction(populateDB, transaction_error, populateDB_success);
    }



    function getItem(tx) {
        id = getUrlVars()["id"];
        $('#busy').show();
        var sql = "select e.id, e.itemName, e.weight, e.numOfPackage, e.totalWeight, " +
                    " e.picture " +
                    "from item e " +
                    "where e.id=:id group by e.itemName order by e.itemName";
        tx.executeSql(sql, [id], getItem_success);
    }
    
    function refreshItem(tx){
        
        $('#busy').show();
        var sql = "select e.id, e.itemName, e.weight, e.numOfPackage, e.totalWeight, " +
                    " e.picture " +
                    "from item e " +
                    "where e.id=:id group by e.itemName order by e.itemName";
        tx.executeSql(sql, [id], getItem_success);
    }
    

    function getItem_success(tx, results) {
        $('#busy').hide();
        item = results.rows.item(0);
        $('#itemPic').attr('src', 'pics/' + item.picture);
        $('#fullName').text(item.itemName + " ("+item.totalWeight+" pounds)");
        $('#packWeight').text("Package Weight: "+item.weight+ " pounds");
        $('#city').text("Number of Package: " + item.numOfPackage);



        setTimeout(function(){
            scroll.refresh();
        });
        //db = null;
    }

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }


    function transaction_error(tx, error) {
        $('#busy').hide();
        alert("Database Error: " + error);
    }

    function populateDB_success() {
        dbCreated = true;
        db.transaction(getItems, transaction_error);
    }

    function getItems(tx) {
        var sql = "select i.id, i.itemName, i.picture, i.totalWeight " + 
                    "from item i " +
                    "group by i.id order by i.itemName";
        tx.executeSql(sql, [], getItems_success);
    }

    function getItems_success(tx, results) {
        $('#busy').hide();
        var len = results.rows.length;
        for (var i=0; i<len; i++) {
            var item = results.rows.item(i);
            $('#itemList').append('<li><a href="itemdetails.html?id=' + item.id + '">' +
                    '<img src="pics/' + item.picture + '" class="list-icon"/>' +
                    '<p class="name">' + item.itemName + '</p>' +
                    '<p class="weight">' + item.totalWeight+ '</p>');
        }
        
        setTimeout(function(){
            scroll.refresh();
        },100);
        //db = null;
    }

    function populateDB(tx) {
        $('#busy').show();
        //tx.executeSql('DROP TABLE IF EXISTS item');
        var sql = 
            "CREATE TABLE IF NOT EXISTS item ( "+
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "itemName VARCHAR(100), " +
            "weight FLOAT, "+ 
            "numOfPackage INTEGER, " +
            "totalWeight FLOAT, " +
            "picture VARCHAR(200))";
        tx.executeSql(sql);
        //sql = "INSERT INTO item (id,itemName,weight,totalWeight,numOfPackage,picture) VALUES (0,'test',200,0,0,'null')";

        //tx.executeSql(sql);
    }


    function transaction_error(tx, error) {
        $('#busy').hide();
        alert("Database Error: " + error);
    }

    $("#weight").focusout(function(){
        var a = $('input[id="weight"]').val();
        var b = $('input[id="numberOfPackage"]').val();


        $('input[id="totalWeight"]').val(a * b) ;
    });


    $("#numberOfPackage").focusout(function(){
         var a = $('input[id="weight"]').val();
        var b = $('input[id="numberOfPackage"]').val();
        $('input[id="totalWeight"]').val(a * b) ;
    });


    $("#createBtn").click(function(){
        console.log("opening database");
        db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
        console.log("database opened");
        db.transaction(createItem, transaction_error);



    });


    function createItem(tx)
    {

        var sql = "SELECT MAX(id) maxId from item";

        tx.executeSql(sql,[],getMaxId);


    }


    function getMaxId(tx,results)
    {
        var maxId = results.rows.item(0).maxId;
        next = maxId + 1;

        db.transaction(insertNew, transaction_error);
    }

    function insertNew(tx)
    {

        sql = "INSERT INTO item (id,itemName,weight,totalWeight,numOfPackage,picture) VALUES (" + next + ",'" +
                      $('#itemName').val() + "', "+
                      $('#weight').val() +", " + 
                      $('#totalWeight').val()+", " + 
                      $('#numberOfPackage').val() +",'null')";

        tx.executeSql(sql);
        window.location = "index.html";
    }
    
    
    var count;
    
    function plusOnePack()
    {
        
        count = item.numOfPackage+1;
        update();
    }
    
     function removeOnePack()
    {
        count = item.numOfPackage-1;
        update();
    }
    
    
    function update()
    {
        console.log("opening database");
        db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
        console.log("database opened");
        db.transaction(updateItem, transaction_error);
    }
    
    
    function updateItem(tx)
    {
        sql = "update item SET numOfPackage = " + count + ", totalWeight = "+item.weight*count+" WHERE item.id = " + id;

        tx.executeSql(sql);
         db.transaction(refreshItem, transaction_error);
    }
    
    
    function getZeroItems(tx) {
        var sql = "select i.id, i.itemName, i.picture, i.totalWeight " + 
                    "from item i where i.totalWeight == 0.0" +
                    " group by i.id order by i.itemName";
        tx.executeSql(sql, [], getZeroItems_success);
    }

    function getZeroItems_success(tx, results) {
        $('#busy').hide();
        var len = results.rows.length;
        for (var i=0; i<len; i++) {
            var item = results.rows.item(i);
            $('#itemZeroList').append('<li><a href="itemdetails.html?id=' + item.id + '">' +
                    '<img src="pics/' + item.picture + '" class="list-icon"/>' +
                    '<p class="name">' + item.itemName + '</p>' +
                    '<p class="weight">' + item.totalWeight+ '</p>');
           
        }
        setTimeout(function(){
            scroll.refresh();
        },100);
       // db = null;
    }

    
});

