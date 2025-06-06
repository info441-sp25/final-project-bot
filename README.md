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

<img width="943" alt="Screenshot 2025-06-06 at 9 43 21 AM" src="https://github.com/user-attachments/assets/422d435c-63d3-43b2-9133-0e6a27ed5cb0" />


## Architecture Diagram:
<img width="863" alt="Screenshot 2025-06-04 at 9 48 04 PM" src="https://github.com/user-attachments/assets/7ee1a755-a1fa-409e-8d21-8d662d23bdd0" />


## User Stories

| Priority | User       | Description                                                                 | Technical Implementation                                                                                                                                         |
|----------|------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| P0       | As a user  | I want to be able to create a task in Discord so I can track what needs to be done. | When adding a new task, update MongoDB with title, description, and status set at “incomplete”.                                                                 |
| P0       | As a user  | I want to be able to view the list of tasks for my group so I can manage my workload effectively. | When viewing tasks, retrieve all tasks from MongoDB.                                                                                                             |
| P0       | As a user  | I want to be able to edit the status of a task, so my group knows how far along I am. | When editing a task, retrieve the task from MongoDB by its taskID, then update the status to “in progress” or “complete”.                                       |
| P0       | As a user  | I want to be able to delete a task. | Delete the task from the DB .                                       |
| P1       | As a user  | I want to be able to set the due date and assign a user for the task so I know what needs to get done first. | When adding a new task, update MongoDB with the due date and assign userID.                                                                                     |
| P1       | As a user  | I want to see the current status of all active tasks so I can monitor team progress. | When viewing all active tasks, retrieve all tasks from MongoDB that contain a status of “incomplete” or “in progress”.                                         |
| P1       | As a user  | I want to view my upcoming tasks so that I can manage my workload effectively. | When viewing your own tasks, retrieve all tasks from MongoDB that contain the user’s userID and the status “incomplete” or “in progress”.                      |
| P2       | As a user  | I want to receive reminders before assignment deadlines, so that I can ensure I don’t miss the due date. | Set a reminder frequency for a task and check the db for the frequency and send a reminder message to the user with the task name, due date, and task assignment. |
| P2       | As a user  | I want to be able to edit task details after creation so I can correct information or adapt to any changes in the team. | When editing a task, retrieve the task by its ID, display a form with current values, then update MongoDB with the modified task name, description, assignee, and due date.                                                |
| P2       | As a user  | I want to see past tasks so I can review what the team has accomplished so far. | When viewing past tasks, retrieve all tasks from MongoDB that contain a status of “complete”.                                                                   |
| P2       | As a user  | I want to get notified if a teammate completes a task. | When the status of a task is changed to “complete”, send out a notification into the chat telling the group the name of the task and userID of the assignee.    |


## Discord/Command Endpoints:

- **/task create** - Create a new task with a task name, description, due date, assigned team member. Also stores a unique task ID, a status of incomplete, created date, and who created the task.
- **/task update** - Update a task's status to "in progress" or "complete".
- **/task all** - View all tasks for the team organized by their current status (incomplete, in-progress, complete)
- **/task delete** - Remove a task from the database.
- **/task remind** - Set up daily reminders for a task at a set time by the user.
- **/task edit** - Modify task details including name, description, due date, and assigned user
- **/task upcoming** - View active tasks with option to see all team tasks or just your personal ones.



## Database Schema

### Tasks
- `_id` (ObjectID): Unique identifier for the task.
- `username` (String): Name of the user who created the task.
- `assignedUser` (String): Name of the user assigned to complete the task.
- `taskName` (String): Title of the task.
- `taskDescription` (String): Detailed description of the task.
- `status` (String): Status of the task ("incomplete", "in progress", or "complete").
- `due_date` (Date): The date the task is due.
- `created_date` (Date): Timestamp of when the task was created.
- `reminderFrequency` (String): How often to send reminders ("daily" as of now).
- `reminderTime` (String): Time of day to send reminders (24-hour format).


