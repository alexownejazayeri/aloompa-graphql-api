const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const uuid = require("uuid");

const DB = require("./db.json");
const APPS = DB["apps"];
const EVENTS = DB["events"];
const STAGES = DB["stages"];

// Constructing a schema w/ GraphQL SDL
const schema = buildSchema(`
input AppStageInput {
  name: String!
}

input EventInput {
  appId: ID!
  stageId: ID!
  name: String!
  description: String!
  image: String!
  startsAt: Int!
  endsAt: Int!
}

type App {
    id: ID!
    name: String!
    events: [Event!]!
    stages: [Stage!]
}

type Event {
  id: ID!
  appId: ID!
  stageId: ID!
  name: String!
  image: String!
  description: String!
  startsAt: Int!
  endsAt: Int!
  stage: Stage!
}

type Stage {
  id: ID!
  name: String!
  events: [Event!]!
}

type Mutation {
  createApp(input: AppStageInput): App
  createEvent(input: EventInput): Event
  createStage(input: AppStageInput): Stage

  updateApp(id: ID!, input: AppStageInput): App
  updateEvent(id: ID!, input: EventInput): Event
  updateStage(id: ID!, input: AppStageInput): Stage

  deleteApp(id: ID!): String
  deleteEvent(id: ID!): String
  deleteStage(id: ID!): String
}

type Query {
      allApps: [App]
      allEvents: [Event!]!
      allStages: [Stage!]!
      app(id: ID!): App!
      event(id: ID, name: String): Event!
      stage(id: ID, name: String): Stage!
      getEventsBetween(start: Int!, end: Int!): [Event!]
  }
`);

class Event {
  constructor(id, name) {
    this.eventId = id;
    this.eventName = name;
    this.event = EVENTS.find(
      (el) => el.id === this.eventId || el.name === this.eventName
    );
  }

  id() {
    return this.event.id;
  }

  appId() {
    return this.event.appId;
  }

  stageId() {
    return this.event.stageId;
  }

  name() {
    return this.event.name;
  }

  description() {
    return this.event.description;
  }

  image() {
    return this.event.image;
  }

  startsAt() {
    return this.event.startsAt;
  }

  endsAt() {
    return this.event.endsAt;
  }

  stage() {
    // get stage id and feed into new instance of Stage type
    const stageId = STAGES.find((el) => el.id === this.event.stageId).id;
    const eventStage = new Stage(stageId);
    return eventStage;
  }
}

class Stage {
  constructor(id, name) {
    this.stageId = id;
    this.stageName = name;
    this.stage = STAGES.find(
      (el) => el.id === this.stageId || el.name === this.stageName
    );
  }

  id() {
    return this.stage.id;
  }

  name() {
    return this.stage.name;
  }

  events() {
    const eventsAtStage = EVENTS.filter((el) => el.stageId === this.stage.id);
    const events = eventsAtStage.map((el) => new Event(el.id));
    return events;
  }
}

class App {
  constructor(id, name) {
    this.appId = id;
    this.appName = name;
    this.app = APPS.find(
      (el) => el.id === this.appId || el.name === this.appName
    );
  }

  id() {
    return this.app.id;
  }

  name() {
    return this.app.name;
  }

  events() {
    const eventsInApp = EVENTS.filter((el) => el.appId === this.appId);
    const events = eventsInApp.map((el) => new Event(el.id));
    return events;
  }

  stages() {
    const stageIdsInApp = EVENTS.map((el) => {
      if (el["appId"] === this.app.id) {
        return el["stageId"];
      }
    });
    const stagesInApp = STAGES.filter((el) =>
      stageIdsInApp.includes(el["id"])
    ).map((el) => new Stage(el.id));
    return stagesInApp;
  }
}

// The root provides the top-level API endpoints
// CRUD Logic segmented by comments
const root = {
  /*---------------- CREATE --------------*/
  createApp: ({ input }) => {
    const appNames = APPS.map((el) => el.name);
    if (appNames.includes(input.name)) {
      throw new Error(`App: ${input.name} already exists in the database.`);
    }

    const id = uuid.v4();

    APPS.push({
      id: id,
      name: input.name,
    });

    return new App(id);
  },
  createEvent: ({ input }) => {
    // Checks for dupe event name, but sometimes artists perform multiple time
    // Could write smarter if check based on start and end times later
    const eventNames = EVENTS.map((el) => el.name);
    if (eventNames.includes(input.name)) {
     throw new Error(`Event: ${input.name} already exists in the database.`);
    }

    const id = uuid.v4();

    EVENTS.push({
      id: id,
      ...input,
    });

    return new Event(id);
  },
  createStage: ({ input }) => {
    const stageNames = STAGES.map((el) => el.name);
    if (stageNames.includes(input.name)) {
      throw new Error(`Stage: ${input.name} already exists in the database.`);
    }
    const id = uuid.v4();

    STAGES.push({
      id: id,
      name: input.name,
    });

    return new Stage(id);
  },

  /*---------------- READ ----------------*/
  // List all apps, events, and stages
  allApps: () => APPS.map((el) => new App(el.id)),
  allEvents: () => EVENTS.map((el) => new Event(el.id)),
  allStages: () => STAGES.map((el) => new Stage(el.id)),

  // Query single app, event, or stage
  app: ({ id }) => {
    // Hideous last-minute error handling block to check id
    if (id && !APPS.map((el) => el.id).includes(id)) {
      throw new Error(`App ID ${id} not found in database. Try this! ${APPS[0]["id"]}`);
    }
    
    return new App(id);
    },
  event: ({ id, name }) => {
    // Hideous last-minute error handling block to check id & name
    if (id && !EVENTS.map((el) => el.id).includes(id)) {
      throw new Error(`Event ID ${id} not found in database. Try this! ${EVENTS[0]["id"]}`);
    } else if (name && !EVENTS.map((el) => el.name).includes(name)) {
      throw new Error(`Event name ${name} not found in database.`);
    } 

    return new Event(id, name);
  },
  stage: ({ id, name }) => {
    // Hideous last-minute error handling block to check id & name
    if (id && !STAGES.map((el) => el.id).includes(id)) {
      throw new Error(`Stage ID ${id} not found in database. Try this! ${STAGES[0]["id"]}`);
    } else if (name && !STAGES.map((el) => el.name).includes(name)) {
      throw new Error(`Stage name ${name} not found in database.`);
    }

    return new Stage(id, name);
  },

  // Query events that occur between two (2) dates
  getEventsBetween: ({ start, end }) => {
    const eventsInRange = EVENTS.filter(
      (el) => el.startsAt >= start && el.endsAt <= end
    );
    const events = eventsInRange.map((el) => new Event(el.id));
    return events;
  },

  /*---------------- UPDATE ---------------*/
  updateApp: ({ id, input }) => {
    // Assign repetitive stuff to variables
    const { name } = input;
    const appIds = APPS.map((el) => el.id);

    // Check if app exists
    if (!appIds.includes(id)) {
      throw new Error(`No app with id ${id} in database.`);
    }

    // Get index of app
    const oldRecord = APPS.find((el) => el.id === id);
    const recordIndex = APPS.indexOf(oldRecord);

    // Update app at index with input
    APPS[recordIndex].name = name;
    return new App(id);
  },
  updateEvent: ({ id, input }) => {
    const eventIds = EVENTS.map((el) => el.id);

    if (!eventIds.includes(id)) {
      throw new Error(`No event with id ${id} in database.`);
    }

    // Get index of event
    const oldRecord = EVENTS.find((el) => el.id === id);
    const recordIndex = EVENTS.indexOf(oldRecord);

    // Update event at index with input
    EVENTS[recordIndex] = {
      id: id,
      ...input,
    };
    return new Event(id);
  },
  updateStage: ({ id, input }) => {
    // Assign repetitive stuff to variables
    const { name } = input;
    const stageIds = STAGES.map((el) => el.id);

    // Check if stage exists
    if (!stageIds.includes(id)) {
      throw new Error(`No stage with id ${id} in database.`);
    }

    // Get index of stage
    const oldRecord = STAGES.find((el) => el.id === id);
    const recordIndex = STAGES.indexOf(oldRecord);

    // Update stage at index with input
    STAGES[recordIndex].name = name;
    return new Stage(id);
  },

  /*---------------- DELETE ---------------*/
  deleteApp: ({ id }) => {
    // Assign repetitive stuff to variables
    const appIds = APPS.map((el) => el.id);

    // Check if app exists
    if (!appIds.includes(id)) {
      throw new Error(`No app with id ${id} in database.`);
    }

    // Get index of app
    const oldRecord = APPS.find((el) => el.id === id);
    const recordIndex = APPS.indexOf(oldRecord);

    // Remove app from database
    APPS.splice(recordIndex, 1);
    return `Removed app with id ${id} from database`;
  },
  deleteEvent: ({ id }) => {
    // Assign repetitive stuff to variables
    const eventIds = EVENTS.map((el) => el.id);

    // Check if event exists
    if (!eventIds.includes(id)) {
      throw new Error(`No event with id ${id} in database.`);
    }

    // Get index of event
    const oldRecord = EVENTS.find((el) => el.id === id);
    const recordIndex = EVENTS.indexOf(oldRecord);

    // Remove app from database
    EVENTS.splice(recordIndex, 1);
    return `Removed event with id ${id} from database`;
  },
  deleteStage: ({ id }) => {
    // Assign repetitive stuff to variables
    const stageIds = STAGES.map((el) => el.id);

    // Check if stage exists
    if (!stageIds.includes(id)) {
      throw new Error(`No stage with id ${id} in database.`);
    }

    // Get index of stage
    const oldRecord = STAGES.find((el) => el.id === id);
    const recordIndex = STAGES.indexOf(oldRecord);

    // Remove stage from database
    STAGES.splice(recordIndex, 1);
    return `Removed stage with id ${id} from database`;
  },
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");
