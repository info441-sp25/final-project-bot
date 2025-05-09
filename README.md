# Project Proposal
By Aadil Ali, Mackenzie Kimbrough, Megan Pham, Spencer Gardner

# Project Description:
PM Bot is a lightweight, user-friendly collaborative project management tool designed for student and club teams already leveraging Discord as their main communication hub. Rather than assigning a project manager, PM Bot allows teams to focus on the work they love by consolidating responsibilities like task assignment and progress tracking into intuitive, automated commands.
Here, our goal is to streamline project workflows and reduce forgotten action items by providing friendly reminders and summaries of whose been assigned what – all without leaving discord.

## Target Audience:
Our target audience are university students, especially those involved in:
Group projects in classes (e.g., capstone, design, CS projects)
Student clubs organizing events
Study groups dividing up shared tasks (e.g., notes, research)
While these groups already use Discord, most use barebones techniques or juggle a number of outside tools to moderate tasks, answer questions, and check assignment timelines. This results in unnecessary stress straining group relationships and worsening the quality of their work.

## Why Would They Use This?
Juggling multiple platforms is tiresome and unnecessary, our platform consolidates external tooling to offer PM functionalities with minimal overhead/onboarding.
Traditional tools (like Trello or Notion) are too bloated or formal. Moreover, they require additional setup, creating more menial tasks for students to handle before getting real work done.
Simple command-based interaction (/assign @alex ”write report by Friday”) provides intuitive, low-effort, automated reminders, status reports, and task overviews to help keep projects on track.

## Why Are We Building This?
As INFO students, we’re no stranger to using Discord to communicate and share files for team projects. We’re also no stranger to the many frustrations that come with managing a student team. Without juggling numerous tools, messages always fall through the cracks, members push deadlines without notice, and manual reminders can strain team relationships. From a technical standpoint, taking this project on gives us an opportunity to leverage what we’ve learned in backend development, database management, and client-side development to learn and work with a new SDK to develop something that would improve not just our lives, but the lives of the students around us.

# Technical Description

## Data Flow:


<img width="745" alt="Screen Shot 2025-05-09 at 1 11 56 PM" src="https://github.com/user-attachments/assets/6ca6ffb8-9a41-41cc-85cb-66a65cc7c8ed" />




## Architecture Diagram:

<img width="1119" alt="Screen Shot 2025-05-09 at 1 12 20 PM" src="https://github.com/user-attachments/assets/c85a9f82-74c6-4566-a65e-a9252b475918" />

| Priority | User       | Description                                                                 | Technical Implementation                                                                                                                                         |
|----------|------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P0       | As a user  | I want to be able to create a task in Discord so I can track what needs to be done. | When adding a new task, update MongoDB with title, description, and status set at “incomplete”.                                                                 |
| P0       | As a user  | I want to be able to view the list of tasks for my group so I can manage my workload effectively. | When viewing tasks, retrieve all tasks from MongoDB.                                                                                                             |
| P0       | As a user  | I want to be able to edit the status of a task, so my group knows how far along I am. | When editing a task, retrieve the task from MongoDB by its taskID, then update the status to “in progress” or “complete”.                                       |
| P1       | As a user  | I want to be able to set the due date and assign a user for the task so I know what needs to get done first. | When adding a new task, update MongoDB with the due date and assign userID.                                                                                     |
| P1       | As a user  | I want to see the current status of all active tasks so I can monitor team progress. | When viewing all active tasks, retrieve all tasks from MongoDB that contain a status of “incomplete” or “in progress”.                                         |
| P1       | As a user  | I want to view my upcoming tasks so that I can manage my workload effectively. | When viewing your own tasks, retrieve all tasks from MongoDB that contain the user’s userID and the status “incomplete” or “in progress”.                      |
| P2       | As a user  | I want to receive reminders before assignment deadlines, so that I can ensure I don’t miss the due date. | Check the database for upcoming tasks based on the field due date. When the due date is 2 days away, send a message to the chat with the assignment title, due date, and assignee. |
| P2       | As a user  | I want to assign team roles, so everyone’s responsibilities are clearly defined. | When assigned a role, locate the selected user in the database and update the role field.                                                                      |
| P2       | As a user  | I want to see past tasks so I can review what the team has accomplished so far. | When viewing past tasks, retrieve all tasks from MongoDB that contain a status of “complete”.                                                                   |
| P2       | As a user  | I want to get notified if a teammate completes a task. | When the status of a task is changed to “complete”, send out a notification into the chat telling the group the name of the task and userID of the assignee.    |


## Discord/Command Endpoints:

/task create @user  (description) - allows users to create a task and assign it to the team or specific members in the server.

/task upcoming - allows user to view upcoming tasks for the team and their assignments

/task upcoming @user- allows user to view upcoming tasks a specific member

/task status @user - allows users to see the status of tasks

/task status (update) @user - allows users to update the status of tasks (complete, working on)

/tasks all - allows users to see all tasks for the team (past and present).

/remind @user (taskID) (frequency) - allows user to set/change reminders for tasks for users on a frequency (1-per-day, 2-per-day, etc)

/remind view - allows user to view all set reminders for the team

/roles @user (role) - allows users to assign / change roles within the team.

/roles view - view all users and their roles in the team



## Database Schema

### Users
- `userID` (String): Unique identifier for the user.
- `username` (String): The user's display name.
- `role` (String): The role assigned to the user (e.g., "member", "admin").

### Tasks
- `taskID` (ObjectID): Unique identifier for the task.
- `description` (String): Description of the task.
- `assignedTo` (Array of Strings): List of userIDs assigned to the task.
- `status` (String): Status of the task (e.g., "incomplete", "in progress", "complete").
- `due_date` (Date): The date the task is due.
- `created_date` (Date): Timestamp of when the task was created.
- `updated_date` (Date): Timestamp of the last update.

### Reminders
- `reminderID` (ObjectID): Unique identifier for the reminder.
- `taskID` (ObjectID): Associated task's ID.
- `userID` (String): ID of the user to remind.
- `message` (String): Reminder message content.
- `remind_date` (Date): Date and time the reminder should be sent.




