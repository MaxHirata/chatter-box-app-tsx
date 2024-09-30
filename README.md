# Chatter Box App

After cloning this repository, run the fallowing to run the application:

```js
  npm install
  npm run dev
```

## Description
This is chat simulation app that :
  - Creates a new user
  - User can send chat messages to a chat
  - User can create multiple chats
  - User can delete a chat, deleting all messages associated with that deleted chat.

  The state management tool used is React's useContext hook.

  This App uses Material UI as a React Comonent library as well as UUID for creating generated unique Ids.

## App Workflow
1) Upon running the app, you will have to create a user first that just requires a user name. This would automatically create a private chat so you can already start chatting to yourself.

2) While in the chat window view:
    - On the left hand nav:
        - You can see yourself as the current "logged in user"
        - See the list of available chats that are you associated with.
        - At the very bottom of the nav bar, there is a "Create Chat" button
    - On the right hand chat window:
        - You can see a window with the current selected chat
        - See messages in the chat if there are any with the sender name, message contents, and time stamp.
        - At the very bottom, there is an input for to create a new chat message and a button to send that message to chat.

  3) When hitting the "Create Chat" button, you just need to provide a name for the new chat. These chats will hold there own records of chat messages for that chat. So when selecting that chat, you only see messages associated that chat.

  4) You can also delete a chat through the "trash can" button next to the chat name. After going through the chat deletion warning/confirmation dialog, this would delete all traces of that chat, including all users associated with the chat and all chat messages associated with that deleted chat.

## Note: 
Currently this app only supports a single user, however the data structure and methods within the ChatContext.tsx file should support:
  - multi user creation
  - switching existing users
  - creating group chats with multiple users in a single chat

This repository was copied from another repository [chatter-box-app](https://github.com/MaxHirata/chatter-box-app)
This is was due to that first chatter-box-app being written in JSX while this version is in TypeScript Tsx. If you are interested in the full commit history, please view this repo's commit history as well as the original jsx chatter-box-app commit history.
