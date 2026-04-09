// 🔹 1. Create Database
use hospitalDB


// 🔹 2. Create Collection with VALIDATION
db.createCollection("patients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["patient_id", "name", "age"],
      properties: {
        patient_id: { bsonType: "int" },
        name: { bsonType: "string" },
        age: { bsonType: "int", minimum: 0, maximum: 120 },
        disease: { bsonType: "string" }
      }
    }
  }
})

// Other collections
db.createCollection("doctors")
db.createCollection("appointments")


// 🔹 3. INSERT (CREATE)
db.patients.insertMany([
  { patient_id: 1, name: "Arun", age: 22, disease: "Fever" },
  { patient_id: 2, name: "Meena", age: 30, disease: "Cold" },
  { patient_id: 3, name: "Karthik", age: 45, disease: "Diabetes" }
])

db.doctors.insertMany([
  { doctor_id: 101, name: "Dr. Kumar", specialization: "General" },
  { doctor_id: 102, name: "Dr. Priya", specialization: "Cardiology" }
])

db.appointments.insertMany([
  { appointment_id: 1001, patient_id: 1, doctor_id: 101, date: "2026-04-10" },
  { appointment_id: 1002, patient_id: 2, doctor_id: 102, date: "2026-04-11" }
])


// 🔹 4. READ
db.patients.find()
db.doctors.find()
db.appointments.find()


// 🔹 5. UPDATE
db.patients.updateOne(
  { patient_id: 1 },
  { $set: { disease: "Viral Fever" } }
)

db.doctors.updateOne(
  { doctor_id: 101 },
  { $set: { specialization: "Physician" } }
)


// 🔹 6. DELETE
db.patients.deleteOne({ patient_id: 3 })
db.appointments.deleteOne({ appointment_id: 1002 })


// 🔹 7. FILTERING
db.patients.find({ age: { $gt: 25 } })
db.doctors.find({ specialization: "Cardiology" })


// 🔹 8. PROJECTION
db.patients.find(
  {},
  { name: 1, disease: 1, _id: 0 }
)


// 🔹 9. VIEW (Virtual Collection)
db.createView(
  "patient_view",
  "patients",
  [
    { $project: { _id: 0, name: 1, disease: 1 } }
  ]
)

// Use View
db.patient_view.find()


// 🔹 10. VIEW with JOIN ($lookup)
db.createView(
  "appointment_view",
  "appointments",
  [
    {
      $lookup: {
        from: "patients",
        localField: "patient_id",
        foreignField: "patient_id",
        as: "patient_info"
      }
    }
  ]
)

// Use View
db.appointment_view.find()


// 🔹 11. DROP (for experiment purpose)
db.doctors.drop()