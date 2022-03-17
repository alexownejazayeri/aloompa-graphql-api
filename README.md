# Aloompa GraphQL API Challenge

## Overview

A GraphQL API to query apps, events, and stages given this [data set](https://assets.aloompa.com.s3.amazonaws.com/rappers/hiphopfest.json). Priorities of this version were to get something that first hits the mark on the requirements with aims of deployment AWS and refactoring for TypeScript with the remaining time.

Tech
- JavaScript
- Node.js
- Express.js
- GraphiQL (enabled)

Database
- API pulls from locally hosted json file
- Data persisted in-memory while server live at localhost:4000
- GraphiQL @ [localhost:4000/graph](http://localhost:4000/graphql) to interact with and test the API

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
## Closing Thoughts, Wish List Items, and Bugs

### Infinite Querying (for the v e r y curious)

You'll notice that there's an "infinite query" behavior that lets you drill into events on a stage that has it's events that each have a stage field...and so on. 

At first this felt like a GraphQL anti-pattern since it was built on the idea of "just enough" data, but I noticed this behavior in the GraphQL SWAPI and decided it was fine.

It's a side effect of exposing all events and weird behavior seemed easily avoidable with smart queries on the client side!

### Error handling

Specifically in the 'app', 'event', and 'stage' fields when you're querying by 'id' or 'name' I'd like to have added in some smart errors that maybe tell you to try again or offer a list possible options to copy/paste. I opted for the extra credit instead!

Another error I'd like to handle is intelligent duplicate value checks. Specifically, with events I'd like to check for duplicate names && startsAt/endsAt value to disallow dupes. Again, the extra credit got me but that's a definit flaw in the design right now.

### Strange ASCII apostrophe

Do you have 20-20 vision? The eyes of a hawk? Tell me...

Can you spot the difference here?

- `Fo’shizzle Stage`
- `Fo'shizzle Stage`

It's subtle, but the ASCII apostrophe in the first Fo'Stage isn't the one you type on a keyboard. As of now, if you want to find the Fo’shizzle Stage you'll have to copy/paste the value directly into the 'name' argument:

**Example**

`stage(name: "Fo’shizzle Stage"`)

Jose told me this wasn't meant to be tricky, and I figured this could be handled with frontend logic too e.g.(pass in exact string value vs. user-typed string).

Alternatively, I ~guess~ one could use RegEx or string matching tools to filter for options that most-likely match a user query, but that felt outside the scope of this project. And Jose said it wasn't meant to be tricky, here's to hoping a search algorithm wasn't scoped for the project!