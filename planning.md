LSPD Bodycam Archive System - Project
Planning

1. Project Overview
A web-based platform for the RED RolePlay LSPD faction. This system allows patrol officers to log their
roleplay bodycam footage (via Streamable links) and provides High Command with a centralized,
searchable master archive for oversight and investigations.
Tech Stack: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL,
NextAuth.js. Vibe: Professional, secure, dark-mode police database (inspired by Axon Evidence).
2. Core Features & Access Levels
Authentication: Badge Number & Password login.
Role: OFFICER
Submit new bodycam reports (Title, Date, Case #, Description, Streamable Link).
View their own submission history.
Role: HIGH_COMMAND (Admin)
Access the Master Archive.
View all submitted bodycam clips from all officers.
Filter/Search by Badge Number, Case Number, or Date.
3. Database Architecture (Prisma/PostgreSQL)
Model: User
id (String/UUID, Primary Key)
username (String - e.g., "J. Doe")
badgeNumber (String, Unique - e.g., "1234")
password (String, Hashed)
role (Enum: OFFICER, HIGH_COMMAND)
Model: BodycamClip
id (String/UUID, Primary Key)
title (String)
streamableUrl (String)
•
•
◦
◦
•
◦
◦
◦

•
•
•
•
•

•
•
•

incidentDate (DateTime)
caseNumber (String, Optional)
description (Text)
createdAt (DateTime, Default: now())
uploaderId (Relation to User)
4. Development Phases (Antigravity Prompts Strategy)
Phase 1: Foundation (Database & Setup)
Initialize Next.js project.
Setup Prisma & PostgreSQL connection.
Create Prisma schema models.
Create a basic seed script for testing users.
Phase 2: Security (Auth & Middleware)
Implement NextAuth with Credentials provider.
Configure route protection in middleware.ts .
Build the secure Login screen.
Phase 3: Officer View (Submission & Personal Archive)
Build the Main Layout/Navigation.
Create the Server Action for database insertion.
Build the Officer Dashboard: Submission form + Grid view of personal clips.
Implement Streamable iframe embedding.
Phase 4: High Command View (Master Archive)
Build the Admin Dashboard ( /archive ).
Implement data fetching for all clips.
Build the Search/Filter logic.
Design the detail view/modal for video playback.
5. UI/UX Guidelines
Color Palette: Dark blues, grays, stark white text.
Typography: Sans-serif for main text, Monospace for numbers (Badge #, Case #, Dates).
•
•
•
•
•

•
•
•
•

•
•
•

•
•
•
•

•
•
•
•

•
•

Components: Sharp edges, subtle borders, high contrast. Use cards for video entries with clear
metadata labels.
