# Android build (not started)

Notes on how feasible an APK of Magnum Opus is. Nothing here is implemented yet.

## Verdict

Feasible: the app already ships with Tauri 2, which builds for Android. The app code needs
little or no change; the work is in setting up the toolchain.

## What it takes

- **Toolchain:** Android Studio (or just the SDK command-line tools), the NDK and JDK 17, with
  `ANDROID_HOME`, `NDK_HOME` and `JAVA_HOME` set.
- **Rust targets — the main blocker.** Rust here is the standalone MSVC install without rustup,
  so it cannot add the Android targets (`aarch64-linux-android`, `armv7-linux-androideabi`,
  `i686-linux-android`, `x86_64-linux-android`). Either switch to rustup
  (`rustup target add …`) or install those targets' standard libraries by hand.
- **Once:** `pnpm tauri android init` generates `src-tauri/gen/android/`.
- **The command:** a script next to `desktop:build`:

  ```json
  "android:build": "tauri android build --apk"
  ```

- **Signing:** installing an APK outside the store requires a signed build. Create a keystore once
  and configure it in the generated Gradle project (keep the keystore and its passwords out of git).

## What already works in our favour

- Fully offline with hash routing: fits the Android WebView as is.
- The CSP (including `'wasm-unsafe-eval'` for the meshopt decoder) and localStorage behave the same.
- The phone layout already exists: bottom sheets, a chrome row that hides while scrolling,
  3D plates paused by default so swipes scroll the page.

## Risks

- **Size:** the GLB assets add up to tens of MB (`muscles.glb` alone is 5.6 MB). The APK will be
  heavy but installable.
- **3D performance:** the skeleton (~650k triangles) plus tissue layers may be slow on modest
  phones. Test on a real device early.
- **Desktop-only code:** review the calls in `src/shell/desktop.ts` and the permissions in
  `src-tauri/capabilities/default.json` for mobile (some APIs may not exist there).

## Lighter alternative: a PWA

A service worker that caches every asset makes the app installable from the phone's browser and
usable offline, with no Android SDK or Rust. The trade-off: it is not a real APK, and the first
load must come from a server (e.g. the PC on the local network).

## Suggested order

1. Install rustup and the Android targets, the SDK, NDK and JDK 17.
2. `pnpm tauri android init`, then `pnpm tauri android dev` on a device to check the 3D plates.
3. Add the `android:build` script and set up signing.
