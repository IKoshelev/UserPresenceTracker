# UserPresenceTracker
Small browser JS component to track when user is inactive (abscent) for a given amount of time and when he is back. 
Written in TypeScript.

To use it get the download 

<pre><code>/src/UserPresenceTracker.js</code></pre>

and 

<pre><code>
var tracker = new UserPresenceTracker.Tracker(window, onInactive , onActivityResume, timeoutMs, window.$);
</code></pre>

All dependencies are passed throught the constructor.<br/>
window - global window object, will be used for timeout setting and addEventListener's if jQuery isn't present.<br/>
onInactive - a () => void funtion called when specifiend timeoutMs has passed without user activity<br/>
onActivityResume - a () => void function called when user is active again<br/>
timeoutMs - timoeut in milliseconds, if this amount of time passes without user activity - user is considered inactive<br/>
window.$ - jQuery library. If you are using evergreen browsers - code should work without it, for legacy - make sure you pass it.<br/>

<h1>Tesing and development</h1>

Make sure you install global cli tools for Grunt and Karma:
<pre><code>
npm install grunt-cli -g
npm install karma-cli -g
</code></pre>

To launch TypeScript compiler with watch use
<pre><code>
grunt
</code></pre>
If you don't use TypeScript, you can delete .ts files at any moment and continue working with the last .js transpilation result.

To launch unit tests with watch 
<pre><code>
karma start karma.conf.js
karma start karma-no-jQuery.conf.js
</code></pre>
