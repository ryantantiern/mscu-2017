---
sectionclass: h1
sectionid: requirements
is-parent: yes
title: Requirements & Use Cases
number: 2000
---
This section discusses the requirements of our project given by the client, then broken down. Most of the discussion surrounds priority of "Must Have" and very little discussion on "Should Have", "Could Have" and non on "Won't Have".
The initial requirements included features to share a route and to "visualize a route remotely". This was decided on the assumption that there was a base app that had navigation included (before we had access to the code). However, after inspection of the code, in order to meet the requirements, we had to develop all the base "infrastructure" ourselves. Upon further clarification, we broke down the problem into 2 parts, Mobile App (client side) and Database (server side). The mobile app should implement key features such as saving a route, sharing a route, creating a profile, logging in and visualisation of each way point. The database is set up to store and retrieve user information and interaction data and also route data. In between the mobile app and database, there will be a Web API layer to handle requests and response. We also utilise external APIs for route creation and text to speech functionality. We broke down the requirements to isolate each one as much as we could with the help of seperating them into functional and non-functional clusters.



