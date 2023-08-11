# Pomodoro Clock Timer

This is a Pomodoro timer app built with React.

## Overview

The Pomodoro Technique is a time management method that uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. This app follows that methodology.

## Features

- Display a 25 minute pomodoro timer that counts down
- Timer labels switch between "Session" and "Break" when the main timer hits zero
- 5 minute break timer
- Button to start and pause the timer
- Button to reset the timer back to 25:00 minutes
- Minus/plus buttons to decrease/increase the session and break durations
- Play an alarm sound when the main timer hits zero

## Implementation

The app is built with React and uses state to keep track of and update the various timers and durations. Some key aspects:

- `Timer` React component holds the state with timer durations and handles all the timer logic
- `startTimer` method uses `setInterval` to count down each second
- `controlTimer` handles pausing and unpausing the timer
- `sessionTimer` method switches between session and break timers
- `handleReset` method resets timers and intervals
- `increment` and `decrement` methods update session and break durations

The app is fully functioning and meets all the standard Pomodoro timer requirements. The UI is basic but utilizes some Font Awesome icons for the buttons.

## Usage

The app is hosted on GitHub Pages here: [https://githubusername.github.io/pomodoro-clock ↗](https://githubusername.github.io/pomodoro-clock)

Simply visit that URL in the browser to use the timer.

- Click start to begin the 25 minute timer
- When it hits zero, a 5 minute break timer will begin
- Click reset to start over at any point
- Use the plus and minus buttons to adjust session and break durations

This Pomodoro Clock is free to use for personal and professional productivity purposes.
