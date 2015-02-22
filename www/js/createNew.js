var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });



var db;

var next;


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	console.log("opening database");
    db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
	console.log("database opened");
   
}


function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Database Error: " + error);
}

$("#quantity").focusout(function(){
    var a = $('input[id="quantity"]').val();
    var b = $('input[id="numberOfPackage"]').val();
   
   
    $('input[id="totalQuantity"]').val(a * b) ;
});


$("#numberOfPackage").focusout(function(){
     var a = $('input[id="quantity"]').val();
    var b = $('input[id="numberOfPackage"]').val();
    $('input[id="totalQuantity"]').val(a * b) ;
});


$("#createBtn").click(function(){
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
    sql = "INSERT INTO item (id,itemName,quantity,totalQuantity,numOfPackage,picture) VALUES (" + next + ",'" +
                  $('#itemName').val() + "', "+
                  $('#quantity').val() +", " + 
                  $('#totalQuantity').val()+", " + 
                  $('#numberOfPackage').val() +",'" + 
                  $('#picture').val() + "')";
    
    tx.executeSql(sql);
}