// Review batches, most-used first. Whatever is approved by the cutoff ships;
// the rest keeps core's current glyph until its batch is done.
export const BATCHES = [
  { id: 0, title: "Proof", names: ["check", "close", "plus", "chevronRight", "arrowRight", "search", "home", "bell", "calendar", "mail", "person", "lock", "trash", "document", "chat", "star"] },
  { id: 1, title: "Arrows and navigation", names: ["chevronDown", "chevronUp", "chevronLeft", "chevronDoubleLeft", "chevronDoubleRight", "chevronsLeftRight", "arrowUp", "arrowDown", "arrowLeft", "arrowUpRight", "minus", "menu", "moreHorizontal"] },
  { id: 2, title: "Actions", names: ["edit", "copy", "download", "upload", "send", "refresh", "filter", "adjustments", "link", "logout", "enter", "return", "forward", "maximize", "minimize", "grip", "grid", "eye", "eyeOff", "eyeDropper"] },
  { id: 3, title: "Status and feedback", names: ["info", "help", "danger", "warning", "checkbox", "security", "time", "flag", "bookmark", "heart", "like", "dislike", "starFill", "sparkle", "bolt", "light", "dark", "opacity", "smiley"] },
  { id: 4, title: "Objects and media", names: ["settings", "image", "video", "play", "pause", "volume", "volumeOff", "file", "folder", "clipboard", "inbox", "newspaper", "book", "computer", "screen", "code", "cube"] },
  { id: 5, title: "Places, people and commerce", names: ["globe", "world", "ball", "food", "paw", "gift", "people", "personRemove", "organization", "symbol", "wordmark", "cart", "store", "tag", "payment", "banknotes"] },
  { id: 6, title: "Charts and gauges", names: ["barChart", "trend", "trendUp", "trendDown", "linearGauge", "radialGauge"] },
  { id: 7, title: "Shared app icons 1", names: ["checkCircle", "text", "ball", "rocket", "brush", "lightbulb", "truck", "map", "mobile", "scissors", "megaphone", "terminal", "lockOpen", "tshirt", "shoppingBag", "key", "stack", "microphone"] },
  { id: 8, title: "Shared app icons 2", names: ["idCard", "language", "camera", "columns", "chevronUpDown", "list", "music", "layers", "arrowsRightLeft", "phone", "briefcase", "heading", "swatch", "fire"] },
  { id: 9, title: "Shared app icons 3", names: ["window", "cpu", "stop", "trophy", "academicCap", "personAdd", "accessibility", "externalLink", "table", "toggle", "presentation", "message", "tablet"] },
  { id: 10, title: "Shared app icons 4", names: ["ticket", "mapPin", "report", "drag", "moreVertical", "bug", "robot", "sidebar", "wifi", "lifebuoy", "medal", "pieChart", "wrench", "backward"] },
  { id: 11, title: "Shared app icons 5", names: ["ban", "beaker", "paperclip", "checkBadge", "crop", "puzzle", "skipBack", "skipForward", "tv", "ruler", "layout", "aspectRatio", "paragraph"] },
];
