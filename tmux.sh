#!/bin/sh

SESSION="samuel"

# Start the tmux server and create a new session
tmux start-server
tmux new-session -d -s $SESSION

# Start the Django server
tmux send-keys "docker-compose up -d && docker-compose logs -f --tail=0" C-m

# Split the window into 2 panes and select the new one
# left (70%) / right (30%)
tmux split-window -h -p 30 -c frontend

# Start the React dev server
tmux send-keys "yarn start" C-m

tmux attach-session -t $SESSION
