# Audio

The site loads its soundtrack from `assets/audio/Window.mp3`.

The player starts automatically when the lock screen is unlocked (the unlock
click counts as the user gesture browsers require for audio playback) and loops.
There's a **sound** toggle in the top-right corner.

To swap the track, replace `Window.mp3` (or change the `<source>` path in
`index.html`). If the file is missing the site still works — playback just stays
paused and the toggle is a no-op until a file exists.
