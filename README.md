# ntfy.js for PocketBase

A JavaScript library for sending notifications via [ntfy.sh](https://ntfy.sh) from PocketBase hooks. This library is designed to work with PocketBase's Goja JavaScript runtime (ECMAScript 5.1 compatible) and provides a fluent API for building and sending notifications with support for tags, priorities, actions, and more.

**Compatible with:** PocketBase, Goja JavaScript engine, ECMAScript 5.1

## Setup

1. Copy the `ntfy.js` file to your PocketBase `pb_hooks/` directory
2. Use it in your PocketBase hooks by requiring the module

## Basic Usage

```javascript
routerAdd("POST", "/myApi/ntfydemo", (e) => {
  const Ntfy = require(`${__hooks}/ntfy.js`);

  // Simple notification
  new Ntfy("https://ntfy.sh/myprivatetopic")
    .priority(3)
    .message("Oh boy...", "It happened again! The demo has been clicked!")
    .send();

  return e.json(200, { status: "notification sent" });
});
```

## Available Methods

### Constructor

- `new Ntfy(url)` - Creates a new notification builder with the ntfy server URL

### Core Methods

- `.message(title, body)` - Sets the notification title and message body
- `.send()` - Sends the notification with all configured settings
- `.reset()` - Returns a new Ntfy instance with the same URL (fresh state)

### Configuration Methods

- `.priority(level)` - Sets priority level (1=min, 3=default, 5=max)
- `.tags(tagArray)` - Adds tags to the notification (appends to existing tags)
- `.setTags(tagArray)` - Replaces all existing tags with new ones
- `.click(url)` - Adds a click action (shorthand for actionView)

### Action Methods

- `.actionView(label, url, clear?)` - Adds a view action button
- `.actionHTTP(label, url, clear?, otherParams?)` - Adds an HTTP action button

## Examples

### Simple Notification

```javascript
const Ntfy = require(`${__hooks}/ntfy.js`);

new Ntfy("https://ntfy.sh/mytopic").message("Hello", "World").send();
```

### High Priority Alert with Tags

```javascript
const Ntfy = require(`${__hooks}/ntfy.js`);

new Ntfy("https://ntfy.sh/alerts")
  .tags(["server", "critical"])
  .priority(5)
  .message("Server Down", "Database connection failed")
  .send();
```

### Notification with Action Buttons

```javascript
const Ntfy = require(`${__hooks}/ntfy.js`);

new Ntfy("https://ntfy.sh/deployment")
  .message("Deployment Ready", "Version 1.2.3 is ready to deploy")
  .actionView("View Dashboard", "https://dashboard.example.com", true)
  .actionHTTP("Deploy Now", "https://api.example.com/deploy", true, {
    headers: { Authorization: "Bearer token123" },
    body: { version: "1.2.3" },
  })
  .send();
```

### Reusable Notification Builder

```javascript
const Ntfy = require(`${__hooks}/ntfy.js`);

// Create a base notifier with persistent settings
const alertNotifier = new Ntfy("https://ntfy.sh/alerts").tags([
  "production",
  "monitoring",
]);

// Send multiple notifications with the same base config
alertNotifier.message("Deploy Started", "Version 1.2.3").send();
alertNotifier.message("Deploy Complete", "All services online").send();
alertNotifier.message("Verification Failed!", "Oh no!").send().topic('morepeople').send();
```

### Click Actions (URLs, Maps, Email)

```javascript
const Ntfy = require(`${__hooks}/ntfy.js`);

// Website link
new Ntfy("https://ntfy.sh/mytopic")
  .message("Check this out", "New blog post published")
  .click("https://blog.example.com/new-post")
  .send();

// Maps location
new Ntfy("https://ntfy.sh/location")
  .message("Meeting Location", "Conference room changed")
  .click("geo:0,0?q=1600+Amphitheatre+Parkway,+Mountain+View,+CA")
  .send();

// Email
new Ntfy("https://ntfy.sh/contact")
  .message("Contact Request", "Someone wants to get in touch")
  .click("mailto:contact@example.com")
  .send();
```

## Priority Levels

- `1` - Minimum priority
- `2` - Low priority
- `3` - Default priority (default)
- `4` - High priority
- `5` - Maximum priority

## Method Chaining

All methods (except `reset()`) return the Ntfy instance, allowing for method chaining:

```javascript
const Ntfy = require(`${__hooks}/ntfy.js`);

new Ntfy("https://ntfy.sh/mytopic")
  .tags(["alert", "server"])
  .priority(4)
  .message("Server Alert", "High CPU usage detected")
  .actionView("Check Dashboard", "https://dashboard.example.com")
  .send()
  .topic('myothertopic')
  .priority(3)
  .send();
```

## API Reference

This library implements features from the [ntfy.sh API specification](https://docs.ntfy.sh/publish/).

For complete details on the ntfy service and additional features, see the official documentation at: https://docs.ntfy.sh/publish/

## Contributing

This library currently implements the most commonly used ntfy features. If you need additional functionality from the ntfy API, please:

1. Check the [ntfy.sh API documentation](https://docs.ntfy.sh/publish/) for the feature you need
2. Submit a Pull Request adding the new method(s)
3. Include JSDoc comments and examples for any new methods
4. Update this README with the new functionality

Missing features you might want to contribute:

- Email notifications
- Webhook forwarding
- File attachments
- Scheduled notifications (delay/at parameters)
- Authentication headers
- Custom icons and images

## License

This library is provided as-is for use with PocketBase applications.
