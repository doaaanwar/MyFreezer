var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });



var db;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	console.log("opening database");
    db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
	console.log("database opened");
    db.transaction(getItems, transaction_error);
}

   

function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Database Error: " + error);
}



function getItems(tx) {
	var sql = "select i.id, i.itemName, i.picture, i.totalQuantity " + 
				"from item i where i.totalQuantity == 0.0" +
				" group by i.id order by i.itemName";
	tx.executeSql(sql, [], getItems_success);
}

function getItems_success(tx, results) {
	$('#busy').hide();
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
    	var item = results.rows.item(i);
		$('#itemList').append('<li><a href="itemdetails.html?id=' + item.id + '">' +
				'<img src="pics/' + item.picture + '" class="list-icon"/>' +
				'<p class="line1">' + item.itemName + '</p>' +
				'<p class="line2">' + item.totalQuantity+ '</p>');
    }
	setTimeout(function(){
		scroll.refresh();
	},100);
	db = null;
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


