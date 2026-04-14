import axios from "axios";

console.log("Starting upload test...");

const testUpload = async () => {

  try {

    const response = await axios.post(
      "http://localhost:5000/api/reports/upload",
      {
        patientId: "patient123",
        text: "Patient has severe cardiac disease and high cholesterol"
      }
    );

    console.log("SUCCESS:");
    console.log(response.data);

  } catch (error) {

    console.log("ERROR:");
    console.log(error.message);

  }

};

testUpload();
