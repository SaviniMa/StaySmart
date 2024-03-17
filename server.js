const csv = require('csvtojson');
const uuid = require('uuid').v4;
const axios = require('axios');

let allTags = [];
async function readCSVFile(){
  const csvFilePath = 'Hotel_Reviews_fragment.csv';
  const jsonArray = await csv().fromFile(csvFilePath);
  return jsonArray;
}

function cleanseRecord(id, hotelName, city, tags, reviews, date, hotelUrl, imgUrl) {
  const tagsSplit = tags.split(";");
  const filteredArray = tagsSplit.filter(value => value !== "");
  filteredArray.forEach(element => {
    allTags.push(element);
  });
  return {
    id: id,
    hotelName: hotelName,
    city: city,
    tags: filteredArray,
    reviews: reviews,
    date: date,
    hotelUrl: hotelUrl,
    imgUrl: imgUrl
  }
}

async function main() {
  console.log("Starting data migrator...");

  const rawdata = await readCSVFile();
  const data = rawdata.map((d, i) => cleanseRecord(i, d["Hotel Name"], d["City"], d["Tags"], d["Review"], d["Date"], d["HotelUrl"], d["ImgUrl"]));

  try {
    for (const payload of data) {
      const res = await axios.post('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/hotels', payload);
      console.log(res.data.data.id);
    } 

    // get unique set of tags
    const uniqueArray = [...new Set(allTags)];
    // call tags api
    const res = await axios.post('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/tags', uniqueArray);
  } catch (error) {
    console.log(error);
  }

  console.log("Finished data migrator...");
}

main();