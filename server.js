const csv = require('csvtojson');
const uuid = require('uuid').v4;
const axios = require('axios');

let allTags = [];
async function readCSVFile(){
  const csvFilePath = 'merged_df.csv';
  const jsonArray = await csv().fromFile(csvFilePath);
  return jsonArray;
}

function cleanseRecord(id, hotelName, city, predicted_proba) {
  return {
    id: id,
    hotelName: hotelName,
    city: city,
    predicted_proba: predicted_proba
  }
}

async function main() {
  console.log("Starting data migrator...");

  const rawdata = await readCSVFile();
  const data = rawdata.map((d, i) => cleanseRecord(i, d["Hotel Name"], d["City"], d["predicted_proba"]));

  try {
    for (const payload of data) {
      const res = await axios.post('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/charts', payload);
      console.log(res.data.data.id);
    } 
  } catch (error) {
    console.log(error);
  }

  console.log("Finished data migrator...");
}

main();