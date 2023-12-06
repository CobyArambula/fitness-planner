const cors = require("cors");
const express = require("express");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const app = express();
const port = 3000;

app.use(cors());

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

app.get("/", (req, res) => {
  res.send("Hello, this is your server!");
});

app.get("/getDynamoData", async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: "activities",
    });

    const response = await docClient.send(command);
    res.json(response.Items);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
