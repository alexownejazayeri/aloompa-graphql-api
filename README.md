# Aloompa GraphQL API Challenge

## Overview

A GraphQL API to query apps, events, and stages given this [data set](https://assets.aloompa.com.s3.amazonaws.com/rappers/hiphopfest.json).

## Description

After coming across a ton of inspiring Apollo GraphQL projects, I cloned and converted this express.js project into an `apollo-server-lambda` project using serverless to deploy to an AWS lambda. 

Since there's some time before EOD, I'm going to try to learn enough TypeScript to refactor the express version (or both).

Here's a link to the [Apollo GraphQL playground](https://efaw8i6jre.execute-api.us-east-1.amazonaws.com/dev/graphql) deployed to AWS. Have a look! Was interesting learning how Apollo handles resolvers and typedefs. Can't tell if I prefer Express or Apollo, but had fun writing both.

Plus, I mean, Apollo's interface is beauty and I was struck with by GQLSWAPI (see: below). Had to give it a shot!

Tech Used 
- JavaScript
- Node.js
- Express.js
- GraphiQL (enabled)
- Apollo Server & Playground
- Serverless
- AWS Lambda
- GitHub

Database Tidbits
- API pulls from locally hosted json file
- Data persisted in-memory

Dev Tooling
- GraphiQL @ [localhost:4000/graphql](http://localhost:4000/graphql) to interact with and test the API
- Apollo deployed to AWS Lambda via Serverless - [Click here to explore](https://efaw8i6jre.execute-api.us-east-1.amazonaws.com/dev/graphql)

Process
- GraphQL Docs 
  - [Queries and Mutations](https://graphql.org/learn/queries/) & [Schemas and Types](https://graphql.org/learn/schema/) to learn client-side GQL
  - [Validation](https://graphql.org/learn/validation/), [Execution](https://graphql.org/learn/execution/), and [GraphQL.js](https://graphql.org/graphql-js/) to learn server-side syntax and packages
- Examples & Inspiration
  - [SpaceX Apollo GraphQL API](https://studio.apollographql.com/public/SpaceX-pxxbxen/home?variant=current)
  - [SWAPI Apollo GraphQL API](https://studio.apollographql.com/public/star-wars-swapi/home?variant=current)



## Requirements

- [x] List all apps
- [x] Query a single app
- [x] List all stages
- [x] Query a single stage
- [x] Search the stages by name
- [x] List all events
- [x] Query a single event
- [x] Search events by name
- [x] Query events that occur between two dates (take Unix Time values)
- [x] List all events in an app
- [x] List all stages in an app
- [x] Get stage in an event
- [x] List events at a stage
- [x] Can add, update, and remove all entities

## Getting started

To test out this project clone the repo, install dependencies with `npm install`, and run the server with `node server.js` in the terminal.

This should get your local server up and running with the GraphiQL dev tool running at [localhost:4000/graph](http://localhost:4000/graphql).

Here's a query to get you started with the most rizzle apizzle on the internizzle.

```
query listAllApps {
    allApps {
        id
        name
        events {
            id
            appId
            stageId
            name
            description
            image
            startsAt
            endsAt
            stage {
                id
                name
            }
        }
        stages {
            id
            name
            events {
                id
                appId
                stageId
                name
                description
                image
                startsAt
                endsAt
                stage {
                    id
                    name
                }
            }
        }
    }
}
```
## A Few CRUD Test Queries

### Create
```
# createApp test
mutation {
	createApp(input: {
		name: "GizzFest"
	}){
		id
	}
}
```
```
# createEvent test
mutation {
	createEvent(input: {
		appId: "b810bf6d-d81d-4104-bc1a-3b21d5154076",
		stageId: "a6bb97dc-224c-4f8f-9af7-fd8b5731840f",
		name: "Ivan Ave",
		description: "Ivan Ave's relationship with music started in the CD shelves of his older sisters. Today the Norwegian MC makes songs clearly shaped by sneaking into 90s bedrooms to play albums by The Fugees and Janet Jackson.",
		image: "https://images.squarespace-cdn.com/content/v1/5d88afe72268c83e4f3edb98/1581518192793-TRRP148UXAKVEOCIFGMB/ivanave-page.jpg?format=1000w",
		startsAt: 1577930400,
		endsAt: 1577935000,
}) {
id
}
}
```
```
# createStage test
mutation {
	createStage(input: {
		name: "Nizzle Stage"
	}){
		id
	}
}
```

### Read

Left as an exercise!

### Update
```
# updateApp test
mutation {
  updateApp(id: "b810bf6d-d81d-4104-bc1a-3b21d5154076", input: {
    name: "Rizzle Dizzle Fest 2022"
  }) {
    id
  }
}
```
```
# updateStage test
mutation {
  updateStage(id: "a6bb97dc-224c-4f8f-9af7-fd8b5731840f", input: {
    name: "Nizzle Stage"
  }) {
    id
    name
  }
}
```
```
# updateEvent test
mutation {
  updatEvent(id: "d4cec773-c287-4efe-aca5-4274accb6656", input: {
	  appId: "b810bf6d-d81d-4104-bc1a-3b21d5154076",
		stageId: "a6bb97dc-224c-4f8f-9af7-fd8b5731840f",
		name: "Ivan Ave",
		description: "Ivan Ave's relationship with music started in the CD shelves of his older sisters. Today the Norwegian MC makes songs clearly shaped by sneaking into 90s bedrooms to play albums by The Fugees and Janet Jackson.",
		image: "https://images.squarespace-cdn.com/content/v1/5d88afe72268c83e4f3edb98/1581518192793-TRRP148UXAKVEOCIFGMB/ivanave-page.jpg?format=1000w",
		startsAt: 1577930400,
		endsAt: 1577935000,
  }) {
    id
    name
  }
}
```

### Delete
```
# deleteApp test
mutation {
	deleteApp(id: "b810bf6d-d81d-4104-bc1a-3b21d5154076")
}
```
```
# deleteEvent test
mutation {
	deleteEvent(id: "b4781407-da92-475e-8d87-596aee0d7f2d")
}
```
```
# deleteStage test
mutation {
	deleteStage(id: "a6bb97dc-224c-4f8f-9af7-fd8b5731840f")
}
```

## Closing Thoughts, Wish List Items, and Bugs

### Infinite querying (for the v e r y curious)

You'll notice that there's an "infinite query" behavior that lets you drill into events on a stage that has it's events that each have a stage field...and so on. 

At first this felt like a GraphQL anti-pattern since it was built on the idea of "just enough" data, but I noticed this behavior in the GraphQL SWAPI and decided it was fine.

It's a side effect of exposing all events and weird behavior seemed easily avoidable with smart queries on the client side!

### Error handling

If I had more time and felt strongly enough to prioritize this, I'd add intelligent duplicate value checks. Specifically, with events I'd like to check names and startsAt/endsAt values together to disallow creating duplicate createEvent() mutations.

### Updating entities (post-rock band name?)

As of this version, you can't update fields selectively - you gotta do it all in an object. This becomes cumbersome when updating the event type for example:

```
events {
    id
    appId
    stageId
    name
    description
    image
    startsAt
    endsAt
    stage {
        id
        name
    }
}
```

Mmmhm, look at all those fields. And that's just the query syntax...blegh. For the holidays this year I want 'generic-holiday-agnostic-mascot' to bless me with inspiration for updating fields selectively, so I can update a name without having to populate 6 other fields.

### Strange ASCII apostrophe

Do you have 20-20 vision? The eyes of a hawk? Tell me...

Can you spot the difference here?

- `Fo’shizzle Stage`
- `Fo'shizzle Stage`

It's subtle, but the ASCII apostrophe in the first Fo'Stage isn't the one you type on a keyboard. As of now, if you want to find the Fo’shizzle Stage you'll have to copy/paste the value directly into the 'name' argument:

**Example**

`stage(name: "Fo’shizzle Stage"`)

It feels very possible that this is best handled with frontend logic too e.g.(pass in exact string value vs. user-typed string). Guess it all depends on the use case and the context for the client requesting tht data.

Alternatively, I could've gone the RegEx path and tried to filter for options best match a query, but that felt unnecessary and outside the scope of this project. And Jose said it wasn't meant to be tricky, here's to hoping a search algorithm wasn't scoped for the project!