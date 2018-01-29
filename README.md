# Secret Santa Generator

## What is secret santa

"Secret Santa is a  Christmas tradition in which members of a group or community are randomly assigned a person to whom they give a gift. The identity of the gift giver is a secret not to be revealed." (Wikipedia)

## What this website does?

You can use this website to do your secret santa pairings for your group. 

As a user you can:
* [x] Register for an account
* [x] Log in to that account
* [x] Create a group and add names to it 
* [x] See a list of your current groups and participants in each groups
* [x] Delete participant(s) 
* [ ] Edit participants names
* [x] Delete group
* [x] Draw names(randomly pair secret santa's)- each participant will recieve an email with the name of the person they're buying a present for .

## Tech stack
Built with postgresql, nodejs, javascript, html and css. 

Npm modules nodemailer, bcryptjs, 

## Running our project locally
Our project is hosted on Heroku, but if you would like to run it locally please follow these instructions:

### Requirements

PostgreSQL, Node

### Installation

`git clone https://github.com/Gbaja/secret-santa-generator.git` 

Switch to the directory

`cd secret-santa-generator` 

Install dependencies

`npm i`

Environment variables 

Create a config.env file in the root directory with the following environment variables:

`DATABASE_URL = [a url to a PostgreSQL Database, setup with our db_build.sql]`

`SECRET = [a secret sequence of letters / numbers for signing JWT tokens]`

Run a Dev Server

`npm run dev`

## Thoughts

The main thing I was hoping to get out of this project was to understand the relations between front end, backend and how to use database to save and retrieve data. It was a good insight into how it all fits together. At first, I was confused about making an XMLHttRequest to get or post data to be used in the back end. This is because a url to me had always been a website one but by making this web app, I was able to familiarise myself with the concept. 
I have also been able to improve my ability to write SQL statements to make queries to add or get data from database. I really enjoyed working with database and hope to learn more about it, SQL to be more specific.  Learning about things like the content editable attribute in html was interesting. 
