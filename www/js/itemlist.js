var db;
var dbCreated = false;

var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("FreezerDirectoryDB", "1.0", "PhoneGap Demo", 200000);
    if (dbCreated)
    	db.transaction(getItems, transaction_error);
    else
    	db.transaction(populateDB, transaction_error, populateDB_success);
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
	var sql = "select i.id, i.itemName, i.picture, i.totalQuantity " + 
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
				'<p class="line1">' + item.itemName + '</p>' +
				'<p class="line2">' + item.totalQuantity+ '</p>');
    }
	setTimeout(function(){
		scroll.refresh();
	},100);
	db = null;
}

function populateDB(tx) {
	$('#busy').show();
	//tx.executeSql('DROP TABLE IF EXISTS item');
	var sql = 
		"CREATE TABLE IF NOT EXISTS item ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"itemName VARCHAR(100), " +
        "quantity FLOAT, "+ 
        "numOfPackage INTEGER, " +
		"totalQuantity FLOAT, " +
		"picture VARCHAR(200))";
    tx.executeSql(sql);

   /* tx.executeSql("INSERT INTO item (id,itemName,quantity, totalQuantity,numOfPackage,picture) VALUES (1,'chicken bonless',15.0,30.0,2,'steven_wells.jpg')");
   tx.executeSql("INSERT INTO item (id,itemName,quantity, totalQuantity,numOfPackage,picture) VALUES (2,'meat square',20.0,60.0,3,'steven_wells.jpg')");
    tx.executeSql("INSERT INTO item (id,itemName,quantity, totalQuantity,numOfPackage,picture) VALUES (3,'meat square',20.0,0.0,0,'steven_wells.jpg')");*/
    /*tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (12,'Steven','Wells',4,'Software Architect','Engineering','617-000-0012','781-000-0012','swells@fakemail.com','Boston, MA','steven_wells.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (11,'Amy','Jones',5,'Sales Representative','Sales','617-000-0011','781-000-0011','ajones@fakemail.com','Boston, MA','amy_jones.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (10,'Kathleen','Byrne',5,'Sales Representative','Sales','617-000-0010','781-000-0010','kbyrne@fakemail.com','Boston, MA','kathleen_byrne.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (9,'Gary','Donovan',2,'Marketing','Marketing','617-000-0009','781-000-0009','gdonovan@fakemail.com','Boston, MA','gary_donovan.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (8,'Lisa','Wong',2,'Marketing Manager','Marketing','617-000-0008','781-000-0008','lwong@fakemail.com','Boston, MA','lisa_wong.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (7,'Paula','Gates',4,'Software Architect','Engineering','617-000-0007','781-000-0007','pgates@fakemail.com','Boston, MA','paula_gates.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (5,'Ray','Moore',1,'VP of Sales','Sales','617-000-0005','781-000-0005','rmoore@fakemail.com','Boston, MA','ray_moore.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (6,'Paul','Jones',4,'QA Manager','Engineering','617-000-0006','781-000-0006','pjones@fakemail.com','Boston, MA','paul_jones.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (3,'Eugene','Lee',1,'CFO','Accounting','617-000-0003','781-000-0003','elee@fakemail.com','Boston, MA','eugene_lee.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (4,'John','Williams',1,'VP of Engineering','Engineering','617-000-0004','781-000-0004','jwilliams@fakemail.com','Boston, MA','john_williams.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (2,'Julie','Taylor',1,'VP of Marketing','Marketing','617-000-0002','781-000-0002','jtaylor@fakemail.com','Boston, MA','julie_taylor.jpg')");
    tx.executeSql("INSERT INTO item (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (1,'James','King',0,'President and CEO','Corporate','617-000-0001','781-000-0001','jking@fakemail.com','Boston, MA','james_king.jpg')");*/
}
