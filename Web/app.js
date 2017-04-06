var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/s7lan-users';
var input = "Test";
// Use connect method to connect to the server
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    //db.createCollection("Users");
    //updateDocument(db, function() {});
    //removeDocument(db, function () {});
    insertDocuments(db, function () {});

    //insertDocument(db, function () {}); <-- not working
    findDocuments(db, function () {});

    db.close();

});
/*var insertDocument = function (db, callback) {
    var collection = db.collection('documents');
    collection.insertOne([{
        Name: 'Jakob',
        Email: 'Jatoe13@student.sdu.dk',
        Studie: 'Optek16',
        Battletag: 'btag#1234',
        SteamID: 'steam1234',
        hasPaid: false,
        Winratio: 1.9
    }], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    })
};*/
var insertDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('Users');
    // Insert some documents
    collection.insertMany([
        {
            Name: 'Jakob',
            Email: 'Jatoe13@student.sdu.dk',
            Studie: 'Optek16',
            Battletag: 'btag#1234',
            SteamID: 'steam1234',
            hasPaid: false,
            Winratio: 1.9
        }, {
            Name: 'Gustav',
            Email: 'Gubor16@student.sdu.dk',
            Studie: 'Optek16',
            Battletag: 'btag#4321',
            SteamID: 'steam4321',
            hasPaid: true,
            Winratio: 1.2
        }, {
            Name: 'Jonas',
            Email: 'jboje16@student.sdu.dk',
            Studie: 'Optek16',
            Battletag: 'btag#6789',
            SteamID: 'steam6789',
            hasPaid: true,
            Winratio: 1.5
        }
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
};

var updateDocument = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({bnet: 'swagmaster#420'}
        , {$set: {bnet: 'bnetid#1234'}}, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
        });
};


var findDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
};

var removeDocument = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Delete document where a is 3
    collection.deleteOne({input: 3}/*, {input: 2}, {input: 3}*/, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the key a equal to input");
        callback(result);
    });
    /*collection.deleteMany({a: 3}, function (err, result) {
     assert.equal(err, null);
     assert.equal(12, result.result.n);
     console.log("Removed all documents with field a equal to 1");
     callback(result);
     });*/
};
