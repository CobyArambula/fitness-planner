# fitness-planner

# Overview
A web application for planning and tracking fitness activities recorded on Apple Watch devices. The app includes a calendar view that provides an overview of days in which activities have been recorded on, as well as an activity view that allows user to view recorded activities, and plan new activities.

# Calendar View
The calendar view displays planned activities for each day. Activities are denoted with a bar icon, and clicking on a date provides additional details in the activity view.
![Calendar View](https://github.com/CobyArambula/fitness-planner/assets/69974538/22eb12df-fe38-43f5-8312-abf107b5661b)

# Activity View
The activity view shows planned and recorded activities for a selected date. It includes information such as activity type, start time, and end time, and more.
![Activity View](https://github.com/CobyArambula/fitness-planner/assets/69974538/93b89ce1-ffae-4d71-96b2-6a23c0d0e5cf)

# Adding Activities
Use the "Add Activity" button to schedule new activities. Fill in the activity type, start time, and end time, then click the submit button. This will store the activity in local storage to persist planned activity data. This ensures that activities are savesd even when the browser is closed.
![Add Activity](https://github.com/CobyArambula/fitness-planner/assets/69974538/c993d5d4-66ce-4d82-944b-94d9802f4ffb)

# Development
The app leverages the use of an iOS app called Health Auto Export, which allows users to automatically export their Apple Health data in JSON or CSV format to various destinations, like Google Drive, Dropbox, or in the case of this application, a REST API. A REST API was built using the AWS API Gateway, which receives POST requests sent from the Health Auto Export app and sends them to an AWS Lambda function. The Lambda function, written in Python, recieves the POST request and manipulates the JSON data in the desired format for adding into a database. For this project, AWS DynamoDB was used. The AWS SDK for Node.js was used to access the DynamoDB table containing activity data. The webapp is built with HTML, CSS and JavaScript. A server file utilizes the AWS SDK to access DynamoDB table entries, while the script file contains functionality for page navigation and data handling.

[This repo](https://github.com/opensource-coding/Responsive-Calendar-with-Events) served as a starting point for creating a fully functional month calendar with switchable months. All other features of the application were developed by me.

