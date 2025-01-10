const {MongoClient}  = require("mongodb");

const url = "mongodb://localhost:27017/";
const client = new MongoClient(url);

const dbName = "codinggita";
const studentCollection = "students";

function main(){
    client 
    .connect()
    .then(() =>{
        console.log("connected to mongoDb");
        const db = client.db(dbName);
        const students = db.collection(studentCollection)

        return addNewStudent(students)
        .then(() => updateStudentDetails(students))
        
    })
    .then(() =>{
        client.close();
        console.log("connection closed");
    })
    .catch((err) => {
        console.error("Error:" , err);
    })



}


function addNewStudent(collection){
    const newStudent ={
        name : "yashvi",
        rollNumber : 104,
        department : "mechanical eng",
        year : 1,
        courseEnrolled : [ "ME101" , "ME102"]
    };
    return collection.insertOne(newStudent).then((result) =>{
        console.log("new student added successfully"  , result.insertedId);
    })
}


function updateStudentDetails(collection){
    const filter = {rollNumber : 101};
    const update = {
        $set : {
            year :3,
            coursesEnrolled : ["CS101" , "CS104"],
        },
    };

    return collection.updateOne(filter , update).then((result) =>{
        console.log(`${result.modifiedCount} doucument(s) updated`);
    });
}

main();