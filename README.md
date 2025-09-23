# Badminton

A web app for managing badminton matches, players, and history.  
Built with **Vue 3**, **Vite**, and **Firebase**.

## Features

- Add and view upcoming matches
- Track match history and results
- Manage player list and levels
- Shuttlecock tracking
- Responsive UI with Tailwind CSS

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Add a web app and copy your config to `src/firebase.js`.
3. Enable Firestore Database.
4. Add collections:
   - `players` (fields: `name`, `level`)
   - `matches` (fields: `teams`, `status`, `finished_at`, etc.)

## Folder Structure

- `src/components/` — Vue components (UpcomingMatches, MatchHistory, etc.)
- `src/firebase.js` — Firebase config
- `src/App.vue` — Main app
- `src/main.js` — Entry point

## Contributing

Pull requests are welcome!  
For major changes, please open an issue first.

## License

MIT
