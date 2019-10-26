#!/bin/sh

SESSION="samuel"

# Start the tmux server and create a new session
tmux start-server
tmux new-session -d -s $SESSION

# Split the window into 2 panes and select the new one
# left (70%) / right (30%)
tmux split-window -h -p 30 -c frontend

tmux attach-session -t $SESSION
