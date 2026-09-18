# 🎋 Bamboo for Zed

A light theme with a dark terminal for Zed.

![Bamboo for Zed screenshot](screenshot.png)

👻 Dark Version coming someday?

## Icons

Pairs well with the [Bamboo Icon Theme for Zed](https://github.com/chrisdrackett/bamboo-icon-theme-zed).

## Development

### Editing and generating the theme

1. Open Zed's command palette and run `zed: install dev extension` (also available as **Install Dev Extension** on the Extensions page).
2. Select this repository's root directory.
3. Run `theme selector: toggle` and select **Bamboo Paper <variation>**.
4. Run `yarn && yarn dev` to start a watcher that automatically rebuilds the theme on changes.

Themes are generated from the files in `src/variations/`.

Syntax groups can also specify optional font styling:

```ts
{ keys: ["comment", "string.doc"], font_style: "italic", font_weight: 400 }
```

Strongly inspired by [I am sorry, but everyone is getting syntax highlighting wrong](https://tonsky.me/blog/syntax-highlighting/).
