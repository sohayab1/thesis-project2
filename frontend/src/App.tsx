cybercrime-reporting
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── cybercrime
│   │   │   │           ├── config
│   │   │   │           │   ├── JwtConfig.java
│   │   │   │           │   ├── SecurityConfig.java
│   │   │   │           │   └── WebSocketConfig.java
│   │   │   │           ├── controller
│   │   │   │           │   ├── AuthController.java
│   │   │   │           │   ├── ChatController.java
│   │   │   │           │   ├── ComplaintController.java
│   │   │   │           │   └── UserController.java
│   │   │   │           ├── model
│   │   │   │           │   ├── Complaint.java
│   │   │   │           │   ├── Invoice.java
│   │   │   │           │   ├── Message.java
│   │   │   │           │   └── User.java
│   │   │   │           ├── repository
│   │   │   │           │   ├── ComplaintRepository.java
│   │   │   │           │   └── UserRepository.java
│   │   │   │           └── service
│   │   │   │               ├── AuthService.java
│   │   │   │               ├── ChatService.java
│   │   │   │               └── ComplaintService.java
│   │   │   └── resources
│   │   │       ├── application.properties
│   │   │       └── i18n
│   │   │           ├── messages_en.properties
│   │   │           └── messages_es.properties
│   │   └── test
│   ├── pom.xml
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── auth
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── chat
│   │   │   │   └── ChatWindow.tsx
│   │   │   ├── complaint
│   │   │   │   └── ComplaintForm.tsx
│   │   │   └── shared
│   │   │       ├── Header.tsx
│   │   │       └── Notifications.tsx
│   │   ├── context
│   │   │   └── AuthContext.tsx
│   │   ├── services
│   │   │   ├── api.ts
│   │   │   └── websocket.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md