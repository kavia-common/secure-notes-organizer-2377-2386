#!/bin/bash
cd /home/kavia/workspace/code-generation/secure-notes-organizer-2377-2386/notes_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

