# Audio

The site loads its soundtrack from `assets/audio/song.mp3`.

That file is **not committed** (it's a placeholder path). To add the track:

1. Drop your file here named exactly `song.mp3`.
2. Commit and deploy.

The player starts automatically when the lock screen is unlocked (the unlock
click counts as the user gesture browsers require for audio playback) and loops.
There's a **sound** toggle in the top-right corner.

If `song.mp3` is missing, the site still works — playback just stays paused and
the toggle is a no-op until the file exists.

> The piece is titled *Come to My Window*; the obvious companion track is
> Melissa Etheridge's "Come to My Window." Make sure you have the rights to
> whatever you ship.
