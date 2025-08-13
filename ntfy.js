/**
 * Creates a new Ntfy notification builder instance
 * @constructor
 * @param {string} url - The ntfy server URL (e.g., 'https://ntfy.sh/mytopic')
 * @example
 * const ntfy = new Ntfy('https://ntfy.sh/thisismytopic');
 */
function Ntfy(url) {
  this.config = {
    topic: '',
    tags: [],
    priority: 3,
    title: '',
    message: '',
    actions: []
  };
  const urlParts = url.split('/');
  if (urlParts.length >= 4) {
    this.server = urlParts.slice(0, 3).join('/');
    this.config.topic = urlParts.slice(3).join('/');
  } else {
    this.server = url;
    this.config.topic = '';
  }
}

/**
 * Sends the notification with all configured settings
 * @returns {Ntfy} Returns this instance for method chaining
 * @example
 * // Basic usage
 * ntfy.message('Hello', 'World').send();
 * 
 * // With method chaining
 * ntfy
 *   .tags(['server', 'alert'])
 *   .message('Server Alert', 'High CPU usage detected')
 *   .priority(4)
 *   .actionView('Check Server', 'https://dashboard.example.com')
 *   .send();
 * 
 * // Multiple notifications with persistent tags
 * const alertNtfy = new Ntfy('https://ntfy.sh/alerts').tags(['production']);
 * alertNtfy.message('Deploy Started', 'Version 1.2.3').send();
 * alertNtfy.message('Deploy Complete', 'All services online').send();
 */
Ntfy.prototype.send = function () {
  // Build the notification payload
  var payload = {
    ...this.config
  };

  $http.send({
    url: this.server,
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return this;
};

/**
 * Resets the notification builder to a fresh state with the same URL
 * @returns {Ntfy} Returns a new Ntfy instance with the same URL
 * @example
 * const freshNtfy = ntfy.reset();
 */
Ntfy.prototype.reset = function () {
  return new Ntfy(this.url);
};

/**
 * Adds the tags for the notification
 * @param {string[]} tagArray - Array of tags to apply to the notification
 * @returns {Ntfy} Returns this instance for method chaining
 * @example
 * ntfy.tags(['server', 'alert', 'urgent']);
 */
Ntfy.prototype.tags = function (tagArray) {
  this.config.tags = [tagArray, ...this.config.tags];
  return this;
};

/**
 * Sets the tags for the notification (replace existing tags)
 * @param {string[]} tagArray - Array of tags to apply to the notification
 * @returns {Ntfy} Returns this instance for method chaining
 * @example
 * ntfy.tags(['server', 'alert', 'urgent']);
 */
Ntfy.prototype.setTags = function (tagArray) {
  this.config.tags = tagArray || [];
  return this;
};

/**
 * Sets the message title and body for the notification
 * @param {string} title - The notification title
 * @param {string} body - The notification message body
 * @returns {Ntfy} Returns this instance for method chaining
 * @example
 * ntfy.message('Server Alert', 'Database connection failed');
 */
Ntfy.prototype.message = function (title = "", body = "") {
  this.config.title = title;
  this.config.message = body;
  return this;
};

/**
 * Sets the priority level for the notification (1=min, 3=default, 5=max)
 * @param {number} level - Priority level (1-5)
 * @returns {Ntfy} Returns this instance for method chaining
 * @example
 * ntfy.priority(5); // Maximum priority
 */
Ntfy.prototype.priority = function (level) {
  this.config.priority = level;
  return this;
};

/**
 * Adds a click action for the notification (shorthand for actionView)
 * @param {string} url - The URL to open when notification is clicked
 * @returns {Ntfy} Returns this instance for method chaining
 * @example
 * ntfy.click('https://example.com');
 * ntfy.click('geo:0,0?q=1600+Amphitheatre+Parkway,+Mountain+View,+CA');
 * ntfy.click('mailto:phil@example.com'); 
*/
Ntfy.prototype.click = function (url) {
  this.config.actions.push({
    action: 'view',
    url: url,
    clear: clear || false
  });
  return this;
};


/**
 * Adds a view action button to the notification
 * @param {string} label - The text to display on the action button
 * @param {string} url - The URL to open when the button is clicked
 * @param {boolean} [clear=false] - Whether to clear the notification when action is triggered
 * @returns {Ntfy} Returns this instance for method chaining
 * @example
 * ntfy.actionView('Visit Site', 'https://example.com', true);
 * ntfy.actionView('Maps to Google', 'geo:0,0?q=1600+Amphitheatre+Parkway,+Mountain+View,+CA');
 */
Ntfy.prototype.actionView = function (label, url, clear) {
  this.config.actions.push({
    action: 'view',
    label: label,
    url: url,
    clear: clear || false
  });
  return this;
};

/**
 * Adds an HTTP action button to the notification (like an API call)
 * @param {string} label - The text to display on the action button
 * @param {string} url - The HTTP endpoint to call when the button is clicked
 * @param {boolean} [clear=false] - Whether to clear the notification when action is triggered
 * @returns {Ntfy} Returns this instance for method chaining
 * @example
 * ntfy.actionHTTP('Restart Service', 'https://api.example.com/restart', true);
 * ntfy.actionHTTP('Restart Service with auth', 'https://api.example.com/restart', true, {"headers": {"Authorization": "Bearer zAzsx1sk.."}});
 * ntfy.actionHTTP('with Auth and Body', 'https://api.example.com/restart', true, {"headers": {"Authorization": "Bearer zAzsx1sk.."}, "body": {"force": true}});
 */
Ntfy.prototype.actionHTTP = function (label, url, clear = false, otherParams = {}) {
  this.config.actions.push({
    action: 'http',
    label: label,
    url: url,
    clear: clear || false,
    ...otherParams
  });
  return this;
};

// Export for PocketBase require() usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Ntfy;
}
