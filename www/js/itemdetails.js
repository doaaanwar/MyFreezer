var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

var id = getUrlVars()["id"];

var db;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	console.log("opening database");
    db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
	console.log("database opened");
    db.transaction(getItem, transaction_error);
}

function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Database Error: " + error);
}

function getItem(tx) {
	$('#busy').show();
	var sql = "select e.id, e.itemName, e.quantity, e.numOfPackage, e.totalQuantity, " +
				" e.picture " +
				"from item e " +
				"where e.id=:id group by e.itemName order by e.itemName";
	tx.executeSql(sql, [id], getItem_success);
}

function getItem_success(tx, results) {
	$('#busy').hide();
	var item = results.rows.item(0);
	$('#itemPic').attr('src', 'pics/' + item.picture);
	$('#fullName').text(item.itemName);
    
    $('#city').text("Number of Package: " + item.numOfPackage + " * Weight of package: " + item.quantity + " pounds");
	
	$('#itemTitle').text("Total: "+item.totalQuantity + " pounds");
	
	/*if (item.managerId>0) {
		$('#actionList').append('<li><a href="itemdetails.html?id=' + item.managerId + '"><p class="line1">View Manager</p>' +
				'<p class="line2">' + item.managerFirstName + ' ' + item.managerLastName + '</p></a></li>');
	}
	if (item.reportCount>0) {
		$('#actionList').append('<li><a href="reportlist.html?id=' + item.id + '"><p class="line1">View Direct Reports</p>' +
				'<p class="line2">' + item.reportCount + '</p></a></li>');
	}
	if (item.email) {
		$('#actionList').append('<li><a href="mailto:' + item.email + '"><p class="line1">Email</p>' +
				'<p class="line2">' + item.email + '</p><img src="img/mail.png" class="action-icon"/></a></li>');
	}
	if (item.officePhone) {
		$('#actionList').append('<li><a href="tel:' + item.officePhone + '"><p class="line1">Call Office</p>' +
				'<p class="line2">' + item.officePhone + '</p><img src="img/phone.png" class="action-icon"/></a></li>');
	}
	if (item.cellPhone) {
		$('#actionList').append('<li><a href="tel:' + item.cellPhone + '"><p class="line1">Call Cell</p>' +
				'<p class="line2">' + item.cellPhone + '</p><img src="img/phone.png" class="action-icon"/></a></li>');
		$('#actionList').append('<li><a href="sms:' + item.cellPhone + '"><p class="line1">SMS</p>' +
				'<p class="line2">' + item.cellPhone + '</p><img src="img/sms.png" class="action-icon"/></a></li>');
	}*/
	setTimeout(function(){
		scroll.refresh();
	});
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
