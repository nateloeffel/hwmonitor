const { Client } = require("@notionhq/client")
const dotenv = require('dotenv').config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const client = require('twilio')(accountSid, authToken);

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getDatabase = async () => {
  const response = await notion.databases.query({ database_id: "1a57b0b38ba14b33a01bdcfd50d0ab1a" });

  for (let i = 0; i < response.results.length; i++) {
    const result = response.results[i]
    const days_left = result.properties['Days Left'].formula.string
    const title = result.properties.Name.title[0].plain_text
    // console.log(title + ": " + days_left)
    if (days_left == "1 days") {
      await notifysms(title, days_left, result)
      console.log(`Assignment: ${title} is due soon.`)
    }
  }
};

const notifysms = async (title, days_left, result) => {
  client.messages.create({
     body: `Assignment: ${title} is due soon.`,
     from: '+12534998919',
     to: '+14042775585'
   })
  .then(message => console.log(message.sid));
}

getDatabase();
