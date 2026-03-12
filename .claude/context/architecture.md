# Architecture

The application follows a simple layered architecture.

Layers:

routes → middleware → services → database

Responsibilities:

routes:
handle HTTP requests

middleware:
authentication and validation

services:
business logic

database:
data persistence