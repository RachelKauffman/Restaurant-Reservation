# Restaurant Reservation System

Periodic Tables, a startup, is creating a reservation system for fine dining restaurants.
The software is used only by restaurant personnel when a customer calls to request a reservation.
At this point, the customers will not access the system online.

## Existing files

This repository is set up as a *monorepo*, meaning that the frontend and backend projects are in one repository. This allows you to open both projects in the same editor.

The table below describes the folders in this starter repository:

| Folder/file path | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `./back-end`     | The backend project, which runs on `localhost:5001` by default.  |
| `./front-end`    | The frontend project, which runs on `localhost:3000` by default. |

## Database setup

1. Set up four new ElephantSQL database instances - development, test, preview, and production - by following the instructions in the "PostgreSQL: Creating & Deleting Databases" checkpoint.
2. After setting up your database instances, connect DBeaver to your new database instances by following the instructions in the "PostgreSQL: Installing DBeaver" checkpoint.

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

## Screenshots

## Dashboard 

Displays current date's reservations and tables. User can also navigate to different dates with previous and next buttons. 
![image](https://user-images.githubusercontent.com/109226895/210275533-fea0ad8d-e19a-44cd-9706-4200351945f3.png)


## Make a New Reservation

The user can take a call from a new customer and create a new reservation for them with their name, phone number, party size and date and time of the reservation.
![image](https://user-images.githubusercontent.com/109226895/210275554-ee186fb1-32b2-4548-b659-e3e7e7087b83.png)

## Make a new table
This page displays a form with table name and capacity fields. The "Submit" button will create a new table and "Cancel" will take the user to the previous page.
![image](https://user-images.githubusercontent.com/109226895/210275652-3d9c3b7c-7ee0-4b18-8be9-0281daa6437f.png)

## Seat a Reservation
When the user clicks the "Seat" button on a specific reservation from the dashboard they are taken to a page to the "Seat Reservation" page. A table to seat them at can be selected and upon clicking "Submit" the reservation's status will be changed from "booked" to "seated".
![image](https://user-images.githubusercontent.com/109226895/210275848-7117baf4-0aec-4527-b6ab-de327d677831.png)

## Finish an Occupied Table
The "finished" button will clear the table and allow another reservation to be sat there.
![image](https://user-images.githubusercontent.com/109226895/210275989-24caa555-db27-4c7a-beb5-0c1e74f61656.png)

## Cancel a Reservation
Clicking the "cancel" button for a specific reservation will display a confirmation window. 
![image](https://user-images.githubusercontent.com/109226895/210276140-99740be9-da2c-4333-8543-6cd10a9bec01.png)

## Edit a Reservation
A reservation can be edited by clicking the "Edit" button. This takes user to a new page with the reservation's information pre-loaded and able to be changed.
![image](https://user-images.githubusercontent.com/109226895/210276271-20903225-9c28-4f59-a775-9102c3d9c5a2.png)



