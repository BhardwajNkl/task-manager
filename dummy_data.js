// dummy data to get started
export let dummyTasks = [
    {
        title: "Complete Project Report",
        description: "Compile and finalize the quarterly project report for the management meeting.",
        dueDate: new Date(),
        priority: "high",
        assignee: "Alice",
        status: "todo"
    },
    {
        title: "Client Meeting",
        description: "Schedule and prepare for the client meeting to discuss project requirements and expectations.",
        dueDate: new Date(),
        priority: "medium",
        assignee: "Bob",
        status: "done"
    },
    {
        title: "Code Review",
        description: "Review the latest code commits and provide feedback to the development team.",
        dueDate: new Date(),
        priority: "low",
        assignee: "Charlie",
        status: "todo"
    },
    {
        title: "Team Building Activity",
        description: "Organize a team building activity to enhance team cohesion and morale.",
        dueDate: new Date(),
        priority: "medium",
        assignee: "David",
        status: "doing"
    }
];


const jsonString = '[{"title":"Complete Project Report","description":"Compile and finalize the quarterly project report for the management meeting.","assignee":"Nikhil Bhardwaj","dueDate":"2024-07-25T00:00:00.000Z","priority":"low","status":"todo"},{"title":"Client Meeting","description":"Schedule and prepare for the client meeting to discuss project requirements and expectations.","assignee":"Anil","dueDate":"2024-07-24T00:00:00.000Z","priority":"high","status":"done"},{"title":"Code Review","description":"Review the latest code commits and provide feedback to the development team.","assignee":"Amar","dueDate":"2024-07-26T00:00:00.000Z","priority":"low","status":"todo"},{"title":"Team Building Activity","description":"Organize a team building activity to enhance team cohesion and morale.","assignee":"Amar","dueDate":"2024-07-26T00:00:00.000Z","priority":"medium","status":"done"},{"title":"Team Building Activity-2","description":"Organize a team building activity to enhance team cohesion and morale.","assignee":"Amar","dueDate":"2024-07-24T00:00:00.000Z","priority":"low","status":"doing"},{"title":"Team Building Activity-3","description":"Organize a team building activity to enhance team cohesion and morale.","assignee":"Amar","dueDate":"2024-07-24T00:00:00.000Z","priority":"low","status":"todo"},{"title":"Team Building Activity-4","description":"Organize a team building activity to enhance team cohesion and morale.","assignee":"Amar","dueDate":"2024-07-24T00:00:00.000Z","priority":"low","status":"done"},{"title":"New Topic","description":"Some topic is here. Complete this.","assignee":"None","dueDate":"2024-07-27T00:00:00.000Z","priority":"low","status":"done"}]';