
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
// Adapted from https://github.com/then/is-promise/blob/master/index.js
// Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
function is_promise(value) {
    return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);
function append(target, node) {
    target.appendChild(node);
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_empty_stylesheet(node) {
    const style_element = element('style');
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_style(node, key, value, important) {
    if (value == null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}

// we need to store the information for multiple documents because a Svelte application could also contain iframes
// https://github.com/sveltejs/svelte/issues/3624
const managed_styles = new Map();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
        rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        managed_styles.forEach(info => {
            const { ownerNode } = info.stylesheet;
            // there is no ownerNode if it runs on jsdom.
            if (ownerNode)
                detach(ownerNode);
        });
        managed_styles.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs#run-time-svelte-ondestroy
 */
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
/**
 * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
 *
 * Component events created with `createEventDispatcher` create a
 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
 * property and can contain any type of data.
 *
 * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
 */
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail, { cancelable });
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
            return !event.defaultPrevented;
        }
        return true;
    };
}
/**
 * Associates an arbitrary `context` object with the current component and the specified `key`
 * and returns that object. The context is then available to children of the component
 * (including slotted content) with `getContext`.
 *
 * Like lifecycle functions, this must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-setcontext
 */
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
    return context;
}
/**
 * Retrieves the context that belongs to the closest parent component with the specified `key`.
 * Must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-getcontext
 */
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush$1);
    }
}
function tick() {
    schedule_update();
    return resolved_promise;
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush$1() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
        return;
    }
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        try {
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
        }
        catch (e) {
            // reset dirty state to not end up in a deadlocked state and then rethrow
            dirty_components.length = 0;
            flushidx = 0;
            throw e;
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 */
function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    const options = { direction: 'in' };
    let config = fn(node, params, options);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            started = true;
            delete_rule(node);
            if (is_function(config)) {
                config = config(options);
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    const options = { direction: 'out' };
    let config = fn(node, params, options);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config(options);
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}

function handle_promise(promise, info) {
    const token = info.token = {};
    function update(type, index, key, value) {
        if (info.token !== token)
            return;
        info.resolved = value;
        let child_ctx = info.ctx;
        if (key !== undefined) {
            child_ctx = child_ctx.slice();
            child_ctx[key] = value;
        }
        const block = type && (info.current = type)(child_ctx);
        let needs_flush = false;
        if (info.block) {
            if (info.blocks) {
                info.blocks.forEach((block, i) => {
                    if (i !== index && block) {
                        group_outros();
                        transition_out(block, 1, 1, () => {
                            if (info.blocks[i] === block) {
                                info.blocks[i] = null;
                            }
                        });
                        check_outros();
                    }
                });
            }
            else {
                info.block.d(1);
            }
            block.c();
            transition_in(block, 1);
            block.m(info.mount(), info.anchor);
            needs_flush = true;
        }
        info.block = block;
        if (info.blocks)
            info.blocks[index] = block;
        if (needs_flush) {
            flush$1();
        }
    }
    if (is_promise(promise)) {
        const current_component = get_current_component();
        promise.then(value => {
            set_current_component(current_component);
            update(info.then, 1, info.value, value);
            set_current_component(null);
        }, error => {
            set_current_component(current_component);
            update(info.catch, 2, info.error, error);
            set_current_component(null);
            if (!info.hasCatch) {
                throw error;
            }
        });
        // if we previously had a then/catch block, destroy it
        if (info.current !== info.pending) {
            update(info.pending, 0);
            return true;
        }
    }
    else {
        if (info.current !== info.then) {
            update(info.then, 1, info.value, promise);
            return true;
        }
        info.resolved = promise;
    }
}
function update_await_block_branch(info, ctx, dirty) {
    const child_ctx = ctx.slice();
    const { resolved } = info;
    if (info.current === info.then) {
        child_ctx[info.value] = resolved;
    }
    if (info.current === info.catch) {
        child_ctx[info.error] = resolved;
    }
    info.block.p(child_ctx, dirty);
}

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
        lookup.delete(block.key);
    });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    const updates = [];
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            // defer updates until all the DOM shuffling is done
            updates.push(() => block.p(child_ctx, dirty));
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error('Cannot have duplicate keys in a keyed each');
        }
        keys.add(key);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        flush_render_callbacks($$.after_update);
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: [],
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush$1();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    if (has_stop_immediate_propagation)
        modifiers.push('stopImmediatePropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
function construct_svelte_component_dev(component, props) {
    const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
    try {
        const instance = new component(props);
        if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
            throw new Error(error_message);
        }
        return instance;
    }
    catch (err) {
        const { message } = err;
        if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
            throw new Error(error_message);
        }
        else {
            throw err;
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier} [start]
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=} start
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0 && stop) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let started = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (started) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        started = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
            // We need to set this to false because callbacks can still happen despite having unsubscribed:
            // Callbacks might already be placed in the queue which doesn't know it should no longer
            // invoke this derived store.
            started = false;
        };
    });
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

var cjs = deepmerge_1;

var deepmerge$1 = /*@__PURE__*/getDefaultExportFromCjs(cjs);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var ErrorKind;
(function (ErrorKind) {
    /** Argument is unclosed (e.g. `{0`) */
    ErrorKind[ErrorKind["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
    /** Argument is empty (e.g. `{}`). */
    ErrorKind[ErrorKind["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
    /** Argument is malformed (e.g. `{foo!}``) */
    ErrorKind[ErrorKind["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
    /** Expect an argument type (e.g. `{foo,}`) */
    ErrorKind[ErrorKind["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
    /** Unsupported argument type (e.g. `{foo,foo}`) */
    ErrorKind[ErrorKind["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
    /** Expect an argument style (e.g. `{foo, number, }`) */
    ErrorKind[ErrorKind["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
    /** The number skeleton is invalid. */
    ErrorKind[ErrorKind["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
    /** The date time skeleton is invalid. */
    ErrorKind[ErrorKind["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
    /** Exepct a number skeleton following the `::` (e.g. `{foo, number, ::}`) */
    ErrorKind[ErrorKind["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
    /** Exepct a date time skeleton following the `::` (e.g. `{foo, date, ::}`) */
    ErrorKind[ErrorKind["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
    /** Unmatched apostrophes in the argument style (e.g. `{foo, number, 'test`) */
    ErrorKind[ErrorKind["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
    /** Missing select argument options (e.g. `{foo, select}`) */
    ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
    /** Expecting an offset value in `plural` or `selectordinal` argument (e.g `{foo, plural, offset}`) */
    ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
    /** Offset value in `plural` or `selectordinal` is invalid (e.g. `{foo, plural, offset: x}`) */
    ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
    /** Expecting a selector in `select` argument (e.g `{foo, select}`) */
    ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
    /** Expecting a selector in `plural` or `selectordinal` argument (e.g `{foo, plural}`) */
    ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
    /** Expecting a message fragment after the `select` selector (e.g. `{foo, select, apple}`) */
    ErrorKind[ErrorKind["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
    /**
     * Expecting a message fragment after the `plural` or `selectordinal` selector
     * (e.g. `{foo, plural, one}`)
     */
    ErrorKind[ErrorKind["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
    /** Selector in `plural` or `selectordinal` is malformed (e.g. `{foo, plural, =x {#}}`) */
    ErrorKind[ErrorKind["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
    /**
     * Duplicate selectors in `plural` or `selectordinal` argument.
     * (e.g. {foo, plural, one {#} one {#}})
     */
    ErrorKind[ErrorKind["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
    /** Duplicate selectors in `select` argument.
     * (e.g. {foo, select, apple {apple} apple {apple}})
     */
    ErrorKind[ErrorKind["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
    /** Plural or select argument option must have `other` clause. */
    ErrorKind[ErrorKind["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
    /** The tag is malformed. (e.g. `<bold!>foo</bold!>) */
    ErrorKind[ErrorKind["INVALID_TAG"] = 23] = "INVALID_TAG";
    /** The tag name is invalid. (e.g. `<123>foo</123>`) */
    ErrorKind[ErrorKind["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
    /** The closing tag does not match the opening tag. (e.g. `<bold>foo</italic>`) */
    ErrorKind[ErrorKind["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
    /** The opening tag has unmatched closing tag. (e.g. `<bold>foo`) */
    ErrorKind[ErrorKind["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
})(ErrorKind || (ErrorKind = {}));

var TYPE;
(function (TYPE) {
    /**
     * Raw text
     */
    TYPE[TYPE["literal"] = 0] = "literal";
    /**
     * Variable w/o any format, e.g `var` in `this is a {var}`
     */
    TYPE[TYPE["argument"] = 1] = "argument";
    /**
     * Variable w/ number format
     */
    TYPE[TYPE["number"] = 2] = "number";
    /**
     * Variable w/ date format
     */
    TYPE[TYPE["date"] = 3] = "date";
    /**
     * Variable w/ time format
     */
    TYPE[TYPE["time"] = 4] = "time";
    /**
     * Variable w/ select format
     */
    TYPE[TYPE["select"] = 5] = "select";
    /**
     * Variable w/ plural format
     */
    TYPE[TYPE["plural"] = 6] = "plural";
    /**
     * Only possible within plural argument.
     * This is the `#` symbol that will be substituted with the count.
     */
    TYPE[TYPE["pound"] = 7] = "pound";
    /**
     * XML-like tag
     */
    TYPE[TYPE["tag"] = 8] = "tag";
})(TYPE || (TYPE = {}));
var SKELETON_TYPE;
(function (SKELETON_TYPE) {
    SKELETON_TYPE[SKELETON_TYPE["number"] = 0] = "number";
    SKELETON_TYPE[SKELETON_TYPE["dateTime"] = 1] = "dateTime";
})(SKELETON_TYPE || (SKELETON_TYPE = {}));
/**
 * Type Guards
 */
function isLiteralElement(el) {
    return el.type === TYPE.literal;
}
function isArgumentElement(el) {
    return el.type === TYPE.argument;
}
function isNumberElement(el) {
    return el.type === TYPE.number;
}
function isDateElement(el) {
    return el.type === TYPE.date;
}
function isTimeElement(el) {
    return el.type === TYPE.time;
}
function isSelectElement(el) {
    return el.type === TYPE.select;
}
function isPluralElement(el) {
    return el.type === TYPE.plural;
}
function isPoundElement(el) {
    return el.type === TYPE.pound;
}
function isTagElement(el) {
    return el.type === TYPE.tag;
}
function isNumberSkeleton(el) {
    return !!(el && typeof el === 'object' && el.type === SKELETON_TYPE.number);
}
function isDateTimeSkeleton(el) {
    return !!(el && typeof el === 'object' && el.type === SKELETON_TYPE.dateTime);
}

// @generated from regex-gen.ts
var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;

/**
 * https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * Credit: https://github.com/caridy/intl-datetimeformat-pattern/blob/master/index.js
 * with some tweaks
 */
var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
/**
 * Parse Date time skeleton into Intl.DateTimeFormatOptions
 * Ref: https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * @public
 * @param skeleton skeleton string
 */
function parseDateTimeSkeleton(skeleton) {
    var result = {};
    skeleton.replace(DATE_TIME_REGEX, function (match) {
        var len = match.length;
        switch (match[0]) {
            // Era
            case 'G':
                result.era = len === 4 ? 'long' : len === 5 ? 'narrow' : 'short';
                break;
            // Year
            case 'y':
                result.year = len === 2 ? '2-digit' : 'numeric';
                break;
            case 'Y':
            case 'u':
            case 'U':
            case 'r':
                throw new RangeError('`Y/u/U/r` (year) patterns are not supported, use `y` instead');
            // Quarter
            case 'q':
            case 'Q':
                throw new RangeError('`q/Q` (quarter) patterns are not supported');
            // Month
            case 'M':
            case 'L':
                result.month = ['numeric', '2-digit', 'short', 'long', 'narrow'][len - 1];
                break;
            // Week
            case 'w':
            case 'W':
                throw new RangeError('`w/W` (week) patterns are not supported');
            case 'd':
                result.day = ['numeric', '2-digit'][len - 1];
                break;
            case 'D':
            case 'F':
            case 'g':
                throw new RangeError('`D/F/g` (day) patterns are not supported, use `d` instead');
            // Weekday
            case 'E':
                result.weekday = len === 4 ? 'long' : len === 5 ? 'narrow' : 'short';
                break;
            case 'e':
                if (len < 4) {
                    throw new RangeError('`e..eee` (weekday) patterns are not supported');
                }
                result.weekday = ['short', 'long', 'narrow', 'short'][len - 4];
                break;
            case 'c':
                if (len < 4) {
                    throw new RangeError('`c..ccc` (weekday) patterns are not supported');
                }
                result.weekday = ['short', 'long', 'narrow', 'short'][len - 4];
                break;
            // Period
            case 'a': // AM, PM
                result.hour12 = true;
                break;
            case 'b': // am, pm, noon, midnight
            case 'B': // flexible day periods
                throw new RangeError('`b/B` (period) patterns are not supported, use `a` instead');
            // Hour
            case 'h':
                result.hourCycle = 'h12';
                result.hour = ['numeric', '2-digit'][len - 1];
                break;
            case 'H':
                result.hourCycle = 'h23';
                result.hour = ['numeric', '2-digit'][len - 1];
                break;
            case 'K':
                result.hourCycle = 'h11';
                result.hour = ['numeric', '2-digit'][len - 1];
                break;
            case 'k':
                result.hourCycle = 'h24';
                result.hour = ['numeric', '2-digit'][len - 1];
                break;
            case 'j':
            case 'J':
            case 'C':
                throw new RangeError('`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead');
            // Minute
            case 'm':
                result.minute = ['numeric', '2-digit'][len - 1];
                break;
            // Second
            case 's':
                result.second = ['numeric', '2-digit'][len - 1];
                break;
            case 'S':
            case 'A':
                throw new RangeError('`S/A` (second) patterns are not supported, use `s` instead');
            // Zone
            case 'z': // 1..3, 4: specific non-location format
                result.timeZoneName = len < 4 ? 'short' : 'long';
                break;
            case 'Z': // 1..3, 4, 5: The ISO8601 varios formats
            case 'O': // 1, 4: milliseconds in day short, long
            case 'v': // 1, 4: generic non-location format
            case 'V': // 1, 2, 3, 4: time zone ID or city
            case 'X': // 1, 2, 3, 4: The ISO8601 varios formats
            case 'x': // 1, 2, 3, 4: The ISO8601 varios formats
                throw new RangeError('`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead');
        }
        return '';
    });
    return result;
}

// @generated from regex-gen.ts
var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;

function parseNumberSkeletonFromString(skeleton) {
    if (skeleton.length === 0) {
        throw new Error('Number skeleton cannot be empty');
    }
    // Parse the skeleton
    var stringTokens = skeleton
        .split(WHITE_SPACE_REGEX)
        .filter(function (x) { return x.length > 0; });
    var tokens = [];
    for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
        var stringToken = stringTokens_1[_i];
        var stemAndOptions = stringToken.split('/');
        if (stemAndOptions.length === 0) {
            throw new Error('Invalid number skeleton');
        }
        var stem = stemAndOptions[0], options = stemAndOptions.slice(1);
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            if (option.length === 0) {
                throw new Error('Invalid number skeleton');
            }
        }
        tokens.push({ stem: stem, options: options });
    }
    return tokens;
}
function icuUnitToEcma(unit) {
    return unit.replace(/^(.*?)-/, '');
}
var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?[rs]?$/g;
var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
function parseSignificantPrecision(str) {
    var result = {};
    if (str[str.length - 1] === 'r') {
        result.roundingPriority = 'morePrecision';
    }
    else if (str[str.length - 1] === 's') {
        result.roundingPriority = 'lessPrecision';
    }
    str.replace(SIGNIFICANT_PRECISION_REGEX, function (_, g1, g2) {
        // @@@ case
        if (typeof g2 !== 'string') {
            result.minimumSignificantDigits = g1.length;
            result.maximumSignificantDigits = g1.length;
        }
        // @@@+ case
        else if (g2 === '+') {
            result.minimumSignificantDigits = g1.length;
        }
        // .### case
        else if (g1[0] === '#') {
            result.maximumSignificantDigits = g1.length;
        }
        // .@@## or .@@@ case
        else {
            result.minimumSignificantDigits = g1.length;
            result.maximumSignificantDigits =
                g1.length + (typeof g2 === 'string' ? g2.length : 0);
        }
        return '';
    });
    return result;
}
function parseSign(str) {
    switch (str) {
        case 'sign-auto':
            return {
                signDisplay: 'auto',
            };
        case 'sign-accounting':
        case '()':
            return {
                currencySign: 'accounting',
            };
        case 'sign-always':
        case '+!':
            return {
                signDisplay: 'always',
            };
        case 'sign-accounting-always':
        case '()!':
            return {
                signDisplay: 'always',
                currencySign: 'accounting',
            };
        case 'sign-except-zero':
        case '+?':
            return {
                signDisplay: 'exceptZero',
            };
        case 'sign-accounting-except-zero':
        case '()?':
            return {
                signDisplay: 'exceptZero',
                currencySign: 'accounting',
            };
        case 'sign-never':
        case '+_':
            return {
                signDisplay: 'never',
            };
    }
}
function parseConciseScientificAndEngineeringStem(stem) {
    // Engineering
    var result;
    if (stem[0] === 'E' && stem[1] === 'E') {
        result = {
            notation: 'engineering',
        };
        stem = stem.slice(2);
    }
    else if (stem[0] === 'E') {
        result = {
            notation: 'scientific',
        };
        stem = stem.slice(1);
    }
    if (result) {
        var signDisplay = stem.slice(0, 2);
        if (signDisplay === '+!') {
            result.signDisplay = 'always';
            stem = stem.slice(2);
        }
        else if (signDisplay === '+?') {
            result.signDisplay = 'exceptZero';
            stem = stem.slice(2);
        }
        if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
            throw new Error('Malformed concise eng/scientific notation');
        }
        result.minimumIntegerDigits = stem.length;
    }
    return result;
}
function parseNotationOptions(opt) {
    var result = {};
    var signOpts = parseSign(opt);
    if (signOpts) {
        return signOpts;
    }
    return result;
}
/**
 * https://github.com/unicode-org/icu/blob/master/docs/userguide/format_parse/numbers/skeletons.md#skeleton-stems-and-options
 */
function parseNumberSkeleton(tokens) {
    var result = {};
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        switch (token.stem) {
            case 'percent':
            case '%':
                result.style = 'percent';
                continue;
            case '%x100':
                result.style = 'percent';
                result.scale = 100;
                continue;
            case 'currency':
                result.style = 'currency';
                result.currency = token.options[0];
                continue;
            case 'group-off':
            case ',_':
                result.useGrouping = false;
                continue;
            case 'precision-integer':
            case '.':
                result.maximumFractionDigits = 0;
                continue;
            case 'measure-unit':
            case 'unit':
                result.style = 'unit';
                result.unit = icuUnitToEcma(token.options[0]);
                continue;
            case 'compact-short':
            case 'K':
                result.notation = 'compact';
                result.compactDisplay = 'short';
                continue;
            case 'compact-long':
            case 'KK':
                result.notation = 'compact';
                result.compactDisplay = 'long';
                continue;
            case 'scientific':
                result = __assign(__assign(__assign({}, result), { notation: 'scientific' }), token.options.reduce(function (all, opt) { return (__assign(__assign({}, all), parseNotationOptions(opt))); }, {}));
                continue;
            case 'engineering':
                result = __assign(__assign(__assign({}, result), { notation: 'engineering' }), token.options.reduce(function (all, opt) { return (__assign(__assign({}, all), parseNotationOptions(opt))); }, {}));
                continue;
            case 'notation-simple':
                result.notation = 'standard';
                continue;
            // https://github.com/unicode-org/icu/blob/master/icu4c/source/i18n/unicode/unumberformatter.h
            case 'unit-width-narrow':
                result.currencyDisplay = 'narrowSymbol';
                result.unitDisplay = 'narrow';
                continue;
            case 'unit-width-short':
                result.currencyDisplay = 'code';
                result.unitDisplay = 'short';
                continue;
            case 'unit-width-full-name':
                result.currencyDisplay = 'name';
                result.unitDisplay = 'long';
                continue;
            case 'unit-width-iso-code':
                result.currencyDisplay = 'symbol';
                continue;
            case 'scale':
                result.scale = parseFloat(token.options[0]);
                continue;
            case 'rounding-mode-floor':
                result.roundingMode = 'floor';
                continue;
            case 'rounding-mode-ceiling':
                result.roundingMode = 'ceil';
                continue;
            case 'rounding-mode-down':
                result.roundingMode = 'trunc';
                continue;
            case 'rounding-mode-up':
                result.roundingMode = 'expand';
                continue;
            case 'rounding-mode-half-even':
                result.roundingMode = 'halfEven';
                continue;
            case 'rounding-mode-half-down':
                result.roundingMode = 'halfTrunc';
                continue;
            case 'rounding-mode-half-up':
                result.roundingMode = 'halfExpand';
                continue;
            // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
            case 'integer-width':
                if (token.options.length > 1) {
                    throw new RangeError('integer-width stems only accept a single optional option');
                }
                token.options[0].replace(INTEGER_WIDTH_REGEX, function (_, g1, g2, g3, g4, g5) {
                    if (g1) {
                        result.minimumIntegerDigits = g2.length;
                    }
                    else if (g3 && g4) {
                        throw new Error('We currently do not support maximum integer digits');
                    }
                    else if (g5) {
                        throw new Error('We currently do not support exact integer digits');
                    }
                    return '';
                });
                continue;
        }
        // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#integer-width
        if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
            result.minimumIntegerDigits = token.stem.length;
            continue;
        }
        if (FRACTION_PRECISION_REGEX.test(token.stem)) {
            // Precision
            // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#fraction-precision
            // precision-integer case
            if (token.options.length > 1) {
                throw new RangeError('Fraction-precision stems only accept a single optional option');
            }
            token.stem.replace(FRACTION_PRECISION_REGEX, function (_, g1, g2, g3, g4, g5) {
                // .000* case (before ICU67 it was .000+)
                if (g2 === '*') {
                    result.minimumFractionDigits = g1.length;
                }
                // .### case
                else if (g3 && g3[0] === '#') {
                    result.maximumFractionDigits = g3.length;
                }
                // .00## case
                else if (g4 && g5) {
                    result.minimumFractionDigits = g4.length;
                    result.maximumFractionDigits = g4.length + g5.length;
                }
                else {
                    result.minimumFractionDigits = g1.length;
                    result.maximumFractionDigits = g1.length;
                }
                return '';
            });
            var opt = token.options[0];
            // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#trailing-zero-display
            if (opt === 'w') {
                result = __assign(__assign({}, result), { trailingZeroDisplay: 'stripIfInteger' });
            }
            else if (opt) {
                result = __assign(__assign({}, result), parseSignificantPrecision(opt));
            }
            continue;
        }
        // https://unicode-org.github.io/icu/userguide/format_parse/numbers/skeletons.html#significant-digits-precision
        if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
            result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
            continue;
        }
        var signOpts = parseSign(token.stem);
        if (signOpts) {
            result = __assign(__assign({}, result), signOpts);
        }
        var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
        if (conciseScientificAndEngineeringOpts) {
            result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
        }
    }
    return result;
}

// @generated from time-data-gen.ts
// prettier-ignore  
var timeData = {
    "001": [
        "H",
        "h"
    ],
    "AC": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "AD": [
        "H",
        "hB"
    ],
    "AE": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "AF": [
        "H",
        "hb",
        "hB",
        "h"
    ],
    "AG": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "AI": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "AL": [
        "h",
        "H",
        "hB"
    ],
    "AM": [
        "H",
        "hB"
    ],
    "AO": [
        "H",
        "hB"
    ],
    "AR": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "AS": [
        "h",
        "H"
    ],
    "AT": [
        "H",
        "hB"
    ],
    "AU": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "AW": [
        "H",
        "hB"
    ],
    "AX": [
        "H"
    ],
    "AZ": [
        "H",
        "hB",
        "h"
    ],
    "BA": [
        "H",
        "hB",
        "h"
    ],
    "BB": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "BD": [
        "h",
        "hB",
        "H"
    ],
    "BE": [
        "H",
        "hB"
    ],
    "BF": [
        "H",
        "hB"
    ],
    "BG": [
        "H",
        "hB",
        "h"
    ],
    "BH": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "BI": [
        "H",
        "h"
    ],
    "BJ": [
        "H",
        "hB"
    ],
    "BL": [
        "H",
        "hB"
    ],
    "BM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "BN": [
        "hb",
        "hB",
        "h",
        "H"
    ],
    "BO": [
        "H",
        "hB",
        "h",
        "hb"
    ],
    "BQ": [
        "H"
    ],
    "BR": [
        "H",
        "hB"
    ],
    "BS": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "BT": [
        "h",
        "H"
    ],
    "BW": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "BY": [
        "H",
        "h"
    ],
    "BZ": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "CA": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "CC": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "CD": [
        "hB",
        "H"
    ],
    "CF": [
        "H",
        "h",
        "hB"
    ],
    "CG": [
        "H",
        "hB"
    ],
    "CH": [
        "H",
        "hB",
        "h"
    ],
    "CI": [
        "H",
        "hB"
    ],
    "CK": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "CL": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "CM": [
        "H",
        "h",
        "hB"
    ],
    "CN": [
        "H",
        "hB",
        "hb",
        "h"
    ],
    "CO": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "CP": [
        "H"
    ],
    "CR": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "CU": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "CV": [
        "H",
        "hB"
    ],
    "CW": [
        "H",
        "hB"
    ],
    "CX": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "CY": [
        "h",
        "H",
        "hb",
        "hB"
    ],
    "CZ": [
        "H"
    ],
    "DE": [
        "H",
        "hB"
    ],
    "DG": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "DJ": [
        "h",
        "H"
    ],
    "DK": [
        "H"
    ],
    "DM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "DO": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "DZ": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "EA": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "EC": [
        "H",
        "hB",
        "h",
        "hb"
    ],
    "EE": [
        "H",
        "hB"
    ],
    "EG": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "EH": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "ER": [
        "h",
        "H"
    ],
    "ES": [
        "H",
        "hB",
        "h",
        "hb"
    ],
    "ET": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "FI": [
        "H"
    ],
    "FJ": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "FK": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "FM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "FO": [
        "H",
        "h"
    ],
    "FR": [
        "H",
        "hB"
    ],
    "GA": [
        "H",
        "hB"
    ],
    "GB": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "GD": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "GE": [
        "H",
        "hB",
        "h"
    ],
    "GF": [
        "H",
        "hB"
    ],
    "GG": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "GH": [
        "h",
        "H"
    ],
    "GI": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "GL": [
        "H",
        "h"
    ],
    "GM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "GN": [
        "H",
        "hB"
    ],
    "GP": [
        "H",
        "hB"
    ],
    "GQ": [
        "H",
        "hB",
        "h",
        "hb"
    ],
    "GR": [
        "h",
        "H",
        "hb",
        "hB"
    ],
    "GT": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "GU": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "GW": [
        "H",
        "hB"
    ],
    "GY": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "HK": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "HN": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "HR": [
        "H",
        "hB"
    ],
    "HU": [
        "H",
        "h"
    ],
    "IC": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "ID": [
        "H"
    ],
    "IE": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "IL": [
        "H",
        "hB"
    ],
    "IM": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "IN": [
        "h",
        "H"
    ],
    "IO": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "IQ": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "IR": [
        "hB",
        "H"
    ],
    "IS": [
        "H"
    ],
    "IT": [
        "H",
        "hB"
    ],
    "JE": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "JM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "JO": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "JP": [
        "H",
        "K",
        "h"
    ],
    "KE": [
        "hB",
        "hb",
        "H",
        "h"
    ],
    "KG": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "KH": [
        "hB",
        "h",
        "H",
        "hb"
    ],
    "KI": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "KM": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "KN": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "KP": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "KR": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "KW": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "KY": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "KZ": [
        "H",
        "hB"
    ],
    "LA": [
        "H",
        "hb",
        "hB",
        "h"
    ],
    "LB": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "LC": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "LI": [
        "H",
        "hB",
        "h"
    ],
    "LK": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "LR": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "LS": [
        "h",
        "H"
    ],
    "LT": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "LU": [
        "H",
        "h",
        "hB"
    ],
    "LV": [
        "H",
        "hB",
        "hb",
        "h"
    ],
    "LY": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "MA": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "MC": [
        "H",
        "hB"
    ],
    "MD": [
        "H",
        "hB"
    ],
    "ME": [
        "H",
        "hB",
        "h"
    ],
    "MF": [
        "H",
        "hB"
    ],
    "MG": [
        "H",
        "h"
    ],
    "MH": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "MK": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "ML": [
        "H"
    ],
    "MM": [
        "hB",
        "hb",
        "H",
        "h"
    ],
    "MN": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "MO": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "MP": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "MQ": [
        "H",
        "hB"
    ],
    "MR": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "MS": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "MT": [
        "H",
        "h"
    ],
    "MU": [
        "H",
        "h"
    ],
    "MV": [
        "H",
        "h"
    ],
    "MW": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "MX": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "MY": [
        "hb",
        "hB",
        "h",
        "H"
    ],
    "MZ": [
        "H",
        "hB"
    ],
    "NA": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "NC": [
        "H",
        "hB"
    ],
    "NE": [
        "H"
    ],
    "NF": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "NG": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "NI": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "NL": [
        "H",
        "hB"
    ],
    "NO": [
        "H",
        "h"
    ],
    "NP": [
        "H",
        "h",
        "hB"
    ],
    "NR": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "NU": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "NZ": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "OM": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "PA": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "PE": [
        "H",
        "hB",
        "h",
        "hb"
    ],
    "PF": [
        "H",
        "h",
        "hB"
    ],
    "PG": [
        "h",
        "H"
    ],
    "PH": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "PK": [
        "h",
        "hB",
        "H"
    ],
    "PL": [
        "H",
        "h"
    ],
    "PM": [
        "H",
        "hB"
    ],
    "PN": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "PR": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "PS": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "PT": [
        "H",
        "hB"
    ],
    "PW": [
        "h",
        "H"
    ],
    "PY": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "QA": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "RE": [
        "H",
        "hB"
    ],
    "RO": [
        "H",
        "hB"
    ],
    "RS": [
        "H",
        "hB",
        "h"
    ],
    "RU": [
        "H"
    ],
    "RW": [
        "H",
        "h"
    ],
    "SA": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "SB": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "SC": [
        "H",
        "h",
        "hB"
    ],
    "SD": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "SE": [
        "H"
    ],
    "SG": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "SH": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "SI": [
        "H",
        "hB"
    ],
    "SJ": [
        "H"
    ],
    "SK": [
        "H"
    ],
    "SL": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "SM": [
        "H",
        "h",
        "hB"
    ],
    "SN": [
        "H",
        "h",
        "hB"
    ],
    "SO": [
        "h",
        "H"
    ],
    "SR": [
        "H",
        "hB"
    ],
    "SS": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "ST": [
        "H",
        "hB"
    ],
    "SV": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "SX": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "SY": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "SZ": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "TA": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "TC": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "TD": [
        "h",
        "H",
        "hB"
    ],
    "TF": [
        "H",
        "h",
        "hB"
    ],
    "TG": [
        "H",
        "hB"
    ],
    "TH": [
        "H",
        "h"
    ],
    "TJ": [
        "H",
        "h"
    ],
    "TL": [
        "H",
        "hB",
        "hb",
        "h"
    ],
    "TM": [
        "H",
        "h"
    ],
    "TN": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "TO": [
        "h",
        "H"
    ],
    "TR": [
        "H",
        "hB"
    ],
    "TT": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "TW": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "TZ": [
        "hB",
        "hb",
        "H",
        "h"
    ],
    "UA": [
        "H",
        "hB",
        "h"
    ],
    "UG": [
        "hB",
        "hb",
        "H",
        "h"
    ],
    "UM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "US": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "UY": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "UZ": [
        "H",
        "hB",
        "h"
    ],
    "VA": [
        "H",
        "h",
        "hB"
    ],
    "VC": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "VE": [
        "h",
        "H",
        "hB",
        "hb"
    ],
    "VG": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "VI": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "VN": [
        "H",
        "h"
    ],
    "VU": [
        "h",
        "H"
    ],
    "WF": [
        "H",
        "hB"
    ],
    "WS": [
        "h",
        "H"
    ],
    "XK": [
        "H",
        "hB",
        "h"
    ],
    "YE": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "YT": [
        "H",
        "hB"
    ],
    "ZA": [
        "H",
        "h",
        "hb",
        "hB"
    ],
    "ZM": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "ZW": [
        "H",
        "h"
    ],
    "af-ZA": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "ar-001": [
        "h",
        "hB",
        "hb",
        "H"
    ],
    "ca-ES": [
        "H",
        "h",
        "hB"
    ],
    "en-001": [
        "h",
        "hb",
        "H",
        "hB"
    ],
    "es-BO": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "es-BR": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "es-EC": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "es-ES": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "es-GQ": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "es-PE": [
        "H",
        "h",
        "hB",
        "hb"
    ],
    "fr-CA": [
        "H",
        "h",
        "hB"
    ],
    "gl-ES": [
        "H",
        "h",
        "hB"
    ],
    "gu-IN": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "hi-IN": [
        "hB",
        "h",
        "H"
    ],
    "it-CH": [
        "H",
        "h",
        "hB"
    ],
    "it-IT": [
        "H",
        "h",
        "hB"
    ],
    "kn-IN": [
        "hB",
        "h",
        "H"
    ],
    "ml-IN": [
        "hB",
        "h",
        "H"
    ],
    "mr-IN": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "pa-IN": [
        "hB",
        "hb",
        "h",
        "H"
    ],
    "ta-IN": [
        "hB",
        "h",
        "hb",
        "H"
    ],
    "te-IN": [
        "hB",
        "h",
        "H"
    ],
    "zu-ZA": [
        "H",
        "hB",
        "hb",
        "h"
    ]
};

/**
 * Returns the best matching date time pattern if a date time skeleton
 * pattern is provided with a locale. Follows the Unicode specification:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#table-mapping-requested-time-skeletons-to-patterns
 * @param skeleton date time skeleton pattern that possibly includes j, J or C
 * @param locale
 */
function getBestPattern(skeleton, locale) {
    var skeletonCopy = '';
    for (var patternPos = 0; patternPos < skeleton.length; patternPos++) {
        var patternChar = skeleton.charAt(patternPos);
        if (patternChar === 'j') {
            var extraLength = 0;
            while (patternPos + 1 < skeleton.length &&
                skeleton.charAt(patternPos + 1) === patternChar) {
                extraLength++;
                patternPos++;
            }
            var hourLen = 1 + (extraLength & 1);
            var dayPeriodLen = extraLength < 2 ? 1 : 3 + (extraLength >> 1);
            var dayPeriodChar = 'a';
            var hourChar = getDefaultHourSymbolFromLocale(locale);
            if (hourChar == 'H' || hourChar == 'k') {
                dayPeriodLen = 0;
            }
            while (dayPeriodLen-- > 0) {
                skeletonCopy += dayPeriodChar;
            }
            while (hourLen-- > 0) {
                skeletonCopy = hourChar + skeletonCopy;
            }
        }
        else if (patternChar === 'J') {
            skeletonCopy += 'H';
        }
        else {
            skeletonCopy += patternChar;
        }
    }
    return skeletonCopy;
}
/**
 * Maps the [hour cycle type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/hourCycle)
 * of the given `locale` to the corresponding time pattern.
 * @param locale
 */
function getDefaultHourSymbolFromLocale(locale) {
    var hourCycle = locale.hourCycle;
    if (hourCycle === undefined &&
        // @ts-ignore hourCycle(s) is not identified yet
        locale.hourCycles &&
        // @ts-ignore
        locale.hourCycles.length) {
        // @ts-ignore
        hourCycle = locale.hourCycles[0];
    }
    if (hourCycle) {
        switch (hourCycle) {
            case 'h24':
                return 'k';
            case 'h23':
                return 'H';
            case 'h12':
                return 'h';
            case 'h11':
                return 'K';
            default:
                throw new Error('Invalid hourCycle');
        }
    }
    // TODO: Once hourCycle is fully supported remove the following with data generation
    var languageTag = locale.language;
    var regionTag;
    if (languageTag !== 'root') {
        regionTag = locale.maximize().region;
    }
    var hourCycles = timeData[regionTag || ''] ||
        timeData[languageTag || ''] ||
        timeData["".concat(languageTag, "-001")] ||
        timeData['001'];
    return hourCycles[0];
}

var _a;
var SPACE_SEPARATOR_START_REGEX = new RegExp("^".concat(SPACE_SEPARATOR_REGEX.source, "*"));
var SPACE_SEPARATOR_END_REGEX = new RegExp("".concat(SPACE_SEPARATOR_REGEX.source, "*$"));
function createLocation(start, end) {
    return { start: start, end: end };
}
// #region Ponyfills
// Consolidate these variables up top for easier toggling during debugging
var hasNativeStartsWith = !!String.prototype.startsWith && '_a'.startsWith('a', 1);
var hasNativeFromCodePoint = !!String.fromCodePoint;
var hasNativeFromEntries = !!Object.fromEntries;
var hasNativeCodePointAt = !!String.prototype.codePointAt;
var hasTrimStart = !!String.prototype.trimStart;
var hasTrimEnd = !!String.prototype.trimEnd;
var hasNativeIsSafeInteger = !!Number.isSafeInteger;
var isSafeInteger = hasNativeIsSafeInteger
    ? Number.isSafeInteger
    : function (n) {
        return (typeof n === 'number' &&
            isFinite(n) &&
            Math.floor(n) === n &&
            Math.abs(n) <= 0x1fffffffffffff);
    };
// IE11 does not support y and u.
var REGEX_SUPPORTS_U_AND_Y = true;
try {
    var re = RE('([^\\p{White_Space}\\p{Pattern_Syntax}]*)', 'yu');
    /**
     * legacy Edge or Xbox One browser
     * Unicode flag support: supported
     * Pattern_Syntax support: not supported
     * See https://github.com/formatjs/formatjs/issues/2822
     */
    REGEX_SUPPORTS_U_AND_Y = ((_a = re.exec('a')) === null || _a === void 0 ? void 0 : _a[0]) === 'a';
}
catch (_) {
    REGEX_SUPPORTS_U_AND_Y = false;
}
var startsWith = hasNativeStartsWith
    ? // Native
        function startsWith(s, search, position) {
            return s.startsWith(search, position);
        }
    : // For IE11
        function startsWith(s, search, position) {
            return s.slice(position, position + search.length) === search;
        };
var fromCodePoint = hasNativeFromCodePoint
    ? String.fromCodePoint
    : // IE11
        function fromCodePoint() {
            var codePoints = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                codePoints[_i] = arguments[_i];
            }
            var elements = '';
            var length = codePoints.length;
            var i = 0;
            var code;
            while (length > i) {
                code = codePoints[i++];
                if (code > 0x10ffff)
                    throw RangeError(code + ' is not a valid code point');
                elements +=
                    code < 0x10000
                        ? String.fromCharCode(code)
                        : String.fromCharCode(((code -= 0x10000) >> 10) + 0xd800, (code % 0x400) + 0xdc00);
            }
            return elements;
        };
var fromEntries = 
// native
hasNativeFromEntries
    ? Object.fromEntries
    : // Ponyfill
        function fromEntries(entries) {
            var obj = {};
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var _a = entries_1[_i], k = _a[0], v = _a[1];
                obj[k] = v;
            }
            return obj;
        };
var codePointAt$1 = hasNativeCodePointAt
    ? // Native
        function codePointAt(s, index) {
            return s.codePointAt(index);
        }
    : // IE 11
        function codePointAt(s, index) {
            var size = s.length;
            if (index < 0 || index >= size) {
                return undefined;
            }
            var first = s.charCodeAt(index);
            var second;
            return first < 0xd800 ||
                first > 0xdbff ||
                index + 1 === size ||
                (second = s.charCodeAt(index + 1)) < 0xdc00 ||
                second > 0xdfff
                ? first
                : ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
        };
var trimStart = hasTrimStart
    ? // Native
        function trimStart(s) {
            return s.trimStart();
        }
    : // Ponyfill
        function trimStart(s) {
            return s.replace(SPACE_SEPARATOR_START_REGEX, '');
        };
var trimEnd = hasTrimEnd
    ? // Native
        function trimEnd(s) {
            return s.trimEnd();
        }
    : // Ponyfill
        function trimEnd(s) {
            return s.replace(SPACE_SEPARATOR_END_REGEX, '');
        };
// Prevent minifier to translate new RegExp to literal form that might cause syntax error on IE11.
function RE(s, flag) {
    return new RegExp(s, flag);
}
// #endregion
var matchIdentifierAtIndex;
if (REGEX_SUPPORTS_U_AND_Y) {
    // Native
    var IDENTIFIER_PREFIX_RE_1 = RE('([^\\p{White_Space}\\p{Pattern_Syntax}]*)', 'yu');
    matchIdentifierAtIndex = function matchIdentifierAtIndex(s, index) {
        var _a;
        IDENTIFIER_PREFIX_RE_1.lastIndex = index;
        var match = IDENTIFIER_PREFIX_RE_1.exec(s);
        return (_a = match[1]) !== null && _a !== void 0 ? _a : '';
    };
}
else {
    // IE11
    matchIdentifierAtIndex = function matchIdentifierAtIndex(s, index) {
        var match = [];
        while (true) {
            var c = codePointAt$1(s, index);
            if (c === undefined || _isWhiteSpace(c) || _isPatternSyntax(c)) {
                break;
            }
            match.push(c);
            index += c >= 0x10000 ? 2 : 1;
        }
        return fromCodePoint.apply(void 0, match);
    };
}
var Parser = /** @class */ (function () {
    function Parser(message, options) {
        if (options === void 0) { options = {}; }
        this.message = message;
        this.position = { offset: 0, line: 1, column: 1 };
        this.ignoreTag = !!options.ignoreTag;
        this.locale = options.locale;
        this.requiresOtherClause = !!options.requiresOtherClause;
        this.shouldParseSkeletons = !!options.shouldParseSkeletons;
    }
    Parser.prototype.parse = function () {
        if (this.offset() !== 0) {
            throw Error('parser can only be used once');
        }
        return this.parseMessage(0, '', false);
    };
    Parser.prototype.parseMessage = function (nestingLevel, parentArgType, expectingCloseTag) {
        var elements = [];
        while (!this.isEOF()) {
            var char = this.char();
            if (char === 123 /* `{` */) {
                var result = this.parseArgument(nestingLevel, expectingCloseTag);
                if (result.err) {
                    return result;
                }
                elements.push(result.val);
            }
            else if (char === 125 /* `}` */ && nestingLevel > 0) {
                break;
            }
            else if (char === 35 /* `#` */ &&
                (parentArgType === 'plural' || parentArgType === 'selectordinal')) {
                var position = this.clonePosition();
                this.bump();
                elements.push({
                    type: TYPE.pound,
                    location: createLocation(position, this.clonePosition()),
                });
            }
            else if (char === 60 /* `<` */ &&
                !this.ignoreTag &&
                this.peek() === 47 // char code for '/'
            ) {
                if (expectingCloseTag) {
                    break;
                }
                else {
                    return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
                }
            }
            else if (char === 60 /* `<` */ &&
                !this.ignoreTag &&
                _isAlpha(this.peek() || 0)) {
                var result = this.parseTag(nestingLevel, parentArgType);
                if (result.err) {
                    return result;
                }
                elements.push(result.val);
            }
            else {
                var result = this.parseLiteral(nestingLevel, parentArgType);
                if (result.err) {
                    return result;
                }
                elements.push(result.val);
            }
        }
        return { val: elements, err: null };
    };
    /**
     * A tag name must start with an ASCII lower/upper case letter. The grammar is based on the
     * [custom element name][] except that a dash is NOT always mandatory and uppercase letters
     * are accepted:
     *
     * ```
     * tag ::= "<" tagName (whitespace)* "/>" | "<" tagName (whitespace)* ">" message "</" tagName (whitespace)* ">"
     * tagName ::= [a-z] (PENChar)*
     * PENChar ::=
     *     "-" | "." | [0-9] | "_" | [a-z] | [A-Z] | #xB7 | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x37D] |
     *     [#x37F-#x1FFF] | [#x200C-#x200D] | [#x203F-#x2040] | [#x2070-#x218F] | [#x2C00-#x2FEF] |
     *     [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
     * ```
     *
     * [custom element name]: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
     * NOTE: We're a bit more lax here since HTML technically does not allow uppercase HTML element but we do
     * since other tag-based engines like React allow it
     */
    Parser.prototype.parseTag = function (nestingLevel, parentArgType) {
        var startPosition = this.clonePosition();
        this.bump(); // `<`
        var tagName = this.parseTagName();
        this.bumpSpace();
        if (this.bumpIf('/>')) {
            // Self closing tag
            return {
                val: {
                    type: TYPE.literal,
                    value: "<".concat(tagName, "/>"),
                    location: createLocation(startPosition, this.clonePosition()),
                },
                err: null,
            };
        }
        else if (this.bumpIf('>')) {
            var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
            if (childrenResult.err) {
                return childrenResult;
            }
            var children = childrenResult.val;
            // Expecting a close tag
            var endTagStartPosition = this.clonePosition();
            if (this.bumpIf('</')) {
                if (this.isEOF() || !_isAlpha(this.char())) {
                    return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
                }
                var closingTagNameStartPosition = this.clonePosition();
                var closingTagName = this.parseTagName();
                if (tagName !== closingTagName) {
                    return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
                }
                this.bumpSpace();
                if (!this.bumpIf('>')) {
                    return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
                }
                return {
                    val: {
                        type: TYPE.tag,
                        value: tagName,
                        children: children,
                        location: createLocation(startPosition, this.clonePosition()),
                    },
                    err: null,
                };
            }
            else {
                return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
            }
        }
        else {
            return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
        }
    };
    /**
     * This method assumes that the caller has peeked ahead for the first tag character.
     */
    Parser.prototype.parseTagName = function () {
        var startOffset = this.offset();
        this.bump(); // the first tag name character
        while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
            this.bump();
        }
        return this.message.slice(startOffset, this.offset());
    };
    Parser.prototype.parseLiteral = function (nestingLevel, parentArgType) {
        var start = this.clonePosition();
        var value = '';
        while (true) {
            var parseQuoteResult = this.tryParseQuote(parentArgType);
            if (parseQuoteResult) {
                value += parseQuoteResult;
                continue;
            }
            var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
            if (parseUnquotedResult) {
                value += parseUnquotedResult;
                continue;
            }
            var parseLeftAngleResult = this.tryParseLeftAngleBracket();
            if (parseLeftAngleResult) {
                value += parseLeftAngleResult;
                continue;
            }
            break;
        }
        var location = createLocation(start, this.clonePosition());
        return {
            val: { type: TYPE.literal, value: value, location: location },
            err: null,
        };
    };
    Parser.prototype.tryParseLeftAngleBracket = function () {
        if (!this.isEOF() &&
            this.char() === 60 /* `<` */ &&
            (this.ignoreTag ||
                // If at the opening tag or closing tag position, bail.
                !_isAlphaOrSlash(this.peek() || 0))) {
            this.bump(); // `<`
            return '<';
        }
        return null;
    };
    /**
     * Starting with ICU 4.8, an ASCII apostrophe only starts quoted text if it immediately precedes
     * a character that requires quoting (that is, "only where needed"), and works the same in
     * nested messages as on the top level of the pattern. The new behavior is otherwise compatible.
     */
    Parser.prototype.tryParseQuote = function (parentArgType) {
        if (this.isEOF() || this.char() !== 39 /* `'` */) {
            return null;
        }
        // Parse escaped char following the apostrophe, or early return if there is no escaped char.
        // Check if is valid escaped character
        switch (this.peek()) {
            case 39 /* `'` */:
                // double quote, should return as a single quote.
                this.bump();
                this.bump();
                return "'";
            // '{', '<', '>', '}'
            case 123:
            case 60:
            case 62:
            case 125:
                break;
            case 35: // '#'
                if (parentArgType === 'plural' || parentArgType === 'selectordinal') {
                    break;
                }
                return null;
            default:
                return null;
        }
        this.bump(); // apostrophe
        var codePoints = [this.char()]; // escaped char
        this.bump();
        // read chars until the optional closing apostrophe is found
        while (!this.isEOF()) {
            var ch = this.char();
            if (ch === 39 /* `'` */) {
                if (this.peek() === 39 /* `'` */) {
                    codePoints.push(39);
                    // Bump one more time because we need to skip 2 characters.
                    this.bump();
                }
                else {
                    // Optional closing apostrophe.
                    this.bump();
                    break;
                }
            }
            else {
                codePoints.push(ch);
            }
            this.bump();
        }
        return fromCodePoint.apply(void 0, codePoints);
    };
    Parser.prototype.tryParseUnquoted = function (nestingLevel, parentArgType) {
        if (this.isEOF()) {
            return null;
        }
        var ch = this.char();
        if (ch === 60 /* `<` */ ||
            ch === 123 /* `{` */ ||
            (ch === 35 /* `#` */ &&
                (parentArgType === 'plural' || parentArgType === 'selectordinal')) ||
            (ch === 125 /* `}` */ && nestingLevel > 0)) {
            return null;
        }
        else {
            this.bump();
            return fromCodePoint(ch);
        }
    };
    Parser.prototype.parseArgument = function (nestingLevel, expectingCloseTag) {
        var openingBracePosition = this.clonePosition();
        this.bump(); // `{`
        this.bumpSpace();
        if (this.isEOF()) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
        }
        if (this.char() === 125 /* `}` */) {
            this.bump();
            return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
        }
        // argument name
        var value = this.parseIdentifierIfPossible().value;
        if (!value) {
            return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
        }
        this.bumpSpace();
        if (this.isEOF()) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
        }
        switch (this.char()) {
            // Simple argument: `{name}`
            case 125 /* `}` */: {
                this.bump(); // `}`
                return {
                    val: {
                        type: TYPE.argument,
                        // value does not include the opening and closing braces.
                        value: value,
                        location: createLocation(openingBracePosition, this.clonePosition()),
                    },
                    err: null,
                };
            }
            // Argument with options: `{name, format, ...}`
            case 44 /* `,` */: {
                this.bump(); // `,`
                this.bumpSpace();
                if (this.isEOF()) {
                    return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
                }
                return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
            }
            default:
                return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
        }
    };
    /**
     * Advance the parser until the end of the identifier, if it is currently on
     * an identifier character. Return an empty string otherwise.
     */
    Parser.prototype.parseIdentifierIfPossible = function () {
        var startingPosition = this.clonePosition();
        var startOffset = this.offset();
        var value = matchIdentifierAtIndex(this.message, startOffset);
        var endOffset = startOffset + value.length;
        this.bumpTo(endOffset);
        var endPosition = this.clonePosition();
        var location = createLocation(startingPosition, endPosition);
        return { value: value, location: location };
    };
    Parser.prototype.parseArgumentOptions = function (nestingLevel, expectingCloseTag, value, openingBracePosition) {
        var _a;
        // Parse this range:
        // {name, type, style}
        //        ^---^
        var typeStartPosition = this.clonePosition();
        var argType = this.parseIdentifierIfPossible().value;
        var typeEndPosition = this.clonePosition();
        switch (argType) {
            case '':
                // Expecting a style string number, date, time, plural, selectordinal, or select.
                return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
            case 'number':
            case 'date':
            case 'time': {
                // Parse this range:
                // {name, number, style}
                //              ^-------^
                this.bumpSpace();
                var styleAndLocation = null;
                if (this.bumpIf(',')) {
                    this.bumpSpace();
                    var styleStartPosition = this.clonePosition();
                    var result = this.parseSimpleArgStyleIfPossible();
                    if (result.err) {
                        return result;
                    }
                    var style = trimEnd(result.val);
                    if (style.length === 0) {
                        return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
                    }
                    var styleLocation = createLocation(styleStartPosition, this.clonePosition());
                    styleAndLocation = { style: style, styleLocation: styleLocation };
                }
                var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                if (argCloseResult.err) {
                    return argCloseResult;
                }
                var location_1 = createLocation(openingBracePosition, this.clonePosition());
                // Extract style or skeleton
                if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, '::', 0)) {
                    // Skeleton starts with `::`.
                    var skeleton = trimStart(styleAndLocation.style.slice(2));
                    if (argType === 'number') {
                        var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
                        if (result.err) {
                            return result;
                        }
                        return {
                            val: { type: TYPE.number, value: value, location: location_1, style: result.val },
                            err: null,
                        };
                    }
                    else {
                        if (skeleton.length === 0) {
                            return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
                        }
                        var dateTimePattern = skeleton;
                        // Get "best match" pattern only if locale is passed, if not, let it
                        // pass as-is where `parseDateTimeSkeleton()` will throw an error
                        // for unsupported patterns.
                        if (this.locale) {
                            dateTimePattern = getBestPattern(skeleton, this.locale);
                        }
                        var style = {
                            type: SKELETON_TYPE.dateTime,
                            pattern: dateTimePattern,
                            location: styleAndLocation.styleLocation,
                            parsedOptions: this.shouldParseSkeletons
                                ? parseDateTimeSkeleton(dateTimePattern)
                                : {},
                        };
                        var type = argType === 'date' ? TYPE.date : TYPE.time;
                        return {
                            val: { type: type, value: value, location: location_1, style: style },
                            err: null,
                        };
                    }
                }
                // Regular style or no style.
                return {
                    val: {
                        type: argType === 'number'
                            ? TYPE.number
                            : argType === 'date'
                                ? TYPE.date
                                : TYPE.time,
                        value: value,
                        location: location_1,
                        style: (_a = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a !== void 0 ? _a : null,
                    },
                    err: null,
                };
            }
            case 'plural':
            case 'selectordinal':
            case 'select': {
                // Parse this range:
                // {name, plural, options}
                //              ^---------^
                var typeEndPosition_1 = this.clonePosition();
                this.bumpSpace();
                if (!this.bumpIf(',')) {
                    return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
                }
                this.bumpSpace();
                // Parse offset:
                // {name, plural, offset:1, options}
                //                ^-----^
                //
                // or the first option:
                //
                // {name, plural, one {...} other {...}}
                //                ^--^
                var identifierAndLocation = this.parseIdentifierIfPossible();
                var pluralOffset = 0;
                if (argType !== 'select' && identifierAndLocation.value === 'offset') {
                    if (!this.bumpIf(':')) {
                        return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
                    }
                    this.bumpSpace();
                    var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
                    if (result.err) {
                        return result;
                    }
                    // Parse another identifier for option parsing
                    this.bumpSpace();
                    identifierAndLocation = this.parseIdentifierIfPossible();
                    pluralOffset = result.val;
                }
                var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
                if (optionsResult.err) {
                    return optionsResult;
                }
                var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
                if (argCloseResult.err) {
                    return argCloseResult;
                }
                var location_2 = createLocation(openingBracePosition, this.clonePosition());
                if (argType === 'select') {
                    return {
                        val: {
                            type: TYPE.select,
                            value: value,
                            options: fromEntries(optionsResult.val),
                            location: location_2,
                        },
                        err: null,
                    };
                }
                else {
                    return {
                        val: {
                            type: TYPE.plural,
                            value: value,
                            options: fromEntries(optionsResult.val),
                            offset: pluralOffset,
                            pluralType: argType === 'plural' ? 'cardinal' : 'ordinal',
                            location: location_2,
                        },
                        err: null,
                    };
                }
            }
            default:
                return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
        }
    };
    Parser.prototype.tryParseArgumentClose = function (openingBracePosition) {
        // Parse: {value, number, ::currency/GBP }
        //
        if (this.isEOF() || this.char() !== 125 /* `}` */) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
        }
        this.bump(); // `}`
        return { val: true, err: null };
    };
    /**
     * See: https://github.com/unicode-org/icu/blob/af7ed1f6d2298013dc303628438ec4abe1f16479/icu4c/source/common/messagepattern.cpp#L659
     */
    Parser.prototype.parseSimpleArgStyleIfPossible = function () {
        var nestedBraces = 0;
        var startPosition = this.clonePosition();
        while (!this.isEOF()) {
            var ch = this.char();
            switch (ch) {
                case 39 /* `'` */: {
                    // Treat apostrophe as quoting but include it in the style part.
                    // Find the end of the quoted literal text.
                    this.bump();
                    var apostrophePosition = this.clonePosition();
                    if (!this.bumpUntil("'")) {
                        return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
                    }
                    this.bump();
                    break;
                }
                case 123 /* `{` */: {
                    nestedBraces += 1;
                    this.bump();
                    break;
                }
                case 125 /* `}` */: {
                    if (nestedBraces > 0) {
                        nestedBraces -= 1;
                    }
                    else {
                        return {
                            val: this.message.slice(startPosition.offset, this.offset()),
                            err: null,
                        };
                    }
                    break;
                }
                default:
                    this.bump();
                    break;
            }
        }
        return {
            val: this.message.slice(startPosition.offset, this.offset()),
            err: null,
        };
    };
    Parser.prototype.parseNumberSkeletonFromString = function (skeleton, location) {
        var tokens = [];
        try {
            tokens = parseNumberSkeletonFromString(skeleton);
        }
        catch (e) {
            return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location);
        }
        return {
            val: {
                type: SKELETON_TYPE.number,
                tokens: tokens,
                location: location,
                parsedOptions: this.shouldParseSkeletons
                    ? parseNumberSkeleton(tokens)
                    : {},
            },
            err: null,
        };
    };
    /**
     * @param nesting_level The current nesting level of messages.
     *     This can be positive when parsing message fragment in select or plural argument options.
     * @param parent_arg_type The parent argument's type.
     * @param parsed_first_identifier If provided, this is the first identifier-like selector of
     *     the argument. It is a by-product of a previous parsing attempt.
     * @param expecting_close_tag If true, this message is directly or indirectly nested inside
     *     between a pair of opening and closing tags. The nested message will not parse beyond
     *     the closing tag boundary.
     */
    Parser.prototype.tryParsePluralOrSelectOptions = function (nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
        var _a;
        var hasOtherClause = false;
        var options = [];
        var parsedSelectors = new Set();
        var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
        // Parse:
        // one {one apple}
        // ^--^
        while (true) {
            if (selector.length === 0) {
                var startPosition = this.clonePosition();
                if (parentArgType !== 'select' && this.bumpIf('=')) {
                    // Try parse `={number}` selector
                    var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
                    if (result.err) {
                        return result;
                    }
                    selectorLocation = createLocation(startPosition, this.clonePosition());
                    selector = this.message.slice(startPosition.offset, this.offset());
                }
                else {
                    break;
                }
            }
            // Duplicate selector clauses
            if (parsedSelectors.has(selector)) {
                return this.error(parentArgType === 'select'
                    ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR
                    : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
            }
            if (selector === 'other') {
                hasOtherClause = true;
            }
            // Parse:
            // one {one apple}
            //     ^----------^
            this.bumpSpace();
            var openingBracePosition = this.clonePosition();
            if (!this.bumpIf('{')) {
                return this.error(parentArgType === 'select'
                    ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT
                    : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
            }
            var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
            if (fragmentResult.err) {
                return fragmentResult;
            }
            var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
            if (argCloseResult.err) {
                return argCloseResult;
            }
            options.push([
                selector,
                {
                    value: fragmentResult.val,
                    location: createLocation(openingBracePosition, this.clonePosition()),
                },
            ]);
            // Keep track of the existing selectors
            parsedSelectors.add(selector);
            // Prep next selector clause.
            this.bumpSpace();
            (_a = this.parseIdentifierIfPossible(), selector = _a.value, selectorLocation = _a.location);
        }
        if (options.length === 0) {
            return this.error(parentArgType === 'select'
                ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR
                : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
        }
        if (this.requiresOtherClause && !hasOtherClause) {
            return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
        }
        return { val: options, err: null };
    };
    Parser.prototype.tryParseDecimalInteger = function (expectNumberError, invalidNumberError) {
        var sign = 1;
        var startingPosition = this.clonePosition();
        if (this.bumpIf('+')) ;
        else if (this.bumpIf('-')) {
            sign = -1;
        }
        var hasDigits = false;
        var decimal = 0;
        while (!this.isEOF()) {
            var ch = this.char();
            if (ch >= 48 /* `0` */ && ch <= 57 /* `9` */) {
                hasDigits = true;
                decimal = decimal * 10 + (ch - 48);
                this.bump();
            }
            else {
                break;
            }
        }
        var location = createLocation(startingPosition, this.clonePosition());
        if (!hasDigits) {
            return this.error(expectNumberError, location);
        }
        decimal *= sign;
        if (!isSafeInteger(decimal)) {
            return this.error(invalidNumberError, location);
        }
        return { val: decimal, err: null };
    };
    Parser.prototype.offset = function () {
        return this.position.offset;
    };
    Parser.prototype.isEOF = function () {
        return this.offset() === this.message.length;
    };
    Parser.prototype.clonePosition = function () {
        // This is much faster than `Object.assign` or spread.
        return {
            offset: this.position.offset,
            line: this.position.line,
            column: this.position.column,
        };
    };
    /**
     * Return the code point at the current position of the parser.
     * Throws if the index is out of bound.
     */
    Parser.prototype.char = function () {
        var offset = this.position.offset;
        if (offset >= this.message.length) {
            throw Error('out of bound');
        }
        var code = codePointAt$1(this.message, offset);
        if (code === undefined) {
            throw Error("Offset ".concat(offset, " is at invalid UTF-16 code unit boundary"));
        }
        return code;
    };
    Parser.prototype.error = function (kind, location) {
        return {
            val: null,
            err: {
                kind: kind,
                message: this.message,
                location: location,
            },
        };
    };
    /** Bump the parser to the next UTF-16 code unit. */
    Parser.prototype.bump = function () {
        if (this.isEOF()) {
            return;
        }
        var code = this.char();
        if (code === 10 /* '\n' */) {
            this.position.line += 1;
            this.position.column = 1;
            this.position.offset += 1;
        }
        else {
            this.position.column += 1;
            // 0 ~ 0x10000 -> unicode BMP, otherwise skip the surrogate pair.
            this.position.offset += code < 0x10000 ? 1 : 2;
        }
    };
    /**
     * If the substring starting at the current position of the parser has
     * the given prefix, then bump the parser to the character immediately
     * following the prefix and return true. Otherwise, don't bump the parser
     * and return false.
     */
    Parser.prototype.bumpIf = function (prefix) {
        if (startsWith(this.message, prefix, this.offset())) {
            for (var i = 0; i < prefix.length; i++) {
                this.bump();
            }
            return true;
        }
        return false;
    };
    /**
     * Bump the parser until the pattern character is found and return `true`.
     * Otherwise bump to the end of the file and return `false`.
     */
    Parser.prototype.bumpUntil = function (pattern) {
        var currentOffset = this.offset();
        var index = this.message.indexOf(pattern, currentOffset);
        if (index >= 0) {
            this.bumpTo(index);
            return true;
        }
        else {
            this.bumpTo(this.message.length);
            return false;
        }
    };
    /**
     * Bump the parser to the target offset.
     * If target offset is beyond the end of the input, bump the parser to the end of the input.
     */
    Parser.prototype.bumpTo = function (targetOffset) {
        if (this.offset() > targetOffset) {
            throw Error("targetOffset ".concat(targetOffset, " must be greater than or equal to the current offset ").concat(this.offset()));
        }
        targetOffset = Math.min(targetOffset, this.message.length);
        while (true) {
            var offset = this.offset();
            if (offset === targetOffset) {
                break;
            }
            if (offset > targetOffset) {
                throw Error("targetOffset ".concat(targetOffset, " is at invalid UTF-16 code unit boundary"));
            }
            this.bump();
            if (this.isEOF()) {
                break;
            }
        }
    };
    /** advance the parser through all whitespace to the next non-whitespace code unit. */
    Parser.prototype.bumpSpace = function () {
        while (!this.isEOF() && _isWhiteSpace(this.char())) {
            this.bump();
        }
    };
    /**
     * Peek at the *next* Unicode codepoint in the input without advancing the parser.
     * If the input has been exhausted, then this returns null.
     */
    Parser.prototype.peek = function () {
        if (this.isEOF()) {
            return null;
        }
        var code = this.char();
        var offset = this.offset();
        var nextCode = this.message.charCodeAt(offset + (code >= 0x10000 ? 2 : 1));
        return nextCode !== null && nextCode !== void 0 ? nextCode : null;
    };
    return Parser;
}());
/**
 * This check if codepoint is alphabet (lower & uppercase)
 * @param codepoint
 * @returns
 */
function _isAlpha(codepoint) {
    return ((codepoint >= 97 && codepoint <= 122) ||
        (codepoint >= 65 && codepoint <= 90));
}
function _isAlphaOrSlash(codepoint) {
    return _isAlpha(codepoint) || codepoint === 47; /* '/' */
}
/** See `parseTag` function docs. */
function _isPotentialElementNameChar(c) {
    return (c === 45 /* '-' */ ||
        c === 46 /* '.' */ ||
        (c >= 48 && c <= 57) /* 0..9 */ ||
        c === 95 /* '_' */ ||
        (c >= 97 && c <= 122) /** a..z */ ||
        (c >= 65 && c <= 90) /* A..Z */ ||
        c == 0xb7 ||
        (c >= 0xc0 && c <= 0xd6) ||
        (c >= 0xd8 && c <= 0xf6) ||
        (c >= 0xf8 && c <= 0x37d) ||
        (c >= 0x37f && c <= 0x1fff) ||
        (c >= 0x200c && c <= 0x200d) ||
        (c >= 0x203f && c <= 0x2040) ||
        (c >= 0x2070 && c <= 0x218f) ||
        (c >= 0x2c00 && c <= 0x2fef) ||
        (c >= 0x3001 && c <= 0xd7ff) ||
        (c >= 0xf900 && c <= 0xfdcf) ||
        (c >= 0xfdf0 && c <= 0xfffd) ||
        (c >= 0x10000 && c <= 0xeffff));
}
/**
 * Code point equivalent of regex `\p{White_Space}`.
 * From: https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
 */
function _isWhiteSpace(c) {
    return ((c >= 0x0009 && c <= 0x000d) ||
        c === 0x0020 ||
        c === 0x0085 ||
        (c >= 0x200e && c <= 0x200f) ||
        c === 0x2028 ||
        c === 0x2029);
}
/**
 * Code point equivalent of regex `\p{Pattern_Syntax}`.
 * See https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
 */
function _isPatternSyntax(c) {
    return ((c >= 0x0021 && c <= 0x0023) ||
        c === 0x0024 ||
        (c >= 0x0025 && c <= 0x0027) ||
        c === 0x0028 ||
        c === 0x0029 ||
        c === 0x002a ||
        c === 0x002b ||
        c === 0x002c ||
        c === 0x002d ||
        (c >= 0x002e && c <= 0x002f) ||
        (c >= 0x003a && c <= 0x003b) ||
        (c >= 0x003c && c <= 0x003e) ||
        (c >= 0x003f && c <= 0x0040) ||
        c === 0x005b ||
        c === 0x005c ||
        c === 0x005d ||
        c === 0x005e ||
        c === 0x0060 ||
        c === 0x007b ||
        c === 0x007c ||
        c === 0x007d ||
        c === 0x007e ||
        c === 0x00a1 ||
        (c >= 0x00a2 && c <= 0x00a5) ||
        c === 0x00a6 ||
        c === 0x00a7 ||
        c === 0x00a9 ||
        c === 0x00ab ||
        c === 0x00ac ||
        c === 0x00ae ||
        c === 0x00b0 ||
        c === 0x00b1 ||
        c === 0x00b6 ||
        c === 0x00bb ||
        c === 0x00bf ||
        c === 0x00d7 ||
        c === 0x00f7 ||
        (c >= 0x2010 && c <= 0x2015) ||
        (c >= 0x2016 && c <= 0x2017) ||
        c === 0x2018 ||
        c === 0x2019 ||
        c === 0x201a ||
        (c >= 0x201b && c <= 0x201c) ||
        c === 0x201d ||
        c === 0x201e ||
        c === 0x201f ||
        (c >= 0x2020 && c <= 0x2027) ||
        (c >= 0x2030 && c <= 0x2038) ||
        c === 0x2039 ||
        c === 0x203a ||
        (c >= 0x203b && c <= 0x203e) ||
        (c >= 0x2041 && c <= 0x2043) ||
        c === 0x2044 ||
        c === 0x2045 ||
        c === 0x2046 ||
        (c >= 0x2047 && c <= 0x2051) ||
        c === 0x2052 ||
        c === 0x2053 ||
        (c >= 0x2055 && c <= 0x205e) ||
        (c >= 0x2190 && c <= 0x2194) ||
        (c >= 0x2195 && c <= 0x2199) ||
        (c >= 0x219a && c <= 0x219b) ||
        (c >= 0x219c && c <= 0x219f) ||
        c === 0x21a0 ||
        (c >= 0x21a1 && c <= 0x21a2) ||
        c === 0x21a3 ||
        (c >= 0x21a4 && c <= 0x21a5) ||
        c === 0x21a6 ||
        (c >= 0x21a7 && c <= 0x21ad) ||
        c === 0x21ae ||
        (c >= 0x21af && c <= 0x21cd) ||
        (c >= 0x21ce && c <= 0x21cf) ||
        (c >= 0x21d0 && c <= 0x21d1) ||
        c === 0x21d2 ||
        c === 0x21d3 ||
        c === 0x21d4 ||
        (c >= 0x21d5 && c <= 0x21f3) ||
        (c >= 0x21f4 && c <= 0x22ff) ||
        (c >= 0x2300 && c <= 0x2307) ||
        c === 0x2308 ||
        c === 0x2309 ||
        c === 0x230a ||
        c === 0x230b ||
        (c >= 0x230c && c <= 0x231f) ||
        (c >= 0x2320 && c <= 0x2321) ||
        (c >= 0x2322 && c <= 0x2328) ||
        c === 0x2329 ||
        c === 0x232a ||
        (c >= 0x232b && c <= 0x237b) ||
        c === 0x237c ||
        (c >= 0x237d && c <= 0x239a) ||
        (c >= 0x239b && c <= 0x23b3) ||
        (c >= 0x23b4 && c <= 0x23db) ||
        (c >= 0x23dc && c <= 0x23e1) ||
        (c >= 0x23e2 && c <= 0x2426) ||
        (c >= 0x2427 && c <= 0x243f) ||
        (c >= 0x2440 && c <= 0x244a) ||
        (c >= 0x244b && c <= 0x245f) ||
        (c >= 0x2500 && c <= 0x25b6) ||
        c === 0x25b7 ||
        (c >= 0x25b8 && c <= 0x25c0) ||
        c === 0x25c1 ||
        (c >= 0x25c2 && c <= 0x25f7) ||
        (c >= 0x25f8 && c <= 0x25ff) ||
        (c >= 0x2600 && c <= 0x266e) ||
        c === 0x266f ||
        (c >= 0x2670 && c <= 0x2767) ||
        c === 0x2768 ||
        c === 0x2769 ||
        c === 0x276a ||
        c === 0x276b ||
        c === 0x276c ||
        c === 0x276d ||
        c === 0x276e ||
        c === 0x276f ||
        c === 0x2770 ||
        c === 0x2771 ||
        c === 0x2772 ||
        c === 0x2773 ||
        c === 0x2774 ||
        c === 0x2775 ||
        (c >= 0x2794 && c <= 0x27bf) ||
        (c >= 0x27c0 && c <= 0x27c4) ||
        c === 0x27c5 ||
        c === 0x27c6 ||
        (c >= 0x27c7 && c <= 0x27e5) ||
        c === 0x27e6 ||
        c === 0x27e7 ||
        c === 0x27e8 ||
        c === 0x27e9 ||
        c === 0x27ea ||
        c === 0x27eb ||
        c === 0x27ec ||
        c === 0x27ed ||
        c === 0x27ee ||
        c === 0x27ef ||
        (c >= 0x27f0 && c <= 0x27ff) ||
        (c >= 0x2800 && c <= 0x28ff) ||
        (c >= 0x2900 && c <= 0x2982) ||
        c === 0x2983 ||
        c === 0x2984 ||
        c === 0x2985 ||
        c === 0x2986 ||
        c === 0x2987 ||
        c === 0x2988 ||
        c === 0x2989 ||
        c === 0x298a ||
        c === 0x298b ||
        c === 0x298c ||
        c === 0x298d ||
        c === 0x298e ||
        c === 0x298f ||
        c === 0x2990 ||
        c === 0x2991 ||
        c === 0x2992 ||
        c === 0x2993 ||
        c === 0x2994 ||
        c === 0x2995 ||
        c === 0x2996 ||
        c === 0x2997 ||
        c === 0x2998 ||
        (c >= 0x2999 && c <= 0x29d7) ||
        c === 0x29d8 ||
        c === 0x29d9 ||
        c === 0x29da ||
        c === 0x29db ||
        (c >= 0x29dc && c <= 0x29fb) ||
        c === 0x29fc ||
        c === 0x29fd ||
        (c >= 0x29fe && c <= 0x2aff) ||
        (c >= 0x2b00 && c <= 0x2b2f) ||
        (c >= 0x2b30 && c <= 0x2b44) ||
        (c >= 0x2b45 && c <= 0x2b46) ||
        (c >= 0x2b47 && c <= 0x2b4c) ||
        (c >= 0x2b4d && c <= 0x2b73) ||
        (c >= 0x2b74 && c <= 0x2b75) ||
        (c >= 0x2b76 && c <= 0x2b95) ||
        c === 0x2b96 ||
        (c >= 0x2b97 && c <= 0x2bff) ||
        (c >= 0x2e00 && c <= 0x2e01) ||
        c === 0x2e02 ||
        c === 0x2e03 ||
        c === 0x2e04 ||
        c === 0x2e05 ||
        (c >= 0x2e06 && c <= 0x2e08) ||
        c === 0x2e09 ||
        c === 0x2e0a ||
        c === 0x2e0b ||
        c === 0x2e0c ||
        c === 0x2e0d ||
        (c >= 0x2e0e && c <= 0x2e16) ||
        c === 0x2e17 ||
        (c >= 0x2e18 && c <= 0x2e19) ||
        c === 0x2e1a ||
        c === 0x2e1b ||
        c === 0x2e1c ||
        c === 0x2e1d ||
        (c >= 0x2e1e && c <= 0x2e1f) ||
        c === 0x2e20 ||
        c === 0x2e21 ||
        c === 0x2e22 ||
        c === 0x2e23 ||
        c === 0x2e24 ||
        c === 0x2e25 ||
        c === 0x2e26 ||
        c === 0x2e27 ||
        c === 0x2e28 ||
        c === 0x2e29 ||
        (c >= 0x2e2a && c <= 0x2e2e) ||
        c === 0x2e2f ||
        (c >= 0x2e30 && c <= 0x2e39) ||
        (c >= 0x2e3a && c <= 0x2e3b) ||
        (c >= 0x2e3c && c <= 0x2e3f) ||
        c === 0x2e40 ||
        c === 0x2e41 ||
        c === 0x2e42 ||
        (c >= 0x2e43 && c <= 0x2e4f) ||
        (c >= 0x2e50 && c <= 0x2e51) ||
        c === 0x2e52 ||
        (c >= 0x2e53 && c <= 0x2e7f) ||
        (c >= 0x3001 && c <= 0x3003) ||
        c === 0x3008 ||
        c === 0x3009 ||
        c === 0x300a ||
        c === 0x300b ||
        c === 0x300c ||
        c === 0x300d ||
        c === 0x300e ||
        c === 0x300f ||
        c === 0x3010 ||
        c === 0x3011 ||
        (c >= 0x3012 && c <= 0x3013) ||
        c === 0x3014 ||
        c === 0x3015 ||
        c === 0x3016 ||
        c === 0x3017 ||
        c === 0x3018 ||
        c === 0x3019 ||
        c === 0x301a ||
        c === 0x301b ||
        c === 0x301c ||
        c === 0x301d ||
        (c >= 0x301e && c <= 0x301f) ||
        c === 0x3020 ||
        c === 0x3030 ||
        c === 0xfd3e ||
        c === 0xfd3f ||
        (c >= 0xfe45 && c <= 0xfe46));
}

function pruneLocation(els) {
    els.forEach(function (el) {
        delete el.location;
        if (isSelectElement(el) || isPluralElement(el)) {
            for (var k in el.options) {
                delete el.options[k].location;
                pruneLocation(el.options[k].value);
            }
        }
        else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
            delete el.style.location;
        }
        else if ((isDateElement(el) || isTimeElement(el)) &&
            isDateTimeSkeleton(el.style)) {
            delete el.style.location;
        }
        else if (isTagElement(el)) {
            pruneLocation(el.children);
        }
    });
}
function parse(message, opts) {
    if (opts === void 0) { opts = {}; }
    opts = __assign({ shouldParseSkeletons: true, requiresOtherClause: true }, opts);
    var result = new Parser(message, opts).parse();
    if (result.err) {
        var error = SyntaxError(ErrorKind[result.err.kind]);
        // @ts-expect-error Assign to error object
        error.location = result.err.location;
        // @ts-expect-error Assign to error object
        error.originalMessage = result.err.message;
        throw error;
    }
    if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
        pruneLocation(result.val);
    }
    return result.val;
}

//
// Main
//
function memoize(fn, options) {
    var cache = options && options.cache ? options.cache : cacheDefault;
    var serializer = options && options.serializer ? options.serializer : serializerDefault;
    var strategy = options && options.strategy ? options.strategy : strategyDefault;
    return strategy(fn, {
        cache: cache,
        serializer: serializer,
    });
}
//
// Strategy
//
function isPrimitive(value) {
    return (value == null || typeof value === 'number' || typeof value === 'boolean'); // || typeof value === "string" 'unsafe' primitive for our needs
}
function monadic(fn, cache, serializer, arg) {
    var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === 'undefined') {
        computedValue = fn.call(this, arg);
        cache.set(cacheKey, computedValue);
    }
    return computedValue;
}
function variadic(fn, cache, serializer) {
    var args = Array.prototype.slice.call(arguments, 3);
    var cacheKey = serializer(args);
    var computedValue = cache.get(cacheKey);
    if (typeof computedValue === 'undefined') {
        computedValue = fn.apply(this, args);
        cache.set(cacheKey, computedValue);
    }
    return computedValue;
}
function assemble(fn, context, strategy, cache, serialize) {
    return strategy.bind(context, fn, cache, serialize);
}
function strategyDefault(fn, options) {
    var strategy = fn.length === 1 ? monadic : variadic;
    return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function strategyVariadic(fn, options) {
    return assemble(fn, this, variadic, options.cache.create(), options.serializer);
}
function strategyMonadic(fn, options) {
    return assemble(fn, this, monadic, options.cache.create(), options.serializer);
}
//
// Serializer
//
var serializerDefault = function () {
    return JSON.stringify(arguments);
};
//
// Cache
//
function ObjectWithoutPrototypeCache() {
    this.cache = Object.create(null);
}
ObjectWithoutPrototypeCache.prototype.get = function (key) {
    return this.cache[key];
};
ObjectWithoutPrototypeCache.prototype.set = function (key, value) {
    this.cache[key] = value;
};
var cacheDefault = {
    create: function create() {
        // @ts-ignore
        return new ObjectWithoutPrototypeCache();
    },
};
var strategies = {
    variadic: strategyVariadic,
    monadic: strategyMonadic,
};

var ErrorCode;
(function (ErrorCode) {
    // When we have a placeholder but no value to format
    ErrorCode["MISSING_VALUE"] = "MISSING_VALUE";
    // When value supplied is invalid
    ErrorCode["INVALID_VALUE"] = "INVALID_VALUE";
    // When we need specific Intl API but it's not available
    ErrorCode["MISSING_INTL_API"] = "MISSING_INTL_API";
})(ErrorCode || (ErrorCode = {}));
var FormatError = /** @class */ (function (_super) {
    __extends(FormatError, _super);
    function FormatError(msg, code, originalMessage) {
        var _this = _super.call(this, msg) || this;
        _this.code = code;
        _this.originalMessage = originalMessage;
        return _this;
    }
    FormatError.prototype.toString = function () {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
    };
    return FormatError;
}(Error));
var InvalidValueError = /** @class */ (function (_super) {
    __extends(InvalidValueError, _super);
    function InvalidValueError(variableId, value, options, originalMessage) {
        return _super.call(this, "Invalid values for \"".concat(variableId, "\": \"").concat(value, "\". Options are \"").concat(Object.keys(options).join('", "'), "\""), ErrorCode.INVALID_VALUE, originalMessage) || this;
    }
    return InvalidValueError;
}(FormatError));
var InvalidValueTypeError = /** @class */ (function (_super) {
    __extends(InvalidValueTypeError, _super);
    function InvalidValueTypeError(value, type, originalMessage) {
        return _super.call(this, "Value for \"".concat(value, "\" must be of type ").concat(type), ErrorCode.INVALID_VALUE, originalMessage) || this;
    }
    return InvalidValueTypeError;
}(FormatError));
var MissingValueError = /** @class */ (function (_super) {
    __extends(MissingValueError, _super);
    function MissingValueError(variableId, originalMessage) {
        return _super.call(this, "The intl string context variable \"".concat(variableId, "\" was not provided to the string \"").concat(originalMessage, "\""), ErrorCode.MISSING_VALUE, originalMessage) || this;
    }
    return MissingValueError;
}(FormatError));

var PART_TYPE;
(function (PART_TYPE) {
    PART_TYPE[PART_TYPE["literal"] = 0] = "literal";
    PART_TYPE[PART_TYPE["object"] = 1] = "object";
})(PART_TYPE || (PART_TYPE = {}));
function mergeLiteral(parts) {
    if (parts.length < 2) {
        return parts;
    }
    return parts.reduce(function (all, part) {
        var lastPart = all[all.length - 1];
        if (!lastPart ||
            lastPart.type !== PART_TYPE.literal ||
            part.type !== PART_TYPE.literal) {
            all.push(part);
        }
        else {
            lastPart.value += part.value;
        }
        return all;
    }, []);
}
function isFormatXMLElementFn(el) {
    return typeof el === 'function';
}
// TODO(skeleton): add skeleton support
function formatToParts(els, locales, formatters, formats, values, currentPluralValue, 
// For debugging
originalMessage) {
    // Hot path for straight simple msg translations
    if (els.length === 1 && isLiteralElement(els[0])) {
        return [
            {
                type: PART_TYPE.literal,
                value: els[0].value,
            },
        ];
    }
    var result = [];
    for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
        var el = els_1[_i];
        // Exit early for string parts.
        if (isLiteralElement(el)) {
            result.push({
                type: PART_TYPE.literal,
                value: el.value,
            });
            continue;
        }
        // TODO: should this part be literal type?
        // Replace `#` in plural rules with the actual numeric value.
        if (isPoundElement(el)) {
            if (typeof currentPluralValue === 'number') {
                result.push({
                    type: PART_TYPE.literal,
                    value: formatters.getNumberFormat(locales).format(currentPluralValue),
                });
            }
            continue;
        }
        var varName = el.value;
        // Enforce that all required values are provided by the caller.
        if (!(values && varName in values)) {
            throw new MissingValueError(varName, originalMessage);
        }
        var value = values[varName];
        if (isArgumentElement(el)) {
            if (!value || typeof value === 'string' || typeof value === 'number') {
                value =
                    typeof value === 'string' || typeof value === 'number'
                        ? String(value)
                        : '';
            }
            result.push({
                type: typeof value === 'string' ? PART_TYPE.literal : PART_TYPE.object,
                value: value,
            });
            continue;
        }
        // Recursively format plural and select parts' option — which can be a
        // nested pattern structure. The choosing of the option to use is
        // abstracted-by and delegated-to the part helper object.
        if (isDateElement(el)) {
            var style = typeof el.style === 'string'
                ? formats.date[el.style]
                : isDateTimeSkeleton(el.style)
                    ? el.style.parsedOptions
                    : undefined;
            result.push({
                type: PART_TYPE.literal,
                value: formatters
                    .getDateTimeFormat(locales, style)
                    .format(value),
            });
            continue;
        }
        if (isTimeElement(el)) {
            var style = typeof el.style === 'string'
                ? formats.time[el.style]
                : isDateTimeSkeleton(el.style)
                    ? el.style.parsedOptions
                    : formats.time.medium;
            result.push({
                type: PART_TYPE.literal,
                value: formatters
                    .getDateTimeFormat(locales, style)
                    .format(value),
            });
            continue;
        }
        if (isNumberElement(el)) {
            var style = typeof el.style === 'string'
                ? formats.number[el.style]
                : isNumberSkeleton(el.style)
                    ? el.style.parsedOptions
                    : undefined;
            if (style && style.scale) {
                value =
                    value *
                        (style.scale || 1);
            }
            result.push({
                type: PART_TYPE.literal,
                value: formatters
                    .getNumberFormat(locales, style)
                    .format(value),
            });
            continue;
        }
        if (isTagElement(el)) {
            var children = el.children, value_1 = el.value;
            var formatFn = values[value_1];
            if (!isFormatXMLElementFn(formatFn)) {
                throw new InvalidValueTypeError(value_1, 'function', originalMessage);
            }
            var parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
            var chunks = formatFn(parts.map(function (p) { return p.value; }));
            if (!Array.isArray(chunks)) {
                chunks = [chunks];
            }
            result.push.apply(result, chunks.map(function (c) {
                return {
                    type: typeof c === 'string' ? PART_TYPE.literal : PART_TYPE.object,
                    value: c,
                };
            }));
        }
        if (isSelectElement(el)) {
            var opt = el.options[value] || el.options.other;
            if (!opt) {
                throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
            }
            result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values));
            continue;
        }
        if (isPluralElement(el)) {
            var opt = el.options["=".concat(value)];
            if (!opt) {
                if (!Intl.PluralRules) {
                    throw new FormatError("Intl.PluralRules is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-pluralrules\"\n", ErrorCode.MISSING_INTL_API, originalMessage);
                }
                var rule = formatters
                    .getPluralRules(locales, { type: el.pluralType })
                    .select(value - (el.offset || 0));
                opt = el.options[rule] || el.options.other;
            }
            if (!opt) {
                throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
            }
            result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
            continue;
        }
    }
    return mergeLiteral(result);
}

/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/
// -- MessageFormat --------------------------------------------------------
function mergeConfig(c1, c2) {
    if (!c2) {
        return c1;
    }
    return __assign(__assign(__assign({}, (c1 || {})), (c2 || {})), Object.keys(c1).reduce(function (all, k) {
        all[k] = __assign(__assign({}, c1[k]), (c2[k] || {}));
        return all;
    }, {}));
}
function mergeConfigs(defaultConfig, configs) {
    if (!configs) {
        return defaultConfig;
    }
    return Object.keys(defaultConfig).reduce(function (all, k) {
        all[k] = mergeConfig(defaultConfig[k], configs[k]);
        return all;
    }, __assign({}, defaultConfig));
}
function createFastMemoizeCache(store) {
    return {
        create: function () {
            return {
                get: function (key) {
                    return store[key];
                },
                set: function (key, value) {
                    store[key] = value;
                },
            };
        },
    };
}
function createDefaultFormatters(cache) {
    if (cache === void 0) { cache = {
        number: {},
        dateTime: {},
        pluralRules: {},
    }; }
    return {
        getNumberFormat: memoize(function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new ((_a = Intl.NumberFormat).bind.apply(_a, __spreadArray([void 0], args, false)))();
        }, {
            cache: createFastMemoizeCache(cache.number),
            strategy: strategies.variadic,
        }),
        getDateTimeFormat: memoize(function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new ((_a = Intl.DateTimeFormat).bind.apply(_a, __spreadArray([void 0], args, false)))();
        }, {
            cache: createFastMemoizeCache(cache.dateTime),
            strategy: strategies.variadic,
        }),
        getPluralRules: memoize(function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new ((_a = Intl.PluralRules).bind.apply(_a, __spreadArray([void 0], args, false)))();
        }, {
            cache: createFastMemoizeCache(cache.pluralRules),
            strategy: strategies.variadic,
        }),
    };
}
var IntlMessageFormat = /** @class */ (function () {
    function IntlMessageFormat(message, locales, overrideFormats, opts) {
        var _this = this;
        if (locales === void 0) { locales = IntlMessageFormat.defaultLocale; }
        this.formatterCache = {
            number: {},
            dateTime: {},
            pluralRules: {},
        };
        this.format = function (values) {
            var parts = _this.formatToParts(values);
            // Hot path for straight simple msg translations
            if (parts.length === 1) {
                return parts[0].value;
            }
            var result = parts.reduce(function (all, part) {
                if (!all.length ||
                    part.type !== PART_TYPE.literal ||
                    typeof all[all.length - 1] !== 'string') {
                    all.push(part.value);
                }
                else {
                    all[all.length - 1] += part.value;
                }
                return all;
            }, []);
            if (result.length <= 1) {
                return result[0] || '';
            }
            return result;
        };
        this.formatToParts = function (values) {
            return formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, undefined, _this.message);
        };
        this.resolvedOptions = function () {
            var _a;
            return ({
                locale: ((_a = _this.resolvedLocale) === null || _a === void 0 ? void 0 : _a.toString()) ||
                    Intl.NumberFormat.supportedLocalesOf(_this.locales)[0],
            });
        };
        this.getAst = function () { return _this.ast; };
        // Defined first because it's used to build the format pattern.
        this.locales = locales;
        this.resolvedLocale = IntlMessageFormat.resolveLocale(locales);
        if (typeof message === 'string') {
            this.message = message;
            if (!IntlMessageFormat.__parse) {
                throw new TypeError('IntlMessageFormat.__parse must be set to process `message` of type `string`');
            }
            var _a = opts || {}; _a.formatters; var parseOpts = __rest(_a, ["formatters"]);
            // Parse string messages into an AST.
            this.ast = IntlMessageFormat.__parse(message, __assign(__assign({}, parseOpts), { locale: this.resolvedLocale }));
        }
        else {
            this.ast = message;
        }
        if (!Array.isArray(this.ast)) {
            throw new TypeError('A message must be provided as a String or AST.');
        }
        // Creates a new object with the specified `formats` merged with the default
        // formats.
        this.formats = mergeConfigs(IntlMessageFormat.formats, overrideFormats);
        this.formatters =
            (opts && opts.formatters) || createDefaultFormatters(this.formatterCache);
    }
    Object.defineProperty(IntlMessageFormat, "defaultLocale", {
        get: function () {
            if (!IntlMessageFormat.memoizedDefaultLocale) {
                IntlMessageFormat.memoizedDefaultLocale =
                    new Intl.NumberFormat().resolvedOptions().locale;
            }
            return IntlMessageFormat.memoizedDefaultLocale;
        },
        enumerable: false,
        configurable: true
    });
    IntlMessageFormat.memoizedDefaultLocale = null;
    IntlMessageFormat.resolveLocale = function (locales) {
        if (typeof Intl.Locale === 'undefined') {
            return;
        }
        var supportedLocales = Intl.NumberFormat.supportedLocalesOf(locales);
        if (supportedLocales.length > 0) {
            return new Intl.Locale(supportedLocales[0]);
        }
        return new Intl.Locale(typeof locales === 'string' ? locales : locales[0]);
    };
    IntlMessageFormat.__parse = parse;
    // Default format options used as the prototype of the `formats` provided to the
    // constructor. These are used when constructing the internal Intl.NumberFormat
    // and Intl.DateTimeFormat instances.
    IntlMessageFormat.formats = {
        number: {
            integer: {
                maximumFractionDigits: 0,
            },
            currency: {
                style: 'currency',
            },
            percent: {
                style: 'percent',
            },
        },
        date: {
            short: {
                month: 'numeric',
                day: 'numeric',
                year: '2-digit',
            },
            medium: {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            },
            long: {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            },
            full: {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            },
        },
        time: {
            short: {
                hour: 'numeric',
                minute: 'numeric',
            },
            medium: {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            },
            long: {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short',
            },
            full: {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short',
            },
        },
    };
    return IntlMessageFormat;
}());

function delve(obj, fullKey) {
  if (fullKey == null)
    return void 0;
  if (fullKey in obj) {
    return obj[fullKey];
  }
  const keys = fullKey.split(".");
  let result = obj;
  for (let p = 0; p < keys.length; p++) {
    if (typeof result === "object") {
      if (p > 0) {
        const partialKey = keys.slice(p, keys.length).join(".");
        if (partialKey in result) {
          result = result[partialKey];
          break;
        }
      }
      result = result[keys[p]];
    } else {
      result = void 0;
    }
  }
  return result;
}

const lookupCache = {};
const addToCache = (path, locale, message) => {
  if (!message)
    return message;
  if (!(locale in lookupCache))
    lookupCache[locale] = {};
  if (!(path in lookupCache[locale]))
    lookupCache[locale][path] = message;
  return message;
};
const lookup = (path, refLocale) => {
  if (refLocale == null)
    return void 0;
  if (refLocale in lookupCache && path in lookupCache[refLocale]) {
    return lookupCache[refLocale][path];
  }
  const locales = getPossibleLocales(refLocale);
  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];
    const message = getMessageFromDictionary(locale, path);
    if (message) {
      return addToCache(path, refLocale, message);
    }
  }
  return void 0;
};

let dictionary;
const $dictionary = writable({});
function getLocaleDictionary(locale) {
  return dictionary[locale] || null;
}
function hasLocaleDictionary(locale) {
  return locale in dictionary;
}
function getMessageFromDictionary(locale, id) {
  if (!hasLocaleDictionary(locale)) {
    return null;
  }
  const localeDictionary = getLocaleDictionary(locale);
  const match = delve(localeDictionary, id);
  return match;
}
function getClosestAvailableLocale(refLocale) {
  if (refLocale == null)
    return void 0;
  const relatedLocales = getPossibleLocales(refLocale);
  for (let i = 0; i < relatedLocales.length; i++) {
    const locale = relatedLocales[i];
    if (hasLocaleDictionary(locale)) {
      return locale;
    }
  }
  return void 0;
}
function addMessages(locale, ...partials) {
  delete lookupCache[locale];
  $dictionary.update((d) => {
    d[locale] = deepmerge$1.all([d[locale] || {}, ...partials]);
    return d;
  });
}
derived(
  [$dictionary],
  ([dictionary2]) => Object.keys(dictionary2)
);
$dictionary.subscribe((newDictionary) => dictionary = newDictionary);

const queue = {};
function createLocaleQueue(locale) {
  queue[locale] = /* @__PURE__ */ new Set();
}
function removeLoaderFromQueue(locale, loader) {
  queue[locale].delete(loader);
  if (queue[locale].size === 0) {
    delete queue[locale];
  }
}
function getLocaleQueue(locale) {
  return queue[locale];
}
function getLocalesQueues(locale) {
  return getPossibleLocales(locale).map((localeItem) => {
    const localeQueue = getLocaleQueue(localeItem);
    return [localeItem, localeQueue ? [...localeQueue] : []];
  }).filter(([, localeQueue]) => localeQueue.length > 0);
}
function hasLocaleQueue(locale) {
  if (locale == null)
    return false;
  return getPossibleLocales(locale).some(
    (localeQueue) => {
      var _a;
      return (_a = getLocaleQueue(localeQueue)) == null ? void 0 : _a.size;
    }
  );
}
function loadLocaleQueue(locale, localeQueue) {
  const allLoadersPromise = Promise.all(
    localeQueue.map((loader) => {
      removeLoaderFromQueue(locale, loader);
      return loader().then((partial) => partial.default || partial);
    })
  );
  return allLoadersPromise.then((partials) => addMessages(locale, ...partials));
}
const activeFlushes = {};
function flush(locale) {
  if (!hasLocaleQueue(locale)) {
    if (locale in activeFlushes) {
      return activeFlushes[locale];
    }
    return Promise.resolve();
  }
  const queues = getLocalesQueues(locale);
  activeFlushes[locale] = Promise.all(
    queues.map(
      ([localeName, localeQueue]) => loadLocaleQueue(localeName, localeQueue)
    )
  ).then(() => {
    if (hasLocaleQueue(locale)) {
      return flush(locale);
    }
    delete activeFlushes[locale];
  });
  return activeFlushes[locale];
}
function registerLocaleLoader(locale, loader) {
  if (!getLocaleQueue(locale))
    createLocaleQueue(locale);
  const localeQueue = getLocaleQueue(locale);
  if (getLocaleQueue(locale).has(loader))
    return;
  if (!hasLocaleDictionary(locale)) {
    $dictionary.update((d) => {
      d[locale] = {};
      return d;
    });
  }
  localeQueue.add(loader);
}

var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __objRest$1 = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const defaultFormats = {
  number: {
    scientific: { notation: "scientific" },
    engineering: { notation: "engineering" },
    compactLong: { notation: "compact", compactDisplay: "long" },
    compactShort: { notation: "compact", compactDisplay: "short" }
  },
  date: {
    short: { month: "numeric", day: "numeric", year: "2-digit" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { month: "long", day: "numeric", year: "numeric" },
    full: { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  },
  time: {
    short: { hour: "numeric", minute: "numeric" },
    medium: { hour: "numeric", minute: "numeric", second: "numeric" },
    long: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    },
    full: {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short"
    }
  }
};
function defaultMissingKeyHandler({ locale, id }) {
  console.warn(
    `[svelte-i18n] The message "${id}" was not found in "${getPossibleLocales(
      locale
    ).join('", "')}".${hasLocaleQueue(getCurrentLocale()) ? `

Note: there are at least one loader still registered to this locale that wasn't executed.` : ""}`
  );
}
const defaultOptions = {
  fallbackLocale: null,
  loadingDelay: 200,
  formats: defaultFormats,
  warnOnMissingMessages: true,
  handleMissingMessage: void 0,
  ignoreTag: true
};
const options = defaultOptions;
function getOptions() {
  return options;
}
function init(opts) {
  const _a = opts, { formats } = _a, rest = __objRest$1(_a, ["formats"]);
  let initialLocale = opts.fallbackLocale;
  if (opts.initialLocale) {
    try {
      if (IntlMessageFormat.resolveLocale(opts.initialLocale)) {
        initialLocale = opts.initialLocale;
      }
    } catch (e) {
      console.warn(
        `[svelte-i18n] The initial locale "${opts.initialLocale}" is not a valid locale.`
      );
    }
  }
  if (rest.warnOnMissingMessages) {
    delete rest.warnOnMissingMessages;
    if (rest.handleMissingMessage == null) {
      rest.handleMissingMessage = defaultMissingKeyHandler;
    } else {
      console.warn(
        '[svelte-i18n] The "warnOnMissingMessages" option is deprecated. Please use the "handleMissingMessage" option instead.'
      );
    }
  }
  Object.assign(options, rest, { initialLocale });
  if (formats) {
    if ("number" in formats) {
      Object.assign(options.formats.number, formats.number);
    }
    if ("date" in formats) {
      Object.assign(options.formats.date, formats.date);
    }
    if ("time" in formats) {
      Object.assign(options.formats.time, formats.time);
    }
  }
  return $locale.set(initialLocale);
}

const $isLoading = writable(false);

var __defProp$1 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
let current;
const internalLocale = writable(null);
function getSubLocales(refLocale) {
  return refLocale.split("-").map((_, i, arr) => arr.slice(0, i + 1).join("-")).reverse();
}
function getPossibleLocales(refLocale, fallbackLocale = getOptions().fallbackLocale) {
  const locales = getSubLocales(refLocale);
  if (fallbackLocale) {
    return [.../* @__PURE__ */ new Set([...locales, ...getSubLocales(fallbackLocale)])];
  }
  return locales;
}
function getCurrentLocale() {
  return current != null ? current : void 0;
}
internalLocale.subscribe((newLocale) => {
  current = newLocale != null ? newLocale : void 0;
  if (typeof window !== "undefined" && newLocale != null) {
    document.documentElement.setAttribute("lang", newLocale);
  }
});
const set$1 = (newLocale) => {
  if (newLocale && getClosestAvailableLocale(newLocale) && hasLocaleQueue(newLocale)) {
    const { loadingDelay } = getOptions();
    let loadingTimer;
    if (typeof window !== "undefined" && getCurrentLocale() != null && loadingDelay) {
      loadingTimer = window.setTimeout(
        () => $isLoading.set(true),
        loadingDelay
      );
    } else {
      $isLoading.set(true);
    }
    return flush(newLocale).then(() => {
      internalLocale.set(newLocale);
    }).finally(() => {
      clearTimeout(loadingTimer);
      $isLoading.set(false);
    });
  }
  return internalLocale.set(newLocale);
};
const $locale = __spreadProps(__spreadValues$1({}, internalLocale), {
  set: set$1
});

const monadicMemoize = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  const memoizedFn = (arg) => {
    const cacheKey = JSON.stringify(arg);
    if (cacheKey in cache) {
      return cache[cacheKey];
    }
    return cache[cacheKey] = fn(arg);
  };
  return memoizedFn;
};

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const getIntlFormatterOptions = (type, name) => {
  const { formats } = getOptions();
  if (type in formats && name in formats[type]) {
    return formats[type][name];
  }
  throw new Error(`[svelte-i18n] Unknown "${name}" ${type} format.`);
};
const createNumberFormatter = monadicMemoize(
  (_a) => {
    var _b = _a, { locale, format } = _b, options = __objRest(_b, ["locale", "format"]);
    if (locale == null) {
      throw new Error('[svelte-i18n] A "locale" must be set to format numbers');
    }
    if (format) {
      options = getIntlFormatterOptions("number", format);
    }
    return new Intl.NumberFormat(locale, options);
  }
);
const createDateFormatter = monadicMemoize(
  (_c) => {
    var _d = _c, { locale, format } = _d, options = __objRest(_d, ["locale", "format"]);
    if (locale == null) {
      throw new Error('[svelte-i18n] A "locale" must be set to format dates');
    }
    if (format) {
      options = getIntlFormatterOptions("date", format);
    } else if (Object.keys(options).length === 0) {
      options = getIntlFormatterOptions("date", "short");
    }
    return new Intl.DateTimeFormat(locale, options);
  }
);
const createTimeFormatter = monadicMemoize(
  (_e) => {
    var _f = _e, { locale, format } = _f, options = __objRest(_f, ["locale", "format"]);
    if (locale == null) {
      throw new Error(
        '[svelte-i18n] A "locale" must be set to format time values'
      );
    }
    if (format) {
      options = getIntlFormatterOptions("time", format);
    } else if (Object.keys(options).length === 0) {
      options = getIntlFormatterOptions("time", "short");
    }
    return new Intl.DateTimeFormat(locale, options);
  }
);
const getNumberFormatter = (_g = {}) => {
  var _h = _g, {
    locale = getCurrentLocale()
  } = _h, args = __objRest(_h, [
    "locale"
  ]);
  return createNumberFormatter(__spreadValues({ locale }, args));
};
const getDateFormatter = (_i = {}) => {
  var _j = _i, {
    locale = getCurrentLocale()
  } = _j, args = __objRest(_j, [
    "locale"
  ]);
  return createDateFormatter(__spreadValues({ locale }, args));
};
const getTimeFormatter = (_k = {}) => {
  var _l = _k, {
    locale = getCurrentLocale()
  } = _l, args = __objRest(_l, [
    "locale"
  ]);
  return createTimeFormatter(__spreadValues({ locale }, args));
};
const getMessageFormatter = monadicMemoize(
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  (message, locale = getCurrentLocale()) => new IntlMessageFormat(message, locale, getOptions().formats, {
    ignoreTag: getOptions().ignoreTag
  })
);

const formatMessage = (id, options = {}) => {
  var _a, _b, _c, _d;
  let messageObj = options;
  if (typeof id === "object") {
    messageObj = id;
    id = messageObj.id;
  }
  const {
    values,
    locale = getCurrentLocale(),
    default: defaultValue
  } = messageObj;
  if (locale == null) {
    throw new Error(
      "[svelte-i18n] Cannot format a message without first setting the initial locale."
    );
  }
  let message = lookup(id, locale);
  if (!message) {
    message = (_d = (_c = (_b = (_a = getOptions()).handleMissingMessage) == null ? void 0 : _b.call(_a, { locale, id, defaultValue })) != null ? _c : defaultValue) != null ? _d : id;
  } else if (typeof message !== "string") {
    console.warn(
      `[svelte-i18n] Message with id "${id}" must be of type "string", found: "${typeof message}". Gettin its value through the "$format" method is deprecated; use the "json" method instead.`
    );
    return message;
  }
  if (!values) {
    return message;
  }
  let result = message;
  try {
    result = getMessageFormatter(message, locale).format(values);
  } catch (e) {
    if (e instanceof Error) {
      console.warn(
        `[svelte-i18n] Message "${id}" has syntax error:`,
        e.message
      );
    }
  }
  return result;
};
const formatTime = (t, options) => {
  return getTimeFormatter(options).format(t);
};
const formatDate = (d, options) => {
  return getDateFormatter(options).format(d);
};
const formatNumber = (n, options) => {
  return getNumberFormatter(options).format(n);
};
const getJSON = (id, locale = getCurrentLocale()) => {
  return lookup(id, locale);
};
const $format = derived([$locale, $dictionary], () => formatMessage);
derived([$locale], () => formatTime);
derived([$locale], () => formatDate);
derived([$locale], () => formatNumber);
derived([$locale, $dictionary], () => getJSON);

const LOCATION = {};
const ROUTER = {};
const HISTORY = {};

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 * https://github.com/reach/router/blob/master/LICENSE
 */

const PARAM = /^:(.+)/;
const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

/**
 * Split up the URI into segments delimited by `/`
 * Strip starting/ending `/`
 * @param {string} uri
 * @return {string[]}
 */
const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
/**
 * Strip `str` of potential start and end `/`
 * @param {string} string
 * @return {string}
 */
const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
/**
 * Score a route depending on how its individual segments look
 * @param {object} route
 * @param {number} index
 * @return {object}
 */
const rankRoute = (route, index) => {
    const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
              score += SEGMENT_POINTS;

              if (segment === "") {
                  score += ROOT_POINTS;
              } else if (PARAM.test(segment)) {
                  score += DYNAMIC_POINTS;
              } else if (segment[0] === "*") {
                  score -= SEGMENT_POINTS + SPLAT_PENALTY;
              } else {
                  score += STATIC_POINTS;
              }

              return score;
          }, 0);

    return { route, score, index };
};
/**
 * Give a score to all routes and sort them on that
 * If two routes have the exact same score, we go by index instead
 * @param {object[]} routes
 * @return {object[]}
 */
const rankRoutes = (routes) =>
    routes
        .map(rankRoute)
        .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
        );
/**
 * Ranks and picks the best route to match. Each segment gets the highest
 * amount of points, then the type of segment gets an additional amount of
 * points where
 *
 *  static > dynamic > splat > root
 *
 * This way we don't have to worry about the order of our routes, let the
 * computers do it.
 *
 * A route looks like this
 *
 *  { path, default, value }
 *
 * And a returned match looks like:
 *
 *  { route, params, uri }
 *
 * @param {object[]} routes
 * @param {string} uri
 * @return {?object}
 */
const pick = (routes, uri) => {
    let match;
    let default_;

    const [uriPathname] = uri.split("?");
    const uriSegments = segmentize(uriPathname);
    const isRootUri = uriSegments[0] === "";
    const ranked = rankRoutes(routes);

    for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
            default_ = {
                route,
                params: {},
                uri,
            };
            continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
            const routeSegment = routeSegments[index];
            const uriSegment = uriSegments[index];

            if (routeSegment && routeSegment[0] === "*") {
                // Hit a splat, just grab the rest, and return a match
                // uri:   /files/documents/work
                // route: /files/* or /files/*splatname
                const splatName =
                    routeSegment === "*" ? "*" : routeSegment.slice(1);

                params[splatName] = uriSegments
                    .slice(index)
                    .map(decodeURIComponent)
                    .join("/");
                break;
            }

            if (typeof uriSegment === "undefined") {
                // URI is shorter than the route, no match
                // uri:   /users
                // route: /users/:userId
                missed = true;
                break;
            }

            const dynamicMatch = PARAM.exec(routeSegment);

            if (dynamicMatch && !isRootUri) {
                const value = decodeURIComponent(uriSegment);
                params[dynamicMatch[1]] = value;
            } else if (routeSegment !== uriSegment) {
                // Current segments don't match, not dynamic, not splat, so no match
                // uri:   /users/123/settings
                // route: /users/:id/profile
                missed = true;
                break;
            }
        }

        if (!missed) {
            match = {
                route,
                params,
                uri: "/" + uriSegments.slice(0, index).join("/"),
            };
            break;
        }
    }

    return match || default_ || null;
};
/**
 * Combines the `basepath` and the `path` into one path.
 * @param {string} basepath
 * @param {string} path
 */
const combinePaths = (basepath, path) =>
    `${stripSlashes(
        path === "/"
            ? basepath
            : `${stripSlashes(basepath)}/${stripSlashes(path)}`
    )}/`;

const canUseDOM = () =>
    typeof window !== "undefined" &&
    "document" in window &&
    "location" in window;

/* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.59.2 */
const get_default_slot_changes$1 = dirty => ({ params: dirty & /*routeParams*/ 4 });
const get_default_slot_context$1 = ctx => ({ params: /*routeParams*/ ctx[2] });

// (42:0) {#if $activeRoute && $activeRoute.route === route}
function create_if_block$i(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_1$7, create_else_block$6];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*component*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$i.name,
		type: "if",
		source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
		ctx
	});

	return block;
}

// (51:4) {:else}
function create_else_block$6(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/ 132)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[7],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
						get_default_slot_context$1
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$6.name,
		type: "else",
		source: "(51:4) {:else}",
		ctx
	});

	return block;
}

// (43:4) {#if component}
function create_if_block_1$7(ctx) {
	let await_block_anchor;
	let promise;
	let current;

	let info = {
		ctx,
		current: null,
		token: null,
		hasCatch: false,
		pending: create_pending_block,
		then: create_then_block,
		catch: create_catch_block,
		value: 12,
		blocks: [,,,]
	};

	handle_promise(promise = /*component*/ ctx[0], info);

	const block = {
		c: function create() {
			await_block_anchor = empty();
			info.block.c();
		},
		m: function mount(target, anchor) {
			insert_dev(target, await_block_anchor, anchor);
			info.block.m(target, info.anchor = anchor);
			info.mount = () => await_block_anchor.parentNode;
			info.anchor = await_block_anchor;
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			info.ctx = ctx;

			if (dirty & /*component*/ 1 && promise !== (promise = /*component*/ ctx[0]) && handle_promise(promise, info)) ; else {
				update_await_block_branch(info, ctx, dirty);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(info.block);
			current = true;
		},
		o: function outro(local) {
			for (let i = 0; i < 3; i += 1) {
				const block = info.blocks[i];
				transition_out(block);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(await_block_anchor);
			info.block.d(detaching);
			info.token = null;
			info = null;
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$7.name,
		type: "if",
		source: "(43:4) {#if component}",
		ctx
	});

	return block;
}

// (1:0) <script>     import { getContext, onDestroy }
function create_catch_block(ctx) {
	const block = {
		c: noop,
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_catch_block.name,
		type: "catch",
		source: "(1:0) <script>     import { getContext, onDestroy }",
		ctx
	});

	return block;
}

// (44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}
function create_then_block(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	const switch_instance_spread_levels = [/*routeParams*/ ctx[2], /*routeProps*/ ctx[3]];
	var switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12];

	function switch_props(ctx) {
		let switch_instance_props = {};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty & /*routeParams, routeProps*/ 12)
			? get_spread_update(switch_instance_spread_levels, [
					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
				])
			: {};

			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_then_block.name,
		type: "then",
		source: "(44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}",
		ctx
	});

	return block;
}

// (1:0) <script>     import { getContext, onDestroy }
function create_pending_block(ctx) {
	const block = {
		c: noop,
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_pending_block.name,
		type: "pending",
		source: "(1:0) <script>     import { getContext, onDestroy }",
		ctx
	});

	return block;
}

function create_fragment$v(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5] && create_if_block$i(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$activeRoute*/ 2) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$i(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$v.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$v($$self, $$props, $$invalidate) {
	let $activeRoute;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Route', slots, ['default']);
	let { path = "" } = $$props;
	let { component = null } = $$props;
	let routeParams = {};
	let routeProps = {};
	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
	validate_store(activeRoute, 'activeRoute');
	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));

	const route = {
		path,
		// If no path prop is given, this Route will act as the default Route
		// that is rendered if no other Route in the Router is a match.
		default: path === ""
	};

	registerRoute(route);

	onDestroy(() => {
		unregisterRoute(route);
	});

	$$self.$$set = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
		if ('path' in $$new_props) $$invalidate(6, path = $$new_props.path);
		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		getContext,
		onDestroy,
		ROUTER,
		canUseDOM,
		path,
		component,
		routeParams,
		routeProps,
		registerRoute,
		unregisterRoute,
		activeRoute,
		route,
		$activeRoute
	});

	$$self.$inject_state = $$new_props => {
		$$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
		if ('path' in $$props) $$invalidate(6, path = $$new_props.path);
		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($activeRoute && $activeRoute.route === route) {
			$$invalidate(2, routeParams = $activeRoute.params);
			const { component: c, path, ...rest } = $$props;
			$$invalidate(3, routeProps = rest);

			if (c) {
				if (c.toString().startsWith("class ")) $$invalidate(0, component = c); else $$invalidate(0, component = c());
			}

			canUseDOM() && !$activeRoute.preserveScroll && window?.scrollTo(0, 0);
		}
	};

	$$props = exclude_internal_props($$props);

	return [
		component,
		$activeRoute,
		routeParams,
		routeProps,
		activeRoute,
		route,
		path,
		$$scope,
		slots
	];
}

class Route extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$v, create_fragment$v, safe_not_equal, { path: 6, component: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Route",
			options,
			id: create_fragment$v.name
		});
	}

	get path() {
		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set path(value) {
		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get component() {
		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set component(value) {
		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 * https://github.com/reach/router/blob/master/LICENSE
 */

const getLocation = (source) => {
    return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial",
    };
};
const createHistory = (source) => {
    const listeners = [];
    let location = getLocation(source);

    return {
        get location() {
            return location;
        },

        listen(listener) {
            listeners.push(listener);

            const popstateListener = () => {
                location = getLocation(source);
                listener({ location, action: "POP" });
            };

            source.addEventListener("popstate", popstateListener);

            return () => {
                source.removeEventListener("popstate", popstateListener);
                const index = listeners.indexOf(listener);
                listeners.splice(index, 1);
            };
        },

        navigate(to, { state, replace = false, preserveScroll = false, blurActiveElement = true } = {}) {
            state = { ...state, key: Date.now() + "" };
            // try...catch iOS Safari limits to 100 pushState calls
            try {
                if (replace) source.history.replaceState(state, "", to);
                else source.history.pushState(state, "", to);
            } catch (e) {
                source.location[replace ? "replace" : "assign"](to);
            }
            location = getLocation(source);
            listeners.forEach((listener) =>
                listener({ location, action: "PUSH", preserveScroll })
            );
            if(blurActiveElement) document.activeElement.blur();
        },
    };
};
// Stores history entries in memory for testing or other platforms like Native
const createMemorySource = (initialPathname = "/") => {
    let index = 0;
    const stack = [{ pathname: initialPathname, search: "" }];
    const states = [];

    return {
        get location() {
            return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
            get entries() {
                return stack;
            },
            get index() {
                return index;
            },
            get state() {
                return states[index];
            },
            pushState(state, _, uri) {
                const [pathname, search = ""] = uri.split("?");
                index++;
                stack.push({ pathname, search });
                states.push(state);
            },
            replaceState(state, _, uri) {
                const [pathname, search = ""] = uri.split("?");
                stack[index] = { pathname, search };
                states[index] = state;
            },
        },
    };
};
// Global history uses window.history as the source if available,
// otherwise a memory history
const globalHistory = createHistory(
    canUseDOM() ? window : createMemorySource()
);

/* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.59.2 */

const { Object: Object_1$1 } = globals;
const file$t = "node_modules\\svelte-routing\\src\\Router.svelte";

const get_default_slot_changes_1 = dirty => ({
	route: dirty & /*$activeRoute*/ 4,
	location: dirty & /*$location*/ 2
});

const get_default_slot_context_1 = ctx => ({
	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
	location: /*$location*/ ctx[1]
});

const get_default_slot_changes = dirty => ({
	route: dirty & /*$activeRoute*/ 4,
	location: dirty & /*$location*/ 2
});

const get_default_slot_context = ctx => ({
	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
	location: /*$location*/ ctx[1]
});

// (143:0) {:else}
function create_else_block$5(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[15].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context_1);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[14],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes_1),
						get_default_slot_context_1
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$5.name,
		type: "else",
		source: "(143:0) {:else}",
		ctx
	});

	return block;
}

// (134:0) {#if viewtransition}
function create_if_block$h(ctx) {
	let previous_key = /*$location*/ ctx[1].pathname;
	let key_block_anchor;
	let current;
	let key_block = create_key_block(ctx);

	const block = {
		c: function create() {
			key_block.c();
			key_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			key_block.m(target, anchor);
			insert_dev(target, key_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$location*/ 2 && safe_not_equal(previous_key, previous_key = /*$location*/ ctx[1].pathname)) {
				group_outros();
				transition_out(key_block, 1, 1, noop);
				check_outros();
				key_block = create_key_block(ctx);
				key_block.c();
				transition_in(key_block, 1);
				key_block.m(key_block_anchor.parentNode, key_block_anchor);
			} else {
				key_block.p(ctx, dirty);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(key_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(key_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(key_block_anchor);
			key_block.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$h.name,
		type: "if",
		source: "(134:0) {#if viewtransition}",
		ctx
	});

	return block;
}

// (135:4) {#key $location.pathname}
function create_key_block(ctx) {
	let div;
	let div_intro;
	let div_outro;
	let current;
	const default_slot_template = /*#slots*/ ctx[15].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			add_location(div, file$t, 135, 8, 4659);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[14],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
						get_default_slot_context
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);

			add_render_callback(() => {
				if (!current) return;
				if (div_outro) div_outro.end(1);
				div_intro = create_in_transition(div, /*viewtransitionFn*/ ctx[3], {});
				div_intro.start();
			});

			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			if (div_intro) div_intro.invalidate();
			div_outro = create_out_transition(div, /*viewtransitionFn*/ ctx[3], {});
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			if (detaching && div_outro) div_outro.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_key_block.name,
		type: "key",
		source: "(135:4) {#key $location.pathname}",
		ctx
	});

	return block;
}

function create_fragment$u(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$h, create_else_block$5];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*viewtransition*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$u.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$u($$self, $$props, $$invalidate) {
	let $location;
	let $routes;
	let $base;
	let $activeRoute;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Router', slots, ['default']);
	let { basepath = "/" } = $$props;
	let { url = null } = $$props;
	let { viewtransition = null } = $$props;
	let { history = globalHistory } = $$props;

	const viewtransitionFn = (node, _, direction) => {
		const vt = viewtransition(direction);
		if (typeof vt?.fn === "function") return vt.fn(node, vt); else return vt;
	};

	setContext(HISTORY, history);
	const locationContext = getContext(LOCATION);
	const routerContext = getContext(ROUTER);
	const routes = writable([]);
	validate_store(routes, 'routes');
	component_subscribe($$self, routes, value => $$invalidate(12, $routes = value));
	const activeRoute = writable(null);
	validate_store(activeRoute, 'activeRoute');
	component_subscribe($$self, activeRoute, value => $$invalidate(2, $activeRoute = value));
	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

	// If locationContext is not set, this is the topmost Router in the tree.
	// If the `url` prop is given we force the location to it.
	const location = locationContext || writable(url ? { pathname: url } : history.location);

	validate_store(location, 'location');
	component_subscribe($$self, location, value => $$invalidate(1, $location = value));

	// If routerContext is set, the routerBase of the parent Router
	// will be the base for this Router's descendants.
	// If routerContext is not set, the path and resolved uri will both
	// have the value of the basepath prop.
	const base = routerContext
	? routerContext.routerBase
	: writable({ path: basepath, uri: basepath });

	validate_store(base, 'base');
	component_subscribe($$self, base, value => $$invalidate(13, $base = value));

	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
		// If there is no activeRoute, the routerBase will be identical to the base.
		if (!activeRoute) return base;

		const { path: basepath } = base;
		const { route, uri } = activeRoute;

		// Remove the potential /* or /*splatname from
		// the end of the child Routes relative paths.
		const path = route.default
		? basepath
		: route.path.replace(/\*.*$/, "");

		return { path, uri };
	});

	const registerRoute = route => {
		const { path: basepath } = $base;
		let { path } = route;

		// We store the original path in the _path property so we can reuse
		// it when the basepath changes. The only thing that matters is that
		// the route reference is intact, so mutation is fine.
		route._path = path;

		route.path = combinePaths(basepath, path);

		if (typeof window === "undefined") {
			// In SSR we should set the activeRoute immediately if it is a match.
			// If there are more Routes being registered after a match is found,
			// we just skip them.
			if (hasActiveRoute) return;

			const matchingRoute = pick([route], $location.pathname);

			if (matchingRoute) {
				activeRoute.set(matchingRoute);
				hasActiveRoute = true;
			}
		} else {
			routes.update(rs => [...rs, route]);
		}
	};

	const unregisterRoute = route => {
		routes.update(rs => rs.filter(r => r !== route));
	};

	let preserveScroll = false;

	if (!locationContext) {
		// The topmost Router in the tree is responsible for updating
		// the location store and supplying it through context.
		onMount(() => {
			const unlisten = history.listen(event => {
				$$invalidate(11, preserveScroll = event.preserveScroll || false);
				location.set(event.location);
			});

			return unlisten;
		});

		setContext(LOCATION, location);
	}

	setContext(ROUTER, {
		activeRoute,
		base,
		routerBase,
		registerRoute,
		unregisterRoute
	});

	const writable_props = ['basepath', 'url', 'viewtransition', 'history'];

	Object_1$1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
		if ('url' in $$props) $$invalidate(9, url = $$props.url);
		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
		if ('history' in $$props) $$invalidate(10, history = $$props.history);
		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		getContext,
		onMount,
		setContext,
		derived,
		writable,
		HISTORY,
		LOCATION,
		ROUTER,
		globalHistory,
		combinePaths,
		pick,
		basepath,
		url,
		viewtransition,
		history,
		viewtransitionFn,
		locationContext,
		routerContext,
		routes,
		activeRoute,
		hasActiveRoute,
		location,
		base,
		routerBase,
		registerRoute,
		unregisterRoute,
		preserveScroll,
		$location,
		$routes,
		$base,
		$activeRoute
	});

	$$self.$inject_state = $$props => {
		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
		if ('url' in $$props) $$invalidate(9, url = $$props.url);
		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
		if ('history' in $$props) $$invalidate(10, history = $$props.history);
		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$props.preserveScroll);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$base*/ 8192) {
			// This reactive statement will update all the Routes' path when
			// the basepath changes.
			{
				const { path: basepath } = $base;
				routes.update(rs => rs.map(r => Object.assign(r, { path: combinePaths(basepath, r._path) })));
			}
		}

		if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/ 6146) {
			// This reactive statement will be run when the Router is created
			// when there are no Routes and then again the following tick, so it
			// will not find an active Route in SSR and in the browser it will only
			// pick an active Route after all Routes have been registered.
			{
				const bestMatch = pick($routes, $location.pathname);
				activeRoute.set(bestMatch ? { ...bestMatch, preserveScroll } : bestMatch);
			}
		}
	};

	return [
		viewtransition,
		$location,
		$activeRoute,
		viewtransitionFn,
		routes,
		activeRoute,
		location,
		base,
		basepath,
		url,
		history,
		preserveScroll,
		$routes,
		$base,
		$$scope,
		slots
	];
}

class Router extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$u, create_fragment$u, safe_not_equal, {
			basepath: 8,
			url: 9,
			viewtransition: 0,
			history: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Router",
			options,
			id: create_fragment$u.name
		});
	}

	get basepath() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set basepath(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get url() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set url(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get viewtransition() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set viewtransition(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get history() {
		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set history(value) {
		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var interact_min = {exports: {}};

/* interact.js 1.10.27 | https://raw.github.com/taye/interact.js/main/LICENSE */
interact_min.exports;

(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){function t(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r);}return n}function e(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?t(Object(r),!0).forEach((function(t){a(e,t,r[t]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):t(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t));}));}return e}function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,d(r.key),r);}}function o(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),Object.defineProperty(t,"prototype",{writable:!1}),t}function a(t,e,n){return (e=d(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&l(t,e);}function c(t){return c=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},c(t)}function l(t,e){return l=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},l(t,e)}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}();return function(){var n,r=c(t);if(e){var i=c(this).constructor;n=Reflect.construct(r,arguments,i);}else n=r.apply(this,arguments);return function(t,e){if(e&&("object"==typeof e||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return u(t)}(this,n)}}function f(){return f="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=c(t)););return t}(t,e);if(r){var i=Object.getOwnPropertyDescriptor(r,e);return i.get?i.get.call(arguments.length<3?t:n):i.value}},f.apply(this,arguments)}function d(t){var e=function(t,e){if("object"!=typeof t||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return ("string"===e?String:Number)(t)}(t,"string");return "symbol"==typeof e?e:e+""}var h=function(t){return !(!t||!t.Window)&&t instanceof t.Window},v=void 0,g=void 0;function m(t){v=t;var e=t.document.createTextNode("");e.ownerDocument!==t.document&&"function"==typeof t.wrap&&t.wrap(e)===e&&(t=t.wrap(t)),g=t;}function y(t){return h(t)?t:(t.ownerDocument||t).defaultView||g.window}"undefined"!=typeof window&&window&&m(window);var b=function(t){return !!t&&"object"===n(t)},x=function(t){return "function"==typeof t},w={window:function(t){return t===g||h(t)},docFrag:function(t){return b(t)&&11===t.nodeType},object:b,func:x,number:function(t){return "number"==typeof t},bool:function(t){return "boolean"==typeof t},string:function(t){return "string"==typeof t},element:function(t){if(!t||"object"!==n(t))return !1;var e=y(t)||g;return /object|function/.test("undefined"==typeof Element?"undefined":n(Element))?t instanceof Element||t instanceof e.Element:1===t.nodeType&&"string"==typeof t.nodeName},plainObject:function(t){return b(t)&&!!t.constructor&&/function Object\b/.test(t.constructor.toString())},array:function(t){return b(t)&&void 0!==t.length&&x(t.splice)}};function E(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.prepared.axis;"x"===n?(e.coords.cur.page.y=e.coords.start.page.y,e.coords.cur.client.y=e.coords.start.client.y,e.coords.velocity.client.y=0,e.coords.velocity.page.y=0):"y"===n&&(e.coords.cur.page.x=e.coords.start.page.x,e.coords.cur.client.x=e.coords.start.client.x,e.coords.velocity.client.x=0,e.coords.velocity.page.x=0);}}function T(t){var e=t.iEvent,n=t.interaction;if("drag"===n.prepared.name){var r=n.prepared.axis;if("x"===r||"y"===r){var i="x"===r?"y":"x";e.page[i]=n.coords.start.page[i],e.client[i]=n.coords.start.client[i],e.delta[i]=0;}}}var S={id:"actions/drag",install:function(t){var e=t.actions,n=t.Interactable,r=t.defaults;n.prototype.draggable=S.draggable,e.map.drag=S,e.methodDict.drag="draggable",r.actions.drag=S.defaults;},listeners:{"interactions:before-action-move":E,"interactions:action-resume":E,"interactions:action-move":T,"auto-start:check":function(t){var e=t.interaction,n=t.interactable,r=t.buttons,i=n.options.drag;if(i&&i.enabled&&(!e.pointerIsDown||!/mouse|pointer/.test(e.pointerType)||0!=(r&n.options.drag.mouseButtons)))return t.action={name:"drag",axis:"start"===i.lockAxis?i.startAxis:i.lockAxis},!1}},draggable:function(t){return w.object(t)?(this.options.drag.enabled=!1!==t.enabled,this.setPerAction("drag",t),this.setOnEvents("drag",t),/^(xy|x|y|start)$/.test(t.lockAxis)&&(this.options.drag.lockAxis=t.lockAxis),/^(xy|x|y)$/.test(t.startAxis)&&(this.options.drag.startAxis=t.startAxis),this):w.bool(t)?(this.options.drag.enabled=t,this):this.options.drag},beforeMove:E,move:T,defaults:{startAxis:"xy",lockAxis:"xy"},getCursor:function(){return "move"},filterEventType:function(t){return 0===t.search("drag")}},_=S,P={init:function(t){var e=t;P.document=e.document,P.DocumentFragment=e.DocumentFragment||O,P.SVGElement=e.SVGElement||O,P.SVGSVGElement=e.SVGSVGElement||O,P.SVGElementInstance=e.SVGElementInstance||O,P.Element=e.Element||O,P.HTMLElement=e.HTMLElement||P.Element,P.Event=e.Event,P.Touch=e.Touch||O,P.PointerEvent=e.PointerEvent||e.MSPointerEvent;},document:null,DocumentFragment:null,SVGElement:null,SVGSVGElement:null,SVGElementInstance:null,Element:null,HTMLElement:null,Event:null,Touch:null,PointerEvent:null};function O(){}var k=P;var D={init:function(t){var e=k.Element,n=t.navigator||{};D.supportsTouch="ontouchstart"in t||w.func(t.DocumentTouch)&&k.document instanceof t.DocumentTouch,D.supportsPointerEvent=!1!==n.pointerEnabled&&!!k.PointerEvent,D.isIOS=/iP(hone|od|ad)/.test(n.platform),D.isIOS7=/iP(hone|od|ad)/.test(n.platform)&&/OS 7[^\d]/.test(n.appVersion),D.isIe9=/MSIE 9/.test(n.userAgent),D.isOperaMobile="Opera"===n.appName&&D.supportsTouch&&/Presto/.test(n.userAgent),D.prefixedMatchesSelector="matches"in e.prototype?"matches":"webkitMatchesSelector"in e.prototype?"webkitMatchesSelector":"mozMatchesSelector"in e.prototype?"mozMatchesSelector":"oMatchesSelector"in e.prototype?"oMatchesSelector":"msMatchesSelector",D.pEventTypes=D.supportsPointerEvent?k.PointerEvent===t.MSPointerEvent?{up:"MSPointerUp",down:"MSPointerDown",over:"mouseover",out:"mouseout",move:"MSPointerMove",cancel:"MSPointerCancel"}:{up:"pointerup",down:"pointerdown",over:"pointerover",out:"pointerout",move:"pointermove",cancel:"pointercancel"}:null,D.wheelEvent=k.document&&"onmousewheel"in k.document?"mousewheel":"wheel";},supportsTouch:null,supportsPointerEvent:null,isIOS7:null,isIOS:null,isIe9:null,isOperaMobile:null,prefixedMatchesSelector:null,pEventTypes:null,wheelEvent:null};var I=D;function M(t,e){if(t.contains)return t.contains(e);for(;e;){if(e===t)return !0;e=e.parentNode;}return !1}function z(t,e){for(;w.element(t);){if(R(t,e))return t;t=A(t);}return null}function A(t){var e=t.parentNode;if(w.docFrag(e)){for(;(e=e.host)&&w.docFrag(e););return e}return e}function R(t,e){return g!==v&&(e=e.replace(/\/deep\//g," ")),t[I.prefixedMatchesSelector](e)}var C=function(t){return t.parentNode||t.host};function j(t,e){for(var n,r=[],i=t;(n=C(i))&&i!==e&&n!==i.ownerDocument;)r.unshift(i),i=n;return r}function F(t,e,n){for(;w.element(t);){if(R(t,e))return !0;if((t=A(t))===n)return R(t,e)}return !1}function X(t){return t.correspondingUseElement||t}function Y(t){var e=t instanceof k.SVGElement?t.getBoundingClientRect():t.getClientRects()[0];return e&&{left:e.left,right:e.right,top:e.top,bottom:e.bottom,width:e.width||e.right-e.left,height:e.height||e.bottom-e.top}}function L(t){var e,n=Y(t);if(!I.isIOS7&&n){var r={x:(e=(e=y(t))||g).scrollX||e.document.documentElement.scrollLeft,y:e.scrollY||e.document.documentElement.scrollTop};n.left+=r.x,n.right+=r.x,n.top+=r.y,n.bottom+=r.y;}return n}function q(t){for(var e=[];t;)e.push(t),t=A(t);return e}function B(t){return !!w.string(t)&&(k.document.querySelector(t),!0)}function V(t,e){for(var n in e)t[n]=e[n];return t}function W(t,e,n){return "parent"===t?A(n):"self"===t?e.getRect(n):z(n,t)}function G(t,e,n,r){var i=t;return w.string(i)?i=W(i,e,n):w.func(i)&&(i=i.apply(void 0,r)),w.element(i)&&(i=L(i)),i}function N(t){return t&&{x:"x"in t?t.x:t.left,y:"y"in t?t.y:t.top}}function U(t){return !t||"x"in t&&"y"in t||((t=V({},t)).x=t.left||0,t.y=t.top||0,t.width=t.width||(t.right||0)-t.x,t.height=t.height||(t.bottom||0)-t.y),t}function H(t,e,n){t.left&&(e.left+=n.x),t.right&&(e.right+=n.x),t.top&&(e.top+=n.y),t.bottom&&(e.bottom+=n.y),e.width=e.right-e.left,e.height=e.bottom-e.top;}function K(t,e,n){var r=n&&t.options[n];return N(G(r&&r.origin||t.options.origin,t,e,[t&&e]))||{x:0,y:0}}function $(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(t){return !0},r=arguments.length>3?arguments[3]:void 0;if(r=r||{},w.string(t)&&-1!==t.search(" ")&&(t=J(t)),w.array(t))return t.forEach((function(t){return $(t,e,n,r)})),r;if(w.object(t)&&(e=t,t=""),w.func(e)&&n(t))r[t]=r[t]||[],r[t].push(e);else if(w.array(e))for(var i=0,o=e;i<o.length;i++){var a=o[i];$(t,a,n,r);}else if(w.object(e))for(var s in e){$(J(s).map((function(e){return "".concat(t).concat(e)})),e[s],n,r);}return r}function J(t){return t.trim().split(/ +/)}var Q=function(t,e){return Math.sqrt(t*t+e*e)},Z=["webkit","moz"];function tt(t,e){t.__set||(t.__set={});var n=function(n){if(Z.some((function(t){return 0===n.indexOf(t)})))return 1;"function"!=typeof t[n]&&"__set"!==n&&Object.defineProperty(t,n,{get:function(){return n in t.__set?t.__set[n]:t.__set[n]=e[n]},set:function(e){t.__set[n]=e;},configurable:!0});};for(var r in e)n(r);return t}function et(t,e){t.page=t.page||{},t.page.x=e.page.x,t.page.y=e.page.y,t.client=t.client||{},t.client.x=e.client.x,t.client.y=e.client.y,t.timeStamp=e.timeStamp;}function nt(t){t.page.x=0,t.page.y=0,t.client.x=0,t.client.y=0;}function rt(t){return t instanceof k.Event||t instanceof k.Touch}function it(t,e,n){return t=t||"page",(n=n||{}).x=e[t+"X"],n.y=e[t+"Y"],n}function ot(t,e){return e=e||{x:0,y:0},I.isOperaMobile&&rt(t)?(it("screen",t,e),e.x+=window.scrollX,e.y+=window.scrollY):it("page",t,e),e}function at(t){return w.number(t.pointerId)?t.pointerId:t.identifier}function st(t,e,n){var r=e.length>1?lt(e):e[0];ot(r,t.page),function(t,e){e=e||{},I.isOperaMobile&&rt(t)?it("screen",t,e):it("client",t,e);}(r,t.client),t.timeStamp=n;}function ct(t){var e=[];return w.array(t)?(e[0]=t[0],e[1]=t[1]):"touchend"===t.type?1===t.touches.length?(e[0]=t.touches[0],e[1]=t.changedTouches[0]):0===t.touches.length&&(e[0]=t.changedTouches[0],e[1]=t.changedTouches[1]):(e[0]=t.touches[0],e[1]=t.touches[1]),e}function lt(t){for(var e={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0},n=0;n<t.length;n++){var r=t[n];for(var i in e)e[i]+=r[i];}for(var o in e)e[o]/=t.length;return e}function ut(t){if(!t.length)return null;var e=ct(t),n=Math.min(e[0].pageX,e[1].pageX),r=Math.min(e[0].pageY,e[1].pageY),i=Math.max(e[0].pageX,e[1].pageX),o=Math.max(e[0].pageY,e[1].pageY);return {x:n,y:r,left:n,top:r,right:i,bottom:o,width:i-n,height:o-r}}function pt(t,e){var n=e+"X",r=e+"Y",i=ct(t),o=i[0][n]-i[1][n],a=i[0][r]-i[1][r];return Q(o,a)}function ft(t,e){var n=e+"X",r=e+"Y",i=ct(t),o=i[1][n]-i[0][n],a=i[1][r]-i[0][r];return 180*Math.atan2(a,o)/Math.PI}function dt(t){return w.string(t.pointerType)?t.pointerType:w.number(t.pointerType)?[void 0,void 0,"touch","pen","mouse"][t.pointerType]:/touch/.test(t.type||"")||t instanceof k.Touch?"touch":"mouse"}function ht(t){var e=w.func(t.composedPath)?t.composedPath():t.path;return [X(e?e[0]:t.target),X(t.currentTarget)]}var vt=function(){function t(e){r(this,t),this.immediatePropagationStopped=!1,this.propagationStopped=!1,this._interaction=e;}return o(t,[{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0;}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0;}}]),t}();Object.defineProperty(vt.prototype,"interaction",{get:function(){return this._interaction._proxy},set:function(){}});var gt=function(t,e){for(var n=0;n<e.length;n++){var r=e[n];t.push(r);}return t},mt=function(t){return gt([],t)},yt=function(t,e){for(var n=0;n<t.length;n++)if(e(t[n],n,t))return n;return -1},bt=function(t,e){return t[yt(t,e)]},xt=function(t){s(n,t);var e=p(n);function n(t,i,o){var a;r(this,n),(a=e.call(this,i._interaction)).dropzone=void 0,a.dragEvent=void 0,a.relatedTarget=void 0,a.draggable=void 0,a.propagationStopped=!1,a.immediatePropagationStopped=!1;var s="dragleave"===o?t.prev:t.cur,c=s.element,l=s.dropzone;return a.type=o,a.target=c,a.currentTarget=c,a.dropzone=l,a.dragEvent=i,a.relatedTarget=i.target,a.draggable=i.interactable,a.timeStamp=i.timeStamp,a}return o(n,[{key:"reject",value:function(){var t=this,e=this._interaction.dropState;if("dropactivate"===this.type||this.dropzone&&e.cur.dropzone===this.dropzone&&e.cur.element===this.target)if(e.prev.dropzone=this.dropzone,e.prev.element=this.target,e.rejected=!0,e.events.enter=null,this.stopImmediatePropagation(),"dropactivate"===this.type){var r=e.activeDrops,i=yt(r,(function(e){var n=e.dropzone,r=e.element;return n===t.dropzone&&r===t.target}));e.activeDrops.splice(i,1);var o=new n(e,this.dragEvent,"dropdeactivate");o.dropzone=this.dropzone,o.target=this.target,this.dropzone.fire(o);}else this.dropzone.fire(new n(e,this.dragEvent,"dragleave"));}},{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0;}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0;}}]),n}(vt);function wt(t,e){for(var n=0,r=t.slice();n<r.length;n++){var i=r[n],o=i.dropzone,a=i.element;e.dropzone=o,e.target=a,o.fire(e),e.propagationStopped=e.immediatePropagationStopped=!1;}}function Et(t,e){for(var n=function(t,e){for(var n=[],r=0,i=t.interactables.list;r<i.length;r++){var o=i[r];if(o.options.drop.enabled){var a=o.options.drop.accept;if(!(w.element(a)&&a!==e||w.string(a)&&!R(e,a)||w.func(a)&&!a({dropzone:o,draggableElement:e})))for(var s=0,c=o.getAllElements();s<c.length;s++){var l=c[s];l!==e&&n.push({dropzone:o,element:l,rect:o.getRect(l)});}}}return n}(t,e),r=0;r<n.length;r++){var i=n[r];i.rect=i.dropzone.getRect(i.element);}return n}function Tt(t,e,n){for(var r=t.dropState,i=t.interactable,o=t.element,a=[],s=0,c=r.activeDrops;s<c.length;s++){var l=c[s],u=l.dropzone,p=l.element,f=l.rect,d=u.dropCheck(e,n,i,o,p,f);a.push(d?p:null);}var h=function(t){for(var e,n,r,i=[],o=0;o<t.length;o++){var a=t[o],s=t[e];if(a&&o!==e)if(s){var c=C(a),l=C(s);if(c!==a.ownerDocument)if(l!==a.ownerDocument)if(c!==l){i=i.length?i:j(s);var u=void 0;if(s instanceof k.HTMLElement&&a instanceof k.SVGElement&&!(a instanceof k.SVGSVGElement)){if(a===l)continue;u=a.ownerSVGElement;}else u=a;for(var p=j(u,s.ownerDocument),f=0;p[f]&&p[f]===i[f];)f++;var d=[p[f-1],p[f],i[f]];if(d[0])for(var h=d[0].lastChild;h;){if(h===d[1]){e=o,i=p;break}if(h===d[2])break;h=h.previousSibling;}}else r=s,(parseInt(y(n=a).getComputedStyle(n).zIndex,10)||0)>=(parseInt(y(r).getComputedStyle(r).zIndex,10)||0)&&(e=o);else e=o;}else e=o;}return e}(a);return r.activeDrops[h]||null}function St(t,e,n){var r=t.dropState,i={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null};return "dragstart"===n.type&&(i.activate=new xt(r,n,"dropactivate"),i.activate.target=null,i.activate.dropzone=null),"dragend"===n.type&&(i.deactivate=new xt(r,n,"dropdeactivate"),i.deactivate.target=null,i.deactivate.dropzone=null),r.rejected||(r.cur.element!==r.prev.element&&(r.prev.dropzone&&(i.leave=new xt(r,n,"dragleave"),n.dragLeave=i.leave.target=r.prev.element,n.prevDropzone=i.leave.dropzone=r.prev.dropzone),r.cur.dropzone&&(i.enter=new xt(r,n,"dragenter"),n.dragEnter=r.cur.element,n.dropzone=r.cur.dropzone)),"dragend"===n.type&&r.cur.dropzone&&(i.drop=new xt(r,n,"drop"),n.dropzone=r.cur.dropzone,n.relatedTarget=r.cur.element),"dragmove"===n.type&&r.cur.dropzone&&(i.move=new xt(r,n,"dropmove"),n.dropzone=r.cur.dropzone)),i}function _t(t,e){var n=t.dropState,r=n.activeDrops,i=n.cur,o=n.prev;e.leave&&o.dropzone.fire(e.leave),e.enter&&i.dropzone.fire(e.enter),e.move&&i.dropzone.fire(e.move),e.drop&&i.dropzone.fire(e.drop),e.deactivate&&wt(r,e.deactivate),n.prev.dropzone=i.dropzone,n.prev.element=i.element;}function Pt(t,e){var n=t.interaction,r=t.iEvent,i=t.event;if("dragmove"===r.type||"dragend"===r.type){var o=n.dropState;e.dynamicDrop&&(o.activeDrops=Et(e,n.element));var a=r,s=Tt(n,a,i);o.rejected=o.rejected&&!!s&&s.dropzone===o.cur.dropzone&&s.element===o.cur.element,o.cur.dropzone=s&&s.dropzone,o.cur.element=s&&s.element,o.events=St(n,0,a);}}var Ot={id:"actions/drop",install:function(t){var e=t.actions,n=t.interactStatic,r=t.Interactable,i=t.defaults;t.usePlugin(_),r.prototype.dropzone=function(t){return function(t,e){if(w.object(e)){if(t.options.drop.enabled=!1!==e.enabled,e.listeners){var n=$(e.listeners),r=Object.keys(n).reduce((function(t,e){return t[/^(enter|leave)/.test(e)?"drag".concat(e):/^(activate|deactivate|move)/.test(e)?"drop".concat(e):e]=n[e],t}),{}),i=t.options.drop.listeners;i&&t.off(i),t.on(r),t.options.drop.listeners=r;}return w.func(e.ondrop)&&t.on("drop",e.ondrop),w.func(e.ondropactivate)&&t.on("dropactivate",e.ondropactivate),w.func(e.ondropdeactivate)&&t.on("dropdeactivate",e.ondropdeactivate),w.func(e.ondragenter)&&t.on("dragenter",e.ondragenter),w.func(e.ondragleave)&&t.on("dragleave",e.ondragleave),w.func(e.ondropmove)&&t.on("dropmove",e.ondropmove),/^(pointer|center)$/.test(e.overlap)?t.options.drop.overlap=e.overlap:w.number(e.overlap)&&(t.options.drop.overlap=Math.max(Math.min(1,e.overlap),0)),"accept"in e&&(t.options.drop.accept=e.accept),"checker"in e&&(t.options.drop.checker=e.checker),t}if(w.bool(e))return t.options.drop.enabled=e,t;return t.options.drop}(this,t)},r.prototype.dropCheck=function(t,e,n,r,i,o){return function(t,e,n,r,i,o,a){var s=!1;if(!(a=a||t.getRect(o)))return !!t.options.drop.checker&&t.options.drop.checker(e,n,s,t,o,r,i);var c=t.options.drop.overlap;if("pointer"===c){var l=K(r,i,"drag"),u=ot(e);u.x+=l.x,u.y+=l.y;var p=u.x>a.left&&u.x<a.right,f=u.y>a.top&&u.y<a.bottom;s=p&&f;}var d=r.getRect(i);if(d&&"center"===c){var h=d.left+d.width/2,v=d.top+d.height/2;s=h>=a.left&&h<=a.right&&v>=a.top&&v<=a.bottom;}if(d&&w.number(c)){s=Math.max(0,Math.min(a.right,d.right)-Math.max(a.left,d.left))*Math.max(0,Math.min(a.bottom,d.bottom)-Math.max(a.top,d.top))/(d.width*d.height)>=c;}t.options.drop.checker&&(s=t.options.drop.checker(e,n,s,t,o,r,i));return s}(this,t,e,n,r,i,o)},n.dynamicDrop=function(e){return w.bool(e)?(t.dynamicDrop=e,n):t.dynamicDrop},V(e.phaselessTypes,{dragenter:!0,dragleave:!0,dropactivate:!0,dropdeactivate:!0,dropmove:!0,drop:!0}),e.methodDict.drop="dropzone",t.dynamicDrop=!1,i.actions.drop=Ot.defaults;},listeners:{"interactions:before-action-start":function(t){var e=t.interaction;"drag"===e.prepared.name&&(e.dropState={cur:{dropzone:null,element:null},prev:{dropzone:null,element:null},rejected:null,events:null,activeDrops:[]});},"interactions:after-action-start":function(t,e){var n=t.interaction,r=(t.event,t.iEvent);if("drag"===n.prepared.name){var i=n.dropState;i.activeDrops=[],i.events={},i.activeDrops=Et(e,n.element),i.events=St(n,0,r),i.events.activate&&(wt(i.activeDrops,i.events.activate),e.fire("actions/drop:start",{interaction:n,dragEvent:r}));}},"interactions:action-move":Pt,"interactions:after-action-move":function(t,e){var n=t.interaction,r=t.iEvent;if("drag"===n.prepared.name){var i=n.dropState;_t(n,i.events),e.fire("actions/drop:move",{interaction:n,dragEvent:r}),i.events={};}},"interactions:action-end":function(t,e){if("drag"===t.interaction.prepared.name){var n=t.interaction,r=t.iEvent;Pt(t,e),_t(n,n.dropState.events),e.fire("actions/drop:end",{interaction:n,dragEvent:r});}},"interactions:stop":function(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.dropState;n&&(n.activeDrops=null,n.events=null,n.cur.dropzone=null,n.cur.element=null,n.prev.dropzone=null,n.prev.element=null,n.rejected=!1);}}},getActiveDrops:Et,getDrop:Tt,getDropEvents:St,fireDropEvents:_t,filterEventType:function(t){return 0===t.search("drag")||0===t.search("drop")},defaults:{enabled:!1,accept:null,overlap:"pointer"}},kt=Ot;function Dt(t){var e=t.interaction,n=t.iEvent,r=t.phase;if("gesture"===e.prepared.name){var i=e.pointers.map((function(t){return t.pointer})),o="start"===r,a="end"===r,s=e.interactable.options.deltaSource;if(n.touches=[i[0],i[1]],o)n.distance=pt(i,s),n.box=ut(i),n.scale=1,n.ds=0,n.angle=ft(i,s),n.da=0,e.gesture.startDistance=n.distance,e.gesture.startAngle=n.angle;else if(a||e.pointers.length<2){var c=e.prevEvent;n.distance=c.distance,n.box=c.box,n.scale=c.scale,n.ds=0,n.angle=c.angle,n.da=0;}else n.distance=pt(i,s),n.box=ut(i),n.scale=n.distance/e.gesture.startDistance,n.angle=ft(i,s),n.ds=n.scale-e.gesture.scale,n.da=n.angle-e.gesture.angle;e.gesture.distance=n.distance,e.gesture.angle=n.angle,w.number(n.scale)&&n.scale!==1/0&&!isNaN(n.scale)&&(e.gesture.scale=n.scale);}}var It={id:"actions/gesture",before:["actions/drag","actions/resize"],install:function(t){var e=t.actions,n=t.Interactable,r=t.defaults;n.prototype.gesturable=function(t){return w.object(t)?(this.options.gesture.enabled=!1!==t.enabled,this.setPerAction("gesture",t),this.setOnEvents("gesture",t),this):w.bool(t)?(this.options.gesture.enabled=t,this):this.options.gesture},e.map.gesture=It,e.methodDict.gesture="gesturable",r.actions.gesture=It.defaults;},listeners:{"interactions:action-start":Dt,"interactions:action-move":Dt,"interactions:action-end":Dt,"interactions:new":function(t){t.interaction.gesture={angle:0,distance:0,scale:1,startAngle:0,startDistance:0};},"auto-start:check":function(t){if(!(t.interaction.pointers.length<2)){var e=t.interactable.options.gesture;if(e&&e.enabled)return t.action={name:"gesture"},!1}}},defaults:{},getCursor:function(){return ""},filterEventType:function(t){return 0===t.search("gesture")}},Mt=It;function zt(t,e,n,r,i,o,a){if(!e)return !1;if(!0===e){var s=w.number(o.width)?o.width:o.right-o.left,c=w.number(o.height)?o.height:o.bottom-o.top;if(a=Math.min(a,Math.abs(("left"===t||"right"===t?s:c)/2)),s<0&&("left"===t?t="right":"right"===t&&(t="left")),c<0&&("top"===t?t="bottom":"bottom"===t&&(t="top")),"left"===t){var l=s>=0?o.left:o.right;return n.x<l+a}if("top"===t){var u=c>=0?o.top:o.bottom;return n.y<u+a}if("right"===t)return n.x>(s>=0?o.right:o.left)-a;if("bottom"===t)return n.y>(c>=0?o.bottom:o.top)-a}return !!w.element(r)&&(w.element(e)?e===r:F(r,e,i))}function At(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.resizeAxes){var r=e;n.interactable.options.resize.square?("y"===n.resizeAxes?r.delta.x=r.delta.y:r.delta.y=r.delta.x,r.axes="xy"):(r.axes=n.resizeAxes,"x"===n.resizeAxes?r.delta.y=0:"y"===n.resizeAxes&&(r.delta.x=0));}}var Rt,Ct,jt={id:"actions/resize",before:["actions/drag"],install:function(t){var e=t.actions,n=t.browser,r=t.Interactable,i=t.defaults;jt.cursors=function(t){return t.isIe9?{x:"e-resize",y:"s-resize",xy:"se-resize",top:"n-resize",left:"w-resize",bottom:"s-resize",right:"e-resize",topleft:"se-resize",bottomright:"se-resize",topright:"ne-resize",bottomleft:"ne-resize"}:{x:"ew-resize",y:"ns-resize",xy:"nwse-resize",top:"ns-resize",left:"ew-resize",bottom:"ns-resize",right:"ew-resize",topleft:"nwse-resize",bottomright:"nwse-resize",topright:"nesw-resize",bottomleft:"nesw-resize"}}(n),jt.defaultMargin=n.supportsTouch||n.supportsPointerEvent?20:10,r.prototype.resizable=function(e){return function(t,e,n){if(w.object(e))return t.options.resize.enabled=!1!==e.enabled,t.setPerAction("resize",e),t.setOnEvents("resize",e),w.string(e.axis)&&/^x$|^y$|^xy$/.test(e.axis)?t.options.resize.axis=e.axis:null===e.axis&&(t.options.resize.axis=n.defaults.actions.resize.axis),w.bool(e.preserveAspectRatio)?t.options.resize.preserveAspectRatio=e.preserveAspectRatio:w.bool(e.square)&&(t.options.resize.square=e.square),t;if(w.bool(e))return t.options.resize.enabled=e,t;return t.options.resize}(this,e,t)},e.map.resize=jt,e.methodDict.resize="resizable",i.actions.resize=jt.defaults;},listeners:{"interactions:new":function(t){t.interaction.resizeAxes="xy";},"interactions:action-start":function(t){!function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e,i=n.rect;n._rects={start:V({},i),corrected:V({},i),previous:V({},i),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}},r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta;}}(t),At(t);},"interactions:action-move":function(t){!function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e,i=n.interactable.options.resize.invert,o="reposition"===i||"negate"===i,a=n.rect,s=n._rects,c=s.start,l=s.corrected,u=s.delta,p=s.previous;if(V(p,l),o){if(V(l,a),"reposition"===i){if(l.top>l.bottom){var f=l.top;l.top=l.bottom,l.bottom=f;}if(l.left>l.right){var d=l.left;l.left=l.right,l.right=d;}}}else l.top=Math.min(a.top,c.bottom),l.bottom=Math.max(a.bottom,c.top),l.left=Math.min(a.left,c.right),l.right=Math.max(a.right,c.left);for(var h in l.width=l.right-l.left,l.height=l.bottom-l.top,l)u[h]=l[h]-p[h];r.edges=n.prepared.edges,r.rect=l,r.deltaRect=u;}}(t),At(t);},"interactions:action-end":function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e;r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta;}},"auto-start:check":function(t){var e=t.interaction,n=t.interactable,r=t.element,i=t.rect,o=t.buttons;if(i){var a=V({},e.coords.cur.page),s=n.options.resize;if(s&&s.enabled&&(!e.pointerIsDown||!/mouse|pointer/.test(e.pointerType)||0!=(o&s.mouseButtons))){if(w.object(s.edges)){var c={left:!1,right:!1,top:!1,bottom:!1};for(var l in c)c[l]=zt(l,s.edges[l],a,e._latestPointer.eventTarget,r,i,s.margin||jt.defaultMargin);c.left=c.left&&!c.right,c.top=c.top&&!c.bottom,(c.left||c.right||c.top||c.bottom)&&(t.action={name:"resize",edges:c});}else {var u="y"!==s.axis&&a.x>i.right-jt.defaultMargin,p="x"!==s.axis&&a.y>i.bottom-jt.defaultMargin;(u||p)&&(t.action={name:"resize",axes:(u?"x":"")+(p?"y":"")});}return !t.action&&void 0}}}},defaults:{square:!1,preserveAspectRatio:!1,axis:"xy",margin:NaN,edges:null,invert:"none"},cursors:null,getCursor:function(t){var e=t.edges,n=t.axis,r=t.name,i=jt.cursors,o=null;if(n)o=i[r+n];else if(e){for(var a="",s=0,c=["top","bottom","left","right"];s<c.length;s++){var l=c[s];e[l]&&(a+=l);}o=i[a];}return o},filterEventType:function(t){return 0===t.search("resize")},defaultMargin:null},Ft=jt,Xt={id:"actions",install:function(t){t.usePlugin(Mt),t.usePlugin(Ft),t.usePlugin(_),t.usePlugin(kt);}},Yt=0;var Lt={request:function(t){return Rt(t)},cancel:function(t){return Ct(t)},init:function(t){if(Rt=t.requestAnimationFrame,Ct=t.cancelAnimationFrame,!Rt)for(var e=["ms","moz","webkit","o"],n=0;n<e.length;n++){var r=e[n];Rt=t["".concat(r,"RequestAnimationFrame")],Ct=t["".concat(r,"CancelAnimationFrame")]||t["".concat(r,"CancelRequestAnimationFrame")];}Rt=Rt&&Rt.bind(t),Ct=Ct&&Ct.bind(t),Rt||(Rt=function(e){var n=Date.now(),r=Math.max(0,16-(n-Yt)),i=t.setTimeout((function(){e(n+r);}),r);return Yt=n+r,i},Ct=function(t){return clearTimeout(t)});}};var qt={defaults:{enabled:!1,margin:60,container:null,speed:300},now:Date.now,interaction:null,i:0,x:0,y:0,isScrolling:!1,prevTime:0,margin:0,speed:0,start:function(t){qt.isScrolling=!0,Lt.cancel(qt.i),t.autoScroll=qt,qt.interaction=t,qt.prevTime=qt.now(),qt.i=Lt.request(qt.scroll);},stop:function(){qt.isScrolling=!1,qt.interaction&&(qt.interaction.autoScroll=null),Lt.cancel(qt.i);},scroll:function(){var t=qt.interaction,e=t.interactable,n=t.element,r=t.prepared.name,i=e.options[r].autoScroll,o=Bt(i.container,e,n),a=qt.now(),s=(a-qt.prevTime)/1e3,c=i.speed*s;if(c>=1){var l={x:qt.x*c,y:qt.y*c};if(l.x||l.y){var u=Vt(o);w.window(o)?o.scrollBy(l.x,l.y):o&&(o.scrollLeft+=l.x,o.scrollTop+=l.y);var p=Vt(o),f={x:p.x-u.x,y:p.y-u.y};(f.x||f.y)&&e.fire({type:"autoscroll",target:n,interactable:e,delta:f,interaction:t,container:o});}qt.prevTime=a;}qt.isScrolling&&(Lt.cancel(qt.i),qt.i=Lt.request(qt.scroll));},check:function(t,e){var n;return null==(n=t.options[e].autoScroll)?void 0:n.enabled},onInteractionMove:function(t){var e=t.interaction,n=t.pointer;if(e.interacting()&&qt.check(e.interactable,e.prepared.name))if(e.simulation)qt.x=qt.y=0;else {var r,i,o,a,s=e.interactable,c=e.element,l=e.prepared.name,u=s.options[l].autoScroll,p=Bt(u.container,s,c);if(w.window(p))a=n.clientX<qt.margin,r=n.clientY<qt.margin,i=n.clientX>p.innerWidth-qt.margin,o=n.clientY>p.innerHeight-qt.margin;else {var f=Y(p);a=n.clientX<f.left+qt.margin,r=n.clientY<f.top+qt.margin,i=n.clientX>f.right-qt.margin,o=n.clientY>f.bottom-qt.margin;}qt.x=i?1:a?-1:0,qt.y=o?1:r?-1:0,qt.isScrolling||(qt.margin=u.margin,qt.speed=u.speed,qt.start(e));}}};function Bt(t,e,n){return (w.string(t)?W(t,e,n):t)||y(n)}function Vt(t){return w.window(t)&&(t=window.document.body),{x:t.scrollLeft,y:t.scrollTop}}var Wt={id:"auto-scroll",install:function(t){var e=t.defaults,n=t.actions;t.autoScroll=qt,qt.now=function(){return t.now()},n.phaselessTypes.autoscroll=!0,e.perAction.autoScroll=qt.defaults;},listeners:{"interactions:new":function(t){t.interaction.autoScroll=null;},"interactions:destroy":function(t){t.interaction.autoScroll=null,qt.stop(),qt.interaction&&(qt.interaction=null);},"interactions:stop":qt.stop,"interactions:action-move":function(t){return qt.onInteractionMove(t)}}},Gt=Wt;function Nt(t,e){var n=!1;return function(){return n||(g.console.warn(e),n=!0),t.apply(this,arguments)}}function Ut(t,e){return t.name=e.name,t.axis=e.axis,t.edges=e.edges,t}function Ht(t){return w.bool(t)?(this.options.styleCursor=t,this):null===t?(delete this.options.styleCursor,this):this.options.styleCursor}function Kt(t){return w.func(t)?(this.options.actionChecker=t,this):null===t?(delete this.options.actionChecker,this):this.options.actionChecker}var $t={id:"auto-start/interactableMethods",install:function(t){var e=t.Interactable;e.prototype.getAction=function(e,n,r,i){var o=function(t,e,n,r,i){var o=t.getRect(r),a=e.buttons||{0:1,1:4,3:8,4:16}[e.button],s={action:null,interactable:t,interaction:n,element:r,rect:o,buttons:a};return i.fire("auto-start:check",s),s.action}(this,n,r,i,t);return this.options.actionChecker?this.options.actionChecker(e,n,o,this,i,r):o},e.prototype.ignoreFrom=Nt((function(t){return this._backCompatOption("ignoreFrom",t)}),"Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."),e.prototype.allowFrom=Nt((function(t){return this._backCompatOption("allowFrom",t)}),"Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."),e.prototype.actionChecker=Kt,e.prototype.styleCursor=Ht;}};function Jt(t,e,n,r,i){return e.testIgnoreAllow(e.options[t.name],n,r)&&e.options[t.name].enabled&&ee(e,n,t,i)?t:null}function Qt(t,e,n,r,i,o,a){for(var s=0,c=r.length;s<c;s++){var l=r[s],u=i[s],p=l.getAction(e,n,t,u);if(p){var f=Jt(p,l,u,o,a);if(f)return {action:f,interactable:l,element:u}}}return {action:null,interactable:null,element:null}}function Zt(t,e,n,r,i){var o=[],a=[],s=r;function c(t){o.push(t),a.push(s);}for(;w.element(s);){o=[],a=[],i.interactables.forEachMatch(s,c);var l=Qt(t,e,n,o,a,r,i);if(l.action&&!l.interactable.options[l.action.name].manualStart)return l;s=A(s);}return {action:null,interactable:null,element:null}}function te(t,e,n){var r=e.action,i=e.interactable,o=e.element;r=r||{name:null},t.interactable=i,t.element=o,Ut(t.prepared,r),t.rect=i&&r.name?i.getRect(o):null,ie(t,n),n.fire("autoStart:prepared",{interaction:t});}function ee(t,e,n,r){var i=t.options,o=i[n.name].max,a=i[n.name].maxPerElement,s=r.autoStart.maxInteractions,c=0,l=0,u=0;if(!(o&&a&&s))return !1;for(var p=0,f=r.interactions.list;p<f.length;p++){var d=f[p],h=d.prepared.name;if(d.interacting()){if(++c>=s)return !1;if(d.interactable===t){if((l+=h===n.name?1:0)>=o)return !1;if(d.element===e&&(u++,h===n.name&&u>=a))return !1}}}return s>0}function ne(t,e){return w.number(t)?(e.autoStart.maxInteractions=t,this):e.autoStart.maxInteractions}function re(t,e,n){var r=n.autoStart.cursorElement;r&&r!==t&&(r.style.cursor=""),t.ownerDocument.documentElement.style.cursor=e,t.style.cursor=e,n.autoStart.cursorElement=e?t:null;}function ie(t,e){var n=t.interactable,r=t.element,i=t.prepared;if("mouse"===t.pointerType&&n&&n.options.styleCursor){var o="";if(i.name){var a=n.options[i.name].cursorChecker;o=w.func(a)?a(i,n,r,t._interacting):e.actions.map[i.name].getCursor(i);}re(t.element,o||"",e);}else e.autoStart.cursorElement&&re(e.autoStart.cursorElement,"",e);}var oe={id:"auto-start/base",before:["actions"],install:function(t){var e=t.interactStatic,n=t.defaults;t.usePlugin($t),n.base.actionChecker=null,n.base.styleCursor=!0,V(n.perAction,{manualStart:!1,max:1/0,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}),e.maxInteractions=function(e){return ne(e,t)},t.autoStart={maxInteractions:1/0,withinInteractionLimit:ee,cursorElement:null};},listeners:{"interactions:down":function(t,e){var n=t.interaction,r=t.pointer,i=t.event,o=t.eventTarget;n.interacting()||te(n,Zt(n,r,i,o,e),e);},"interactions:move":function(t,e){!function(t,e){var n=t.interaction,r=t.pointer,i=t.event,o=t.eventTarget;"mouse"!==n.pointerType||n.pointerIsDown||n.interacting()||te(n,Zt(n,r,i,o,e),e);}(t,e),function(t,e){var n=t.interaction;if(n.pointerIsDown&&!n.interacting()&&n.pointerWasMoved&&n.prepared.name){e.fire("autoStart:before-start",t);var r=n.interactable,i=n.prepared.name;i&&r&&(r.options[i].manualStart||!ee(r,n.element,n.prepared,e)?n.stop():(n.start(n.prepared,r,n.element),ie(n,e)));}}(t,e);},"interactions:stop":function(t,e){var n=t.interaction,r=n.interactable;r&&r.options.styleCursor&&re(n.element,"",e);}},maxInteractions:ne,withinInteractionLimit:ee,validateAction:Jt},ae=oe;var se={id:"auto-start/dragAxis",listeners:{"autoStart:before-start":function(t,e){var n=t.interaction,r=t.eventTarget,i=t.dx,o=t.dy;if("drag"===n.prepared.name){var a=Math.abs(i),s=Math.abs(o),c=n.interactable.options.drag,l=c.startAxis,u=a>s?"x":a<s?"y":"xy";if(n.prepared.axis="start"===c.lockAxis?u[0]:c.lockAxis,"xy"!==u&&"xy"!==l&&l!==u){n.prepared.name=null;for(var p=r,f=function(t){if(t!==n.interactable){var i=n.interactable.options.drag;if(!i.manualStart&&t.testIgnoreAllow(i,p,r)){var o=t.getAction(n.downPointer,n.downEvent,n,p);if(o&&"drag"===o.name&&function(t,e){if(!e)return !1;var n=e.options.drag.startAxis;return "xy"===t||"xy"===n||n===t}(u,t)&&ae.validateAction(o,t,p,r,e))return t}}};w.element(p);){var d=e.interactables.forEachMatch(p,f);if(d){n.prepared.name="drag",n.interactable=d,n.element=p;break}p=A(p);}}}}}};function ce(t){var e=t.prepared&&t.prepared.name;if(!e)return null;var n=t.interactable.options;return n[e].hold||n[e].delay}var le={id:"auto-start/hold",install:function(t){var e=t.defaults;t.usePlugin(ae),e.perAction.hold=0,e.perAction.delay=0;},listeners:{"interactions:new":function(t){t.interaction.autoStartHoldTimer=null;},"autoStart:prepared":function(t){var e=t.interaction,n=ce(e);n>0&&(e.autoStartHoldTimer=setTimeout((function(){e.start(e.prepared,e.interactable,e.element);}),n));},"interactions:move":function(t){var e=t.interaction,n=t.duplicate;e.autoStartHoldTimer&&e.pointerWasMoved&&!n&&(clearTimeout(e.autoStartHoldTimer),e.autoStartHoldTimer=null);},"autoStart:before-start":function(t){var e=t.interaction;ce(e)>0&&(e.prepared.name=null);}},getHoldDuration:ce},ue=le,pe={id:"auto-start",install:function(t){t.usePlugin(ae),t.usePlugin(ue),t.usePlugin(se);}},fe=function(t){return /^(always|never|auto)$/.test(t)?(this.options.preventDefault=t,this):w.bool(t)?(this.options.preventDefault=t?"always":"never",this):this.options.preventDefault};function de(t){var e=t.interaction,n=t.event;e.interactable&&e.interactable.checkAndPreventDefault(n);}var he={id:"core/interactablePreventDefault",install:function(t){var e=t.Interactable;e.prototype.preventDefault=fe,e.prototype.checkAndPreventDefault=function(e){return function(t,e,n){var r=t.options.preventDefault;if("never"!==r)if("always"!==r){if(e.events.supportsPassive&&/^touch(start|move)$/.test(n.type)){var i=y(n.target).document,o=e.getDocOptions(i);if(!o||!o.events||!1!==o.events.passive)return}/^(mouse|pointer|touch)*(down|start)/i.test(n.type)||w.element(n.target)&&R(n.target,"input,select,textarea,[contenteditable=true],[contenteditable=true] *")||n.preventDefault();}else n.preventDefault();}(this,t,e)},t.interactions.docEvents.push({type:"dragstart",listener:function(e){for(var n=0,r=t.interactions.list;n<r.length;n++){var i=r[n];if(i.element&&(i.element===e.target||M(i.element,e.target)))return void i.interactable.checkAndPreventDefault(e)}}});},listeners:["down","move","up","cancel"].reduce((function(t,e){return t["interactions:".concat(e)]=de,t}),{})};function ve(t,e){if(e.phaselessTypes[t])return !0;for(var n in e.map)if(0===t.indexOf(n)&&t.substr(n.length)in e.phases)return !0;return !1}function ge(t){var e={};for(var n in t){var r=t[n];w.plainObject(r)?e[n]=ge(r):w.array(r)?e[n]=mt(r):e[n]=r;}return e}var me=function(){function t(e){r(this,t),this.states=[],this.startOffset={left:0,right:0,top:0,bottom:0},this.startDelta=void 0,this.result=void 0,this.endResult=void 0,this.startEdges=void 0,this.edges=void 0,this.interaction=void 0,this.interaction=e,this.result=ye(),this.edges={left:!1,right:!1,top:!1,bottom:!1};}return o(t,[{key:"start",value:function(t,e){var n,r,i=t.phase,o=this.interaction,a=function(t){var e=t.interactable.options[t.prepared.name],n=e.modifiers;if(n&&n.length)return n;return ["snap","snapSize","snapEdges","restrict","restrictEdges","restrictSize"].map((function(t){var n=e[t];return n&&n.enabled&&{options:n,methods:n._methods}})).filter((function(t){return !!t}))}(o);this.prepareStates(a),this.startEdges=V({},o.edges),this.edges=V({},this.startEdges),this.startOffset=(n=o.rect,r=e,n?{left:r.x-n.left,top:r.y-n.top,right:n.right-r.x,bottom:n.bottom-r.y}:{left:0,top:0,right:0,bottom:0}),this.startDelta={x:0,y:0};var s=this.fillArg({phase:i,pageCoords:e,preEnd:!1});return this.result=ye(),this.startAll(s),this.result=this.setAll(s)}},{key:"fillArg",value:function(t){var e=this.interaction;return t.interaction=e,t.interactable=e.interactable,t.element=e.element,t.rect||(t.rect=e.rect),t.edges||(t.edges=this.startEdges),t.startOffset=this.startOffset,t}},{key:"startAll",value:function(t){for(var e=0,n=this.states;e<n.length;e++){var r=n[e];r.methods.start&&(t.state=r,r.methods.start(t));}}},{key:"setAll",value:function(t){var e=t.phase,n=t.preEnd,r=t.skipModifiers,i=t.rect,o=t.edges;t.coords=V({},t.pageCoords),t.rect=V({},i),t.edges=V({},o);for(var a=r?this.states.slice(r):this.states,s=ye(t.coords,t.rect),c=0;c<a.length;c++){var l,u=a[c],p=u.options,f=V({},t.coords),d=null;null!=(l=u.methods)&&l.set&&this.shouldDo(p,n,e)&&(t.state=u,d=u.methods.set(t),H(t.edges,t.rect,{x:t.coords.x-f.x,y:t.coords.y-f.y})),s.eventProps.push(d);}V(this.edges,t.edges),s.delta.x=t.coords.x-t.pageCoords.x,s.delta.y=t.coords.y-t.pageCoords.y,s.rectDelta.left=t.rect.left-i.left,s.rectDelta.right=t.rect.right-i.right,s.rectDelta.top=t.rect.top-i.top,s.rectDelta.bottom=t.rect.bottom-i.bottom;var h=this.result.coords,v=this.result.rect;if(h&&v){var g=s.rect.left!==v.left||s.rect.right!==v.right||s.rect.top!==v.top||s.rect.bottom!==v.bottom;s.changed=g||h.x!==s.coords.x||h.y!==s.coords.y;}return s}},{key:"applyToInteraction",value:function(t){var e=this.interaction,n=t.phase,r=e.coords.cur,i=e.coords.start,o=this.result,a=this.startDelta,s=o.delta;"start"===n&&V(this.startDelta,o.delta);for(var c=0,l=[[i,a],[r,s]];c<l.length;c++){var u=l[c],p=u[0],f=u[1];p.page.x+=f.x,p.page.y+=f.y,p.client.x+=f.x,p.client.y+=f.y;}var d=this.result.rectDelta,h=t.rect||e.rect;h.left+=d.left,h.right+=d.right,h.top+=d.top,h.bottom+=d.bottom,h.width=h.right-h.left,h.height=h.bottom-h.top;}},{key:"setAndApply",value:function(t){var e=this.interaction,n=t.phase,r=t.preEnd,i=t.skipModifiers,o=this.setAll(this.fillArg({preEnd:r,phase:n,pageCoords:t.modifiedCoords||e.coords.cur.page}));if(this.result=o,!o.changed&&(!i||i<this.states.length)&&e.interacting())return !1;if(t.modifiedCoords){var a=e.coords.cur.page,s={x:t.modifiedCoords.x-a.x,y:t.modifiedCoords.y-a.y};o.coords.x+=s.x,o.coords.y+=s.y,o.delta.x+=s.x,o.delta.y+=s.y;}this.applyToInteraction(t);}},{key:"beforeEnd",value:function(t){var e=t.interaction,n=t.event,r=this.states;if(r&&r.length){for(var i=!1,o=0;o<r.length;o++){var a=r[o];t.state=a;var s=a.options,c=a.methods,l=c.beforeEnd&&c.beforeEnd(t);if(l)return this.endResult=l,!1;i=i||!i&&this.shouldDo(s,!0,t.phase,!0);}i&&e.move({event:n,preEnd:!0});}}},{key:"stop",value:function(t){var e=t.interaction;if(this.states&&this.states.length){var n=V({states:this.states,interactable:e.interactable,element:e.element,rect:null},t);this.fillArg(n);for(var r=0,i=this.states;r<i.length;r++){var o=i[r];n.state=o,o.methods.stop&&o.methods.stop(n);}this.states=null,this.endResult=null;}}},{key:"prepareStates",value:function(t){this.states=[];for(var e=0;e<t.length;e++){var n=t[e],r=n.options,i=n.methods,o=n.name;this.states.push({options:r,methods:i,index:e,name:o});}return this.states}},{key:"restoreInteractionCoords",value:function(t){var e=t.interaction,n=e.coords,r=e.rect,i=e.modification;if(i.result){for(var o=i.startDelta,a=i.result,s=a.delta,c=a.rectDelta,l=0,u=[[n.start,o],[n.cur,s]];l<u.length;l++){var p=u[l],f=p[0],d=p[1];f.page.x-=d.x,f.page.y-=d.y,f.client.x-=d.x,f.client.y-=d.y;}r.left-=c.left,r.right-=c.right,r.top-=c.top,r.bottom-=c.bottom;}}},{key:"shouldDo",value:function(t,e,n,r){return !(!t||!1===t.enabled||r&&!t.endOnly||t.endOnly&&!e||"start"===n&&!t.setStart)}},{key:"copyFrom",value:function(t){this.startOffset=t.startOffset,this.startDelta=t.startDelta,this.startEdges=t.startEdges,this.edges=t.edges,this.states=t.states.map((function(t){return ge(t)})),this.result=ye(V({},t.result.coords),V({},t.result.rect));}},{key:"destroy",value:function(){for(var t in this)this[t]=null;}}]),t}();function ye(t,e){return {rect:e,coords:t,delta:{x:0,y:0},rectDelta:{left:0,right:0,top:0,bottom:0},eventProps:[],changed:!0}}function be(t,e){var n=t.defaults,r={start:t.start,set:t.set,beforeEnd:t.beforeEnd,stop:t.stop},i=function(t){var i=t||{};for(var o in i.enabled=!1!==i.enabled,n)o in i||(i[o]=n[o]);var a={options:i,methods:r,name:e,enable:function(){return i.enabled=!0,a},disable:function(){return i.enabled=!1,a}};return a};return e&&"string"==typeof e&&(i._defaults=n,i._methods=r),i}function xe(t){var e=t.iEvent,n=t.interaction.modification.result;n&&(e.modifiers=n.eventProps);}var we={id:"modifiers/base",before:["actions"],install:function(t){t.defaults.perAction.modifiers=[];},listeners:{"interactions:new":function(t){var e=t.interaction;e.modification=new me(e);},"interactions:before-action-start":function(t){var e=t.interaction,n=t.interaction.modification;n.start(t,e.coords.start.page),e.edges=n.edges,n.applyToInteraction(t);},"interactions:before-action-move":function(t){var e=t.interaction,n=e.modification,r=n.setAndApply(t);return e.edges=n.edges,r},"interactions:before-action-end":function(t){var e=t.interaction,n=e.modification,r=n.beforeEnd(t);return e.edges=n.startEdges,r},"interactions:action-start":xe,"interactions:action-move":xe,"interactions:action-end":xe,"interactions:after-action-start":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:after-action-move":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:stop":function(t){return t.interaction.modification.stop(t)}}},Ee=we,Te={base:{preventDefault:"auto",deltaSource:"page"},perAction:{enabled:!1,origin:{x:0,y:0}},actions:{}},Se=function(t){s(n,t);var e=p(n);function n(t,i,o,a,s,c,l){var p;r(this,n),(p=e.call(this,t)).relatedTarget=null,p.screenX=void 0,p.screenY=void 0,p.button=void 0,p.buttons=void 0,p.ctrlKey=void 0,p.shiftKey=void 0,p.altKey=void 0,p.metaKey=void 0,p.page=void 0,p.client=void 0,p.delta=void 0,p.rect=void 0,p.x0=void 0,p.y0=void 0,p.t0=void 0,p.dt=void 0,p.duration=void 0,p.clientX0=void 0,p.clientY0=void 0,p.velocity=void 0,p.speed=void 0,p.swipe=void 0,p.axes=void 0,p.preEnd=void 0,s=s||t.element;var f=t.interactable,d=(f&&f.options||Te).deltaSource,h=K(f,s,o),v="start"===a,g="end"===a,m=v?u(p):t.prevEvent,y=v?t.coords.start:g?{page:m.page,client:m.client,timeStamp:t.coords.cur.timeStamp}:t.coords.cur;return p.page=V({},y.page),p.client=V({},y.client),p.rect=V({},t.rect),p.timeStamp=y.timeStamp,g||(p.page.x-=h.x,p.page.y-=h.y,p.client.x-=h.x,p.client.y-=h.y),p.ctrlKey=i.ctrlKey,p.altKey=i.altKey,p.shiftKey=i.shiftKey,p.metaKey=i.metaKey,p.button=i.button,p.buttons=i.buttons,p.target=s,p.currentTarget=s,p.preEnd=c,p.type=l||o+(a||""),p.interactable=f,p.t0=v?t.pointers[t.pointers.length-1].downTime:m.t0,p.x0=t.coords.start.page.x-h.x,p.y0=t.coords.start.page.y-h.y,p.clientX0=t.coords.start.client.x-h.x,p.clientY0=t.coords.start.client.y-h.y,p.delta=v||g?{x:0,y:0}:{x:p[d].x-m[d].x,y:p[d].y-m[d].y},p.dt=t.coords.delta.timeStamp,p.duration=p.timeStamp-p.t0,p.velocity=V({},t.coords.velocity[d]),p.speed=Q(p.velocity.x,p.velocity.y),p.swipe=g||"inertiastart"===a?p.getSwipe():null,p}return o(n,[{key:"getSwipe",value:function(){var t=this._interaction;if(t.prevEvent.speed<600||this.timeStamp-t.prevEvent.timeStamp>150)return null;var e=180*Math.atan2(t.prevEvent.velocityY,t.prevEvent.velocityX)/Math.PI;e<0&&(e+=360);var n=112.5<=e&&e<247.5,r=202.5<=e&&e<337.5;return {up:r,down:!r&&22.5<=e&&e<157.5,left:n,right:!n&&(292.5<=e||e<67.5),angle:e,speed:t.prevEvent.speed,velocity:{x:t.prevEvent.velocityX,y:t.prevEvent.velocityY}}}},{key:"preventDefault",value:function(){}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0;}},{key:"stopPropagation",value:function(){this.propagationStopped=!0;}}]),n}(vt);Object.defineProperties(Se.prototype,{pageX:{get:function(){return this.page.x},set:function(t){this.page.x=t;}},pageY:{get:function(){return this.page.y},set:function(t){this.page.y=t;}},clientX:{get:function(){return this.client.x},set:function(t){this.client.x=t;}},clientY:{get:function(){return this.client.y},set:function(t){this.client.y=t;}},dx:{get:function(){return this.delta.x},set:function(t){this.delta.x=t;}},dy:{get:function(){return this.delta.y},set:function(t){this.delta.y=t;}},velocityX:{get:function(){return this.velocity.x},set:function(t){this.velocity.x=t;}},velocityY:{get:function(){return this.velocity.y},set:function(t){this.velocity.y=t;}}});var _e=o((function t(e,n,i,o,a){r(this,t),this.id=void 0,this.pointer=void 0,this.event=void 0,this.downTime=void 0,this.downTarget=void 0,this.id=e,this.pointer=n,this.event=i,this.downTime=o,this.downTarget=a;})),Pe=function(t){return t.interactable="",t.element="",t.prepared="",t.pointerIsDown="",t.pointerWasMoved="",t._proxy="",t}({}),Oe=function(t){return t.start="",t.move="",t.end="",t.stop="",t.interacting="",t}({}),ke=0,De=function(){function t(e){var n=this,i=e.pointerType,o=e.scopeFire;r(this,t),this.interactable=null,this.element=null,this.rect=null,this._rects=void 0,this.edges=null,this._scopeFire=void 0,this.prepared={name:null,axis:null,edges:null},this.pointerType=void 0,this.pointers=[],this.downEvent=null,this.downPointer={},this._latestPointer={pointer:null,event:null,eventTarget:null},this.prevEvent=null,this.pointerIsDown=!1,this.pointerWasMoved=!1,this._interacting=!1,this._ending=!1,this._stopped=!0,this._proxy=void 0,this.simulation=null,this.doMove=Nt((function(t){this.move(t);}),"The interaction.doMove() method has been renamed to interaction.move()"),this.coords={start:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},prev:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},cur:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},delta:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},velocity:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0}},this._id=ke++,this._scopeFire=o,this.pointerType=i;var a=this;this._proxy={};var s=function(t){Object.defineProperty(n._proxy,t,{get:function(){return a[t]}});};for(var c in Pe)s(c);var l=function(t){Object.defineProperty(n._proxy,t,{value:function(){return a[t].apply(a,arguments)}});};for(var u in Oe)l(u);this._scopeFire("interactions:new",{interaction:this});}return o(t,[{key:"pointerMoveTolerance",get:function(){return 1}},{key:"pointerDown",value:function(t,e,n){var r=this.updatePointer(t,e,n,!0),i=this.pointers[r];this._scopeFire("interactions:down",{pointer:t,event:e,eventTarget:n,pointerIndex:r,pointerInfo:i,type:"down",interaction:this});}},{key:"start",value:function(t,e,n){return !(this.interacting()||!this.pointerIsDown||this.pointers.length<("gesture"===t.name?2:1)||!e.options[t.name].enabled)&&(Ut(this.prepared,t),this.interactable=e,this.element=n,this.rect=e.getRect(n),this.edges=this.prepared.edges?V({},this.prepared.edges):{left:!0,right:!0,top:!0,bottom:!0},this._stopped=!1,this._interacting=this._doPhase({interaction:this,event:this.downEvent,phase:"start"})&&!this._stopped,this._interacting)}},{key:"pointerMove",value:function(t,e,n){this.simulation||this.modification&&this.modification.endResult||this.updatePointer(t,e,n,!1);var r,i,o=this.coords.cur.page.x===this.coords.prev.page.x&&this.coords.cur.page.y===this.coords.prev.page.y&&this.coords.cur.client.x===this.coords.prev.client.x&&this.coords.cur.client.y===this.coords.prev.client.y;this.pointerIsDown&&!this.pointerWasMoved&&(r=this.coords.cur.client.x-this.coords.start.client.x,i=this.coords.cur.client.y-this.coords.start.client.y,this.pointerWasMoved=Q(r,i)>this.pointerMoveTolerance);var a,s,c,l=this.getPointerIndex(t),u={pointer:t,pointerIndex:l,pointerInfo:this.pointers[l],event:e,type:"move",eventTarget:n,dx:r,dy:i,duplicate:o,interaction:this};o||(a=this.coords.velocity,s=this.coords.delta,c=Math.max(s.timeStamp/1e3,.001),a.page.x=s.page.x/c,a.page.y=s.page.y/c,a.client.x=s.client.x/c,a.client.y=s.client.y/c,a.timeStamp=c),this._scopeFire("interactions:move",u),o||this.simulation||(this.interacting()&&(u.type=null,this.move(u)),this.pointerWasMoved&&et(this.coords.prev,this.coords.cur));}},{key:"move",value:function(t){t&&t.event||nt(this.coords.delta),(t=V({pointer:this._latestPointer.pointer,event:this._latestPointer.event,eventTarget:this._latestPointer.eventTarget,interaction:this},t||{})).phase="move",this._doPhase(t);}},{key:"pointerUp",value:function(t,e,n,r){var i=this.getPointerIndex(t);-1===i&&(i=this.updatePointer(t,e,n,!1));var o=/cancel$/i.test(e.type)?"cancel":"up";this._scopeFire("interactions:".concat(o),{pointer:t,pointerIndex:i,pointerInfo:this.pointers[i],event:e,eventTarget:n,type:o,curEventTarget:r,interaction:this}),this.simulation||this.end(e),this.removePointer(t,e);}},{key:"documentBlur",value:function(t){this.end(t),this._scopeFire("interactions:blur",{event:t,type:"blur",interaction:this});}},{key:"end",value:function(t){var e;this._ending=!0,t=t||this._latestPointer.event,this.interacting()&&(e=this._doPhase({event:t,interaction:this,phase:"end"})),this._ending=!1,!0===e&&this.stop();}},{key:"currentAction",value:function(){return this._interacting?this.prepared.name:null}},{key:"interacting",value:function(){return this._interacting}},{key:"stop",value:function(){this._scopeFire("interactions:stop",{interaction:this}),this.interactable=this.element=null,this._interacting=!1,this._stopped=!0,this.prepared.name=this.prevEvent=null;}},{key:"getPointerIndex",value:function(t){var e=at(t);return "mouse"===this.pointerType||"pen"===this.pointerType?this.pointers.length-1:yt(this.pointers,(function(t){return t.id===e}))}},{key:"getPointerInfo",value:function(t){return this.pointers[this.getPointerIndex(t)]}},{key:"updatePointer",value:function(t,e,n,r){var i,o,a,s=at(t),c=this.getPointerIndex(t),l=this.pointers[c];return r=!1!==r&&(r||/(down|start)$/i.test(e.type)),l?l.pointer=t:(l=new _e(s,t,e,null,null),c=this.pointers.length,this.pointers.push(l)),st(this.coords.cur,this.pointers.map((function(t){return t.pointer})),this._now()),i=this.coords.delta,o=this.coords.prev,a=this.coords.cur,i.page.x=a.page.x-o.page.x,i.page.y=a.page.y-o.page.y,i.client.x=a.client.x-o.client.x,i.client.y=a.client.y-o.client.y,i.timeStamp=a.timeStamp-o.timeStamp,r&&(this.pointerIsDown=!0,l.downTime=this.coords.cur.timeStamp,l.downTarget=n,tt(this.downPointer,t),this.interacting()||(et(this.coords.start,this.coords.cur),et(this.coords.prev,this.coords.cur),this.downEvent=e,this.pointerWasMoved=!1)),this._updateLatestPointer(t,e,n),this._scopeFire("interactions:update-pointer",{pointer:t,event:e,eventTarget:n,down:r,pointerInfo:l,pointerIndex:c,interaction:this}),c}},{key:"removePointer",value:function(t,e){var n=this.getPointerIndex(t);if(-1!==n){var r=this.pointers[n];this._scopeFire("interactions:remove-pointer",{pointer:t,event:e,eventTarget:null,pointerIndex:n,pointerInfo:r,interaction:this}),this.pointers.splice(n,1),this.pointerIsDown=!1;}}},{key:"_updateLatestPointer",value:function(t,e,n){this._latestPointer.pointer=t,this._latestPointer.event=e,this._latestPointer.eventTarget=n;}},{key:"destroy",value:function(){this._latestPointer.pointer=null,this._latestPointer.event=null,this._latestPointer.eventTarget=null;}},{key:"_createPreparedEvent",value:function(t,e,n,r){return new Se(this,t,this.prepared.name,e,this.element,n,r)}},{key:"_fireEvent",value:function(t){var e;null==(e=this.interactable)||e.fire(t),(!this.prevEvent||t.timeStamp>=this.prevEvent.timeStamp)&&(this.prevEvent=t);}},{key:"_doPhase",value:function(t){var e=t.event,n=t.phase,r=t.preEnd,i=t.type,o=this.rect;if(o&&"move"===n&&(H(this.edges,o,this.coords.delta[this.interactable.options.deltaSource]),o.width=o.right-o.left,o.height=o.bottom-o.top),!1===this._scopeFire("interactions:before-action-".concat(n),t))return !1;var a=t.iEvent=this._createPreparedEvent(e,n,r,i);return this._scopeFire("interactions:action-".concat(n),t),"start"===n&&(this.prevEvent=a),this._fireEvent(a),this._scopeFire("interactions:after-action-".concat(n),t),!0}},{key:"_now",value:function(){return Date.now()}}]),t}();function Ie(t){Me(t.interaction);}function Me(t){if(!function(t){return !(!t.offset.pending.x&&!t.offset.pending.y)}(t))return !1;var e=t.offset.pending;return Ae(t.coords.cur,e),Ae(t.coords.delta,e),H(t.edges,t.rect,e),e.x=0,e.y=0,!0}function ze(t){var e=t.x,n=t.y;this.offset.pending.x+=e,this.offset.pending.y+=n,this.offset.total.x+=e,this.offset.total.y+=n;}function Ae(t,e){var n=t.page,r=t.client,i=e.x,o=e.y;n.x+=i,n.y+=o,r.x+=i,r.y+=o;}Oe.offsetBy="";var Re={id:"offset",before:["modifiers","pointer-events","actions","inertia"],install:function(t){t.Interaction.prototype.offsetBy=ze;},listeners:{"interactions:new":function(t){t.interaction.offset={total:{x:0,y:0},pending:{x:0,y:0}};},"interactions:update-pointer":function(t){return function(t){t.pointerIsDown&&(Ae(t.coords.cur,t.offset.total),t.offset.pending.x=0,t.offset.pending.y=0);}(t.interaction)},"interactions:before-action-start":Ie,"interactions:before-action-move":Ie,"interactions:before-action-end":function(t){var e=t.interaction;if(Me(e))return e.move({offset:!0}),e.end(),!1},"interactions:stop":function(t){var e=t.interaction;e.offset.total.x=0,e.offset.total.y=0,e.offset.pending.x=0,e.offset.pending.y=0;}}},Ce=Re;var je=function(){function t(e){r(this,t),this.active=!1,this.isModified=!1,this.smoothEnd=!1,this.allowResume=!1,this.modification=void 0,this.modifierCount=0,this.modifierArg=void 0,this.startCoords=void 0,this.t0=0,this.v0=0,this.te=0,this.targetOffset=void 0,this.modifiedOffset=void 0,this.currentOffset=void 0,this.lambda_v0=0,this.one_ve_v0=0,this.timeout=void 0,this.interaction=void 0,this.interaction=e;}return o(t,[{key:"start",value:function(t){var e=this.interaction,n=Fe(e);if(!n||!n.enabled)return !1;var r=e.coords.velocity.client,i=Q(r.x,r.y),o=this.modification||(this.modification=new me(e));if(o.copyFrom(e.modification),this.t0=e._now(),this.allowResume=n.allowResume,this.v0=i,this.currentOffset={x:0,y:0},this.startCoords=e.coords.cur.page,this.modifierArg=o.fillArg({pageCoords:this.startCoords,preEnd:!0,phase:"inertiastart"}),this.t0-e.coords.cur.timeStamp<50&&i>n.minSpeed&&i>n.endSpeed)this.startInertia();else {if(o.result=o.setAll(this.modifierArg),!o.result.changed)return !1;this.startSmoothEnd();}return e.modification.result.rect=null,e.offsetBy(this.targetOffset),e._doPhase({interaction:e,event:t,phase:"inertiastart"}),e.offsetBy({x:-this.targetOffset.x,y:-this.targetOffset.y}),e.modification.result.rect=null,this.active=!0,e.simulation=this,!0}},{key:"startInertia",value:function(){var t=this,e=this.interaction.coords.velocity.client,n=Fe(this.interaction),r=n.resistance,i=-Math.log(n.endSpeed/this.v0)/r;this.targetOffset={x:(e.x-i)/r,y:(e.y-i)/r},this.te=i,this.lambda_v0=r/this.v0,this.one_ve_v0=1-n.endSpeed/this.v0;var o=this.modification,a=this.modifierArg;a.pageCoords={x:this.startCoords.x+this.targetOffset.x,y:this.startCoords.y+this.targetOffset.y},o.result=o.setAll(a),o.result.changed&&(this.isModified=!0,this.modifiedOffset={x:this.targetOffset.x+o.result.delta.x,y:this.targetOffset.y+o.result.delta.y}),this.onNextFrame((function(){return t.inertiaTick()}));}},{key:"startSmoothEnd",value:function(){var t=this;this.smoothEnd=!0,this.isModified=!0,this.targetOffset={x:this.modification.result.delta.x,y:this.modification.result.delta.y},this.onNextFrame((function(){return t.smoothEndTick()}));}},{key:"onNextFrame",value:function(t){var e=this;this.timeout=Lt.request((function(){e.active&&t();}));}},{key:"inertiaTick",value:function(){var t,e,n,r,i,o,a,s=this,c=this.interaction,l=Fe(c).resistance,u=(c._now()-this.t0)/1e3;if(u<this.te){var p,f=1-(Math.exp(-l*u)-this.lambda_v0)/this.one_ve_v0;this.isModified?(t=0,e=0,n=this.targetOffset.x,r=this.targetOffset.y,i=this.modifiedOffset.x,o=this.modifiedOffset.y,p={x:Ye(a=f,t,n,i),y:Ye(a,e,r,o)}):p={x:this.targetOffset.x*f,y:this.targetOffset.y*f};var d={x:p.x-this.currentOffset.x,y:p.y-this.currentOffset.y};this.currentOffset.x+=d.x,this.currentOffset.y+=d.y,c.offsetBy(d),c.move(),this.onNextFrame((function(){return s.inertiaTick()}));}else c.offsetBy({x:this.modifiedOffset.x-this.currentOffset.x,y:this.modifiedOffset.y-this.currentOffset.y}),this.end();}},{key:"smoothEndTick",value:function(){var t=this,e=this.interaction,n=e._now()-this.t0,r=Fe(e).smoothEndDuration;if(n<r){var i={x:Le(n,0,this.targetOffset.x,r),y:Le(n,0,this.targetOffset.y,r)},o={x:i.x-this.currentOffset.x,y:i.y-this.currentOffset.y};this.currentOffset.x+=o.x,this.currentOffset.y+=o.y,e.offsetBy(o),e.move({skipModifiers:this.modifierCount}),this.onNextFrame((function(){return t.smoothEndTick()}));}else e.offsetBy({x:this.targetOffset.x-this.currentOffset.x,y:this.targetOffset.y-this.currentOffset.y}),this.end();}},{key:"resume",value:function(t){var e=t.pointer,n=t.event,r=t.eventTarget,i=this.interaction;i.offsetBy({x:-this.currentOffset.x,y:-this.currentOffset.y}),i.updatePointer(e,n,r,!0),i._doPhase({interaction:i,event:n,phase:"resume"}),et(i.coords.prev,i.coords.cur),this.stop();}},{key:"end",value:function(){this.interaction.move(),this.interaction.end(),this.stop();}},{key:"stop",value:function(){this.active=this.smoothEnd=!1,this.interaction.simulation=null,Lt.cancel(this.timeout);}}]),t}();function Fe(t){var e=t.interactable,n=t.prepared;return e&&e.options&&n.name&&e.options[n.name].inertia}var Xe={id:"inertia",before:["modifiers","actions"],install:function(t){var e=t.defaults;t.usePlugin(Ce),t.usePlugin(Ee),t.actions.phases.inertiastart=!0,t.actions.phases.resume=!0,e.perAction.inertia={enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300};},listeners:{"interactions:new":function(t){var e=t.interaction;e.inertia=new je(e);},"interactions:before-action-end":function(t){var e=t.interaction,n=t.event;return (!e._interacting||e.simulation||!e.inertia.start(n))&&null},"interactions:down":function(t){var e=t.interaction,n=t.eventTarget,r=e.inertia;if(r.active)for(var i=n;w.element(i);){if(i===e.element){r.resume(t);break}i=A(i);}},"interactions:stop":function(t){var e=t.interaction.inertia;e.active&&e.stop();},"interactions:before-action-resume":function(t){var e=t.interaction.modification;e.stop(t),e.start(t,t.interaction.coords.cur.page),e.applyToInteraction(t);},"interactions:before-action-inertiastart":function(t){return t.interaction.modification.setAndApply(t)},"interactions:action-resume":xe,"interactions:action-inertiastart":xe,"interactions:after-action-inertiastart":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:after-action-resume":function(t){return t.interaction.modification.restoreInteractionCoords(t)}}};function Ye(t,e,n,r){var i=1-t;return i*i*e+2*i*t*n+t*t*r}function Le(t,e,n,r){return -n*(t/=r)*(t-2)+e}var qe=Xe;function Be(t,e){for(var n=0;n<e.length;n++){var r=e[n];if(t.immediatePropagationStopped)break;r(t);}}var Ve=function(){function t(e){r(this,t),this.options=void 0,this.types={},this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.global=void 0,this.options=V({},e||{});}return o(t,[{key:"fire",value:function(t){var e,n=this.global;(e=this.types[t.type])&&Be(t,e),!t.propagationStopped&&n&&(e=n[t.type])&&Be(t,e);}},{key:"on",value:function(t,e){var n=$(t,e);for(t in n)this.types[t]=gt(this.types[t]||[],n[t]);}},{key:"off",value:function(t,e){var n=$(t,e);for(t in n){var r=this.types[t];if(r&&r.length)for(var i=0,o=n[t];i<o.length;i++){var a=o[i],s=r.indexOf(a);-1!==s&&r.splice(s,1);}}}},{key:"getRect",value:function(t){return null}}]),t}();var We=function(){function t(e){r(this,t),this.currentTarget=void 0,this.originalEvent=void 0,this.type=void 0,this.originalEvent=e,tt(this,e);}return o(t,[{key:"preventOriginalDefault",value:function(){this.originalEvent.preventDefault();}},{key:"stopPropagation",value:function(){this.originalEvent.stopPropagation();}},{key:"stopImmediatePropagation",value:function(){this.originalEvent.stopImmediatePropagation();}}]),t}();function Ge(t){return w.object(t)?{capture:!!t.capture,passive:!!t.passive}:{capture:!!t,passive:!1}}function Ne(t,e){return t===e||("boolean"==typeof t?!!e.capture===t&&!1==!!e.passive:!!t.capture==!!e.capture&&!!t.passive==!!e.passive)}var Ue={id:"events",install:function(t){var e,n=[],r={},i=[],o={add:a,remove:s,addDelegate:function(t,e,n,o,s){var u=Ge(s);if(!r[n]){r[n]=[];for(var p=0;p<i.length;p++){var f=i[p];a(f,n,c),a(f,n,l,!0);}}var d=r[n],h=bt(d,(function(n){return n.selector===t&&n.context===e}));h||(h={selector:t,context:e,listeners:[]},d.push(h));h.listeners.push({func:o,options:u});},removeDelegate:function(t,e,n,i,o){var a,u=Ge(o),p=r[n],f=!1;if(!p)return;for(a=p.length-1;a>=0;a--){var d=p[a];if(d.selector===t&&d.context===e){for(var h=d.listeners,v=h.length-1;v>=0;v--){var g=h[v];if(g.func===i&&Ne(g.options,u)){h.splice(v,1),h.length||(p.splice(a,1),s(e,n,c),s(e,n,l,!0)),f=!0;break}}if(f)break}}},delegateListener:c,delegateUseCapture:l,delegatedEvents:r,documents:i,targets:n,supportsOptions:!1,supportsPassive:!1};function a(t,e,r,i){if(t.addEventListener){var a=Ge(i),s=bt(n,(function(e){return e.eventTarget===t}));s||(s={eventTarget:t,events:{}},n.push(s)),s.events[e]||(s.events[e]=[]),bt(s.events[e],(function(t){return t.func===r&&Ne(t.options,a)}))||(t.addEventListener(e,r,o.supportsOptions?a:a.capture),s.events[e].push({func:r,options:a}));}}function s(t,e,r,i){if(t.addEventListener&&t.removeEventListener){var a=yt(n,(function(e){return e.eventTarget===t})),c=n[a];if(c&&c.events)if("all"!==e){var l=!1,u=c.events[e];if(u){if("all"===r){for(var p=u.length-1;p>=0;p--){var f=u[p];s(t,e,f.func,f.options);}return}for(var d=Ge(i),h=0;h<u.length;h++){var v=u[h];if(v.func===r&&Ne(v.options,d)){t.removeEventListener(e,r,o.supportsOptions?d:d.capture),u.splice(h,1),0===u.length&&(delete c.events[e],l=!0);break}}}l&&!Object.keys(c.events).length&&n.splice(a,1);}else for(e in c.events)c.events.hasOwnProperty(e)&&s(t,e,"all");}}function c(t,e){for(var n=Ge(e),i=new We(t),o=r[t.type],a=ht(t)[0],s=a;w.element(s);){for(var c=0;c<o.length;c++){var l=o[c],u=l.selector,p=l.context;if(R(s,u)&&M(p,a)&&M(p,s)){var f=l.listeners;i.currentTarget=s;for(var d=0;d<f.length;d++){var h=f[d];Ne(h.options,n)&&h.func(i);}}}s=A(s);}}function l(t){return c(t,!0)}return null==(e=t.document)||e.createElement("div").addEventListener("test",null,{get capture(){return o.supportsOptions=!0},get passive(){return o.supportsPassive=!0}}),t.events=o,o}},He={methodOrder:["simulationResume","mouseOrPen","hasPointer","idle"],search:function(t){for(var e=0,n=He.methodOrder;e<n.length;e++){var r=n[e],i=He[r](t);if(i)return i}return null},simulationResume:function(t){var e=t.pointerType,n=t.eventType,r=t.eventTarget,i=t.scope;if(!/down|start/i.test(n))return null;for(var o=0,a=i.interactions.list;o<a.length;o++){var s=a[o],c=r;if(s.simulation&&s.simulation.allowResume&&s.pointerType===e)for(;c;){if(c===s.element)return s;c=A(c);}}return null},mouseOrPen:function(t){var e,n=t.pointerId,r=t.pointerType,i=t.eventType,o=t.scope;if("mouse"!==r&&"pen"!==r)return null;for(var a=0,s=o.interactions.list;a<s.length;a++){var c=s[a];if(c.pointerType===r){if(c.simulation&&!Ke(c,n))continue;if(c.interacting())return c;e||(e=c);}}if(e)return e;for(var l=0,u=o.interactions.list;l<u.length;l++){var p=u[l];if(!(p.pointerType!==r||/down/i.test(i)&&p.simulation))return p}return null},hasPointer:function(t){for(var e=t.pointerId,n=0,r=t.scope.interactions.list;n<r.length;n++){var i=r[n];if(Ke(i,e))return i}return null},idle:function(t){for(var e=t.pointerType,n=0,r=t.scope.interactions.list;n<r.length;n++){var i=r[n];if(1===i.pointers.length){var o=i.interactable;if(o&&(!o.options.gesture||!o.options.gesture.enabled))continue}else if(i.pointers.length>=2)continue;if(!i.interacting()&&e===i.pointerType)return i}return null}};function Ke(t,e){return t.pointers.some((function(t){return t.id===e}))}var $e=He,Je=["pointerDown","pointerMove","pointerUp","updatePointer","removePointer","windowBlur"];function Qe(t,e){return function(n){var r=e.interactions.list,i=dt(n),o=ht(n),a=o[0],s=o[1],c=[];if(/^touch/.test(n.type)){e.prevTouchTime=e.now();for(var l=0,u=n.changedTouches;l<u.length;l++){var p=u[l],f={pointer:p,pointerId:at(p),pointerType:i,eventType:n.type,eventTarget:a,curEventTarget:s,scope:e},d=Ze(f);c.push([f.pointer,f.eventTarget,f.curEventTarget,d]);}}else {var h=!1;if(!I.supportsPointerEvent&&/mouse/.test(n.type)){for(var v=0;v<r.length&&!h;v++)h="mouse"!==r[v].pointerType&&r[v].pointerIsDown;h=h||e.now()-e.prevTouchTime<500||0===n.timeStamp;}if(!h){var g={pointer:n,pointerId:at(n),pointerType:i,eventType:n.type,curEventTarget:s,eventTarget:a,scope:e},m=Ze(g);c.push([g.pointer,g.eventTarget,g.curEventTarget,m]);}}for(var y=0;y<c.length;y++){var b=c[y],x=b[0],w=b[1],E=b[2];b[3][t](x,n,w,E);}}}function Ze(t){var e=t.pointerType,n=t.scope,r={interaction:$e.search(t),searchDetails:t};return n.fire("interactions:find",r),r.interaction||n.interactions.new({pointerType:e})}function tn(t,e){var n=t.doc,r=t.scope,i=t.options,o=r.interactions.docEvents,a=r.events,s=a[e];for(var c in r.browser.isIOS&&!i.events&&(i.events={passive:!1}),a.delegatedEvents)s(n,c,a.delegateListener),s(n,c,a.delegateUseCapture,!0);for(var l=i&&i.events,u=0;u<o.length;u++){var p=o[u];s(n,p.type,p.listener,l);}}var en={id:"core/interactions",install:function(t){for(var e={},n=0;n<Je.length;n++){var i=Je[n];e[i]=Qe(i,t);}var a,c=I.pEventTypes;function l(){for(var e=0,n=t.interactions.list;e<n.length;e++){var r=n[e];if(r.pointerIsDown&&"touch"===r.pointerType&&!r._interacting)for(var i=function(){var e=a[o];t.documents.some((function(t){return M(t.doc,e.downTarget)}))||r.removePointer(e.pointer,e.event);},o=0,a=r.pointers;o<a.length;o++)i();}}(a=k.PointerEvent?[{type:c.down,listener:l},{type:c.down,listener:e.pointerDown},{type:c.move,listener:e.pointerMove},{type:c.up,listener:e.pointerUp},{type:c.cancel,listener:e.pointerUp}]:[{type:"mousedown",listener:e.pointerDown},{type:"mousemove",listener:e.pointerMove},{type:"mouseup",listener:e.pointerUp},{type:"touchstart",listener:l},{type:"touchstart",listener:e.pointerDown},{type:"touchmove",listener:e.pointerMove},{type:"touchend",listener:e.pointerUp},{type:"touchcancel",listener:e.pointerUp}]).push({type:"blur",listener:function(e){for(var n=0,r=t.interactions.list;n<r.length;n++){r[n].documentBlur(e);}}}),t.prevTouchTime=0,t.Interaction=function(e){s(i,e);var n=p(i);function i(){return r(this,i),n.apply(this,arguments)}return o(i,[{key:"pointerMoveTolerance",get:function(){return t.interactions.pointerMoveTolerance},set:function(e){t.interactions.pointerMoveTolerance=e;}},{key:"_now",value:function(){return t.now()}}]),i}(De),t.interactions={list:[],new:function(e){e.scopeFire=function(e,n){return t.fire(e,n)};var n=new t.Interaction(e);return t.interactions.list.push(n),n},listeners:e,docEvents:a,pointerMoveTolerance:1},t.usePlugin(he);},listeners:{"scope:add-document":function(t){return tn(t,"add")},"scope:remove-document":function(t){return tn(t,"remove")},"interactable:unset":function(t,e){for(var n=t.interactable,r=e.interactions.list.length-1;r>=0;r--){var i=e.interactions.list[r];i.interactable===n&&(i.stop(),e.fire("interactions:destroy",{interaction:i}),i.destroy(),e.interactions.list.length>2&&e.interactions.list.splice(r,1));}}},onDocSignal:tn,doOnInteractions:Qe,methodNames:Je},nn=en,rn=function(t){return t[t.On=0]="On",t[t.Off=1]="Off",t}(rn||{}),on=function(){function t(e,n,i,o){r(this,t),this.target=void 0,this.options=void 0,this._actions=void 0,this.events=new Ve,this._context=void 0,this._win=void 0,this._doc=void 0,this._scopeEvents=void 0,this._actions=n.actions,this.target=e,this._context=n.context||i,this._win=y(B(e)?this._context:e),this._doc=this._win.document,this._scopeEvents=o,this.set(n);}return o(t,[{key:"_defaults",get:function(){return {base:{},perAction:{},actions:{}}}},{key:"setOnEvents",value:function(t,e){return w.func(e.onstart)&&this.on("".concat(t,"start"),e.onstart),w.func(e.onmove)&&this.on("".concat(t,"move"),e.onmove),w.func(e.onend)&&this.on("".concat(t,"end"),e.onend),w.func(e.oninertiastart)&&this.on("".concat(t,"inertiastart"),e.oninertiastart),this}},{key:"updatePerActionListeners",value:function(t,e,n){var r,i=this,o=null==(r=this._actions.map[t])?void 0:r.filterEventType,a=function(t){return (null==o||o(t))&&ve(t,i._actions)};(w.array(e)||w.object(e))&&this._onOff(rn.Off,t,e,void 0,a),(w.array(n)||w.object(n))&&this._onOff(rn.On,t,n,void 0,a);}},{key:"setPerAction",value:function(t,e){var n=this._defaults;for(var r in e){var i=r,o=this.options[t],a=e[i];"listeners"===i&&this.updatePerActionListeners(t,o.listeners,a),w.array(a)?o[i]=mt(a):w.plainObject(a)?(o[i]=V(o[i]||{},ge(a)),w.object(n.perAction[i])&&"enabled"in n.perAction[i]&&(o[i].enabled=!1!==a.enabled)):w.bool(a)&&w.object(n.perAction[i])?o[i].enabled=a:o[i]=a;}}},{key:"getRect",value:function(t){return t=t||(w.element(this.target)?this.target:null),w.string(this.target)&&(t=t||this._context.querySelector(this.target)),L(t)}},{key:"rectChecker",value:function(t){var e=this;return w.func(t)?(this.getRect=function(n){var r=V({},t.apply(e,n));return "width"in r||(r.width=r.right-r.left,r.height=r.bottom-r.top),r},this):null===t?(delete this.getRect,this):this.getRect}},{key:"_backCompatOption",value:function(t,e){if(B(e)||w.object(e)){for(var n in this.options[t]=e,this._actions.map)this.options[n][t]=e;return this}return this.options[t]}},{key:"origin",value:function(t){return this._backCompatOption("origin",t)}},{key:"deltaSource",value:function(t){return "page"===t||"client"===t?(this.options.deltaSource=t,this):this.options.deltaSource}},{key:"getAllElements",value:function(){var t=this.target;return w.string(t)?Array.from(this._context.querySelectorAll(t)):w.func(t)&&t.getAllElements?t.getAllElements():w.element(t)?[t]:[]}},{key:"context",value:function(){return this._context}},{key:"inContext",value:function(t){return this._context===t.ownerDocument||M(this._context,t)}},{key:"testIgnoreAllow",value:function(t,e,n){return !this.testIgnore(t.ignoreFrom,e,n)&&this.testAllow(t.allowFrom,e,n)}},{key:"testAllow",value:function(t,e,n){return !t||!!w.element(n)&&(w.string(t)?F(n,t,e):!!w.element(t)&&M(t,n))}},{key:"testIgnore",value:function(t,e,n){return !(!t||!w.element(n))&&(w.string(t)?F(n,t,e):!!w.element(t)&&M(t,n))}},{key:"fire",value:function(t){return this.events.fire(t),this}},{key:"_onOff",value:function(t,e,n,r,i){w.object(e)&&!w.array(e)&&(r=n,n=null);var o=$(e,n,i);for(var a in o){"wheel"===a&&(a=I.wheelEvent);for(var s=0,c=o[a];s<c.length;s++){var l=c[s];ve(a,this._actions)?this.events[t===rn.On?"on":"off"](a,l):w.string(this.target)?this._scopeEvents[t===rn.On?"addDelegate":"removeDelegate"](this.target,this._context,a,l,r):this._scopeEvents[t===rn.On?"add":"remove"](this.target,a,l,r);}}return this}},{key:"on",value:function(t,e,n){return this._onOff(rn.On,t,e,n)}},{key:"off",value:function(t,e,n){return this._onOff(rn.Off,t,e,n)}},{key:"set",value:function(t){var e=this._defaults;for(var n in w.object(t)||(t={}),this.options=ge(e.base),this._actions.methodDict){var r=n,i=this._actions.methodDict[r];this.options[r]={},this.setPerAction(r,V(V({},e.perAction),e.actions[r])),this[i](t[r]);}for(var o in t)"getRect"!==o?w.func(this[o])&&this[o](t[o]):this.rectChecker(t.getRect);return this}},{key:"unset",value:function(){if(w.string(this.target))for(var t in this._scopeEvents.delegatedEvents)for(var e=this._scopeEvents.delegatedEvents[t],n=e.length-1;n>=0;n--){var r=e[n],i=r.selector,o=r.context,a=r.listeners;i===this.target&&o===this._context&&e.splice(n,1);for(var s=a.length-1;s>=0;s--)this._scopeEvents.removeDelegate(this.target,this._context,t,a[s][0],a[s][1]);}else this._scopeEvents.remove(this.target,"all");}}]),t}(),an=function(){function t(e){var n=this;r(this,t),this.list=[],this.selectorMap={},this.scope=void 0,this.scope=e,e.addListeners({"interactable:unset":function(t){var e=t.interactable,r=e.target,i=w.string(r)?n.selectorMap[r]:r[n.scope.id],o=yt(i,(function(t){return t===e}));i.splice(o,1);}});}return o(t,[{key:"new",value:function(t,e){e=V(e||{},{actions:this.scope.actions});var n=new this.scope.Interactable(t,e,this.scope.document,this.scope.events);return this.scope.addDocument(n._doc),this.list.push(n),w.string(t)?(this.selectorMap[t]||(this.selectorMap[t]=[]),this.selectorMap[t].push(n)):(n.target[this.scope.id]||Object.defineProperty(t,this.scope.id,{value:[],configurable:!0}),t[this.scope.id].push(n)),this.scope.fire("interactable:new",{target:t,options:e,interactable:n,win:this.scope._win}),n}},{key:"getExisting",value:function(t,e){var n=e&&e.context||this.scope.document,r=w.string(t),i=r?this.selectorMap[t]:t[this.scope.id];if(i)return bt(i,(function(e){return e._context===n&&(r||e.inContext(t))}))}},{key:"forEachMatch",value:function(t,e){for(var n=0,r=this.list;n<r.length;n++){var i=r[n],o=void 0;if((w.string(i.target)?w.element(t)&&R(t,i.target):t===i.target)&&i.inContext(t)&&(o=e(i)),void 0!==o)return o}}}]),t}();var sn=function(){function t(){var e=this;r(this,t),this.id="__interact_scope_".concat(Math.floor(100*Math.random())),this.isInitialized=!1,this.listenerMaps=[],this.browser=I,this.defaults=ge(Te),this.Eventable=Ve,this.actions={map:{},phases:{start:!0,move:!0,end:!0},methodDict:{},phaselessTypes:{}},this.interactStatic=function(t){var e=function e(n,r){var i=t.interactables.getExisting(n,r);return i||((i=t.interactables.new(n,r)).events.global=e.globalEvents),i};return e.getPointerAverage=lt,e.getTouchBBox=ut,e.getTouchDistance=pt,e.getTouchAngle=ft,e.getElementRect=L,e.getElementClientRect=Y,e.matchesSelector=R,e.closest=z,e.globalEvents={},e.version="1.10.27",e.scope=t,e.use=function(t,e){return this.scope.usePlugin(t,e),this},e.isSet=function(t,e){return !!this.scope.interactables.get(t,e&&e.context)},e.on=Nt((function(t,e,n){if(w.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),w.array(t)){for(var r=0,i=t;r<i.length;r++){var o=i[r];this.on(o,e,n);}return this}if(w.object(t)){for(var a in t)this.on(a,t[a],e);return this}return ve(t,this.scope.actions)?this.globalEvents[t]?this.globalEvents[t].push(e):this.globalEvents[t]=[e]:this.scope.events.add(this.scope.document,t,e,{options:n}),this}),"The interact.on() method is being deprecated"),e.off=Nt((function(t,e,n){if(w.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),w.array(t)){for(var r=0,i=t;r<i.length;r++){var o=i[r];this.off(o,e,n);}return this}if(w.object(t)){for(var a in t)this.off(a,t[a],e);return this}var s;return ve(t,this.scope.actions)?t in this.globalEvents&&-1!==(s=this.globalEvents[t].indexOf(e))&&this.globalEvents[t].splice(s,1):this.scope.events.remove(this.scope.document,t,e,n),this}),"The interact.off() method is being deprecated"),e.debug=function(){return this.scope},e.supportsTouch=function(){return I.supportsTouch},e.supportsPointerEvent=function(){return I.supportsPointerEvent},e.stop=function(){for(var t=0,e=this.scope.interactions.list;t<e.length;t++)e[t].stop();return this},e.pointerMoveTolerance=function(t){return w.number(t)?(this.scope.interactions.pointerMoveTolerance=t,this):this.scope.interactions.pointerMoveTolerance},e.addDocument=function(t,e){this.scope.addDocument(t,e);},e.removeDocument=function(t){this.scope.removeDocument(t);},e}(this),this.InteractEvent=Se,this.Interactable=void 0,this.interactables=new an(this),this._win=void 0,this.document=void 0,this.window=void 0,this.documents=[],this._plugins={list:[],map:{}},this.onWindowUnload=function(t){return e.removeDocument(t.target)};var n=this;this.Interactable=function(t){s(i,t);var e=p(i);function i(){return r(this,i),e.apply(this,arguments)}return o(i,[{key:"_defaults",get:function(){return n.defaults}},{key:"set",value:function(t){return f(c(i.prototype),"set",this).call(this,t),n.fire("interactable:set",{options:t,interactable:this}),this}},{key:"unset",value:function(){f(c(i.prototype),"unset",this).call(this);var t=n.interactables.list.indexOf(this);t<0||(n.interactables.list.splice(t,1),n.fire("interactable:unset",{interactable:this}));}}]),i}(on);}return o(t,[{key:"addListeners",value:function(t,e){this.listenerMaps.push({id:e,map:t});}},{key:"fire",value:function(t,e){for(var n=0,r=this.listenerMaps;n<r.length;n++){var i=r[n].map[t];if(i&&!1===i(e,this,t))return !1}}},{key:"init",value:function(t){return this.isInitialized?this:function(t,e){t.isInitialized=!0,w.window(e)&&m(e);return k.init(e),I.init(e),Lt.init(e),t.window=e,t.document=e.document,t.usePlugin(nn),t.usePlugin(Ue),t}(this,t)}},{key:"pluginIsInstalled",value:function(t){var e=t.id;return e?!!this._plugins.map[e]:-1!==this._plugins.list.indexOf(t)}},{key:"usePlugin",value:function(t,e){if(!this.isInitialized)return this;if(this.pluginIsInstalled(t))return this;if(t.id&&(this._plugins.map[t.id]=t),this._plugins.list.push(t),t.install&&t.install(this,e),t.listeners&&t.before){for(var n=0,r=this.listenerMaps.length,i=t.before.reduce((function(t,e){return t[e]=!0,t[cn(e)]=!0,t}),{});n<r;n++){var o=this.listenerMaps[n].id;if(o&&(i[o]||i[cn(o)]))break}this.listenerMaps.splice(n,0,{id:t.id,map:t.listeners});}else t.listeners&&this.listenerMaps.push({id:t.id,map:t.listeners});return this}},{key:"addDocument",value:function(t,e){if(-1!==this.getDocIndex(t))return !1;var n=y(t);e=e?V({},e):{},this.documents.push({doc:t,options:e}),this.events.documents.push(t),t!==this.document&&this.events.add(n,"unload",this.onWindowUnload),this.fire("scope:add-document",{doc:t,window:n,scope:this,options:e});}},{key:"removeDocument",value:function(t){var e=this.getDocIndex(t),n=y(t),r=this.documents[e].options;this.events.remove(n,"unload",this.onWindowUnload),this.documents.splice(e,1),this.events.documents.splice(e,1),this.fire("scope:remove-document",{doc:t,window:n,scope:this,options:r});}},{key:"getDocIndex",value:function(t){for(var e=0;e<this.documents.length;e++)if(this.documents[e].doc===t)return e;return -1}},{key:"getDocOptions",value:function(t){var e=this.getDocIndex(t);return -1===e?null:this.documents[e].options}},{key:"now",value:function(){return (this.window.Date||Date).now()}}]),t}();function cn(t){return t&&t.replace(/\/.*$/,"")}var ln=new sn,un=ln.interactStatic,pn="undefined"!=typeof globalThis?globalThis:window;ln.init(pn);var fn=Object.freeze({__proto__:null,edgeTarget:function(){},elements:function(){},grid:function(t){var e=[["x","y"],["left","top"],["right","bottom"],["width","height"]].filter((function(e){var n=e[0],r=e[1];return n in t||r in t})),n=function(n,r){for(var i=t.range,o=t.limits,a=void 0===o?{left:-1/0,right:1/0,top:-1/0,bottom:1/0}:o,s=t.offset,c=void 0===s?{x:0,y:0}:s,l={range:i,grid:t,x:null,y:null},u=0;u<e.length;u++){var p=e[u],f=p[0],d=p[1],h=Math.round((n-c.x)/t[f]),v=Math.round((r-c.y)/t[d]);l[f]=Math.max(a.left,Math.min(a.right,h*t[f]+c.x)),l[d]=Math.max(a.top,Math.min(a.bottom,v*t[d]+c.y));}return l};return n.grid=t,n.coordFields=e,n}}),dn={id:"snappers",install:function(t){var e=t.interactStatic;e.snappers=V(e.snappers||{},fn),e.createSnapGrid=e.snappers.grid;}},hn=dn,vn={start:function(t){var n=t.state,r=t.rect,i=t.edges,o=t.pageCoords,a=n.options,s=a.ratio,c=a.enabled,l=n.options,u=l.equalDelta,p=l.modifiers;"preserve"===s&&(s=r.width/r.height),n.startCoords=V({},o),n.startRect=V({},r),n.ratio=s,n.equalDelta=u;var f=n.linkedEdges={top:i.top||i.left&&!i.bottom,left:i.left||i.top&&!i.right,bottom:i.bottom||i.right&&!i.top,right:i.right||i.bottom&&!i.left};if(n.xIsPrimaryAxis=!(!i.left&&!i.right),n.equalDelta){var d=(f.left?1:-1)*(f.top?1:-1);n.edgeSign={x:d,y:d};}else n.edgeSign={x:f.left?-1:1,y:f.top?-1:1};if(!1!==c&&V(i,f),null!=p&&p.length){var h=new me(t.interaction);h.copyFrom(t.interaction.modification),h.prepareStates(p),n.subModification=h,h.startAll(e({},t));}},set:function(t){var n=t.state,r=t.rect,i=t.coords,o=n.linkedEdges,a=V({},i),s=n.equalDelta?gn:mn;if(V(t.edges,o),s(n,n.xIsPrimaryAxis,i,r),!n.subModification)return null;var c=V({},r);H(o,c,{x:i.x-a.x,y:i.y-a.y});var l=n.subModification.setAll(e(e({},t),{},{rect:c,edges:o,pageCoords:i,prevCoords:i,prevRect:c})),u=l.delta;l.changed&&(s(n,Math.abs(u.x)>Math.abs(u.y),l.coords,l.rect),V(i,l.coords));return l.eventProps},defaults:{ratio:"preserve",equalDelta:!1,modifiers:[],enabled:!1}};function gn(t,e,n){var r=t.startCoords,i=t.edgeSign;e?n.y=r.y+(n.x-r.x)*i.y:n.x=r.x+(n.y-r.y)*i.x;}function mn(t,e,n,r){var i=t.startRect,o=t.startCoords,a=t.ratio,s=t.edgeSign;if(e){var c=r.width/a;n.y=o.y+(c-i.height)*s.y;}else {var l=r.height*a;n.x=o.x+(l-i.width)*s.x;}}var yn=be(vn,"aspectRatio"),bn=function(){};bn._defaults={};var xn=bn;function wn(t,e,n){return w.func(t)?G(t,e.interactable,e.element,[n.x,n.y,e]):G(t,e.interactable,e.element)}var En={start:function(t){var e=t.rect,n=t.startOffset,r=t.state,i=t.interaction,o=t.pageCoords,a=r.options,s=a.elementRect,c=V({left:0,top:0,right:0,bottom:0},a.offset||{});if(e&&s){var l=wn(a.restriction,i,o);if(l){var u=l.right-l.left-e.width,p=l.bottom-l.top-e.height;u<0&&(c.left+=u,c.right+=u),p<0&&(c.top+=p,c.bottom+=p);}c.left+=n.left-e.width*s.left,c.top+=n.top-e.height*s.top,c.right+=n.right-e.width*(1-s.right),c.bottom+=n.bottom-e.height*(1-s.bottom);}r.offset=c;},set:function(t){var e=t.coords,n=t.interaction,r=t.state,i=r.options,o=r.offset,a=wn(i.restriction,n,e);if(a){var s=function(t){return !t||"left"in t&&"top"in t||((t=V({},t)).left=t.x||0,t.top=t.y||0,t.right=t.right||t.left+t.width,t.bottom=t.bottom||t.top+t.height),t}(a);e.x=Math.max(Math.min(s.right-o.right,e.x),s.left+o.left),e.y=Math.max(Math.min(s.bottom-o.bottom,e.y),s.top+o.top);}},defaults:{restriction:null,elementRect:null,offset:null,endOnly:!1,enabled:!1}},Tn=be(En,"restrict"),Sn={top:1/0,left:1/0,bottom:-1/0,right:-1/0},_n={top:-1/0,left:-1/0,bottom:1/0,right:1/0};function Pn(t,e){for(var n=0,r=["top","left","bottom","right"];n<r.length;n++){var i=r[n];i in t||(t[i]=e[i]);}return t}var On={noInner:Sn,noOuter:_n,start:function(t){var e,n=t.interaction,r=t.startOffset,i=t.state,o=i.options;o&&(e=N(wn(o.offset,n,n.coords.start.page))),e=e||{x:0,y:0},i.offset={top:e.y+r.top,left:e.x+r.left,bottom:e.y-r.bottom,right:e.x-r.right};},set:function(t){var e=t.coords,n=t.edges,r=t.interaction,i=t.state,o=i.offset,a=i.options;if(n){var s=V({},e),c=wn(a.inner,r,s)||{},l=wn(a.outer,r,s)||{};Pn(c,Sn),Pn(l,_n),n.top?e.y=Math.min(Math.max(l.top+o.top,s.y),c.top+o.top):n.bottom&&(e.y=Math.max(Math.min(l.bottom+o.bottom,s.y),c.bottom+o.bottom)),n.left?e.x=Math.min(Math.max(l.left+o.left,s.x),c.left+o.left):n.right&&(e.x=Math.max(Math.min(l.right+o.right,s.x),c.right+o.right));}},defaults:{inner:null,outer:null,offset:null,endOnly:!1,enabled:!1}},kn=be(On,"restrictEdges"),Dn=V({get elementRect(){return {top:0,left:0,bottom:1,right:1}},set elementRect(t){}},En.defaults),In=be({start:En.start,set:En.set,defaults:Dn},"restrictRect"),Mn={width:-1/0,height:-1/0},zn={width:1/0,height:1/0};var An=be({start:function(t){return On.start(t)},set:function(t){var e=t.interaction,n=t.state,r=t.rect,i=t.edges,o=n.options;if(i){var a=U(wn(o.min,e,t.coords))||Mn,s=U(wn(o.max,e,t.coords))||zn;n.options={endOnly:o.endOnly,inner:V({},On.noInner),outer:V({},On.noOuter)},i.top?(n.options.inner.top=r.bottom-a.height,n.options.outer.top=r.bottom-s.height):i.bottom&&(n.options.inner.bottom=r.top+a.height,n.options.outer.bottom=r.top+s.height),i.left?(n.options.inner.left=r.right-a.width,n.options.outer.left=r.right-s.width):i.right&&(n.options.inner.right=r.left+a.width,n.options.outer.right=r.left+s.width),On.set(t),n.options=o;}},defaults:{min:null,max:null,endOnly:!1,enabled:!1}},"restrictSize");var Rn={start:function(t){var e,n=t.interaction,r=t.interactable,i=t.element,o=t.rect,a=t.state,s=t.startOffset,c=a.options,l=c.offsetWithOrigin?function(t){var e=t.interaction.element,n=N(G(t.state.options.origin,null,null,[e])),r=n||K(t.interactable,e,t.interaction.prepared.name);return r}(t):{x:0,y:0};if("startCoords"===c.offset)e={x:n.coords.start.page.x,y:n.coords.start.page.y};else {var u=G(c.offset,r,i,[n]);(e=N(u)||{x:0,y:0}).x+=l.x,e.y+=l.y;}var p=c.relativePoints;a.offsets=o&&p&&p.length?p.map((function(t,n){return {index:n,relativePoint:t,x:s.left-o.width*t.x+e.x,y:s.top-o.height*t.y+e.y}})):[{index:0,relativePoint:null,x:e.x,y:e.y}];},set:function(t){var e=t.interaction,n=t.coords,r=t.state,i=r.options,o=r.offsets,a=K(e.interactable,e.element,e.prepared.name),s=V({},n),c=[];i.offsetWithOrigin||(s.x-=a.x,s.y-=a.y);for(var l=0,u=o;l<u.length;l++)for(var p=u[l],f=s.x-p.x,d=s.y-p.y,h=0,v=i.targets.length;h<v;h++){var g=i.targets[h],m=void 0;(m=w.func(g)?g(f,d,e._proxy,p,h):g)&&c.push({x:(w.number(m.x)?m.x:f)+p.x,y:(w.number(m.y)?m.y:d)+p.y,range:w.number(m.range)?m.range:i.range,source:g,index:h,offset:p});}for(var y={target:null,inRange:!1,distance:0,range:0,delta:{x:0,y:0}},b=0;b<c.length;b++){var x=c[b],E=x.range,T=x.x-s.x,S=x.y-s.y,_=Q(T,S),P=_<=E;E===1/0&&y.inRange&&y.range!==1/0&&(P=!1),y.target&&!(P?y.inRange&&E!==1/0?_/E<y.distance/y.range:E===1/0&&y.range!==1/0||_<y.distance:!y.inRange&&_<y.distance)||(y.target=x,y.distance=_,y.range=E,y.inRange=P,y.delta.x=T,y.delta.y=S);}return y.inRange&&(n.x=y.target.x,n.y=y.target.y),r.closest=y,y},defaults:{range:1/0,targets:null,offset:null,offsetWithOrigin:!0,origin:null,relativePoints:null,endOnly:!1,enabled:!1}},Cn=be(Rn,"snap");var jn={start:function(t){var e=t.state,n=t.edges,r=e.options;if(!n)return null;t.state={options:{targets:null,relativePoints:[{x:n.left?0:1,y:n.top?0:1}],offset:r.offset||"self",origin:{x:0,y:0},range:r.range}},e.targetFields=e.targetFields||[["width","height"],["x","y"]],Rn.start(t),e.offsets=t.state.offsets,t.state=e;},set:function(t){var e=t.interaction,n=t.state,r=t.coords,i=n.options,o=n.offsets,a={x:r.x-o[0].x,y:r.y-o[0].y};n.options=V({},i),n.options.targets=[];for(var s=0,c=i.targets||[];s<c.length;s++){var l=c[s],u=void 0;if(u=w.func(l)?l(a.x,a.y,e):l){for(var p=0,f=n.targetFields;p<f.length;p++){var d=f[p],h=d[0],v=d[1];if(h in u||v in u){u.x=u[h],u.y=u[v];break}}n.options.targets.push(u);}}var g=Rn.set(t);return n.options=i,g},defaults:{range:1/0,targets:null,offset:null,endOnly:!1,enabled:!1}},Fn=be(jn,"snapSize");var Xn={aspectRatio:yn,restrictEdges:kn,restrict:Tn,restrictRect:In,restrictSize:An,snapEdges:be({start:function(t){var e=t.edges;return e?(t.state.targetFields=t.state.targetFields||[[e.left?"left":"right",e.top?"top":"bottom"]],jn.start(t)):null},set:jn.set,defaults:V(ge(jn.defaults),{targets:void 0,range:void 0,offset:{x:0,y:0}})},"snapEdges"),snap:Cn,snapSize:Fn,spring:xn,avoid:xn,transform:xn,rubberband:xn},Yn={id:"modifiers",install:function(t){var e=t.interactStatic;for(var n in t.usePlugin(Ee),t.usePlugin(hn),e.modifiers=Xn,Xn){var r=Xn[n],i=r._defaults,o=r._methods;i._methods=o,t.defaults.perAction[n]=i;}}},Ln=Yn,qn=function(t){s(n,t);var e=p(n);function n(t,i,o,a,s,c){var l;if(r(this,n),tt(u(l=e.call(this,s)),o),o!==i&&tt(u(l),i),l.timeStamp=c,l.originalEvent=o,l.type=t,l.pointerId=at(i),l.pointerType=dt(i),l.target=a,l.currentTarget=null,"tap"===t){var p=s.getPointerIndex(i);l.dt=l.timeStamp-s.pointers[p].downTime;var f=l.timeStamp-s.tapTime;l.double=!!s.prevTap&&"doubletap"!==s.prevTap.type&&s.prevTap.target===l.target&&f<500;}else "doubletap"===t&&(l.dt=i.timeStamp-s.tapTime,l.double=!0);return l}return o(n,[{key:"_subtractOrigin",value:function(t){var e=t.x,n=t.y;return this.pageX-=e,this.pageY-=n,this.clientX-=e,this.clientY-=n,this}},{key:"_addOrigin",value:function(t){var e=t.x,n=t.y;return this.pageX+=e,this.pageY+=n,this.clientX+=e,this.clientY+=n,this}},{key:"preventDefault",value:function(){this.originalEvent.preventDefault();}}]),n}(vt),Bn={id:"pointer-events/base",before:["inertia","modifiers","auto-start","actions"],install:function(t){t.pointerEvents=Bn,t.defaults.actions.pointerEvents=Bn.defaults,V(t.actions.phaselessTypes,Bn.types);},listeners:{"interactions:new":function(t){var e=t.interaction;e.prevTap=null,e.tapTime=0;},"interactions:update-pointer":function(t){var e=t.down,n=t.pointerInfo;if(!e&&n.hold)return;n.hold={duration:1/0,timeout:null};},"interactions:move":function(t,e){var n=t.interaction,r=t.pointer,i=t.event,o=t.eventTarget;t.duplicate||n.pointerIsDown&&!n.pointerWasMoved||(n.pointerIsDown&&Gn(t),Vn({interaction:n,pointer:r,event:i,eventTarget:o,type:"move"},e));},"interactions:down":function(t,e){!function(t,e){for(var n=t.interaction,r=t.pointer,i=t.event,o=t.eventTarget,a=t.pointerIndex,s=n.pointers[a].hold,c=q(o),l={interaction:n,pointer:r,event:i,eventTarget:o,type:"hold",targets:[],path:c,node:null},u=0;u<c.length;u++){var p=c[u];l.node=p,e.fire("pointerEvents:collect-targets",l);}if(!l.targets.length)return;for(var f=1/0,d=0,h=l.targets;d<h.length;d++){var v=h[d].eventable.options.holdDuration;v<f&&(f=v);}s.duration=f,s.timeout=setTimeout((function(){Vn({interaction:n,eventTarget:o,pointer:r,event:i,type:"hold"},e);}),f);}(t,e),Vn(t,e);},"interactions:up":function(t,e){Gn(t),Vn(t,e),function(t,e){var n=t.interaction,r=t.pointer,i=t.event,o=t.eventTarget;n.pointerWasMoved||Vn({interaction:n,eventTarget:o,pointer:r,event:i,type:"tap"},e);}(t,e);},"interactions:cancel":function(t,e){Gn(t),Vn(t,e);}},PointerEvent:qn,fire:Vn,collectEventTargets:Wn,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:{down:!0,move:!0,up:!0,cancel:!0,tap:!0,doubletap:!0,hold:!0}};function Vn(t,e){var n=t.interaction,r=t.pointer,i=t.event,o=t.eventTarget,a=t.type,s=t.targets,c=void 0===s?Wn(t,e):s,l=new qn(a,r,i,o,n,e.now());e.fire("pointerEvents:new",{pointerEvent:l});for(var u={interaction:n,pointer:r,event:i,eventTarget:o,targets:c,type:a,pointerEvent:l},p=0;p<c.length;p++){var f=c[p];for(var d in f.props||{})l[d]=f.props[d];var h=K(f.eventable,f.node);if(l._subtractOrigin(h),l.eventable=f.eventable,l.currentTarget=f.node,f.eventable.fire(l),l._addOrigin(h),l.immediatePropagationStopped||l.propagationStopped&&p+1<c.length&&c[p+1].node!==l.currentTarget)break}if(e.fire("pointerEvents:fired",u),"tap"===a){var v=l.double?Vn({interaction:n,pointer:r,event:i,eventTarget:o,type:"doubletap"},e):l;n.prevTap=v,n.tapTime=v.timeStamp;}return l}function Wn(t,e){var n=t.interaction,r=t.pointer,i=t.event,o=t.eventTarget,a=t.type,s=n.getPointerIndex(r),c=n.pointers[s];if("tap"===a&&(n.pointerWasMoved||!c||c.downTarget!==o))return [];for(var l=q(o),u={interaction:n,pointer:r,event:i,eventTarget:o,type:a,path:l,targets:[],node:null},p=0;p<l.length;p++){var f=l[p];u.node=f,e.fire("pointerEvents:collect-targets",u);}return "hold"===a&&(u.targets=u.targets.filter((function(t){var e,r;return t.eventable.options.holdDuration===(null==(e=n.pointers[s])||null==(r=e.hold)?void 0:r.duration)}))),u.targets}function Gn(t){var e=t.interaction,n=t.pointerIndex,r=e.pointers[n].hold;r&&r.timeout&&(clearTimeout(r.timeout),r.timeout=null);}var Nn=Object.freeze({__proto__:null,default:Bn});function Un(t){var e=t.interaction;e.holdIntervalHandle&&(clearInterval(e.holdIntervalHandle),e.holdIntervalHandle=null);}var Hn={id:"pointer-events/holdRepeat",install:function(t){t.usePlugin(Bn);var e=t.pointerEvents;e.defaults.holdRepeatInterval=0,e.types.holdrepeat=t.actions.phaselessTypes.holdrepeat=!0;},listeners:["move","up","cancel","endall"].reduce((function(t,e){return t["pointerEvents:".concat(e)]=Un,t}),{"pointerEvents:new":function(t){var e=t.pointerEvent;"hold"===e.type&&(e.count=(e.count||0)+1);},"pointerEvents:fired":function(t,e){var n=t.interaction,r=t.pointerEvent,i=t.eventTarget,o=t.targets;if("hold"===r.type&&o.length){var a=o[0].eventable.options.holdRepeatInterval;a<=0||(n.holdIntervalHandle=setTimeout((function(){e.pointerEvents.fire({interaction:n,eventTarget:i,type:"hold",pointer:r,event:r},e);}),a));}}})},Kn=Hn;var $n={id:"pointer-events/interactableTargets",install:function(t){var e=t.Interactable;e.prototype.pointerEvents=function(t){return V(this.events.options,t),this};var n=e.prototype._backCompatOption;e.prototype._backCompatOption=function(t,e){var r=n.call(this,t,e);return r===this&&(this.events.options[t]=e),r};},listeners:{"pointerEvents:collect-targets":function(t,e){var n=t.targets,r=t.node,i=t.type,o=t.eventTarget;e.interactables.forEachMatch(r,(function(t){var e=t.events,a=e.options;e.types[i]&&e.types[i].length&&t.testIgnoreAllow(a,r,o)&&n.push({node:r,eventable:e,props:{interactable:t}});}));},"interactable:new":function(t){var e=t.interactable;e.events.getRect=function(t){return e.getRect(t)};},"interactable:set":function(t,e){var n=t.interactable,r=t.options;V(n.events.options,e.pointerEvents.defaults),V(n.events.options,r.pointerEvents||{});}}},Jn=$n,Qn={id:"pointer-events",install:function(t){t.usePlugin(Nn),t.usePlugin(Kn),t.usePlugin(Jn);}},Zn=Qn;var tr={id:"reflow",install:function(t){var e=t.Interactable;t.actions.phases.reflow=!0,e.prototype.reflow=function(e){return function(t,e,n){for(var r=t.getAllElements(),i=n.window.Promise,o=i?[]:null,a=function(){var a=r[s],c=t.getRect(a);if(!c)return 1;var l,u=bt(n.interactions.list,(function(n){return n.interacting()&&n.interactable===t&&n.element===a&&n.prepared.name===e.name}));if(u)u.move(),o&&(l=u._reflowPromise||new i((function(t){u._reflowResolve=t;})));else {var p=U(c),f=function(t){return {coords:t,get page(){return this.coords.page},get client(){return this.coords.client},get timeStamp(){return this.coords.timeStamp},get pageX(){return this.coords.page.x},get pageY(){return this.coords.page.y},get clientX(){return this.coords.client.x},get clientY(){return this.coords.client.y},get pointerId(){return this.coords.pointerId},get target(){return this.coords.target},get type(){return this.coords.type},get pointerType(){return this.coords.pointerType},get buttons(){return this.coords.buttons},preventDefault:function(){}}}({page:{x:p.x,y:p.y},client:{x:p.x,y:p.y},timeStamp:n.now()});l=function(t,e,n,r,i){var o=t.interactions.new({pointerType:"reflow"}),a={interaction:o,event:i,pointer:i,eventTarget:n,phase:"reflow"};o.interactable=e,o.element=n,o.prevEvent=i,o.updatePointer(i,i,n,!0),nt(o.coords.delta),Ut(o.prepared,r),o._doPhase(a);var s=t.window,c=s.Promise,l=c?new c((function(t){o._reflowResolve=t;})):void 0;o._reflowPromise=l,o.start(r,e,n),o._interacting?(o.move(a),o.end(i)):(o.stop(),o._reflowResolve());return o.removePointer(i,i),l}(n,t,a,e,f);}o&&o.push(l);},s=0;s<r.length&&!a();s++);return o&&i.all(o).then((function(){return t}))}(this,e,t)};},listeners:{"interactions:stop":function(t,e){var n=t.interaction;"reflow"===n.pointerType&&(n._reflowResolve&&n._reflowResolve(),function(t,e){t.splice(t.indexOf(e),1);}(e.interactions.list,n));}}},er=tr;if(un.use(he),un.use(Ce),un.use(Zn),un.use(qe),un.use(Ln),un.use(pe),un.use(Xt),un.use(Gt),un.use(er),un.default=un,"object"===(n(module))&&module)try{module.exports=un;}catch(t){}return un.default=un,un}));
	
} (interact_min, interact_min.exports));

var interact_minExports = interact_min.exports;
var interact = /*@__PURE__*/getDefaultExportFromCjs(interact_minExports);

const errorStore = writable("");
const editorWrapperHeightStore = writable(0);
const projectExpanded = writable(true);

var img$t = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg class='feather feather-minimize-2' fill='none' height='24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cpolyline points='4 14 10 14 10 20'/%3e%3cpolyline points='20 10 14 10 14 4'/%3e%3cline x1='14' x2='21' y1='10' y2='3'/%3e%3cline x1='3' x2='10' y1='21' y2='14'/%3e%3c/svg%3e";

var img$s = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg class='feather feather-maximize-2' fill='none' height='24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cpolyline points='15 3 21 3 21 9'/%3e%3cpolyline points='9 21 3 21 3 15'/%3e%3cline x1='21' x2='14' y1='3' y2='10'/%3e%3cline x1='3' x2='10' y1='21' y2='14'/%3e%3c/svg%3e";

/* src\Components\Editor\Problems.svelte generated by Svelte v3.59.2 */
const file$s = "src\\Components\\Editor\\Problems.svelte";

function create_fragment$t(ctx) {
	let div4;
	let div2;
	let div0;
	let h4;
	let t0_value = /*$_*/ ctx[1]("editor.terminal.terminal") + "";
	let t0;
	let t1;
	let div1;
	let button;
	let img;
	let img_src_value;
	let button_title_value;
	let t2;
	let div3;
	let p;

	let raw_value = (/*$errorStore*/ ctx[2]
	? /*$errorStore*/ ctx[2].replace(/\n/g, "<br>")
	: "") + "";

	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div4 = element("div");
			div2 = element("div");
			div0 = element("div");
			h4 = element("h4");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			button = element("button");
			img = element("img");
			t2 = space();
			div3 = element("div");
			p = element("p");
			attr_dev(h4, "class", "terminal-header svelte-1k1pf9o");
			add_location(h4, file$s, 67, 6, 2157);
			attr_dev(div0, "id", "headerFrame");
			attr_dev(div0, "class", "svelte-1k1pf9o");
			add_location(div0, file$s, 66, 4, 2128);
			if (!src_url_equal(img.src, img_src_value = /*icon*/ ctx[0])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Minimize Terminal");
			attr_dev(img, "width", "20px");
			attr_dev(img, "height", "20px");
			attr_dev(img, "class", "svelte-1k1pf9o");
			add_location(img, file$s, 76, 8, 2453);
			attr_dev(button, "title", button_title_value = /*$_*/ ctx[1]("editor.terminal.minimizeTerminal"));
			attr_dev(button, "id", "minimize-problem");
			attr_dev(button, "class", "minimize-button svelte-1k1pf9o");
			add_location(button, file$s, 70, 6, 2276);
			attr_dev(div1, "class", "minimize-terminal svelte-1k1pf9o");
			add_location(div1, file$s, 69, 4, 2238);
			attr_dev(div2, "id", "navFrame");
			attr_dev(div2, "class", "svelte-1k1pf9o");
			add_location(div2, file$s, 65, 2, 2104);
			attr_dev(p, "class", "problems svelte-1k1pf9o");
			add_location(p, file$s, 81, 4, 2594);
			attr_dev(div3, "id", "problem-container");
			attr_dev(div3, "class", "svelte-1k1pf9o");
			add_location(div3, file$s, 80, 2, 2561);
			attr_dev(div4, "id", "terminal-frame");
			attr_dev(div4, "class", "svelte-1k1pf9o");
			add_location(div4, file$s, 64, 0, 2076);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, div2);
			append_dev(div2, div0);
			append_dev(div0, h4);
			append_dev(h4, t0);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div1, button);
			append_dev(button, img);
			append_dev(div4, t2);
			append_dev(div4, div3);
			append_dev(div3, p);
			p.innerHTML = raw_value;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*handleMinimizing*/ ctx[3], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$_*/ 2 && t0_value !== (t0_value = /*$_*/ ctx[1]("editor.terminal.terminal") + "")) set_data_dev(t0, t0_value);

			if (dirty & /*icon*/ 1 && !src_url_equal(img.src, img_src_value = /*icon*/ ctx[0])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*$_*/ 2 && button_title_value !== (button_title_value = /*$_*/ ctx[1]("editor.terminal.minimizeTerminal"))) {
				attr_dev(button, "title", button_title_value);
			}

			if (dirty & /*$errorStore*/ 4 && raw_value !== (raw_value = (/*$errorStore*/ ctx[2]
			? /*$errorStore*/ ctx[2].replace(/\n/g, "<br>")
			: "") + "")) p.innerHTML = raw_value;		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$t.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$t($$self, $$props, $$invalidate) {
	let icon;
	let $_;
	let $errorStore;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(1, $_ = $$value));
	validate_store(errorStore, 'errorStore');
	component_subscribe($$self, errorStore, $$value => $$invalidate(2, $errorStore = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Problems', slots, []);
	let isMinimized = false;
	let originalHeight = "27%";

	// Make the terminal frame resizable
	interact("#terminal-frame").resizable({
		edges: {
			top: true,
			left: false,
			bottom: false,
			right: false
		},
		modifiers: [
			interact.modifiers.restrictSize({
				min: { width: 100, height: 46 },
				max: { width: Infinity, height: 500 }
			})
		]
	}).on("resizemove", function (event) {
		var target = event.target;
		target.style.width = "100%";
		target.style.height = event.rect.height + "px";
	}).on("resizestart", function (event) {
		var target = event.target;
		target.style.borderTop = "2px solid blue";

		// Make #editor-wrapper unclickable
		var editorWrapper = document.querySelector("#editor-wrapper");

		if (editorWrapper) {
			editorWrapper.style.pointerEvents = "none";
		}
	}).on("resizeend", function (event) {
		var target = event.target;
		target.style.borderTop = "";

		// Make #editor-wrapper clickable again
		var editorWrapper = document.querySelector("#editor-wrapper");

		if (editorWrapper) {
			editorWrapper.style.pointerEvents = "auto";
		}
	});

	function handleMinimizing() {
		let terminalFrame = document.getElementById("terminal-frame");
		let minimizeProblem = document.getElementById("minimize-problem");

		if (isMinimized) {
			terminalFrame.style.height = originalHeight;
			$$invalidate(4, isMinimized = false);
			minimizeProblem.title = "Minimize Terminal";
		} else {
			terminalFrame.style.height = "42px";
			$$invalidate(4, isMinimized = true);
			minimizeProblem.title = "Expand Terminal";
		}
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Problems> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		interact,
		errorStore,
		MinimizeIcon: img$t,
		ExpandIcon: img$s,
		_: $format,
		writable,
		isMinimized,
		originalHeight,
		handleMinimizing,
		icon,
		$_,
		$errorStore
	});

	$$self.$inject_state = $$props => {
		if ('isMinimized' in $$props) $$invalidate(4, isMinimized = $$props.isMinimized);
		if ('originalHeight' in $$props) originalHeight = $$props.originalHeight;
		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*isMinimized*/ 16) {
			$$invalidate(0, icon = isMinimized ? img$s : img$t);
		}
	};

	return [icon, $_, $errorStore, handleMinimizing, isMinimized];
}

class Problems extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$t, create_fragment$t, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Problems",
			options,
			id: create_fragment$t.name
		});
	}
}

/* src\Components\Editor\Dashboard.svelte generated by Svelte v3.59.2 */
const file$r = "src\\Components\\Editor\\Dashboard.svelte";

function create_fragment$s(ctx) {
	let div;
	let h4;
	let t_value = /*$_*/ ctx[0]("editor.editorDashboard.dashboard") + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			h4 = element("h4");
			t = text(t_value);
			attr_dev(h4, "class", "dashboard-header svelte-6bmxgw");
			add_location(h4, file$r, 5, 2, 88);
			attr_dev(div, "id", "dashboard-container");
			attr_dev(div, "class", "svelte-6bmxgw");
			add_location(div, file$r, 4, 0, 55);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h4);
			append_dev(h4, t);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$_*/ 1 && t_value !== (t_value = /*$_*/ ctx[0]("editor.editorDashboard.dashboard") + "")) set_data_dev(t, t_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$s.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$s($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(0, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Dashboard', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ _: $format, $_ });
	return [$_];
}

class Dashboard extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$s, create_fragment$s, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dashboard",
			options,
			id: create_fragment$s.name
		});
	}
}

class FileNavigator {
  constructor(fileManager, codeEditor,currentFile) {
    this.fileManager = fileManager;
    this.codeEditor = codeEditor;
    this.currentPageName = writable(null);
    this.currentFile = currentFile;
  }

  // As the name suggests, creates a new page.
  // Prompts the user for the new page name, checks if a file with the same name already exists,
  //uses fileManager to save the new page, and loads the new page in the code editor.
  createNewPage() {
    // Ask the user for the new page name
    const newPageName = prompt("Enter the new page name:");
    if (newPageName === null || newPageName.trim() === "") {
      alert("Invalid page name");
      return;
    }

    // Check if file with the same name exists
    const files = this.fileManager.getAllFiles();
    if (files.includes(newPageName)) {
      alert("File with the same name already exists");
      return;
    }

    // Create the new page
    this.fileManager.saveToLocalStorage([], newPageName);

    // Load the new page in the code editor
  
    this.codeEditor.loadFile(newPageName);
    this.currentPageName.set(newPageName);
    this.currentFile.set(newPageName);
    
  }

  // Deletes the file from the fileManager and loads the next file in the code editor.
deleteFile(file) {
  // Get the current index of the file to be deleted
  const filesBeforeDeletion = this.fileManager.getAllFiles();
  const index = filesBeforeDeletion.indexOf(file);

  // Delete the file from localStorage
  this.fileManager.deleteFile(file);

  // Make code editor focus the next file on left if exists, else right, else make focus default
  const filesAfterDeletion = this.fileManager.getAllFiles();

  let nextFile;
  if (index > 0) {
    nextFile = filesAfterDeletion[index - 1];
  } else if (filesAfterDeletion.length > 0) {
    nextFile = filesAfterDeletion[0];
  } else {
    nextFile = "main";
  }
  this.codeEditor.loadFile(nextFile);
  this.currentPageName.set(nextFile);
  this.currentFile.set(nextFile); // Update the currentFile store
}
  get currentFileName() {
    return this.currentPageName;
  }
  get currentFileName() {
    return this.currentPageName;
  }
}

var img$r = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg data-name='Layer 1' id='Layer_1' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3ctitle/%3e%3cpath d='M27.2%2c8.22H23.78V5.42A3.42%2c3.42%2c0%2c0%2c0%2c20.36%2c2H5.42A3.42%2c3.42%2c0%2c0%2c0%2c2%2c5.42V20.36a3.42%2c3.42%2c0%2c0%2c0%2c3.42%2c3.42h2.8V27.2A2.81%2c2.81%2c0%2c0%2c0%2c11%2c30H27.2A2.81%2c2.81%2c0%2c0%2c0%2c30%2c27.2V11A2.81%2c2.81%2c0%2c0%2c0%2c27.2%2c8.22ZM5.42%2c21.91a1.55%2c1.55%2c0%2c0%2c1-1.55-1.55V5.42A1.54%2c1.54%2c0%2c0%2c1%2c5.42%2c3.87H20.36a1.55%2c1.55%2c0%2c0%2c1%2c1.55%2c1.55v2.8H11A2.81%2c2.81%2c0%2c0%2c0%2c8.22%2c11V21.91ZM28.13%2c27.2a.93.93%2c0%2c0%2c1-.93.93H11a.93.93%2c0%2c0%2c1-.93-.93V11a.93.93%2c0%2c0%2c1%2c.93-.93H27.2a.93.93%2c0%2c0%2c1%2c.93.93Z'/%3e%3cpath d='M24.09%2c18.18H20v-4a.93.93%2c0%2c1%2c0-1.86%2c0v4h-4a.93.93%2c0%2c0%2c0%2c0%2c1.86h4v4.05a.93.93%2c0%2c1%2c0%2c1.86%2c0V20h4.05a.93.93%2c0%2c1%2c0%2c0-1.86Z'/%3e%3c/svg%3e";

var img$q = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11%2c12 L11%2c9 L13%2c9 L13%2c12 L16%2c12 L16%2c14 L13%2c14 L13%2c17 L11%2c17 L11%2c14 L8%2c14 L8%2c12 L11%2c12 Z M21%2c5 C22.1045695%2c5 23%2c5.8954305 23%2c7 L23%2c19 C23%2c20.1045695 22.1045695%2c21 21%2c21 L3%2c21 C1.8954305%2c21 1%2c20.1045695 1%2c19 L1%2c5 C1%2c3.8954305 1.8954305%2c3 3%2c3 L9%2c3 C10.1200023%2c3 10.832939%2c3.47545118 11.5489764%2c4.37885309 C11.5967547%2c4.43913352 11.8100999%2c4.71588275 11.8624831%2c4.78081945 C12.019726%2c4.97574495 12.0517795%2c4.99972956 12.0017863%2c5 L21%2c5 Z M21%2c19 L21%2c7 L11.994646%2c6.99998567 C11.2764915%2c6.99614058 10.8086916%2c6.65990923 10.3058322%2c6.03654146 C10.2364281%2c5.95050497 10.0158737%2c5.66440398 9.98159778%2c5.62115916 C9.60702158%2c5.14856811 9.38424442%2c5 9%2c5 L3%2c5 L3%2c19 L21%2c19 Z' fill-rule='evenodd'/%3e%3c/svg%3e";

/* src\Components\Editor\FileNavigator.svelte generated by Svelte v3.59.2 */
const file$q = "src\\Components\\Editor\\FileNavigator.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	return child_ctx;
}

// (97:10) {#each files as file (file)}
function create_each_block$4(key_1, ctx) {
	let li;
	let t0_value = /*file*/ ctx[15] + "";
	let t0;
	let t1;
	let button;
	let t3;
	let li_class_value;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[12](/*file*/ ctx[15]);
	}

	function click_handler_1() {
		return /*click_handler_1*/ ctx[13](/*file*/ ctx[15]);
	}

	function keydown_handler(...args) {
		return /*keydown_handler*/ ctx[14](/*file*/ ctx[15], ...args);
	}

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			li = element("li");
			t0 = text(t0_value);
			t1 = space();
			button = element("button");
			button.textContent = "X";
			t3 = space();
			attr_dev(button, "class", "svelte-5h3ue5");
			add_location(button, file$q, 103, 14, 3010);

			attr_dev(li, "class", li_class_value = "" + (null_to_empty(/*$currentFile*/ ctx[2] === /*file*/ ctx[15]
			? "active"
			: "") + " svelte-5h3ue5"));

			add_location(li, file$q, 97, 12, 2769);
			this.first = li;
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, t0);
			append_dev(li, t1);
			append_dev(li, button);
			append_dev(li, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button, "click", click_handler, false, false, false, false),
					listen_dev(li, "click", click_handler_1, false, false, false, false),
					listen_dev(li, "keydown", keydown_handler, false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*files*/ 1 && t0_value !== (t0_value = /*file*/ ctx[15] + "")) set_data_dev(t0, t0_value);

			if (dirty & /*$currentFile, files*/ 5 && li_class_value !== (li_class_value = "" + (null_to_empty(/*$currentFile*/ ctx[2] === /*file*/ ctx[15]
			? "active"
			: "") + " svelte-5h3ue5"))) {
				attr_dev(li, "class", li_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(97:10) {#each files as file (file)}",
		ctx
	});

	return block;
}

function create_fragment$r(ctx) {
	let div0;
	let t0;
	let div5;
	let div1;
	let input;
	let input_placeholder_value;
	let t1;
	let button0;
	let img0;
	let img0_src_value;
	let button0_title_value;
	let t2;
	let button1;
	let img1;
	let img1_src_value;
	let button1_title_value;
	let t3;
	let div4;
	let div3;
	let div2;
	let ul;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let mounted;
	let dispose;
	let each_value = /*files*/ ctx[0];
	validate_each_argument(each_value);
	const get_key = ctx => /*file*/ ctx[15];
	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$4(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
	}

	const block = {
		c: function create() {
			div0 = element("div");
			t0 = space();
			div5 = element("div");
			div1 = element("div");
			input = element("input");
			t1 = space();
			button0 = element("button");
			img0 = element("img");
			t2 = space();
			button1 = element("button");
			img1 = element("img");
			t3 = space();
			div4 = element("div");
			div3 = element("div");
			div2 = element("div");
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div0, "id", "nav-placeholder");
			attr_dev(div0, "class", "svelte-5h3ue5");
			add_location(div0, file$q, 59, 0, 1744);
			attr_dev(input, "id", "project-name");
			attr_dev(input, "type", "text");
			attr_dev(input, "maxlength", MAX_LENGTH_PROJECT_NAME);
			attr_dev(input, "placeholder", input_placeholder_value = /*$_*/ ctx[1]("editor.projectToolbar.nameProject"));
			attr_dev(input, "class", "svelte-5h3ue5");
			add_location(input, file$q, 62, 4, 1836);
			if (!src_url_equal(img0.src, img0_src_value = img$r)) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", "Create new file");
			attr_dev(img0, "width", "22px");
			attr_dev(img0, "height", "22px");
			attr_dev(img0, "class", "svelte-5h3ue5");
			add_location(img0, file$q, 74, 6, 2163);
			attr_dev(button0, "title", button0_title_value = /*$_*/ ctx[1]("editor.projectToolbar.createFile"));
			attr_dev(button0, "class", "project-toolbar-btn svelte-5h3ue5");
			attr_dev(button0, "id", "create-new-file");
			add_location(button0, file$q, 68, 4, 1998);
			if (!src_url_equal(img1.src, img1_src_value = img$q)) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", "Create new folder");
			attr_dev(img1, "width", "22px");
			attr_dev(img1, "height", "22px");
			attr_dev(img1, "background", "transparent");
			attr_dev(img1, "class", "svelte-5h3ue5");
			add_location(img1, file$q, 83, 6, 2436);
			attr_dev(button1, "title", button1_title_value = /*$_*/ ctx[1]("editor.projectToolbar.createFolder"));
			attr_dev(button1, "class", "project-toolbar-btn svelte-5h3ue5");
			attr_dev(button1, "id", "create-new-folder");
			add_location(button1, file$q, 78, 4, 2298);
			attr_dev(div1, "id", "project-toolbar");
			attr_dev(div1, "class", "svelte-5h3ue5");
			add_location(div1, file$q, 61, 2, 1805);
			attr_dev(ul, "class", "svelte-5h3ue5");
			add_location(ul, file$q, 95, 8, 2713);
			attr_dev(div2, "id", "file-selector");
			attr_dev(div2, "class", "svelte-5h3ue5");
			add_location(div2, file$q, 94, 6, 2680);
			attr_dev(div3, "id", "file-system-container");
			attr_dev(div3, "class", "svelte-5h3ue5");
			add_location(div3, file$q, 93, 4, 2641);
			attr_dev(div4, "class", "flex-column svelte-5h3ue5");
			add_location(div4, file$q, 92, 2, 2611);
			attr_dev(div5, "id", "file-navigator");
			attr_dev(div5, "class", "svelte-5h3ue5");
			add_location(div5, file$q, 60, 0, 1777);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, div5, anchor);
			append_dev(div5, div1);
			append_dev(div1, input);
			append_dev(div1, t1);
			append_dev(div1, button0);
			append_dev(button0, img0);
			append_dev(div1, t2);
			append_dev(div1, button1);
			append_dev(button1, img1);
			append_dev(div5, t3);
			append_dev(div5, div4);
			append_dev(div4, div3);
			append_dev(div3, div2);
			append_dev(div2, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(ul, null);
				}
			}

			if (!mounted) {
				dispose = listen_dev(button0, "click", /*createNewFile*/ ctx[5], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$_*/ 2 && input_placeholder_value !== (input_placeholder_value = /*$_*/ ctx[1]("editor.projectToolbar.nameProject"))) {
				attr_dev(input, "placeholder", input_placeholder_value);
			}

			if (dirty & /*$_*/ 2 && button0_title_value !== (button0_title_value = /*$_*/ ctx[1]("editor.projectToolbar.createFile"))) {
				attr_dev(button0, "title", button0_title_value);
			}

			if (dirty & /*$_*/ 2 && button1_title_value !== (button1_title_value = /*$_*/ ctx[1]("editor.projectToolbar.createFolder"))) {
				attr_dev(button1, "title", button1_title_value);
			}

			if (dirty & /*$currentFile, files, selectFile, deleteFile*/ 85) {
				each_value = /*files*/ ctx[0];
				validate_each_argument(each_value);
				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, destroy_block, create_each_block$4, null, get_each_context$4);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div5);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$r.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const MAX_LENGTH_PROJECT_NAME = 22;

function instance$r($$self, $$props, $$invalidate) {
	let $_;
	let $currentFile;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(1, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('FileNavigator', slots, []);
	let { codeEditor } = $$props;
	let { fileManager } = $$props;
	let { textareaValue } = $$props;
	let files = [];
	let currentFile = writable(null);
	validate_store(currentFile, 'currentFile');
	component_subscribe($$self, currentFile, value => $$invalidate(2, $currentFile = value));
	let fileNavigator;

	let unsubscribe = () => {
		
	};

	function selectFile(file) {
		codeEditor.loadFile(file);
		textareaValue.set(codeEditor.textarea.value);
		currentFile.set(file);
		fileManager.saveCurrentFile(file);
	}

	function createNewFile() {
		fileNavigator.createNewPage();
		$$invalidate(0, files = fileManager.getAllFiles());
		textareaValue.set(codeEditor.textarea.value);
	}

	function deleteFile(file) {
		fileNavigator.deleteFile(file);
		$$invalidate(0, files = fileManager.getAllFiles());
		textareaValue.set(codeEditor.textarea.value);
	}

	$$self.$$.on_mount.push(function () {
		if (codeEditor === undefined && !('codeEditor' in $$props || $$self.$$.bound[$$self.$$.props['codeEditor']])) {
			console.warn("<FileNavigator> was created without expected prop 'codeEditor'");
		}

		if (fileManager === undefined && !('fileManager' in $$props || $$self.$$.bound[$$self.$$.props['fileManager']])) {
			console.warn("<FileNavigator> was created without expected prop 'fileManager'");
		}

		if (textareaValue === undefined && !('textareaValue' in $$props || $$self.$$.bound[$$self.$$.props['textareaValue']])) {
			console.warn("<FileNavigator> was created without expected prop 'textareaValue'");
		}
	});

	const writable_props = ['codeEditor', 'fileManager', 'textareaValue'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileNavigator> was created with unknown prop '${key}'`);
	});

	const click_handler = file => deleteFile(file);
	const click_handler_1 = file => selectFile(file);
	const keydown_handler = (file, event) => event.key === "Enter" && selectFile(file);

	$$self.$$set = $$props => {
		if ('codeEditor' in $$props) $$invalidate(7, codeEditor = $$props.codeEditor);
		if ('fileManager' in $$props) $$invalidate(8, fileManager = $$props.fileManager);
		if ('textareaValue' in $$props) $$invalidate(9, textareaValue = $$props.textareaValue);
	};

	$$self.$capture_state = () => ({
		writable,
		FileNavigator,
		AddFileIcon: img$r,
		AddFolderIcon: img$q,
		_: $format,
		text,
		tick,
		codeEditor,
		fileManager,
		textareaValue,
		files,
		currentFile,
		fileNavigator,
		MAX_LENGTH_PROJECT_NAME,
		unsubscribe,
		selectFile,
		createNewFile,
		deleteFile,
		$_,
		$currentFile
	});

	$$self.$inject_state = $$props => {
		if ('codeEditor' in $$props) $$invalidate(7, codeEditor = $$props.codeEditor);
		if ('fileManager' in $$props) $$invalidate(8, fileManager = $$props.fileManager);
		if ('textareaValue' in $$props) $$invalidate(9, textareaValue = $$props.textareaValue);
		if ('files' in $$props) $$invalidate(0, files = $$props.files);
		if ('currentFile' in $$props) $$invalidate(3, currentFile = $$props.currentFile);
		if ('fileNavigator' in $$props) $$invalidate(10, fileNavigator = $$props.fileNavigator);
		if ('unsubscribe' in $$props) $$invalidate(11, unsubscribe = $$props.unsubscribe);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*codeEditor, fileManager, unsubscribe, fileNavigator*/ 3456) {
			if (codeEditor && fileManager) {
				$$invalidate(10, fileNavigator = new FileNavigator(fileManager, codeEditor, currentFile));

				// Update the files variable whenever the file list changes
				$$invalidate(0, files = fileManager.getAllFiles());

				// Update the current file whenever the code editor's current file changes
				tick().then(() => {
					const savedCurrentFile = localStorage.getItem("currentFile");

					if (savedCurrentFile) {
						currentFile.set(savedCurrentFile);
					}
				});

				unsubscribe();

				$$invalidate(11, unsubscribe = fileNavigator.currentPageName.subscribe(value => {
					currentFile.set(value);
				}));
			}
		}
	};

	return [
		files,
		$_,
		$currentFile,
		currentFile,
		selectFile,
		createNewFile,
		deleteFile,
		codeEditor,
		fileManager,
		textareaValue,
		fileNavigator,
		unsubscribe,
		click_handler,
		click_handler_1,
		keydown_handler
	];
}

class FileNavigator_1 extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$r, create_fragment$r, safe_not_equal, {
			codeEditor: 7,
			fileManager: 8,
			textareaValue: 9
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "FileNavigator_1",
			options,
			id: create_fragment$r.name
		});
	}

	get codeEditor() {
		throw new Error("<FileNavigator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set codeEditor(value) {
		throw new Error("<FileNavigator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fileManager() {
		throw new Error("<FileNavigator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fileManager(value) {
		throw new Error("<FileNavigator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get textareaValue() {
		throw new Error("<FileNavigator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set textareaValue(value) {
		throw new Error("<FileNavigator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\Components\Editor\LineNumbers.svelte generated by Svelte v3.59.2 */

const file$p = "src\\Components\\Editor\\LineNumbers.svelte";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	return child_ctx;
}

// (18:2) {#each lineNumbers as lineNumber (lineNumber)}
function create_each_block$3(key_1, ctx) {
	let span;
	let t_value = /*lineNumber*/ ctx[4] + "";
	let t;

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			span = element("span");
			t = text(t_value);
			attr_dev(span, "class", "svelte-1f6044e");
			add_location(span, file$p, 18, 4, 475);
			this.first = span;
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, t);
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*lineNumbers*/ 2 && t_value !== (t_value = /*lineNumber*/ ctx[4] + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(18:2) {#each lineNumbers as lineNumber (lineNumber)}",
		ctx
	});

	return block;
}

function create_fragment$q(ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_value = /*lineNumbers*/ ctx[1];
	validate_each_argument(each_value);
	const get_key = ctx => /*lineNumber*/ ctx[4];
	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$3(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "id", "line-numbers");
			attr_dev(div, "class", "svelte-1f6044e");
			add_location(div, file$p, 16, 0, 398);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*lineNumbers*/ 2) {
				each_value = /*lineNumbers*/ ctx[1];
				validate_each_argument(each_value);
				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$3, null, get_each_context$3);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$q.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$q($$self, $$props, $$invalidate) {
	let lineNumbers;

	let $textareaValue,
		$$unsubscribe_textareaValue = noop,
		$$subscribe_textareaValue = () => ($$unsubscribe_textareaValue(), $$unsubscribe_textareaValue = subscribe(textareaValue, $$value => $$invalidate(3, $textareaValue = $$value)), textareaValue);

	$$self.$$.on_destroy.push(() => $$unsubscribe_textareaValue());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('LineNumbers', slots, []);
	let { textareaValue } = $$props;
	validate_store(textareaValue, 'textareaValue');
	$$subscribe_textareaValue();

	function recalculateLineNumbers() {
		$$invalidate(1, lineNumbers = Array.from({ length: textareaValue.split("\n").length }, (_, i) => i + 1));
	}

	$$self.$$.on_mount.push(function () {
		if (textareaValue === undefined && !('textareaValue' in $$props || $$self.$$.bound[$$self.$$.props['textareaValue']])) {
			console.warn("<LineNumbers> was created without expected prop 'textareaValue'");
		}
	});

	const writable_props = ['textareaValue'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LineNumbers> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('textareaValue' in $$props) $$subscribe_textareaValue($$invalidate(0, textareaValue = $$props.textareaValue));
	};

	$$self.$capture_state = () => ({
		textareaValue,
		recalculateLineNumbers,
		lineNumbers,
		$textareaValue
	});

	$$self.$inject_state = $$props => {
		if ('textareaValue' in $$props) $$subscribe_textareaValue($$invalidate(0, textareaValue = $$props.textareaValue));
		if ('lineNumbers' in $$props) $$invalidate(1, lineNumbers = $$props.lineNumbers);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*$textareaValue*/ 8) {
			// Reactive statement to generate line numbers whenever textareaValue changes
			$$invalidate(1, lineNumbers = Array.from(
				{
					length: $textareaValue.split("\n").length
				},
				(_, i) => i + 1
			));
		}
	};

	return [textareaValue, lineNumbers, recalculateLineNumbers, $textareaValue];
}

class LineNumbers extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$q, create_fragment$q, safe_not_equal, {
			textareaValue: 0,
			recalculateLineNumbers: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LineNumbers",
			options,
			id: create_fragment$q.name
		});
	}

	get textareaValue() {
		throw new Error("<LineNumbers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set textareaValue(value) {
		throw new Error("<LineNumbers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get recalculateLineNumbers() {
		return this.$$.ctx[2];
	}

	set recalculateLineNumbers(value) {
		throw new Error("<LineNumbers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
function isNothing(subject) {
  return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
  return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];

  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


var isNothing_1      = isNothing;
var isObject_1       = isObject;
var toArray_1        = toArray;
var repeat_1         = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1         = extend;

var common = {
	isNothing: isNothing_1,
	isObject: isObject_1,
	toArray: toArray_1,
	repeat: repeat_1,
	isNegativeZero: isNegativeZero_1,
	extend: extend_1
};

// YAML error class. http://stackoverflow.com/questions/8458984


function formatError(exception, compact) {
  var where = '', message = exception.reason || '(unknown reason)';

  if (!exception.mark) return message;

  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }

  where += '(' + (exception.mark.line + 1) + ':' + (exception.mark.column + 1) + ')';

  if (!compact && exception.mark.snippet) {
    where += '\n\n' + exception.mark.snippet;
  }

  return message + ' ' + where;
}


function YAMLException$1(reason, mark) {
  // Super constructor
  Error.call(this);

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }
}


// Inherit from Error
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;


YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ': ' + formatError(this, compact);
};


var exception = YAMLException$1;

// get snippet for a single line, respecting maxLength
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = '';
  var tail = '';
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;

  if (position - lineStart > maxHalfLength) {
    head = ' ... ';
    lineStart = position - maxHalfLength + head.length;
  }

  if (lineEnd - position > maxHalfLength) {
    tail = ' ...';
    lineEnd = position + maxHalfLength - tail.length;
  }

  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, '→') + tail,
    pos: position - lineStart + head.length // relative position
  };
}


function padStart(string, max) {
  return common.repeat(' ', max - string.length) + string;
}


function makeSnippet(mark, options) {
  options = Object.create(options || null);

  if (!mark.buffer) return null;

  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent      !== 'number') options.indent      = 1;
  if (typeof options.linesBefore !== 'number') options.linesBefore = 3;
  if (typeof options.linesAfter  !== 'number') options.linesAfter  = 2;

  var re = /\r?\n|\r|\0/g;
  var lineStarts = [ 0 ];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;

  while ((match = re.exec(mark.buffer))) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);

    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }

  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;

  var result = '', i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);

  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(' ', options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n' + result;
  }

  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(' ', options.indent) + padStart((mark.line + 1).toString(), lineNoLength) +
    ' | ' + line.str + '\n';
  result += common.repeat('-', options.indent + lineNoLength + 3 + line.pos) + '^' + '\n';

  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(' ', options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) +
      ' | ' + line.str + '\n';
  }

  return result.replace(/\n$/, '');
}


var snippet = makeSnippet;

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'multi',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'representName',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type$1(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.options       = options; // keep original options in case user wants to extend this type later
  this.tag           = tag;
  this.kind          = options['kind']          || null;
  this.resolve       = options['resolve']       || function () { return true; };
  this.construct     = options['construct']     || function (data) { return data; };
  this.instanceOf    = options['instanceOf']    || null;
  this.predicate     = options['predicate']     || null;
  this.represent     = options['represent']     || null;
  this.representName = options['representName'] || null;
  this.defaultStyle  = options['defaultStyle']  || null;
  this.multi         = options['multi']         || false;
  this.styleAliases  = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

var type = Type$1;

/*eslint-disable max-len*/





function compileList(schema, name) {
  var result = [];

  schema[name].forEach(function (currentType) {
    var newIndex = result.length;

    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag &&
          previousType.kind === currentType.kind &&
          previousType.multi === currentType.multi) {

        newIndex = previousIndex;
      }
    });

    result[newIndex] = currentType;
  });

  return result;
}


function compileMap(/* lists... */) {
  var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {},
        multi: {
          scalar: [],
          sequence: [],
          mapping: [],
          fallback: []
        }
      }, index, length;

  function collectType(type) {
    if (type.multi) {
      result.multi[type.kind].push(type);
      result.multi['fallback'].push(type);
    } else {
      result[type.kind][type.tag] = result['fallback'][type.tag] = type;
    }
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}


function Schema$1(definition) {
  return this.extend(definition);
}


Schema$1.prototype.extend = function extend(definition) {
  var implicit = [];
  var explicit = [];

  if (definition instanceof type) {
    // Schema.extend(type)
    explicit.push(definition);

  } else if (Array.isArray(definition)) {
    // Schema.extend([ type1, type2, ... ])
    explicit = explicit.concat(definition);

  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    // Schema.extend({ explicit: [ type1, type2, ... ], implicit: [ type1, type2, ... ] })
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);

  } else {
    throw new exception('Schema.extend argument should be a Type, [ Type ], ' +
      'or a schema definition ({ implicit: [...], explicit: [...] })');
  }

  implicit.forEach(function (type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }

    if (type$1.loadKind && type$1.loadKind !== 'scalar') {
      throw new exception('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }

    if (type$1.multi) {
      throw new exception('There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.');
    }
  });

  explicit.forEach(function (type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception('Specified list of YAML types (or a single Type object) contains a non-Type object.');
    }
  });

  var result = Object.create(Schema$1.prototype);

  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);

  result.compiledImplicit = compileList(result, 'implicit');
  result.compiledExplicit = compileList(result, 'explicit');
  result.compiledTypeMap  = compileMap(result.compiledImplicit, result.compiledExplicit);

  return result;
};


var schema = Schema$1;

var str = new type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});

var seq = new type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return data !== null ? data : []; }
});

var map = new type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return data !== null ? data : {}; }
});

var failsafe = new schema({
  explicit: [
    str,
    seq,
    map
  ]
});

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

var _null = new type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; },
    empty:     function () { return '';     }
  },
  defaultStyle: 'lowercase'
});

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

var bool = new type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'o') {
      // base 8
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }
  }

  // base 10 (except 0)

  // value should not start with `_`;
  if (ch === '_') return false;

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;

  return true;
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch;

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value.slice(2), 16);
    if (value[1] === 'o') return sign * parseInt(value.slice(2), 8);
  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return (Object.prototype.toString.call(object)) === '[object Number]' &&
         (object % 1 === 0 && !common.isNegativeZero(object));
}

var int = new type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
    octal:       function (obj) { return obj >= 0 ? '0o'  + obj.toString(8) : '-0o'  + obj.toString(8).slice(1); },
    decimal:     function (obj) { return obj.toString(10); },
    /* eslint-disable max-len */
    hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});

var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  '^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
  // .2e4, .2
  // special case, seems not from spec
  '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
  // .inf
  '|[-+]?\\.(?:inf|Inf|INF)' +
  // .nan
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data) ||
      // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === '_') {
    return false;
  }

  return true;
}

function constructYamlFloat(data) {
  var value, sign;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = value[0] === '-' ? -1 : 1;

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if (value === '.nan') {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase': return '.nan';
      case 'uppercase': return '.NAN';
      case 'camelcase': return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '.inf';
      case 'uppercase': return '.INF';
      case 'camelcase': return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '-.inf';
      case 'uppercase': return '-.INF';
      case 'camelcase': return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return (Object.prototype.toString.call(object) === '[object Number]') &&
         (object % 1 !== 0 || common.isNegativeZero(object));
}

var float = new type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});

var core = json;

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

var timestamp = new type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

var merge = new type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

/*eslint-disable no-bitwise*/





// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (data === null) return false;

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  return new Uint8Array(result);
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(obj) {
  return Object.prototype.toString.call(obj) ===  '[object Uint8Array]';
}

var binary = new type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString$2.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

var omap = new type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});

var _toString$1 = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString$1.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

var pairs = new type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

var set = new type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});

var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});

/*eslint-disable max-len,no-use-before-define*/







var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function _class(obj) { return Object.prototype.toString.call(obj); }

function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(
    ((c - 0x010000) >> 10) + 0xD800,
    ((c - 0x010000) & 0x03FF) + 0xDC00
  );
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State$1(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || _default;
  this.onWarning = options['onWarning'] || null;
  // (Hidden) Remove? makes the loader to expect YAML 1.1 documents
  // if such documents have no explicit %YAML directive
  this.legacy    = options['legacy']    || false;

  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  // position of first leading tab in the current line,
  // used to make sure there are no tabs in the indentation
  this.firstTabInLine = -1;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  var mark = {
    name:     state.filename,
    buffer:   state.input.slice(0, -1), // omit trailing \0
    position: state.position,
    line:     state.line,
    column:   state.position - state.lineStart
  };

  mark.snippet = snippet(mark);

  return new exception(message, mark);
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, 'tag prefix is malformed: ' + prefix);
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode,
  startLine, startLineStart, startPos) {

  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);

    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }

      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }


  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty$1.call(overridableKeys, keyNode) &&
        _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }

    // used for this specific key only because Object.defineProperty is slow
    if (keyNode === '__proto__') {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 0x09/* Tab */ && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _lineStart,
      _pos,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = Object.create(null),
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    } else if (ch === 0x2C/* , */) {
      // "flow collection entries can never be completely empty", as per YAML 1.2, section 7.4
      throwError(state, "expected the node content, but found ','");
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F/* ? */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line; // Save the current line.
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C/* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      didReadContent = false,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _keyLine,
      _keyLineStart,
      _keyPos,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = Object.create(null),
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  // there is a leading tab before this token, so it can't be a block sequence/mapping;
  // it can still be flow sequence/mapping or a scalar
  if (state.firstTabInLine !== -1) return false;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, 'tab characters must not be used in indentation');
    }

    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;

      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        // Neither implicit nor explicit notation.
        // Reading is done. Go to the epilogue.
        break;
      }

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }

      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, 'tag name is malformed: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      typeList,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }

  } else if (state.tag === '?') {
    // Implicit resolving is not allowed for non-scalar types, and '?'
    // non-specific tag is only automatically assigned to plain scalars.
    //
    // We only need to check kind conformity in case user explicitly assigns '?'
    // tag, for example like this: "!<?> [0]"
    //
    if (state.result !== null && state.kind !== 'scalar') {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }

    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type = state.implicitTypes[typeIndex];

      if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
        state.result = type.construct(state.result);
        state.tag = type.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== '!') {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];
    } else {
      // looking for multi type
      type = null;
      typeList = state.typeMap.multi[state.kind || 'fallback'];

      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type = typeList[typeIndex];
          break;
        }
      }
    }

    if (!type) {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }

    if (state.result !== null && type.kind !== state.kind) {
      throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
    }

    if (!type.resolve(state.result, state.tag)) { // `state.result` updated in resolver if matched
      throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else {
      state.result = type.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25/* % */) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 &&
      state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
        input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State$1(input, options);

  var nullpos = input.indexOf('\0');

  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, 'null byte is not allowed in input');
  }

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
    options = iterator;
    iterator = null;
  }

  var documents = loadDocuments(input, options);

  if (typeof iterator !== 'function') {
    return documents;
  }

  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load$1(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception('expected a single document in the stream, but found more');
}


var loadAll_1 = loadAll$1;
var load_1    = load$1;

var loader = {
	loadAll: loadAll_1,
	load: load_1
};

/*eslint-disable no-use-before-define*/





var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_BOM                  = 0xFEFF;
var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_EQUALS               = 0x3D; /* = */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new exception('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}


var QUOTING_TYPE_SINGLE = 1,
    QUOTING_TYPE_DOUBLE = 2;

function State(options) {
  this.schema        = options['schema'] || _default;
  this.indent        = Math.max(1, (options['indent'] || 2));
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid   = options['skipInvalid'] || false;
  this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys      = options['sortKeys'] || false;
  this.lineWidth     = options['lineWidth'] || 80;
  this.noRefs        = options['noRefs'] || false;
  this.noCompatMode  = options['noCompatMode'] || false;
  this.condenseFlow  = options['condenseFlow'] || false;
  this.quotingType   = options['quotingType'] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes   = options['forceQuotes'] || false;
  this.replacer      = typeof options['replacer'] === 'function' ? options['replacer'] : null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return  (0x00020 <= c && c <= 0x00007E)
      || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
      || ((0x0E000 <= c && c <= 0x00FFFD) && c !== CHAR_BOM)
      ||  (0x10000 <= c && c <= 0x10FFFF);
}

// [34] ns-char ::= nb-char - s-white
// [27] nb-char ::= c-printable - b-char - c-byte-order-mark
// [26] b-char  ::= b-line-feed | b-carriage-return
// Including s-white (for some reason, examples doesn't match specs in this aspect)
// ns-char ::= c-printable - b-line-feed - b-carriage-return - c-byte-order-mark
function isNsCharOrWhitespace(c) {
  return isPrintable(c)
    && c !== CHAR_BOM
    // - b-char
    && c !== CHAR_CARRIAGE_RETURN
    && c !== CHAR_LINE_FEED;
}

// [127]  ns-plain-safe(c) ::= c = flow-out  ⇒ ns-plain-safe-out
//                             c = flow-in   ⇒ ns-plain-safe-in
//                             c = block-key ⇒ ns-plain-safe-out
//                             c = flow-key  ⇒ ns-plain-safe-in
// [128] ns-plain-safe-out ::= ns-char
// [129]  ns-plain-safe-in ::= ns-char - c-flow-indicator
// [130]  ns-plain-char(c) ::=  ( ns-plain-safe(c) - “:” - “#” )
//                            | ( /* An ns-char preceding */ “#” )
//                            | ( “:” /* Followed by an ns-plain-safe(c) */ )
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    inblock ? // c = flow-in
      cIsNsCharOrWhitespace
      : cIsNsCharOrWhitespace
        // - c-flow-indicator
        && c !== CHAR_COMMA
        && c !== CHAR_LEFT_SQUARE_BRACKET
        && c !== CHAR_RIGHT_SQUARE_BRACKET
        && c !== CHAR_LEFT_CURLY_BRACKET
        && c !== CHAR_RIGHT_CURLY_BRACKET
  )
    // ns-plain-char
    && c !== CHAR_SHARP // false on '#'
    && !(prev === CHAR_COLON && !cIsNsChar) // false on ': '
    || (isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP) // change to true on '[^ ]#'
    || (prev === CHAR_COLON && cIsNsChar); // change to true on ':[^ ]'
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  // No support of ( ( “?” | “:” | “-” ) /* Followed by an ns-plain-safe(c)) */ ) part
  return isPrintable(c) && c !== CHAR_BOM
    && !isWhitespace(c) // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    && c !== CHAR_MINUS
    && c !== CHAR_QUESTION
    && c !== CHAR_COLON
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    && c !== CHAR_SHARP
    && c !== CHAR_AMPERSAND
    && c !== CHAR_ASTERISK
    && c !== CHAR_EXCLAMATION
    && c !== CHAR_VERTICAL_LINE
    && c !== CHAR_EQUALS
    && c !== CHAR_GREATER_THAN
    && c !== CHAR_SINGLE_QUOTE
    && c !== CHAR_DOUBLE_QUOTE
    // | “%” | “@” | “`”)
    && c !== CHAR_PERCENT
    && c !== CHAR_COMMERCIAL_AT
    && c !== CHAR_GRAVE_ACCENT;
}

// Simplified test for values allowed as the last character in plain style.
function isPlainSafeLast(c) {
  // just not whitespace or colon, it will be checked to be plain character later
  return !isWhitespace(c) && c !== CHAR_COLON;
}

// Same as 'string'.codePointAt(pos), but works in older browsers.
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 0xD800 && first <= 0xDBFF && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }
  return first;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}

var STYLE_PLAIN   = 1,
    STYLE_SINGLE  = 2,
    STYLE_LITERAL = 3,
    STYLE_FOLDED  = 4,
    STYLE_DOUBLE  = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth,
  testAmbiguousType, quotingType, forceQuotes, inblock) {

  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(codePointAt(string, 0))
          && isPlainSafeLast(codePointAt(string, string.length - 1));

  if (singleLineOnly || forceQuotes) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
            // Foldable line = too long, and not more-indented.
            (i - previousLineBreak - 1 > lineWidth &&
             string[previousLineBreak + 1] !== ' ');
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
      (i - previousLineBreak - 1 > lineWidth &&
       string[previousLineBreak + 1] !== ' '));
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function () {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? ('"' + string + '"') : ("'" + string + "'");
      }
    }

    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1
      ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
      // No block styles in flow mode.
      || (state.flowLevel > -1 && level >= state.flowLevel);
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }

    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth,
      testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {

      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception('impossible error: invalid scalar style');
    }
  }());
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip =          string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : (clip ? '' : '-');

  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = (function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }());
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while ((match = lineRe.exec(string))) {
    var prefix = match[1], line = match[2];
    moreIndented = (line[0] === ' ');
    result += prefix
      + (!prevMoreIndented && !moreIndented && line !== ''
        ? '\n' : '')
      + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }

  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0, end, curr = 0, next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while ((match = breakRe.exec(line))) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = (curr > start) ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1;                    // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }

  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char = 0;
  var escapeSeq;

  for (var i = 0; i < string.length; char >= 0x10000 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];

    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 0x10000) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }

  return result;
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level, value, false, false) ||
        (typeof value === 'undefined' &&
         writeNode(state, level, null, false, false))) {

      if (_result !== '') _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length,
      value;

  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];

    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }

    // Write only valid elements, put null instead of invalid elements.
    if (writeNode(state, level + 1, value, true, true, false, true) ||
        (typeof value === 'undefined' &&
         writeNode(state, level + 1, null, true, true, false, true))) {

      if (!compact || _result !== '') {
        _result += generateNextLine(state, level);
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }

      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {

    pairBuffer = '';
    if (_result !== '') pairBuffer += ', ';

    if (state.condenseFlow) pairBuffer += '"';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new exception('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || _result !== '') {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (state.tag !== null && state.tag !== '?') ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      if (explicit) {
        if (type.multi && type.representName) {
          state.tag = type.representName(object);
        } else {
          state.tag = type.tag;
        }
      } else {
        state.tag = '?';
      }

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new exception('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);
  var inblock = block;
  var tagStr;

  if (block) {
    block = (state.flowLevel < 0 || state.flowLevel > level);
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && (Object.keys(state.dump).length !== 0)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && (state.dump.length !== 0)) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type === '[object Undefined]') {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      // Need to encode all characters except those allowed by the spec:
      //
      // [35] ns-dec-digit    ::=  [#x30-#x39] /* 0-9 */
      // [36] ns-hex-digit    ::=  ns-dec-digit
      //                         | [#x41-#x46] /* A-F */ | [#x61-#x66] /* a-f */
      // [37] ns-ascii-letter ::=  [#x41-#x5A] /* A-Z */ | [#x61-#x7A] /* a-z */
      // [38] ns-word-char    ::=  ns-dec-digit | ns-ascii-letter | “-”
      // [39] ns-uri-char     ::=  “%” ns-hex-digit ns-hex-digit | ns-word-char | “#”
      //                         | “;” | “/” | “?” | “:” | “@” | “&” | “=” | “+” | “$” | “,”
      //                         | “_” | “.” | “!” | “~” | “*” | “'” | “(” | “)” | “[” | “]”
      //
      // Also need to encode '!' because it has special meaning (end of tag prefix).
      //
      tagStr = encodeURI(
        state.tag[0] === '!' ? state.tag.slice(1) : state.tag
      ).replace(/!/g, '%21');

      if (state.tag[0] === '!') {
        tagStr = '!' + tagStr;
      } else if (tagStr.slice(0, 18) === 'tag:yaml.org,2002:') {
        tagStr = '!!' + tagStr.slice(18);
      } else {
        tagStr = '!<' + tagStr + '>';
      }

      state.dump = tagStr + ' ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump$1(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  var value = input;

  if (state.replacer) {
    value = state.replacer.call({ '': value }, '', value);
  }

  if (writeNode(state, 0, value, true, true)) return state.dump + '\n';

  return '';
}

var dump_1 = dump$1;

var dumper = {
	dump: dump_1
};

function renamed(from, to) {
  return function () {
    throw new Error('Function yaml.' + from + ' is removed in js-yaml 4. ' +
      'Use yaml.' + to + ' instead, which is now safe by default.');
  };
}


var Type                = type;
var Schema              = schema;
var FAILSAFE_SCHEMA     = failsafe;
var JSON_SCHEMA         = json;
var CORE_SCHEMA         = core;
var DEFAULT_SCHEMA      = _default;
var load                = loader.load;
var loadAll             = loader.loadAll;
var dump                = dumper.dump;
var YAMLException       = exception;

// Re-export all types in case user wants to create custom schema
var types = {
  binary:    binary,
  float:     float,
  map:       map,
  null:      _null,
  pairs:     pairs,
  set:       set,
  timestamp: timestamp,
  bool:      bool,
  int:       int,
  merge:     merge,
  omap:      omap,
  seq:       seq,
  str:       str
};

// Removed functions from JS-YAML 3.0.x
var safeLoad            = renamed('safeLoad', 'load');
var safeLoadAll         = renamed('safeLoadAll', 'loadAll');
var safeDump            = renamed('safeDump', 'dump');

var jsYaml = {
	Type: Type,
	Schema: Schema,
	FAILSAFE_SCHEMA: FAILSAFE_SCHEMA,
	JSON_SCHEMA: JSON_SCHEMA,
	CORE_SCHEMA: CORE_SCHEMA,
	DEFAULT_SCHEMA: DEFAULT_SCHEMA,
	load: load,
	loadAll: loadAll,
	dump: dump,
	YAMLException: YAMLException,
	types: types,
	safeLoad: safeLoad,
	safeLoadAll: safeLoadAll,
	safeDump: safeDump
};

class YamlChecker {
  constructor(yamlCode) {
    this.yamlCode = yamlCode;
    this.lastErrorMessage = null;
    this.lastErrorYamlCode = null;
    this._errorLine = null;
    this._errorColumn = null;
  }

  get errorLine() {
    return this._errorLine;
  }

  get errorColumn() {
    return this._errorColumn;
  }
  //whole error message

  validateYAML() {
    try {
      jsYaml.load(this.yamlCode);
      if (!this.yamlCode.trim()) {
              return "Empty YAML file!";
            }
      this.lastErrorMessage = null;
      this._errorLine = null;
      this._errorColumn = null;
    } catch (error) {
      let errorMessage = error.message; // Get the whole error message
      let errorLocationMatch = errorMessage.match(/\((\d+):(\d+)\)/);
      if (errorLocationMatch) {
        this._errorLine = parseInt(errorLocationMatch[1]);
        this._errorColumn = parseInt(errorLocationMatch[2]);
      }
      this.lastErrorMessage = errorMessage;
      return this.lastErrorMessage;
    }
     return "Correct YAML syntax!"
  }
  formatYAML() {
    const formattedYaml = jsYaml.dump(jsYaml.load(this.yamlCode));
    return formattedYaml;
  }

  //Don't delete this, possible future feature

  // async fetchGeminiData(yamlCode) {
  //   const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  //   const prompt = "Fix the following YAML syntax error in this yaml code without any other comments: \n" + yamlCode;
    
  //   const result = await model.generateContent(prompt);
  //   console.log(result.response.text());
  // }
  
  // //only first line of error message
  // validateYAML() {
  //   try {
  //     jsyaml.load(this.yamlCode);
  //     if (!this.yamlCode.trim()) {
  //       return "Empty YAML file!";
  //     }
  //     this.lastErrorMessage = null;
  //     this._errorLine = null;
  //     this._errorColumn = null;
  //   } catch (error) {
  //     let errorMessage = error.message.split('\n')[0]; // Get only the first line of the error message
  //     let errorLocationMatch = errorMessage.match(/\((\d+):(\d+)\)/);
  //     if (errorLocationMatch) {
  //       this._errorLine = parseInt(errorLocationMatch[1]);
  //       this._errorColumn = parseInt(errorLocationMatch[2]);
  //     }
  //     this.lastErrorMessage = errorMessage;
  //     return this.lastErrorMessage;
  //   }
  //   return "Correct YAML syntax!"
  // }

}

class CodeEditor {
  constructor(
    editorId,
    textareaId,
    lineNumbersId,
    overlayId,
    fileManager,
    initialFileName = "main"
  ) {
    this.getHtmlElements(editorId, textareaId, lineNumbersId, overlayId);
    this.fileManager = fileManager;
    this.currentFileName =
      this.fileManager.getCurrentFile() || initialFileName;
    this.charObjects = this.fileManager.loadFromLocalStorage(
      this.currentFileName
    );
    this.dragCounter = 0;
    this.textarea.value = this.charObjects.map((obj) => obj.char).join("");
    this.addEventListeners();
  }

  getHtmlElements(editorId, textareaId, lineNumbersId, overlayId) {
    this.editor = document.getElementById(editorId);
    this.textarea = document.getElementById(textareaId);
    this.lineNumbers = document.getElementById(lineNumbersId);
    this.overlay = document.getElementById(overlayId);
    this.editorWrapper = document.querySelector("#editor-wrapper");

    const missingElements = [];
    if (!this.editor) missingElements.push("editor");
    if (!this.textarea) missingElements.push("textarea");
    if (!this.lineNumbers) missingElements.push("line numbers");
    if (!this.overlay) missingElements.push("overlay");

    if (missingElements.length > 0) {
      throw new Error(`Missing elements: ${missingElements.join(", ")}`);
    }
  }

  addEventListeners() {
    this.textarea.addEventListener("keyup", (event) => this.onKeyUp(event));
    this.editor.addEventListener("dragenter", this.handleDragEvent);
    this.editor.addEventListener("dragleave", this.handleDragEvent);
    this.editor.addEventListener("drop", this.handleDropEvent);
  }

  onKeyUp(event) {
    const newText = this.textarea.value;
    this.charObjects = this.createCharObjects(newText, this.charObjects);
    this.fileManager.saveToLocalStorage(
      this.charObjects,
      this.currentFileName
    );
  }

  handleDragEvent = (event) => {
    event.preventDefault();
    if (event.type === "dragenter") {
      this.dragCounter++;
      if (this.dragCounter === 1) {
        this.textarea.style.filter = "blur(2px)";
        this.overlay.classList.remove("hidden");
      }
    } else if (event.type === "dragleave" || event.type === "drop") {
      this.dragCounter--;
      if (this.dragCounter === 0) {
        this.textarea.style.filter = "";
        this.overlay.classList.add("hidden");
      }
    }
  };

  handleDropEvent = (event) => {
    event.preventDefault();
    this.handleDragEvent(event);

    // If the textarea is not empty, ask the user for confirmation
    if (
      this.textarea.value.trim() !== "" &&
      !confirm("Textarea has content. Replace with file content?")
    ) {
      return;
    }

    const { items, files } = event.dataTransfer;
    const fileList = items ? [...items] : [...files];

    if (fileList.length > 1) {
      alert("Multiple file uploads are not supported yet.");
      return;
    }

    fileList.forEach((item) => {
      const file = items ? item.getAsFile() : item;
      if (file) {
        this.readFile(file);
      } else {
        alert("Dropped item is not a file");
      }
    });
  };

  createCharObjects = (text, existingCharObjects = []) => {
    return Array.from(text).map((char, position) => {
      if (
        existingCharObjects[position] &&
        existingCharObjects[position].char === char
      ) {
        return existingCharObjects[position];
      } else {
        return {
          char: char,
          position: position,
          user: "username",
          date: Date.now(),
        };
      }
    });
  };

  /**
   * Reads the contents of a file and updates the textarea and charObjects accordingly.
   *
   * @param {File} file - The file to be read.
   */
  readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Update the textarea value with the contents of the file
      this.textarea.value = e.target.result;
      // Create new charObjects based on the file contents
      this.charObjects = this.createCharObjects(e.target.result);
      // Save the updated charObjects to local storage
      this.fileManager.saveToLocalStorage(
        this.charObjects,
        this.currentFileName
      );
    };
    // Read the file as text
    reader.readAsText(file);
  };

  updateDimensions() {
    // Reset the textarea width to its default value
    this.textarea.style.width = "auto";

    // Update the textarea height
    this.textarea.style.height = "auto";
    this.textarea.style.height = this.textarea.scrollHeight + "px";

    // Calculate the width based on the longest line
    const lines = this.textarea.value.split("\n");
    let longestLine = lines[0];

    // Find the line with the most characters
    for (let line of lines) {
      if (line.length > longestLine.length) {
        longestLine = line;
      }
    }
    const newWidth = longestLine.length * 9; // 9px width per char

    // Set the width of the textarea to match the width of the longest line
    // only if the new width exceeds the default width
    if (newWidth > this.textarea.offsetWidth) {
      this.textarea.style.width = `${newWidth}px`;
    }
  }
  loadFile(file) {
    this.currentFileName = file;
    this.charObjects = this.fileManager.loadFromLocalStorage(
      this.currentFileName
    );
    this.textarea.value = this.charObjects.map((obj) => obj.char).join("");
    errorStore.set(null);

    this.checkYamlSyntax();
    // Reset the scroll position
    this.editorWrapper.scrollTop = 0;
    this.editorWrapper.scrollLeft = 0;

    //Update the width of text area
    this.updateDimensions();
    // Save highlighted file in local storage
    this.fileManager.saveCurrentFile(file);
  }

  removeNoBreakSpaceChars(text) {
    return text.replace(/\u00A0/g, " ");
  }

  checkYamlSyntax() {
    let yamlChecker = new YamlChecker(
      this.removeNoBreakSpaceChars(this.textarea.value)
    );
    let error = yamlChecker.validateYAML();
    if (error) {
      errorStore.set(error);
    }
  }
}

/**
 * FileManager class for managing files in local storage.
 */
class FileManager {
  /**
   * Constructs a new FileManager instance.
   */
  constructor() {
    this.filePrefix = "code-editor-file-";
  }

  /**
   * Loads file content from local storage.
   * @param {string} file - The name of the file to load.
   * @returns {Array} The content of the file as an array.
   */
  loadFromLocalStorage(file) {
    const storedFile = localStorage.getItem(this.filePrefix + file);
    const fileData = storedFile ? JSON.parse(storedFile) : null;
    return Array.isArray(fileData?.content) ? fileData.content : [];
  }

  /**
   * Saves file content to local storage.
   */
  saveToLocalStorage(content, file) {
    const fileData = {
      name: file,
      content: content,
      timestamp: new Date().getTime(), // Current time
    };
    localStorage.setItem(this.filePrefix + file, JSON.stringify(fileData));
  }

  /**
   * Retrieves all file names from local storage.
   */
  getAllFiles() {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.filePrefix)) {
        const fileData = JSON.parse(localStorage.getItem(key));
        files.push(fileData);
      }
    }
    // Sort the files by their names
    files.sort((a, b) => a.name.localeCompare(b.name));
    // Return file names
    return files.map((file) => file.name);
  }

  /**
   * Deletes a file from local storage.
   * @param {string} file - The name of the file to delete.
   */
  deleteFile(file) {
    localStorage.removeItem(this.filePrefix + file);
  }

  /**
   * Stores the currently highlighted file in local storage.
   */
  saveCurrentFile(file) {
    localStorage.setItem("currentFile", file);
  }

  /**
   * Retrieves the currently highlighted file from local storage.
   */
  getCurrentFile() {
    return localStorage.getItem("currentFile");
    
  }
  
  func_savedata(data) { 
    var string_data = typeof data === "string" ? data : JSON.stringify(data);
    var file = new File([string_data], this.getCurrentFile() + ".txt", {
      type: "text;charset=utf-8",
    });

    var anchor = document.createElement("a");
    anchor.setAttribute("href", window.URL.createObjectURL(file));
    anchor.setAttribute("download", this.getCurrentFile() + ".txt",);
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }
}

var img$p = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg class='feather feather-play' fill='none' height='24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cpolygon points='5 3 19 12 5 21 5 3'/%3e%3c/svg%3e";

var img$o = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg height='24.0px' id='SVGRoot' version='1.1' viewBox='0 0 24.0 24.0' width='24.0px' xmlns='http://www.w3.org/2000/svg' xmlns:cc='http://creativecommons.org/ns%23' xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd' xmlns:svg='http://www.w3.org/2000/svg'%3e%3cdefs id='defs2'/%3e%3cg id='layer1'%3e%3cpath d='M 3 2 A 1.0001 1.0001 0 0 0 2 3 L 2 21 A 1.0001 1.0001 0 0 0 3 22 L 8 22 L 16 22 L 21 22 A 1.0001 1.0001 0 0 0 22 21 L 22 6.1542969 A 1.0001 1.0001 0 0 0 21.738281 5.4785156 L 18.851562 2.3242188 A 1.0001 1.0001 0 0 0 18.113281 2 L 16 2 L 8 2 L 3 2 z M 4 4 L 7 4 L 7 9 A 1.0001 1.0001 0 0 0 8 10 L 16 10 A 1.0001 1.0001 0 0 0 17 9 L 17 4 L 17.673828 4 L 20 6.5429688 L 20 20 L 17 20 L 17 13 A 1.0001 1.0001 0 0 0 16 12 L 8 12 A 1.0001 1.0001 0 0 0 7 13 L 7 20 L 4 20 L 4 4 z M 9 4 L 15 4 L 15 8 L 9 8 L 9 4 z M 9 14 L 15 14 L 15 20 L 9 20 L 9 14 z ' id='path11261' style='color:black%3bfont-style:normal%3bfont-variant:normal%3bfont-weight:normal%3bfont-stretch:normal%3bfont-size:medium%3bline-height:normal%3bfont-family:sans-serif%3bfont-variant-ligatures:normal%3bfont-variant-position:normal%3bfont-variant-caps:normal%3bfont-variant-numeric:normal%3bfont-variant-alternates:normal%3bfont-variant-east-asian:normal%3bfont-feature-settings:normal%3bfont-variation-settings:normal%3btext-indent:0%3btext-align:start%3btext-decoration:none%3btext-decoration-line:none%3btext-decoration-style:solid%3btext-decoration-color:black%3bletter-spacing:normal%3bword-spacing:normal%3btext-transform:none%3bwriting-mode:lr-tb%3bdirection:ltr%3btext-orientation:mixed%3bdominant-baseline:auto%3bbaseline-shift:baseline%3btext-anchor:start%3bwhite-space:normal%3bshape-padding:0%3bshape-margin:0%3binline-size:0%3bclip-rule:nonzero%3bdisplay:inline%3boverflow:visible%3bvisibility:visible%3bisolation:auto%3bmix-blend-mode:normal%3bcolor-interpolation:sRGB%3bcolor-interpolation-filters:linearRGB%3bsolid-color:black%3bsolid-opacity:1%3bvector-effect:none%3bfill:black%3bfill-opacity:1%3bfill-rule:nonzero%3bstroke:none%3bstroke-width:2%3bstroke-linecap:butt%3bstroke-linejoin:round%3bstroke-miterlimit:4%3bstroke-dasharray:none%3bstroke-dashoffset:0%3bstroke-opacity:1%3bcolor-rendering:auto%3bimage-rendering:auto%3bshape-rendering:auto%3btext-rendering:auto%3benable-background:accumulate%3bstop-color:black%3bstop-opacity:1%3bopacity:1'/%3e%3c/g%3e%3c/svg%3e";

var img$n = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4Z' fill='currentColor'/%3e%3cpath d='M4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H12C12.5523 11 13 10.5523 13 10C13 9.44772 12.5523 9 12 9H4Z' fill='currentColor'/%3e%3cpath d='M3 14C3 13.4477 3.44772 13 4 13H20C20.5523 13 21 13.4477 21 14C21 14.5523 20.5523 15 20 15H4C3.44772 15 3 14.5523 3 14Z' fill='currentColor'/%3e%3cpath d='M4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H12C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17H4Z' fill='currentColor'/%3e%3c/svg%3e";

var img$m = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg height='22px' version='1.1' viewBox='0 0 18 22' width='18px' xmlns='http://www.w3.org/2000/svg' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3ctitle/%3e%3cdesc/%3e%3cdefs/%3e%3cg fill='none' fill-rule='evenodd' id='Page-1' stroke='none' stroke-width='1'%3e%3cg fill='black' id='Core' transform='translate(-171.000000%2c -127.000000)'%3e%3cg id='content-paste' transform='translate(171.000000%2c 127.000000)'%3e%3cpath d='M16%2c2 L11.8%2c2 C11.4%2c0.8 10.3%2c0 9%2c0 C7.7%2c0 6.6%2c0.8 6.2%2c2 L2%2c2 C0.9%2c2 0%2c2.9 0%2c4 L0%2c20 C0%2c21.1 0.9%2c22 2%2c22 L16%2c22 C17.1%2c22 18%2c21.1 18%2c20 L18%2c4 C18%2c2.9 17.1%2c2 16%2c2 L16%2c2 Z M9%2c2 C9.6%2c2 10%2c2.4 10%2c3 C10%2c3.6 9.6%2c4 9%2c4 C8.4%2c4 8%2c3.6 8%2c3 C8%2c2.4 8.4%2c2 9%2c2 L9%2c2 Z M16%2c20 L2%2c20 L2%2c4 L4%2c4 L4%2c7 L14%2c7 L14%2c4 L16%2c4 L16%2c20 L16%2c20 Z' id='Shape'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

var img$l = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg style='enable-background:new 0 0 24 24%3b' version='1.1' viewBox='0 0 24 24' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg id='info'/%3e%3cg id='icons'%3e%3cg id='save'%3e%3cpath d='M11.2%2c16.6c0.4%2c0.5%2c1.2%2c0.5%2c1.6%2c0l6-6.3C19.3%2c9.8%2c18.8%2c9%2c18%2c9h-4c0%2c0%2c0.2-4.6%2c0-7c-0.1-1.1-0.9-2-2-2c-1.1%2c0-1.9%2c0.9-2%2c2 c-0.2%2c2.3%2c0%2c7%2c0%2c7H6c-0.8%2c0-1.3%2c0.8-0.8%2c1.4L11.2%2c16.6z'/%3e%3cpath d='M19%2c19H5c-1.1%2c0-2%2c0.9-2%2c2v0c0%2c0.6%2c0.4%2c1%2c1%2c1h16c0.6%2c0%2c1-0.4%2c1-1v0C21%2c19.9%2c20.1%2c19%2c19%2c19z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

var img$k = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg enable-background='new 0 0 512 512' height='512px' id='Layer_1' version='1.1' viewBox='0 0 512 512' width='512px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg%3e%3cg%3e%3cpath d='M178.375%2c287.812L73.094%2c393.094L32%2c352c-17.688%2c0-32%2c14.312-32%2c32v96c0%2c17.688%2c14.312%2c32%2c32%2c32h96 c17.688%2c0%2c32-14.312%2c32-32l-41.095-41.062l105.281-105.312L178.375%2c287.812z M480%2c0h-96c-17.688%2c0-32%2c14.328-32%2c32l41.094%2c41.094 L287.812%2c178.375l45.812%2c45.812l105.281-105.266L480%2c160c17.688%2c0%2c32-14.312%2c32-32V32C512%2c14.328%2c497.688%2c0%2c480%2c0z M480%2c352 l-41.095%2c41.094l-105.28-105.281l-45.812%2c45.812l105.281%2c105.312L352%2c480c0%2c17.688%2c14.312%2c32%2c32%2c32h96c17.688%2c0%2c32-14.312%2c32-32 v-96C512%2c366.312%2c497.688%2c352%2c480%2c352z M160%2c32c0-17.672-14.312-32-32-32H32C14.312%2c0%2c0%2c14.328%2c0%2c32v96c0%2c17.688%2c14.312%2c32%2c32%2c32 l41.094-41.078l105.281%2c105.266l45.812-45.812L118.906%2c73.094L160%2c32z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

/* src\Components\Editor\GeneralToolbar.svelte generated by Svelte v3.59.2 */
const file$o = "src\\Components\\Editor\\GeneralToolbar.svelte";

function create_fragment$p(ctx) {
	let div;
	let button0;
	let img0;
	let img0_src_value;
	let button0_title_value;
	let t0;
	let button1;
	let img1;
	let img1_src_value;
	let button1_title_value;
	let t1;
	let button2;
	let img2;
	let img2_src_value;
	let button2_title_value;
	let t2;
	let button3;
	let img3;
	let img3_src_value;
	let button3_title_value;
	let t3;
	let button4;
	let img4;
	let img4_src_value;
	let button4_title_value;
	let t4;
	let button5;
	let img5;
	let img5_src_value;
	let button5_title_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			button0 = element("button");
			img0 = element("img");
			t0 = space();
			button1 = element("button");
			img1 = element("img");
			t1 = space();
			button2 = element("button");
			img2 = element("img");
			t2 = space();
			button3 = element("button");
			img3 = element("img");
			t3 = space();
			button4 = element("button");
			img4 = element("img");
			t4 = space();
			button5 = element("button");
			img5 = element("img");
			if (!src_url_equal(img0.src, img0_src_value = img$p)) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", "Run Script");
			attr_dev(img0, "width", "20px");
			attr_dev(img0, "height", "20px");
			add_location(img0, file$o, 26, 4, 917);
			attr_dev(button0, "title", button0_title_value = /*$_*/ ctx[0]("editor.generalToolbar.runScript"));
			attr_dev(button0, "id", "run-button");
			attr_dev(button0, "class", "top-button svelte-118q6l3");
			add_location(button0, file$o, 21, 2, 808);
			if (!src_url_equal(img1.src, img1_src_value = img$o)) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", "Save File");
			attr_dev(img1, "width", "20px");
			attr_dev(img1, "height", "20px");
			add_location(img1, file$o, 33, 4, 1116);
			attr_dev(button1, "title", button1_title_value = /*$_*/ ctx[0]("editor.generalToolbar.saveProject"));
			attr_dev(button1, "id", "save-button");
			attr_dev(button1, "class", "top-button svelte-118q6l3");
			add_location(button1, file$o, 28, 2, 1004);
			if (!src_url_equal(img2.src, img2_src_value = img$n)) attr_dev(img2, "src", img2_src_value);
			attr_dev(img2, "alt", "Format Code");
			attr_dev(img2, "width", "20px");
			attr_dev(img2, "height", "20px");
			add_location(img2, file$o, 40, 4, 1309);
			attr_dev(button2, "title", button2_title_value = /*$_*/ ctx[0]("editor.generalToolbar.format"));
			attr_dev(button2, "id", "format-button");
			attr_dev(button2, "class", "top-button svelte-118q6l3");
			add_location(button2, file$o, 35, 2, 1200);
			if (!src_url_equal(img3.src, img3_src_value = img$m)) attr_dev(img3, "src", img3_src_value);
			attr_dev(img3, "alt", "Copy to Clipboard");
			attr_dev(img3, "width", "20px");
			attr_dev(img3, "height", "20px");
			add_location(img3, file$o, 47, 4, 1518);
			attr_dev(button3, "title", button3_title_value = /*$_*/ ctx[0]("editor.generalToolbar.copyToClipboard"));
			attr_dev(button3, "id", "clipboard-button");
			attr_dev(button3, "class", "top-button svelte-118q6l3");
			add_location(button3, file$o, 42, 2, 1397);
			if (!src_url_equal(img4.src, img4_src_value = img$l)) attr_dev(img4, "src", img4_src_value);
			attr_dev(img4, "alt", "Save As");
			attr_dev(img4, "width", "20px");
			attr_dev(img4, "height", "20px");
			add_location(img4, file$o, 60, 4, 1786);
			attr_dev(button4, "title", button4_title_value = /*$_*/ ctx[0]("editor.generalToolbar.saveAs"));
			attr_dev(button4, "id", "save-as-button");
			attr_dev(button4, "class", "top-button svelte-118q6l3");
			add_location(button4, file$o, 54, 2, 1645);
			if (!src_url_equal(img5.src, img5_src_value = img$k)) attr_dev(img5, "src", img5_src_value);
			attr_dev(img5, "alt", "Expand");
			attr_dev(img5, "width", "20px");
			attr_dev(img5, "height", "20px");
			add_location(img5, file$o, 67, 4, 1975);
			attr_dev(button5, "title", button5_title_value = /*$_*/ ctx[0]("editor.generalToolbar.expand"));
			attr_dev(button5, "id", "expand-button");
			attr_dev(button5, "class", "top-button svelte-118q6l3");
			add_location(button5, file$o, 62, 2, 1866);
			attr_dev(div, "id", "top-toolbar");
			attr_dev(div, "class", "svelte-118q6l3");
			add_location(div, file$o, 20, 0, 783);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button0);
			append_dev(button0, img0);
			append_dev(div, t0);
			append_dev(div, button1);
			append_dev(button1, img1);
			append_dev(div, t1);
			append_dev(div, button2);
			append_dev(button2, img2);
			append_dev(div, t2);
			append_dev(div, button3);
			append_dev(button3, img3);
			append_dev(div, t3);
			append_dev(div, button4);
			append_dev(button4, img4);
			append_dev(div, t4);
			append_dev(div, button5);
			append_dev(button5, img5);

			if (!mounted) {
				dispose = listen_dev(button4, "click", /*handleSaveLocal*/ ctx[1], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$_*/ 1 && button0_title_value !== (button0_title_value = /*$_*/ ctx[0]("editor.generalToolbar.runScript"))) {
				attr_dev(button0, "title", button0_title_value);
			}

			if (dirty & /*$_*/ 1 && button1_title_value !== (button1_title_value = /*$_*/ ctx[0]("editor.generalToolbar.saveProject"))) {
				attr_dev(button1, "title", button1_title_value);
			}

			if (dirty & /*$_*/ 1 && button2_title_value !== (button2_title_value = /*$_*/ ctx[0]("editor.generalToolbar.format"))) {
				attr_dev(button2, "title", button2_title_value);
			}

			if (dirty & /*$_*/ 1 && button3_title_value !== (button3_title_value = /*$_*/ ctx[0]("editor.generalToolbar.copyToClipboard"))) {
				attr_dev(button3, "title", button3_title_value);
			}

			if (dirty & /*$_*/ 1 && button4_title_value !== (button4_title_value = /*$_*/ ctx[0]("editor.generalToolbar.saveAs"))) {
				attr_dev(button4, "title", button4_title_value);
			}

			if (dirty & /*$_*/ 1 && button5_title_value !== (button5_title_value = /*$_*/ ctx[0]("editor.generalToolbar.expand"))) {
				attr_dev(button5, "title", button5_title_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$p.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$p($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(0, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('GeneralToolbar', slots, []);
	const dispatch = createEventDispatcher();

	// function handleClick() {
	//   dispatch("format");
	// }
	function handleSaveLocal() {
		dispatch("saveLocal");
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GeneralToolbar> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		RunProjectIcon: img$p,
		SaveFileIcon: img$o,
		FormatCodeIcon: img$n,
		CopyToClipboardIcon: img$m,
		SaveAsIcon: img$l,
		ExpandIcon: img$k,
		createEventDispatcher,
		_: $format,
		dispatch,
		handleSaveLocal,
		$_
	});

	return [$_, handleSaveLocal];
}

class GeneralToolbar extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$p, create_fragment$p, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "GeneralToolbar",
			options,
			id: create_fragment$p.name
		});
	}
}

var img$j = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg enable-background='new 0 0 500 500' id='Layer_1' version='1.1' viewBox='0 0 500 500' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg%3e%3cg%3e%3cpolygon points='400.1%2c401.1 60.5%2c401.1 60.5%2c100 203.1%2c99.9 230.4%2c127.3 402.7%2c127.3 402.7%2c192.7 375.3%2c192.7 375.3%2c154.7 219.1%2c154.7 191.7%2c127.3 87.9%2c127.3 87.9%2c373.7 377.9%2c373.7 406.7%2c236.8 375.3%2c236.8 375.3%2c220.7 389%2c220.7 389%2c209.4 440.5%2c209.4 '/%3e%3c/g%3e%3cg%3e%3cpolygon points='94.5%2c335.1 67.6%2c330.2 97%2c168.4 419.3%2c168.4 408.2%2c225.7 381.3%2c220.5 386.1%2c195.7 119.8%2c195.7 '/%3e%3c/g%3e%3cg%3e%3cpolygon points='87.5%2c390.7 60.9%2c384 98.1%2c236.8 226.3%2c236.8 253.7%2c209.4 416.4%2c209.4 416.4%2c236.8 265%2c236.8 237.7%2c264.2 119.5%2c264.2 '/%3e%3c/g%3e%3c/g%3e%3c/svg%3e";

/* src\Components\Editor\NavigatorController.svelte generated by Svelte v3.59.2 */
const file$n = "src\\Components\\Editor\\NavigatorController.svelte";

function create_fragment$o(ctx) {
	let div;
	let button;
	let img;
	let img_src_value;
	let button_title_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			button = element("button");
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = img$j)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Projects");
			attr_dev(img, "width", "40px");
			attr_dev(img, "height", "40px");
			add_location(img, file$n, 17, 4, 445);
			attr_dev(button, "title", button_title_value = /*$_*/ ctx[0]("editor.navigatorController.explorer"));
			attr_dev(button, "id", "projectExpand-btn");
			attr_dev(button, "class", "nav-buttons svelte-14bjxtv");
			add_location(button, file$n, 11, 2, 293);
			attr_dev(div, "id", "nav-controller");
			attr_dev(div, "class", "svelte-14bjxtv");
			add_location(div, file$n, 10, 0, 265);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button);
			append_dev(button, img);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*handleExpandBtn*/ ctx[1], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$_*/ 1 && button_title_value !== (button_title_value = /*$_*/ ctx[0]("editor.navigatorController.explorer"))) {
				attr_dev(button, "title", button_title_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$o.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$o($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(0, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('NavigatorController', slots, []);

	function handleExpandBtn() {
		projectExpanded.update(value => !value);
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavigatorController> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		Projects: img$j,
		projectExpanded,
		_: $format,
		handleExpandBtn,
		$_
	});

	return [$_, handleExpandBtn];
}

class NavigatorController extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$o, create_fragment$o, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "NavigatorController",
			options,
			id: create_fragment$o.name
		});
	}
}

/* src\Components\Editor\CodeEditor.svelte generated by Svelte v3.59.2 */
const file$m = "src\\Components\\Editor\\CodeEditor.svelte";

// (184:6) {#if $projectExpanded}
function create_if_block$g(ctx) {
	let div;
	let filenavigator;
	let t;
	let dashboard;
	let current;

	filenavigator = new FileNavigator_1({
			props: {
				codeEditor: /*codeEditor*/ ctx[0],
				fileManager: /*fileManager*/ ctx[4],
				textareaValue: /*textareaValue*/ ctx[5]
			},
			$$inline: true
		});

	dashboard = new Dashboard({ $$inline: true });

	const block = {
		c: function create() {
			div = element("div");
			create_component(filenavigator.$$.fragment);
			t = space();
			create_component(dashboard.$$.fragment);
			attr_dev(div, "id", "navigator-dashboard");
			attr_dev(div, "class", "svelte-e5k62l");
			add_location(div, file$m, 184, 8, 6221);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(filenavigator, div, null);
			append_dev(div, t);
			mount_component(dashboard, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const filenavigator_changes = {};
			if (dirty & /*codeEditor*/ 1) filenavigator_changes.codeEditor = /*codeEditor*/ ctx[0];
			filenavigator.$set(filenavigator_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(filenavigator.$$.fragment, local);
			transition_in(dashboard.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(filenavigator.$$.fragment, local);
			transition_out(dashboard.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(filenavigator);
			destroy_component(dashboard);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$g.name,
		type: "if",
		source: "(184:6) {#if $projectExpanded}",
		ctx
	});

	return block;
}

function create_fragment$n(ctx) {
	let div6;
	let div5;
	let generaltoolbar;
	let t0;
	let div4;
	let navcontroller;
	let t1;
	let t2;
	let div3;
	let div2;
	let linenumbers;
	let t3;
	let div1;
	let textarea_1;
	let t4;
	let div0;
	let t6;
	let problems;
	let current;
	let mounted;
	let dispose;
	generaltoolbar = new GeneralToolbar({ $$inline: true });
	generaltoolbar.$on("saveLocal", /*handleSaveLocal*/ ctx[7]);
	navcontroller = new NavigatorController({ $$inline: true });
	let if_block = /*$projectExpanded*/ ctx[2] && create_if_block$g(ctx);

	linenumbers = new LineNumbers({
			props: { textareaValue: /*textareaValue*/ ctx[5] },
			$$inline: true
		});

	problems = new Problems({ $$inline: true });

	const block = {
		c: function create() {
			div6 = element("div");
			div5 = element("div");
			create_component(generaltoolbar.$$.fragment);
			t0 = space();
			div4 = element("div");
			create_component(navcontroller.$$.fragment);
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			div3 = element("div");
			div2 = element("div");
			create_component(linenumbers.$$.fragment);
			t3 = space();
			div1 = element("div");
			textarea_1 = element("textarea");
			t4 = space();
			div0 = element("div");
			div0.textContent = "Drop your file here...";
			t6 = space();
			create_component(problems.$$.fragment);
			attr_dev(textarea_1, "id", "editor-field");
			attr_dev(textarea_1, "cols", "75");
			attr_dev(textarea_1, "rows", "30");
			attr_dev(textarea_1, "placeholder", "Start typing here...");
			attr_dev(textarea_1, "spellcheck", "false");
			set_style(textarea_1, "overflow", "hidden");
			set_style(textarea_1, "height", "auto");
			attr_dev(textarea_1, "class", "svelte-e5k62l");
			add_location(textarea_1, file$m, 193, 12, 6538);
			attr_dev(div0, "id", "overlay");
			attr_dev(div0, "class", "hidden svelte-e5k62l");
			add_location(div0, file$m, 204, 12, 6915);
			attr_dev(div1, "class", "textarea-container svelte-e5k62l");
			add_location(div1, file$m, 192, 10, 6493);
			attr_dev(div2, "id", "editor-wrapper");
			attr_dev(div2, "class", "svelte-e5k62l");
			add_location(div2, file$m, 190, 8, 6415);
			attr_dev(div3, "class", "flex-column2 svelte-e5k62l");
			add_location(div3, file$m, 189, 6, 6380);
			attr_dev(div4, "class", "flex-row svelte-e5k62l");
			add_location(div4, file$m, 181, 4, 6137);
			attr_dev(div5, "id", "editor");
			attr_dev(div5, "class", "svelte-e5k62l");
			add_location(div5, file$m, 179, 2, 6061);
			attr_dev(div6, "class", "main-component svelte-e5k62l");
			add_location(div6, file$m, 178, 0, 6030);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div6, anchor);
			append_dev(div6, div5);
			mount_component(generaltoolbar, div5, null);
			append_dev(div5, t0);
			append_dev(div5, div4);
			mount_component(navcontroller, div4, null);
			append_dev(div4, t1);
			if (if_block) if_block.m(div4, null);
			append_dev(div4, t2);
			append_dev(div4, div3);
			append_dev(div3, div2);
			mount_component(linenumbers, div2, null);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div1, textarea_1);
			set_input_value(textarea_1, /*$textareaValue*/ ctx[3]);
			/*textarea_1_binding*/ ctx[9](textarea_1);
			append_dev(div1, t4);
			append_dev(div1, div0);
			append_dev(div3, t6);
			mount_component(problems, div3, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(textarea_1, "input", /*textarea_1_input_handler*/ ctx[8]),
					listen_dev(textarea_1, "input", /*handleInput*/ ctx[6], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*$projectExpanded*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*$projectExpanded*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$g(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div4, t2);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}

			if (dirty & /*$textareaValue*/ 8) {
				set_input_value(textarea_1, /*$textareaValue*/ ctx[3]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(generaltoolbar.$$.fragment, local);
			transition_in(navcontroller.$$.fragment, local);
			transition_in(if_block);
			transition_in(linenumbers.$$.fragment, local);
			transition_in(problems.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(generaltoolbar.$$.fragment, local);
			transition_out(navcontroller.$$.fragment, local);
			transition_out(if_block);
			transition_out(linenumbers.$$.fragment, local);
			transition_out(problems.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div6);
			destroy_component(generaltoolbar);
			destroy_component(navcontroller);
			if (if_block) if_block.d();
			destroy_component(linenumbers);
			/*textarea_1_binding*/ ctx[9](null);
			destroy_component(problems);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$n.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$n($$self, $$props, $$invalidate) {
	let $projectExpanded;
	let $textareaValue;
	validate_store(projectExpanded, 'projectExpanded');
	component_subscribe($$self, projectExpanded, $$value => $$invalidate(2, $projectExpanded = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('CodeEditor', slots, []);
	let fileManager = new FileManager();
	let codeEditor;
	let textareaValue = writable("");
	validate_store(textareaValue, 'textareaValue');
	component_subscribe($$self, textareaValue, value => $$invalidate(3, $textareaValue = value));
	let textarea;
	let defaultWidth;
	let editorWrapperHeight;

	editorWrapperHeightStore.subscribe(value => {
		editorWrapperHeight = value;
	});

	let projectExpandedValue;

	projectExpanded.subscribe(value => {
		projectExpandedValue = value;
	});

	const handleInput = () => {
		$$invalidate(1, textarea.style.height = "auto", textarea);
		$$invalidate(1, textarea.style.height = textarea.scrollHeight + "px", textarea);
	};

	const adjustTextareaWidth = () => {
		const lines = textarea.value.split("\n");
		let longestLine = lines[0];

		// If textarea is empty, reset to original width
		if (textarea.value === "") {
			$$invalidate(1, textarea.style.width = `${defaultWidth}px`, textarea);
			return;
		}

		// Find the line with the most characters
		for (let line of lines) {
			if (line.length > longestLine.length) {
				longestLine = line;
			}
		}

		// Calculate the width of the longest line
		const newWidth = longestLine.length * 9; // 9px per character

		// Set the width of the textarea to match the width of the longest line
		// only if the new width exceeds the default width
		if (newWidth > defaultWidth) {
			$$invalidate(1, textarea.style.width = `${newWidth}px`, textarea);

			//saves the width into local storage
			localStorage.setItem("textareaWidth", textarea.scrollWidth);
		} else {
			$$invalidate(1, textarea.style.width = `${defaultWidth}px`, textarea);
		}
	};

	onMount(() => {
		$$invalidate(0, codeEditor = new CodeEditor("editor", "editor-field", "line-numbers", "overlay", fileManager));
		textareaValue.set(codeEditor.textarea.value);
		const editorWrapperElement = document.querySelector("#editor-wrapper");
		editorWrapperHeightStore.set(editorWrapperElement.offsetHeight);
		defaultWidth = textarea.offsetWidth;
		adjustTextareaWidth(); // Adjust the width on mount

		textarea.addEventListener("input", () => {
			adjustTextareaWidth();
			handleInput();
			codeEditor.checkYamlSyntax(codeEditor.textarea.value);
		});

		// Handles both tab and enter functionalities
		textarea.addEventListener("keydown", event => {
			if (event.key === "Tab") {
				event.preventDefault();
				const { selectionStart, selectionEnd } = textarea;
				const value = textarea.value;
				$$invalidate(1, textarea.value = value.substring(0, selectionStart) + "  " + value.substring(selectionEnd), textarea);
				$$invalidate(1, textarea.selectionStart = $$invalidate(1, textarea.selectionEnd = selectionStart + 2, textarea), textarea);
			} else // } else if (event.key === "Enter") {
			//   event.preventDefault();
			//   const { selectionStart, selectionEnd } = textarea;
			//   const value = textarea.value;
			//   const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
			//   let spaceLength = value.substring(lineStart).search(/\S/);
			//   spaceLength = spaceLength === -1 ? 0 : spaceLength;
			//   const spaces = " ".repeat(spaceLength);
			//   textarea.value = value.substring(0, selectionEnd + 2) + "\n" + spaces;
			//   textareaValue.set(codeEditor.textarea.value);
			if (event.ctrlKey && event.key === "/") ; // TODO: Add comment functionality with user fake cursor and selection,
			// also multiple lines should work
		});

		// Adjust the height on mount
		handleInput();

		codeEditor.checkYamlSyntax(codeEditor.textarea.value);
	});

	// function handleFormat() {
	//   yamlChecker.yamlCode = textarea.value;
	//   textarea.value = yamlChecker.formatYAML();
	// }
	function handleSaveLocal() {
		var file = new File([textarea.value], fileManager.getCurrentFile(), { type: "text;charset=utf-8" });

		// Create a link to download the file
		const anchor = document.createElement("a");

		anchor.setAttribute("href", window.URL.createObjectURL(file));
		anchor.setAttribute("download", fileManager.getCurrentFile());
		anchor.click();
		URL.revokeObjectURL(anchor.href);
	}

	//interact js for resizing the navigator-dashboard
	interact("#navigator-dashboard").resizable({
		edges: {
			top: false,
			left: false,
			bottom: false,
			right: true
		},
		modifiers: [
			interact.modifiers.restrictSize({
				min: { width: 100, height: Infinity },
				max: { width: 600, height: Infinity }
			})
		]
	}).on("resizemove", function (event) {
		var target = event.target;
		var flexColumn = document.querySelector(".flex-column2");
		var newWidth = event.rect.width;
		var totalWidth = target.parentNode.offsetWidth;
		target.style.width = newWidth + "px";
		flexColumn.style.width = totalWidth - newWidth + "px";
	}).on("resizestart", function (event) {
		var target = event.target;
		target.style.borderRight = "2px solid blue";
		var editorWrapper = document.querySelector("#editor-wrapper");

		if (editorWrapper) {
			editorWrapper.style.pointerEvents = "none";
		}
	}).on("resizeend", function (event) {
		var target = event.target;
		target.style.borderRight = "";
		var editorWrapper = document.querySelector("#editor-wrapper");

		if (editorWrapper) {
			editorWrapper.style.pointerEvents = "auto";
		}
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CodeEditor> was created with unknown prop '${key}'`);
	});

	function textarea_1_input_handler() {
		$textareaValue = this.value;
		textareaValue.set($textareaValue);
	}

	function textarea_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			textarea = $$value;
			$$invalidate(1, textarea);
		});
	}

	$$self.$capture_state = () => ({
		onMount,
		writable,
		Problems,
		Dashboard,
		FileNavigator: FileNavigator_1,
		LineNumbers,
		CodeEditor,
		FileManager,
		GeneralToolbar,
		NavController: NavigatorController,
		projectExpanded,
		editorWrapperHeightStore,
		_: $format,
		interact,
		fileManager,
		codeEditor,
		textareaValue,
		textarea,
		defaultWidth,
		editorWrapperHeight,
		projectExpandedValue,
		handleInput,
		adjustTextareaWidth,
		handleSaveLocal,
		$projectExpanded,
		$textareaValue
	});

	$$self.$inject_state = $$props => {
		if ('fileManager' in $$props) $$invalidate(4, fileManager = $$props.fileManager);
		if ('codeEditor' in $$props) $$invalidate(0, codeEditor = $$props.codeEditor);
		if ('textareaValue' in $$props) $$invalidate(5, textareaValue = $$props.textareaValue);
		if ('textarea' in $$props) $$invalidate(1, textarea = $$props.textarea);
		if ('defaultWidth' in $$props) defaultWidth = $$props.defaultWidth;
		if ('editorWrapperHeight' in $$props) editorWrapperHeight = $$props.editorWrapperHeight;
		if ('projectExpandedValue' in $$props) projectExpandedValue = $$props.projectExpandedValue;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		codeEditor,
		textarea,
		$projectExpanded,
		$textareaValue,
		fileManager,
		textareaValue,
		handleInput,
		handleSaveLocal,
		textarea_1_input_handler,
		textarea_1_binding
	];
}

class CodeEditor_1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$n, create_fragment$n, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CodeEditor_1",
			options,
			id: create_fragment$n.name
		});
	}
}

/* src\Components\Footer\LanguageBox.svelte generated by Svelte v3.59.2 */

const file$l = "src\\Components\\Footer\\LanguageBox.svelte";

function create_fragment$m(ctx) {
	let div2;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let div1;
	let p;
	let t1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div1 = element("div");
			p = element("p");
			t1 = text(/*languageName*/ ctx[1]);
			if (!src_url_equal(img.src, img_src_value = /*flagIcon*/ ctx[0])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "...");
			attr_dev(img, "class", "svelte-1ecxusq");
			add_location(img, file$l, 9, 8, 242);
			attr_dev(div0, "class", "language-container__icon-container svelte-1ecxusq");
			add_location(div0, file$l, 8, 4, 184);
			attr_dev(p, "class", "svelte-1ecxusq");
			add_location(p, file$l, 12, 8, 348);
			attr_dev(div1, "class", "language-container__text-container svelte-1ecxusq");
			add_location(div1, file$l, 11, 4, 290);
			attr_dev(div2, "class", "language-container svelte-1ecxusq");
			add_location(div2, file$l, 7, 0, 106);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, img);
			append_dev(div2, t0);
			append_dev(div2, div1);
			append_dev(div1, p);
			append_dev(p, t1);

			if (!mounted) {
				dispose = [
					listen_dev(
						div2,
						"click",
						function () {
							if (is_function(/*onClick*/ ctx[2])) /*onClick*/ ctx[2].apply(this, arguments);
						},
						false,
						false,
						false,
						false
					),
					listen_dev(
						div2,
						"keydown",
						function () {
							if (is_function(/*onClick*/ ctx[2])) /*onClick*/ ctx[2].apply(this, arguments);
						},
						false,
						false,
						false,
						false
					)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (dirty & /*flagIcon*/ 1 && !src_url_equal(img.src, img_src_value = /*flagIcon*/ ctx[0])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*languageName*/ 2) set_data_dev(t1, /*languageName*/ ctx[1]);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$m.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$m($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('LanguageBox', slots, []);
	let { flagIcon } = $$props;
	let { languageName } = $$props;
	let { onClick } = $$props;

	$$self.$$.on_mount.push(function () {
		if (flagIcon === undefined && !('flagIcon' in $$props || $$self.$$.bound[$$self.$$.props['flagIcon']])) {
			console.warn("<LanguageBox> was created without expected prop 'flagIcon'");
		}

		if (languageName === undefined && !('languageName' in $$props || $$self.$$.bound[$$self.$$.props['languageName']])) {
			console.warn("<LanguageBox> was created without expected prop 'languageName'");
		}

		if (onClick === undefined && !('onClick' in $$props || $$self.$$.bound[$$self.$$.props['onClick']])) {
			console.warn("<LanguageBox> was created without expected prop 'onClick'");
		}
	});

	const writable_props = ['flagIcon', 'languageName', 'onClick'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LanguageBox> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('flagIcon' in $$props) $$invalidate(0, flagIcon = $$props.flagIcon);
		if ('languageName' in $$props) $$invalidate(1, languageName = $$props.languageName);
		if ('onClick' in $$props) $$invalidate(2, onClick = $$props.onClick);
	};

	$$self.$capture_state = () => ({ flagIcon, languageName, onClick });

	$$self.$inject_state = $$props => {
		if ('flagIcon' in $$props) $$invalidate(0, flagIcon = $$props.flagIcon);
		if ('languageName' in $$props) $$invalidate(1, languageName = $$props.languageName);
		if ('onClick' in $$props) $$invalidate(2, onClick = $$props.onClick);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [flagIcon, languageName, onClick];
}

class LanguageBox extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$m, create_fragment$m, safe_not_equal, { flagIcon: 0, languageName: 1, onClick: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LanguageBox",
			options,
			id: create_fragment$m.name
		});
	}

	get flagIcon() {
		throw new Error("<LanguageBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set flagIcon(value) {
		throw new Error("<LanguageBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get languageName() {
		throw new Error("<LanguageBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set languageName(value) {
		throw new Error("<LanguageBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get onClick() {
		throw new Error("<LanguageBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set onClick(value) {
		throw new Error("<LanguageBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var img$i = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 55.2 38.4' style='enable-background:new 0 0 55.2 38.4' xml:space='preserve'%3e%3cstyle type='text/css'%3e%3c!%5bCDATA%5b .st0%7bfill:%23C1272D%3b%7d .st1%7bfill:%23FDB913%3b%7d .st2%7bfill:%23006A44%3b%7d%5d%5d%3e%3c/style%3e%3cg%3e%3cpath class='st0' d='M3.03%2c0h49.13c1.67%2c0%2c3.03%2c1.36%2c3.03%2c3.03v32.33c0%2c1.67-1.37%2c3.03-3.03%2c3.03H3.03C1.37%2c38.4%2c0%2c37.04%2c0%2c35.37 V3.03C0%2c1.36%2c1.37%2c0%2c3.03%2c0L3.03%2c0z'/%3e%3cpath class='st2' d='M55.2%2c26.04H0V3.03C0%2c1.36%2c1.37%2c0%2c3.03%2c0h49.13c1.67%2c0%2c3.03%2c1.36%2c3.03%2c3.03V26.04L55.2%2c26.04z'/%3e%3cpath class='st1' d='M55.2%2c12.36H0V3.03C0%2c1.36%2c1.37%2c0%2c3.03%2c0h49.13c1.67%2c0%2c3.03%2c1.36%2c3.03%2c3.03V12.36L55.2%2c12.36z'/%3e%3c/g%3e%3c/svg%3e";

var img$h = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 55.2 38.4' style='enable-background:new 0 0 55.2 38.4' xml:space='preserve'%3e%3cstyle type='text/css'%3e.st0%7bfill:%23FEFEFE%3b%7d .st1%7bfill:%23C8102E%3b%7d .st2%7bfill:%23012169%3b%7d%3c/style%3e%3cg%3e%3cpath class='st0' d='M2.87%2c38.4h49.46c1.59-0.09%2c2.87-1.42%2c2.87-3.03V3.03c0-1.66-1.35-3.02-3.01-3.03H3.01 C1.35%2c0.01%2c0%2c1.37%2c0%2c3.03v32.33C0%2c36.98%2c1.28%2c38.31%2c2.87%2c38.4L2.87%2c38.4z'/%3e%3cpolygon class='st1' points='23.74%2c23.03 23.74%2c38.4 31.42%2c38.4 31.42%2c23.03 55.2%2c23.03 55.2%2c15.35 31.42%2c15.35 31.42%2c0 23.74%2c0 23.74%2c15.35 0%2c15.35 0%2c23.03 23.74%2c23.03'/%3e%3cpath class='st2' d='M33.98%2c12.43V0h18.23c1.26%2c0.02%2c2.34%2c0.81%2c2.78%2c1.92L33.98%2c12.43L33.98%2c12.43z'/%3e%3cpath class='st2' d='M33.98%2c25.97V38.4h18.35c1.21-0.07%2c2.23-0.85%2c2.66-1.92L33.98%2c25.97L33.98%2c25.97z'/%3e%3cpath class='st2' d='M21.18%2c25.97V38.4H2.87c-1.21-0.07-2.24-0.85-2.66-1.94L21.18%2c25.97L21.18%2c25.97z'/%3e%3cpath class='st2' d='M21.18%2c12.43V0H2.99C1.73%2c0.02%2c0.64%2c0.82%2c0.21%2c1.94L21.18%2c12.43L21.18%2c12.43z'/%3e%3cpolygon class='st2' points='0%2c12.8 7.65%2c12.8 0%2c8.97 0%2c12.8'/%3e%3cpolygon class='st2' points='55.2%2c12.8 47.51%2c12.8 55.2%2c8.95 55.2%2c12.8'/%3e%3cpolygon class='st2' points='55.2%2c25.6 47.51%2c25.6 55.2%2c29.45 55.2%2c25.6'/%3e%3cpolygon class='st2' points='0%2c25.6 7.65%2c25.6 0%2c29.43 0%2c25.6'/%3e%3cpolygon class='st1' points='55.2%2c3.25 36.15%2c12.8 40.41%2c12.8 55.2%2c5.4 55.2%2c3.25'/%3e%3cpolygon class='st1' points='19.01%2c25.6 14.75%2c25.6 0%2c32.98 0%2c35.13 19.05%2c25.6 19.01%2c25.6'/%3e%3cpolygon class='st1' points='10.52%2c12.81 14.78%2c12.81 0%2c5.41 0%2c7.55 10.52%2c12.81'/%3e%3cpolygon class='st1' points='44.63%2c25.59 40.37%2c25.59 55.2%2c33.02 55.2%2c30.88 44.63%2c25.59'/%3e%3c/g%3e%3c/svg%3e";

// uses fetch to load locale files on demand
async function loadLocale(localeName) {
  const response = await fetch(`/lang/${localeName}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load ${localeName} translation`);
  }
  return await response.json();
}

registerLocaleLoader('en', () => loadLocale('en'));
registerLocaleLoader('lt', () => loadLocale('lt'));

// initial locale is to english unless there is a cached locale
init({
  fallbackLocale: 'en',
  initialLocale: localStorage.getItem('cachedLocale') || 'en',
});

const AVAILABLE_LOCALES = ['en', 'lt'];

function changeLocale(chosenLocale) {
  const cachedLocale = localStorage.getItem('cachedLocale');
  if (cachedLocale !== chosenLocale) {
    localStorage.setItem('cachedLocale', chosenLocale);
    $locale.set(chosenLocale);
  }
}

/* src\Components\Footer\Footer.svelte generated by Svelte v3.59.2 */
const file$k = "src\\Components\\Footer\\Footer.svelte";

// (29:4) {#if $locale !== 'lt'}
function create_if_block_1$6(ctx) {
	let languagebox;
	let current;

	languagebox = new LanguageBox({
			props: {
				flagIcon: img$i,
				languageName: /*$_*/ ctx[1]('footer.LT'),
				onClick: /*func*/ ctx[4]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(languagebox.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(languagebox, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const languagebox_changes = {};
			if (dirty & /*$_*/ 2) languagebox_changes.languageName = /*$_*/ ctx[1]('footer.LT');
			languagebox.$set(languagebox_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(languagebox.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(languagebox.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(languagebox, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$6.name,
		type: "if",
		source: "(29:4) {#if $locale !== 'lt'}",
		ctx
	});

	return block;
}

// (32:4) {#if $locale !== 'en'}
function create_if_block$f(ctx) {
	let languagebox;
	let current;

	languagebox = new LanguageBox({
			props: {
				flagIcon: img$h,
				languageName: /*$_*/ ctx[1]('footer.EN'),
				onClick: /*func_1*/ ctx[5]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(languagebox.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(languagebox, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const languagebox_changes = {};
			if (dirty & /*$_*/ 2) languagebox_changes.languageName = /*$_*/ ctx[1]('footer.EN');
			languagebox.$set(languagebox_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(languagebox.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(languagebox.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(languagebox, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$f.name,
		type: "if",
		source: "(32:4) {#if $locale !== 'en'}",
		ctx
	});

	return block;
}

function create_fragment$l(ctx) {
	let footer;
	let div0;
	let p;
	let t1;
	let div1;
	let t2;
	let current;
	let if_block0 = /*$locale*/ ctx[0] !== 'lt' && create_if_block_1$6(ctx);
	let if_block1 = /*$locale*/ ctx[0] !== 'en' && create_if_block$f(ctx);

	const block = {
		c: function create() {
			footer = element("footer");
			div0 = element("div");
			p = element("p");
			p.textContent = `${/*currentYear*/ ctx[2]}`;
			t1 = space();
			div1 = element("div");
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			attr_dev(p, "id", "copyright");
			attr_dev(p, "class", "svelte-4qkejc");
			add_location(p, file$k, 25, 4, 736);
			attr_dev(div0, "class", "footer-container svelte-4qkejc");
			add_location(div0, file$k, 24, 2, 701);
			attr_dev(div1, "class", "language-container svelte-4qkejc");
			add_location(div1, file$k, 27, 2, 783);
			attr_dev(footer, "class", "svelte-4qkejc");
			add_location(footer, file$k, 23, 0, 690);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, footer, anchor);
			append_dev(footer, div0);
			append_dev(div0, p);
			append_dev(footer, t1);
			append_dev(footer, div1);
			if (if_block0) if_block0.m(div1, null);
			append_dev(div1, t2);
			if (if_block1) if_block1.m(div1, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*$locale*/ ctx[0] !== 'lt') {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*$locale*/ 1) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_1$6(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(div1, t2);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*$locale*/ ctx[0] !== 'en') {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*$locale*/ 1) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block$f(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(footer);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$l.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$l($$self, $$props, $$invalidate) {
	let $locale$1;
	let $_;
	validate_store($locale, 'locale');
	component_subscribe($$self, $locale, $$value => $$invalidate(0, $locale$1 = $$value));
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(1, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Footer', slots, []);
	let currentYear = new Date().getFullYear();

	onMount(() => {
		// Updates the current year in the footer
		const yearElement = document.getElementById('copyright');

		if (yearElement) {
			yearElement.textContent = currentYear + " © Studiosus";
		}
	});

	function handleLanguageSelect(language) {
		changeLocale(language);
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
	});

	const func = () => handleLanguageSelect('lt');
	const func_1 = () => handleLanguageSelect('en');

	$$self.$capture_state = () => ({
		onMount,
		LanguageBox,
		LtFlag: img$i,
		EnFlag: img$h,
		_: $format,
		locale: $locale,
		changeLocale,
		currentYear,
		handleLanguageSelect,
		$locale: $locale$1,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('currentYear' in $$props) $$invalidate(2, currentYear = $$props.currentYear);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [$locale$1, $_, currentYear, handleLanguageSelect, func, func_1];
}

class Footer extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$l, create_fragment$l, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Footer",
			options,
			id: create_fragment$l.name
		});
	}
}

/* src\Components\LayoutManager.svelte generated by Svelte v3.59.2 */

const file$j = "src\\Components\\LayoutManager.svelte";

function create_fragment$k(ctx) {
	let div2;
	let div0;
	let switch_instance0;
	let t0;
	let main;
	let t1;
	let div1;
	let switch_instance1;
	let current;
	var switch_value = /*header*/ ctx[0];

	function switch_props(ctx) {
		return { $$inline: true };
	}

	if (switch_value) {
		switch_instance0 = construct_svelte_component_dev(switch_value, switch_props());
	}

	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
	var switch_value_1 = /*footer*/ ctx[1];

	function switch_props_1(ctx) {
		return { $$inline: true };
	}

	if (switch_value_1) {
		switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1());
	}

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			if (switch_instance0) create_component(switch_instance0.$$.fragment);
			t0 = space();
			main = element("main");
			if (default_slot) default_slot.c();
			t1 = space();
			div1 = element("div");
			if (switch_instance1) create_component(switch_instance1.$$.fragment);
			attr_dev(div0, "class", "header svelte-9zu8yo");
			add_location(div0, file$j, 6, 2, 100);
			attr_dev(main, "class", "svelte-9zu8yo");
			add_location(main, file$j, 7, 2, 164);
			attr_dev(div1, "class", "footer");
			add_location(div1, file$j, 10, 2, 199);
			attr_dev(div2, "class", "content-wrapper svelte-9zu8yo");
			add_location(div2, file$j, 5, 0, 67);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			if (switch_instance0) mount_component(switch_instance0, div0, null);
			append_dev(div2, t0);
			append_dev(div2, main);

			if (default_slot) {
				default_slot.m(main, null);
			}

			append_dev(div2, t1);
			append_dev(div2, div1);
			if (switch_instance1) mount_component(switch_instance1, div1, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*header*/ 1 && switch_value !== (switch_value = /*header*/ ctx[0])) {
				if (switch_instance0) {
					group_outros();
					const old_component = switch_instance0;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance0 = construct_svelte_component_dev(switch_value, switch_props());
					create_component(switch_instance0.$$.fragment);
					transition_in(switch_instance0.$$.fragment, 1);
					mount_component(switch_instance0, div0, null);
				} else {
					switch_instance0 = null;
				}
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
						null
					);
				}
			}

			if (dirty & /*footer*/ 2 && switch_value_1 !== (switch_value_1 = /*footer*/ ctx[1])) {
				if (switch_instance1) {
					group_outros();
					const old_component = switch_instance1;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value_1) {
					switch_instance1 = construct_svelte_component_dev(switch_value_1, switch_props_1());
					create_component(switch_instance1.$$.fragment);
					transition_in(switch_instance1.$$.fragment, 1);
					mount_component(switch_instance1, div1, null);
				} else {
					switch_instance1 = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
			transition_in(default_slot, local);
			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
			transition_out(default_slot, local);
			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if (switch_instance0) destroy_component(switch_instance0);
			if (default_slot) default_slot.d(detaching);
			if (switch_instance1) destroy_component(switch_instance1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$k.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$k($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('LayoutManager', slots, ['default']);
	let { header } = $$props;
	let { footer } = $$props;

	$$self.$$.on_mount.push(function () {
		if (header === undefined && !('header' in $$props || $$self.$$.bound[$$self.$$.props['header']])) {
			console.warn("<LayoutManager> was created without expected prop 'header'");
		}

		if (footer === undefined && !('footer' in $$props || $$self.$$.bound[$$self.$$.props['footer']])) {
			console.warn("<LayoutManager> was created without expected prop 'footer'");
		}
	});

	const writable_props = ['header', 'footer'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LayoutManager> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('header' in $$props) $$invalidate(0, header = $$props.header);
		if ('footer' in $$props) $$invalidate(1, footer = $$props.footer);
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({ header, footer });

	$$self.$inject_state = $$props => {
		if ('header' in $$props) $$invalidate(0, header = $$props.header);
		if ('footer' in $$props) $$invalidate(1, footer = $$props.footer);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [header, footer, $$scope, slots];
}

class LayoutManager extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$k, create_fragment$k, safe_not_equal, { header: 0, footer: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LayoutManager",
			options,
			id: create_fragment$k.name
		});
	}

	get header() {
		throw new Error("<LayoutManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set header(value) {
		throw new Error("<LayoutManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get footer() {
		throw new Error("<LayoutManager>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set footer(value) {
		throw new Error("<LayoutManager>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var img$g = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg height='512px' id='Layer_1' style='enable-background:new 0 0 512 512%3b' version='1.1' viewBox='0 0 512 512' width='512px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cstyle type='text/css'%3e%3c!%5bCDATA%5b .st0%7bfill-rule:evenodd%3bclip-rule:evenodd%3b%7d%5d%5d%3e%3c/style%3e%3cg%3e%3cpath class='st0' d='M256%2c32C132.3%2c32%2c32%2c134.8%2c32%2c261.7c0%2c101.5%2c64.2%2c187.5%2c153.2%2c217.9c11.2%2c2.1%2c15.3-5%2c15.3-11.1 c0-5.5-0.2-19.9-0.3-39.1c-62.3%2c13.9-75.5-30.8-75.5-30.8c-10.2-26.5-24.9-33.6-24.9-33.6c-20.3-14.3%2c1.5-14%2c1.5-14 c22.5%2c1.6%2c34.3%2c23.7%2c34.3%2c23.7c20%2c35.1%2c52.4%2c25%2c65.2%2c19.1c2-14.8%2c7.8-25%2c14.2-30.7c-49.7-5.8-102-25.5-102-113.5 c0-25.1%2c8.7-45.6%2c23-61.6c-2.3-5.8-10-29.2%2c2.2-60.8c0%2c0%2c18.8-6.2%2c61.6%2c23.5c17.9-5.1%2c37-7.6%2c56.1-7.7c19%2c0.1%2c38.2%2c2.6%2c56.1%2c7.7 c42.8-29.7%2c61.5-23.5%2c61.5-23.5c12.2%2c31.6%2c4.5%2c55%2c2.2%2c60.8c14.3%2c16.1%2c23%2c36.6%2c23%2c61.6c0%2c88.2-52.4%2c107.6-102.3%2c113.3 c8%2c7.1%2c15.2%2c21.1%2c15.2%2c42.5c0%2c30.7-0.3%2c55.5-0.3%2c63c0%2c6.1%2c4%2c13.3%2c15.4%2c11C415.9%2c449.1%2c480%2c363.1%2c480%2c261.7 C480%2c134.8%2c379.7%2c32%2c256%2c32z'/%3e%3c/g%3e%3c/svg%3e";

var img$f = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e%3cg%3e%3cpath d='M0 0h24v24H0z' fill='none'/%3e%3cpath d='M5.868 2.75L8 10h8l2.132-7.25a.4.4 0 0 1 .765-.01l3.495 10.924a.5.5 0 0 1-.173.55L12 22 1.78 14.214a.5.5 0 0 1-.172-.55L5.103 2.74a.4.4 0 0 1 .765.009z'/%3e%3c/g%3e%3c/svg%3e";

/* src\Components\Login.svelte generated by Svelte v3.59.2 */

const { Error: Error_1$5, console: console_1$4 } = globals;
const file$i = "src\\Components\\Login.svelte";

// (55:4) {#if errorMessage}
function create_if_block_3$4(ctx) {
	let h3;
	let t_value = /*$_*/ ctx[4](`login.errorMessages.${/*errorMessageKey*/ ctx[3]}`) + "";
	let t;

	const block = {
		c: function create() {
			h3 = element("h3");
			t = text(t_value);
			attr_dev(h3, "class", "error svelte-14pm9rp");
			add_location(h3, file$i, 55, 6, 1512);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h3, anchor);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_, errorMessageKey*/ 24 && t_value !== (t_value = /*$_*/ ctx[4](`login.errorMessages.${/*errorMessageKey*/ ctx[3]}`) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$4.name,
		type: "if",
		source: "(55:4) {#if errorMessage}",
		ctx
	});

	return block;
}

// (58:4) {#if showGithubOAuth || showGitlabOAuth}
function create_if_block$e(ctx) {
	let div1;
	let div0;
	let t;
	let if_block0 = /*showGithubOAuth*/ ctx[0] && create_if_block_2$4(ctx);
	let if_block1 = /*showGitlabOAuth*/ ctx[1] && create_if_block_1$5(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			if (if_block0) if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			attr_dev(div0, "class", "oauth-options svelte-14pm9rp");
			add_location(div0, file$i, 59, 8, 1678);
			attr_dev(div1, "class", "oauth-logins svelte-14pm9rp");
			add_location(div1, file$i, 58, 6, 1643);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div0, t);
			if (if_block1) if_block1.m(div0, null);
		},
		p: function update(ctx, dirty) {
			if (/*showGithubOAuth*/ ctx[0]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2$4(ctx);
					if_block0.c();
					if_block0.m(div0, t);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*showGitlabOAuth*/ ctx[1]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1$5(ctx);
					if_block1.c();
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$e.name,
		type: "if",
		source: "(58:4) {#if showGithubOAuth || showGitlabOAuth}",
		ctx
	});

	return block;
}

// (61:10) {#if showGithubOAuth}
function create_if_block_2$4(ctx) {
	let a;
	let img;
	let img_src_value;
	let t_value = /*$_*/ ctx[4](`login.loginWithGithub`) + "";
	let t;

	const block = {
		c: function create() {
			a = element("a");
			img = element("img");
			t = text(t_value);
			if (!src_url_equal(img.src, img_src_value = img$g)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "github logo");
			attr_dev(img, "class", "svelte-14pm9rp");
			add_location(img, file$i, 62, 14, 1819);
			attr_dev(a, "href", backendUrl$7 + "/oauth2/authorization/github");
			attr_dev(a, "class", "svelte-14pm9rp");
			add_location(a, file$i, 61, 12, 1750);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, img);
			append_dev(a, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 16 && t_value !== (t_value = /*$_*/ ctx[4](`login.loginWithGithub`) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$4.name,
		type: "if",
		source: "(61:10) {#if showGithubOAuth}",
		ctx
	});

	return block;
}

// (68:10) {#if showGitlabOAuth}
function create_if_block_1$5(ctx) {
	let a;
	let img;
	let img_src_value;
	let t_value = /*$_*/ ctx[4](`login.loginWithGitLab`) + "";
	let t;

	const block = {
		c: function create() {
			a = element("a");
			img = element("img");
			t = text(t_value);
			attr_dev(img, "class", "gitlab svelte-14pm9rp");
			if (!src_url_equal(img.src, img_src_value = img$f)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "gitlab logo");
			add_location(img, file$i, 69, 14, 2069);
			attr_dev(a, "href", backendUrl$7 + "/oauth2/authorization/gitlab");
			attr_dev(a, "class", "svelte-14pm9rp");
			add_location(a, file$i, 68, 12, 2000);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, img);
			append_dev(a, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 16 && t_value !== (t_value = /*$_*/ ctx[4](`login.loginWithGitLab`) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$5.name,
		type: "if",
		source: "(68:10) {#if showGitlabOAuth}",
		ctx
	});

	return block;
}

function create_fragment$j(ctx) {
	let div3;
	let h1;
	let t1;
	let div2;
	let t2;
	let t3;
	let div1;
	let form;
	let input0;
	let input0_placeholder_value;
	let t4;
	let input1;
	let input1_placeholder_value;
	let t5;
	let div0;
	let button;
	let t6_value = /*$_*/ ctx[4]("login.login") + "";
	let t6;
	let t7;
	let a;
	let t8_value = /*$_*/ ctx[4]("login.register") + "";
	let t8;
	let if_block0 = /*errorMessage*/ ctx[2] && create_if_block_3$4(ctx);
	let if_block1 = (/*showGithubOAuth*/ ctx[0] || /*showGitlabOAuth*/ ctx[1]) && create_if_block$e(ctx);

	const block = {
		c: function create() {
			div3 = element("div");
			h1 = element("h1");
			h1.textContent = "Studiosus";
			t1 = space();
			div2 = element("div");
			if (if_block0) if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			t3 = space();
			div1 = element("div");
			form = element("form");
			input0 = element("input");
			t4 = space();
			input1 = element("input");
			t5 = space();
			div0 = element("div");
			button = element("button");
			t6 = text(t6_value);
			t7 = space();
			a = element("a");
			t8 = text(t8_value);
			add_location(h1, file$i, 52, 2, 1432);
			attr_dev(input0, "type", "email");
			attr_dev(input0, "id", "username");
			attr_dev(input0, "name", "username");
			attr_dev(input0, "placeholder", input0_placeholder_value = /*$_*/ ctx[4]("login.email"));
			attr_dev(input0, "class", "svelte-14pm9rp");
			add_location(input0, file$i, 79, 8, 2358);
			attr_dev(input1, "type", "password");
			attr_dev(input1, "id", "password");
			attr_dev(input1, "name", "password");
			attr_dev(input1, "placeholder", input1_placeholder_value = /*$_*/ ctx[4]("login.password"));
			attr_dev(input1, "class", "svelte-14pm9rp");
			add_location(input1, file$i, 85, 8, 2499);
			attr_dev(button, "class", "button--blue");
			attr_dev(button, "type", "submit");
			add_location(button, file$i, 92, 10, 2687);
			attr_dev(div0, "class", "button-container svelte-14pm9rp");
			add_location(div0, file$i, 91, 8, 2646);
			attr_dev(form, "action", backendUrl$7 + "/login");
			attr_dev(form, "method", "post");
			attr_dev(form, "class", "svelte-14pm9rp");
			add_location(form, file$i, 78, 6, 2298);
			attr_dev(a, "href", "/register");
			attr_dev(a, "class", "svelte-14pm9rp");
			add_location(a, file$i, 96, 6, 2805);
			attr_dev(div1, "class", "password-login svelte-14pm9rp");
			add_location(div1, file$i, 77, 4, 2263);
			attr_dev(div2, "class", "login-component");
			add_location(div2, file$i, 53, 2, 1453);
			attr_dev(div3, "class", "main-component svelte-14pm9rp");
			add_location(div3, file$i, 51, 0, 1401);
		},
		l: function claim(nodes) {
			throw new Error_1$5("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, h1);
			append_dev(div3, t1);
			append_dev(div3, div2);
			if (if_block0) if_block0.m(div2, null);
			append_dev(div2, t2);
			if (if_block1) if_block1.m(div2, null);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div1, form);
			append_dev(form, input0);
			append_dev(form, t4);
			append_dev(form, input1);
			append_dev(form, t5);
			append_dev(form, div0);
			append_dev(div0, button);
			append_dev(button, t6);
			append_dev(div1, t7);
			append_dev(div1, a);
			append_dev(a, t8);
		},
		p: function update(ctx, [dirty]) {
			if (/*errorMessage*/ ctx[2]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3$4(ctx);
					if_block0.c();
					if_block0.m(div2, t2);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*showGithubOAuth*/ ctx[0] || /*showGitlabOAuth*/ ctx[1]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$e(ctx);
					if_block1.c();
					if_block1.m(div2, t3);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*$_*/ 16 && input0_placeholder_value !== (input0_placeholder_value = /*$_*/ ctx[4]("login.email"))) {
				attr_dev(input0, "placeholder", input0_placeholder_value);
			}

			if (dirty & /*$_*/ 16 && input1_placeholder_value !== (input1_placeholder_value = /*$_*/ ctx[4]("login.password"))) {
				attr_dev(input1, "placeholder", input1_placeholder_value);
			}

			if (dirty & /*$_*/ 16 && t6_value !== (t6_value = /*$_*/ ctx[4]("login.login") + "")) set_data_dev(t6, t6_value);
			if (dirty & /*$_*/ 16 && t8_value !== (t8_value = /*$_*/ ctx[4]("login.register") + "")) set_data_dev(t8, t8_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$j.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const backendUrl$7 = "http://localhost:8080";

function instance$j($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(4, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Login', slots, []);
	let showGithubOAuth;
	let showGitlabOAuth;
	let errorMessage = "";
	let errorMessageKey = "undefinedError";
	let isLoggedIn = false;

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		$$invalidate(2, errorMessage = params.get("exception"));

		switch (errorMessage) {
			case "LockedException":
				$$invalidate(3, errorMessageKey = "accountLocked");
				break;
			case "DisabledException":
				$$invalidate(3, errorMessageKey = "accountDisabled");
				break;
			case "BadCredentialsException":
				$$invalidate(3, errorMessageKey = "invalidCredentials");
				break;
			case "AccountExpiredException":
				$$invalidate(3, errorMessageKey = "accountExpired");
				break;
		}

		try {
			const response = await fetch(backendUrl$7 + "/api/loginOptions", {
				method: "GET",
				headers: { Accept: "application/json" }
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			$$invalidate(0, showGithubOAuth = data.github);
			$$invalidate(1, showGitlabOAuth = data.gitlab);
		} catch(e) {
			console.error(e.message);
		}
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Login> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		_: $format,
		GitHubIcon: img$g,
		GitLabIcon: img$f,
		backendUrl: backendUrl$7,
		showGithubOAuth,
		showGitlabOAuth,
		errorMessage,
		errorMessageKey,
		isLoggedIn,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('showGithubOAuth' in $$props) $$invalidate(0, showGithubOAuth = $$props.showGithubOAuth);
		if ('showGitlabOAuth' in $$props) $$invalidate(1, showGitlabOAuth = $$props.showGitlabOAuth);
		if ('errorMessage' in $$props) $$invalidate(2, errorMessage = $$props.errorMessage);
		if ('errorMessageKey' in $$props) $$invalidate(3, errorMessageKey = $$props.errorMessageKey);
		if ('isLoggedIn' in $$props) isLoggedIn = $$props.isLoggedIn;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [showGithubOAuth, showGitlabOAuth, errorMessage, errorMessageKey, $_];
}

class Login extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$j, create_fragment$j, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Login",
			options,
			id: create_fragment$j.name
		});
	}
}

var img$e = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' width='860.13137' height='571.14799' viewBox='0 0 860.13137 571.14799' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cpath d='M605.66974%2c324.95306c-7.66934-12.68446-16.7572-26.22768-30.98954-30.36953-16.482-4.7965-33.4132%2c4.73193-47.77473%2c14.13453a1392.15692%2c1392.15692%2c0%2c0%2c0-123.89338%2c91.28311l.04331.49238q46.22556-3.1878%2c92.451-6.37554c22.26532-1.53546%2c45.29557-3.2827%2c64.97195-13.8156%2c7.46652-3.99683%2c14.74475-9.33579%2c23.20555-9.70782%2c10.51175-.46217%2c19.67733%2c6.87923%2c26.8802%2c14.54931%2c42.60731%2c45.371%2c54.937%2c114.75409%2c102.73817%2c154.61591A1516.99453%2c1516.99453%2c0%2c0%2c0%2c605.66974%2c324.95306Z' transform='translate(-169.93432 -164.42601)' fill='%23f2f2f2'/%3e%3cpath d='M867.57068%2c709.78146c-4.71167-5.94958-6.6369-7.343-11.28457-13.34761q-56.7644-73.41638-106.70791-151.79237-33.92354-53.23-64.48275-108.50439-14.54864-26.2781-28.29961-52.96872-10.67044-20.6952-20.8646-41.63793c-1.94358-3.98782-3.8321-7.99393-5.71122-12.00922-4.42788-9.44232-8.77341-18.93047-13.43943-28.24449-5.31686-10.61572-11.789-21.74485-21.55259-28.877a29.40493%2c29.40493%2c0%2c0%2c0-15.31855-5.89458c-7.948-.51336-15.28184%2c2.76855-22.17568%2c6.35295-50.43859%2c26.301-97.65922%2c59.27589-140.3696%2c96.79771A730.77816%2c730.77816%2c0%2c0%2c0%2c303.32241%2c496.24719c-1.008%2c1.43927-3.39164.06417-2.37419-1.38422q6.00933-8.49818%2c12.25681-16.81288A734.817%2c734.817%2c0%2c0%2c1%2c500.80465%2c303.06436q18.24824-11.82581%2c37.18269-22.54245c6.36206-3.60275%2c12.75188-7.15967%2c19.25136-10.49653%2c6.37146-3.27274%2c13.13683-6.21547%2c20.41563-6.32547%2c24.7701-.385%2c37.59539%2c27.66695%2c46.40506%2c46.54248q4.15283%2c8.9106%2c8.40636%2c17.76626%2c16.0748%2c33.62106%2c33.38729%2c66.628%2c10.68453%2c20.379%2c21.83683%2c40.51955%2c34.7071%2c62.71816%2c73.77854%2c122.897c34.5059%2c53.1429%2c68.73651%2c100.08874%2c108.04585%2c149.78472C870.59617%2c709.21309%2c868.662%2c711.17491%2c867.57068%2c709.78146Z' transform='translate(-169.93432 -164.42601)' fill='%23e4e4e4'/%3e%3cpath d='M414.91613%2c355.804c-1.43911-1.60428-2.86927-3.20856-4.31777-4.81284-11.42244-12.63259-23.6788-25.11847-39.3644-32.36067a57.11025%2c57.11025%2c0%2c0%2c0-23.92679-5.54622c-8.56213.02753-16.93178%2c2.27348-24.84306%2c5.41792-3.74034%2c1.49427-7.39831%2c3.1902-11.00078%2c4.99614-4.11634%2c2.07182-8.15927%2c4.28118-12.1834%2c6.50883q-11.33112%2c6.27044-22.36816%2c13.09089-21.9606%2c13.57221-42.54566%2c29.21623-10.67111%2c8.11311-20.90174%2c16.75788-9.51557%2c8.03054-18.64618%2c16.492c-1.30169%2c1.20091-3.24527-.74255-1.94358-1.94347%2c1.60428-1.49428%2c3.22691-2.97938%2c4.84955-4.44613q6.87547-6.21546%2c13.9712-12.19257%2c12.93921-10.91827%2c26.54851-20.99312%2c21.16293-15.67614%2c43.78288-29.22541%2c11.30361-6.76545%2c22.91829-12.96259c2.33794-1.24675%2c4.70318-2.466%2c7.09572-3.6211a113.11578%2c113.11578%2c0%2c0%2c1%2c16.86777-6.86632%2c60.0063%2c60.0063%2c0%2c0%2c1%2c25.476-2.50265%2c66.32706%2c66.32706%2c0%2c0%2c1%2c23.50512%2c8.1314c15.40091%2c8.60812%2c27.34573%2c21.919%2c38.97%2c34.90915C418.03337%2c355.17141%2c416.09875%2c357.12405%2c414.91613%2c355.804Z' transform='translate(-169.93432 -164.42601)' fill='%23e4e4e4'/%3e%3cpath d='M730.47659%2c486.71092l36.90462-13.498%2c18.32327-6.70183c5.96758-2.18267%2c11.92082-4.66747%2c18.08988-6.23036a28.53871%2c28.53871%2c0%2c0%2c1%2c16.37356.20862%2c37.73753%2c37.73753%2c0%2c0%2c1%2c12.771%2c7.91666%2c103.63965%2c103.63965%2c0%2c0%2c1%2c10.47487%2c11.18643c3.98932%2c4.79426%2c7.91971%2c9.63877%2c11.86772%2c14.46706q24.44136%2c29.89094%2c48.56307%2c60.04134%2c24.12117%2c30.14991%2c47.91981%2c60.556%2c23.85681%2c30.48041%2c47.38548%2c61.21573%2c2.88229%2c3.76518%2c5.75966%2c7.53415c1.0598%2c1.38809%2c3.44949.01962%2c2.37472-1.38808Q983.582%2c650.9742%2c959.54931%2c620.184q-24.09177-30.86383-48.51647-61.46586-24.42421-30.60141-49.17853-60.93743-6.16706-7.55761-12.35445-15.09858c-3.47953-4.24073-6.91983-8.52718-10.73628-12.47427-7.00539-7.24516-15.75772-13.64794-26.23437-13.82166-6.15972-.10214-12.121%2c1.85248-17.844%2c3.92287-6.16968%2c2.232-12.32455%2c4.50571-18.48633%2c6.75941l-37.16269%2c13.59243-9.29067%2c3.3981c-1.64875.603-.93651%2c3.2619.73111%2c2.652Z' transform='translate(-169.93432 -164.42601)' fill='%23e4e4e4'/%3e%3cpath d='M366.37741%2c334.52609c-18.75411-9.63866-42.77137-7.75087-60.00508%2c4.29119a855.84708%2c855.84708%2c0%2c0%2c1%2c97.37056%2c22.72581C390.4603%2c353.75916%2c380.07013%2c341.5635%2c366.37741%2c334.52609Z' transform='translate(-169.93432 -164.42601)' fill='%23f2f2f2'/%3e%3cpath d='M306.18775%2c338.7841l-3.61042%2c2.93462c1.22123-1.02713%2c2.4908-1.99013%2c3.795-2.90144C306.31073%2c338.80665%2c306.24935%2c338.79473%2c306.18775%2c338.7841Z' transform='translate(-169.93432 -164.42601)' fill='%23f2f2f2'/%3e%3cpath d='M831.54929%2c486.84576c-3.6328-4.42207-7.56046-9.05222-12.99421-10.84836l-5.07308.20008A575.436%2c575.436%2c0%2c0%2c0%2c966.74929%2c651.418Q899.14929%2c569.13192%2c831.54929%2c486.84576Z' transform='translate(-169.93432 -164.42601)' fill='%23f2f2f2'/%3e%3cpath d='M516.08388%2c450.36652A37.4811%2c37.4811%2c0%2c0%2c0%2c531.015%2c471.32518c2.82017%2c1.92011%2c6.15681%2c3.76209%2c7.12158%2c7.03463a8.37858%2c8.37858%2c0%2c0%2c1-.87362%2c6.1499%2c24.88351%2c24.88351%2c0%2c0%2c1-3.86126%2c5.04137l-.13667.512c-6.99843-4.14731-13.65641-9.3934-17.52227-16.55115s-4.40553-16.53895.34116-23.14544' transform='translate(-169.93432 -164.42601)' fill='%23f2f2f2'/%3e%3cpath d='M749.08388%2c653.36652A37.4811%2c37.4811%2c0%2c0%2c0%2c764.015%2c674.32518c2.82017%2c1.92011%2c6.15681%2c3.76209%2c7.12158%2c7.03463a8.37858%2c8.37858%2c0%2c0%2c1-.87362%2c6.1499%2c24.88351%2c24.88351%2c0%2c0%2c1-3.86126%2c5.04137l-.13667.512c-6.99843-4.14731-13.65641-9.3934-17.52227-16.55115s-4.40553-16.53895.34116-23.14544' transform='translate(-169.93432 -164.42601)' fill='%23f2f2f2'/%3e%3cpath d='M284.08388%2c639.36652A37.4811%2c37.4811%2c0%2c0%2c0%2c299.015%2c660.32518c2.82017%2c1.92011%2c6.15681%2c3.76209%2c7.12158%2c7.03463a8.37858%2c8.37858%2c0%2c0%2c1-.87362%2c6.1499%2c24.88351%2c24.88351%2c0%2c0%2c1-3.86126%2c5.04137l-.13667.512c-6.99843-4.14731-13.65641-9.3934-17.52227-16.55115s-4.40553-16.53895.34116-23.14544' transform='translate(-169.93432 -164.42601)' fill='%23f2f2f2'/%3e%3ccircle cx='649.24878' cy='51' r='51' fill='%233bd461'/%3e%3cpath d='M911.21851%2c176.29639c-24.7168-3.34094-52.93512%2c10.01868-59.34131%2c34.12353a21.59653%2c21.59653%2c0%2c0%2c0-41.09351%2c2.10871l2.82972%2c2.02667a372.27461%2c372.27461%2c0%2c0%2c0%2c160.65881-.72638C957.07935%2c195.76%2c935.93537%2c179.63727%2c911.21851%2c176.29639Z' transform='translate(-169.93432 -164.42601)' fill='%23f0f0f0'/%3e%3cpath d='M805.21851%2c244.29639c-24.7168-3.34094-52.93512%2c10.01868-59.34131%2c34.12353a21.59653%2c21.59653%2c0%2c0%2c0-41.09351%2c2.10871l2.82972%2c2.02667a372.27461%2c372.27461%2c0%2c0%2c0%2c160.65881-.72638C851.07935%2c263.76%2c829.93537%2c247.63727%2c805.21851%2c244.29639Z' transform='translate(-169.93432 -164.42601)' fill='%23f0f0f0'/%3e%3cpath d='M1020.94552%2c257.15423a.98189.98189%2c0%2c0%2c1-.30176-.04688C756.237%2c173.48919%2c523.19942%2c184.42376%2c374.26388%2c208.32122c-20.26856%2c3.251-40.59131%2c7.00586-60.40381%2c11.16113-5.05811%2c1.05957-10.30567%2c2.19532-15.59668%2c3.37793-6.31885%2c1.40723-12.55371%2c2.85645-18.53223%2c4.30567q-3.873.917-7.59472%2c1.84863c-3.75831.92773-7.57178%2c1.89453-11.65967%2c2.957-4.56787%2c1.17774-9.209%2c2.41309-13.79737%2c3.67188a.44239.44239%2c0%2c0%2c1-.05127.01465l.00049.001c-5.18261%2c1.415-10.33789%2c2.8711-15.32324%2c4.3252-2.69824.77929-5.30371%2c1.54785-7.79932%2c2.30664-.2788.07715-.52587.15136-.77636.22754l-.53614.16308c-.31054.09473-.61718.1875-.92382.27539l-.01953.00586.00048.001-.81152.252c-.96777.293-1.91211.5791-2.84082.86426-24.54492%2c7.56641-38.03809%2c12.94922-38.17139%2c13.00195a1%2c1%2c0%2c1%2c1-.74414-1.85644c.13428-.05274%2c13.69336-5.46289%2c38.32764-13.05762.93213-.28613%2c1.87891-.57226%2c2.84961-.86621l.7539-.23438c.02588-.00976.05176-.01757.07813-.02539.30518-.08691.60986-.17968.91943-.27343l.53711-.16309c.26758-.08105.53125-.16113.80127-.23535%2c2.47852-.75391%2c5.09278-1.52441%2c7.79785-2.30664%2c4.98731-1.45508%2c10.14746-2.91113%2c15.334-4.32813.01611-.00586.03271-.00976.04883-.01464v-.001c4.60449-1.2627%2c9.26269-2.50293%2c13.84521-3.68457%2c4.09424-1.06348%2c7.915-2.03223%2c11.67969-2.96192q3.73755-.93017%2c7.60937-1.85253c5.98536-1.45118%2c12.23291-2.90235%2c18.563-4.3125%2c5.29932-1.1836%2c10.55567-2.32227%2c15.62207-3.38282%2c19.84326-4.16211%2c40.19776-7.92285%2c60.49707-11.17871C523.09591%2c182.415%2c756.46749%2c171.46282%2c1021.2463%2c255.2011a.99974.99974%2c0%2c0%2c1-.30078%2c1.95313Z' transform='translate(-169.93432 -164.42601)' fill='%23ccc'/%3e%3cpath d='M432.92309%2c584.266a6.72948%2c6.72948%2c0%2c0%2c0-1.7-2.67%2c6.42983%2c6.42983%2c0%2c0%2c0-.92-.71c-2.61-1.74-6.51-2.13-8.99%2c0a5.81012%2c5.81012%2c0%2c0%2c0-.69.71q-1.11%2c1.365-2.28%2c2.67c-1.28%2c1.46-2.59%2c2.87-3.96%2c4.24-.39.38-.78.77-1.18%2c1.15-.23.23-.46.45-.69.67-.88.84-1.78%2c1.65-2.69%2c2.45-.48.43-.96.85-1.45%2c1.26-.73.61-1.46%2c1.22-2.2%2c1.81-.07.05-.14.1-.21.16-.02.01-.03.03-.05.04-.01%2c0-.02%2c0-.03.02a.17861.17861%2c0%2c0%2c0-.07.05c-.22.15-.37.25-.48.34.04-.01995.08-.05.12-.07-.18.14-.37.28-.55.42-1.75%2c1.29-3.54%2c2.53-5.37%2c3.69a99.21022%2c99.21022%2c0%2c0%2c1-14.22%2c7.55c-.33.13-.67.27-1.01.4a85.96993%2c85.96993%2c0%2c0%2c1-40.85%2c6.02q-2.13008-.165-4.26-.45c-1.64-.24-3.27-.53-4.89-.86a97.93186%2c97.93186%2c0%2c0%2c1-18.02-5.44%2c118.65185%2c118.65185%2c0%2c0%2c1-20.66-12.12c-1-.71-2.01-1.42-3.02-2.11%2c1.15-2.82%2c2.28-5.64%2c3.38-8.48.55-1.37%2c1.08-2.74%2c1.6-4.12%2c4.09-10.63%2c7.93-21.36%2c11.61-32.13q5.58-16.365%2c10.53-32.92.51-1.68.99-3.36%2c2.595-8.745%2c4.98-17.53c.15-.56994.31-1.12994.45-1.7q.68994-2.52%2c1.35-5.04c1-3.79-1.26-8.32-5.24-9.23a7.63441%2c7.63441%2c0%2c0%2c0-9.22%2c5.24c-.43%2c1.62-.86%2c3.23-1.3%2c4.85q-3.165%2c11.74494-6.66%2c23.41-.51%2c1.68-1.02%2c3.36-7.71%2c25.41-16.93%2c50.31-1.11%2c3.015-2.25%2c6.01c-.37.98-.74%2c1.96-1.12%2c2.94-.73%2c1.93-1.48%2c3.86-2.23%2c5.79-.43006%2c1.13-.87006%2c2.26-1.31%2c3.38-.29.71-.57%2c1.42-.85%2c2.12a41.80941%2c41.80941%2c0%2c0%2c0-8.81-2.12l-.48-.06a27.397%2c27.397%2c0%2c0%2c0-7.01.06%2c23.91419%2c23.91419%2c0%2c0%2c0-17.24%2c10.66c-4.77%2c7.51-4.71%2c18.25%2c1.98%2c24.63%2c6.89%2c6.57%2c17.32%2c6.52%2c25.43%2c2.41a28.35124%2c28.35124%2c0%2c0%2c0%2c10.52-9.86%2c50.56939%2c50.56939%2c0%2c0%2c0%2c2.74-4.65c.21.14.42.28.63.43.8.56%2c1.6%2c1.13%2c2.39%2c1.69a111.73777%2c111.73777%2c0%2c0%2c0%2c14.51%2c8.91%2c108.35887%2c108.35887%2c0%2c0%2c0%2c34.62%2c10.47c.27.03.53.07.8.1%2c1.33.17%2c2.67.3%2c4.01.41a103.78229%2c103.78229%2c0%2c0%2c0%2c55.58-11.36q2.175-1.125%2c4.31-2.36%2c3.315-1.92%2c6.48-4.08c1.15-.78%2c2.27-1.57%2c3.38-2.4a101.04244%2c101.04244%2c0%2c0%2c0%2c13.51-11.95q2.35491-2.475%2c4.51-5.11005a8.0612%2c8.0612%2c0%2c0%2c0%2c2.2-5.3A7.5644%2c7.5644%2c0%2c0%2c0%2c432.92309%2c584.266Zm-165.59%2c23.82c.21-.15.42-.31.62-.47C267.89312%2c607.766%2c267.60308%2c607.936%2c267.33312%2c608.086Zm3.21-3.23c-.23.26-.44.52-.67.78a23.36609%2c23.36609%2c0%2c0%2c1-2.25%2c2.2c-.11.1-.23.2-.35.29a.00976.00976%2c0%2c0%2c0-.01.01%2c3.80417%2c3.80417%2c0%2c0%2c0-.42005.22q-.645.39-1.31994.72a17.00459%2c17.00459%2c0%2c0%2c1-2.71.75%2c16.79925%2c16.79925%2c0%2c0%2c1-2.13.02h-.02a14.82252%2c14.82252%2c0%2c0%2c1-1.45-.4c-.24-.12-.47-.25994-.7-.4-.09-.08-.17005-.16-.22-.21a2.44015%2c2.44015%2c0%2c0%2c1-.26995-.29.0098.0098%2c0%2c0%2c0-.01-.01c-.11005-.2-.23005-.4-.34-.6a.031.031%2c0%2c0%2c1-.01-.02c-.08-.25-.15-.51-.21-.77a12.51066%2c12.51066%2c0%2c0%2c1%2c.01-1.37%2c13.4675%2c13.4675%2c0%2c0%2c1%2c.54-1.88%2c11.06776%2c11.06776%2c0%2c0%2c1%2c.69-1.26c.02-.04.12-.2.23-.38.01-.01.01-.01.01-.02.15-.17.3-.35.46-.51.27-.3.56-.56.85-.83a18.02212%2c18.02212%2c0%2c0%2c1%2c1.75-1.01%2c19.48061%2c19.48061%2c0%2c0%2c1%2c2.93-.79%2c24.98945%2c24.98945%2c0%2c0%2c1%2c4.41.04%2c30.30134%2c30.30134%2c0%2c0%2c1%2c4.1%2c1.01%2c36.94452%2c36.94452%2c0%2c0%2c1-2.77%2c4.54C270.6231%2c604.746%2c270.58312%2c604.806%2c270.54308%2c604.856Zm-11.12-3.29a2.18029%2c2.18029%2c0%2c0%2c1-.31.38995A1.40868%2c1.40868%2c0%2c0%2c1%2c259.42309%2c601.566Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3cpath d='M402.86309%2c482.136q-.13494%2c4.71-.27%2c9.42-.285%2c10.455-.59%2c20.92-.315%2c11.775-.66%2c23.54-.165%2c6.07507-.34%2c12.15-.465%2c16.365-.92%2c32.72c-.03%2c1.13-.07%2c2.25-.1%2c3.38q-.225%2c8.11506-.45%2c16.23-.255%2c8.805-.5%2c17.61-.18%2c6.59994-.37%2c13.21-1.34994%2c47.895-2.7%2c95.79a7.64844%2c7.64844%2c0%2c0%2c1-7.5%2c7.5%2c7.56114%2c7.56114%2c0%2c0%2c1-7.5-7.5q.75-26.94%2c1.52-53.88.675-24.36%2c1.37-48.72.225-8.025.45-16.06.345-12.09.68-24.18c.03-1.13.07-2.25.1-3.38.02-.99.05-1.97.08-2.96q.66-23.475%2c1.32-46.96.27-9.24.52-18.49.3-10.545.6-21.08c.09-3.09.17005-6.17.26-9.26a7.64844%2c7.64844%2c0%2c0%2c1%2c7.5-7.5A7.56116%2c7.56116%2c0%2c0%2c1%2c402.86309%2c482.136Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3cpath d='M814.29118%2c484.2172a893.23753%2c893.23753%2c0%2c0%2c1-28.16112%2c87.94127c-3.007%2c7.94641-6.08319%2c15.877-9.3715%2c23.71185l.75606-1.7916a54.58274%2c54.58274%2c0%2c0%2c1-5.58953%2c10.61184q-.22935.32119-.46685.63642%2c1.16559-1.49043.4428-.589c-.25405.30065-.5049.60219-.7676.89546a23.66436%2c23.66436%2c0%2c0%2c1-2.2489%2c2.20318q-.30139.25767-.61188.5043l.93783-.729c-.10884.25668-.87275.59747-1.11067.74287a18.25362%2c18.25362%2c0%2c0%2c1-2.40479%2c1.21853l1.7916-.75606a19.0859%2c19.0859%2c0%2c0%2c1-4.23122%2c1.16069l1.9938-.26791a17.02055%2c17.02055%2c0%2c0%2c1-4.29785.046l1.99379.2679a14.0022%2c14.0022%2c0%2c0%2c1-3.40493-.917l1.79159.75606a12.01175%2c12.01175%2c0%2c0%2c1-1.67882-.89614c-.27135-.17688-1.10526-.80852-.01487.02461%2c1.13336.86595.14562.07434-.08763-.15584-.19427-.19171-.36962-.4-.55974-.595-.88208-.90454.99637%2c1.55662.39689.49858a18.18179%2c18.18179%2c0%2c0%2c1-.87827-1.63672l.75606%2c1.7916a11.92493%2c11.92493%2c0%2c0%2c1-.728-2.65143l.26791%2c1.9938a13.65147%2c13.65147%2c0%2c0%2c1-.00316-3.40491l-.2679%2c1.9938a15.96371%2c15.96371%2c0%2c0%2c1%2c.99486-3.68011l-.75606%2c1.7916a16.72914%2c16.72914%2c0%2c0%2c1%2c1.17794-2.29848%2c6.72934%2c6.72934%2c0%2c0%2c1%2c.72851-1.0714c.04915.01594-1.26865%2c1.51278-.56937.757.1829-.19767.354-.40592.539-.602.29617-.31382.61354-.60082.92561-.89791%2c1.04458-.99442-1.46188.966-.25652.17907a19.0489%2c19.0489%2c0%2c0%2c1%2c2.74925-1.49923l-1.79159.75606a20.31136%2c20.31136%2c0%2c0%2c1%2c4.99523-1.33984l-1.9938.2679a25.62828%2c25.62828%2c0%2c0%2c1%2c6.46062.07647l-1.9938-.2679a33.21056%2c33.21056%2c0%2c0%2c1%2c7.89178%2c2.2199l-1.7916-.75606c5.38965%2c2.31383%2c10.16308%2c5.74926%2c14.928%2c9.118a111.94962%2c111.94962%2c0%2c0%2c0%2c14.50615%2c8.9065%2c108.38849%2c108.38849%2c0%2c0%2c0%2c34.62226%2c10.47371%2c103.93268%2c103.93268%2c0%2c0%2c0%2c92.58557-36.75192%2c8.07773%2c8.07773%2c0%2c0%2c0%2c2.1967-5.3033%2c7.63232%2c7.63232%2c0%2c0%2c0-2.1967-5.3033c-2.75154-2.52586-7.94926-3.239-10.6066%2c0a95.63575%2c95.63575%2c0%2c0%2c1-8.10664%2c8.72692q-2.01736%2c1.914-4.14232%2c3.70983-1.21364%2c1.02588-2.46086%2c2.01121c-.3934.31081-1.61863%2c1.13807.26309-.19744-.43135.30614-.845.64036-1.27058.95478a99.26881%2c99.26881%2c0%2c0%2c1-20.33215%2c11.56478l1.79159-.75606a96.8364%2c96.8364%2c0%2c0%2c1-24.17119%2c6.62249l1.99379-.2679a97.64308%2c97.64308%2c0%2c0%2c1-25.75362-.03807l1.99379.2679a99.79982%2c99.79982%2c0%2c0%2c1-24.857-6.77027l1.7916.75607a116.02515%2c116.02515%2c0%2c0%2c1-21.7364-12.59112%2c86.87725%2c86.87725%2c0%2c0%2c0-11.113-6.99417%2c42.8238%2c42.8238%2c0%2c0%2c0-14.43784-4.38851c-9.43884-1.11076-19.0571%2c2.56562-24.24624%2c10.72035-4.77557%2c7.50482-4.71394%2c18.24362%2c1.97369%2c24.62519%2c6.8877%2c6.5725%2c17.31846%2c6.51693%2c25.43556%2c2.40567%2c7.81741-3.95946%2c12.51288-12.18539%2c15.815-19.94186%2c7.43109-17.45514%2c14.01023-35.31364%2c20.1399-53.263q9.09651-26.63712%2c16.49855-53.81332.91661-3.36581%2c1.80683-6.73869c1.001-3.78869-1.26094-8.32-5.23829-9.22589a7.63317%2c7.63317%2c0%2c0%2c0-9.22589%2c5.23829Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3cpath d='M889.12382%2c482.13557l-2.69954%2c95.79311-2.68548%2c95.29418-1.5185%2c53.88362a7.56465%2c7.56465%2c0%2c0%2c0%2c7.5%2c7.5%2c7.64923%2c7.64923%2c0%2c0%2c0%2c7.5-7.5l2.69955-95.79311%2c2.68548-95.29418%2c1.51849-53.88362a7.56465%2c7.56465%2c0%2c0%2c0-7.5-7.5%2c7.64923%2c7.64923%2c0%2c0%2c0-7.5%2c7.5Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3cpath d='M629.52566%2c700.36106h2.32885V594.31942h54.32863v-2.32291H631.85451V547.25214H673.8102q-.92256-1.17339-1.89893-2.31694H631.85451V515.38231c-.7703-.32846-1.54659-.64493-2.32885-.9435V544.9352h-45.652V507.07c-.78227.03583-1.55258.08959-2.3289.15527v37.71h-36.4201V516.68409c-.78227.34636-1.55258.71061-2.31694%2c1.0928V544.9352h-30.6158v2.31694h30.6158v44.74437h-30.6158v2.32291h30.6158V700.36106h2.31694V594.31942a36.41283%2c36.41283%2c0%2c0%2c1%2c36.4201%2c36.42007v69.62157h2.3289V594.31942h45.652Zm-84.401-108.36455V547.25214h36.4201v44.74437Zm38.749%2c0V547.25214h.91362a44.74135%2c44.74135%2c0%2c0%2c1%2c44.73842%2c44.74437Z' transform='translate(-169.93432 -164.42601)' opacity='0.2'/%3e%3cpath d='M615.30309%2c668.566a63.05854%2c63.05854%2c0%2c0%2c1-20.05%2c33.7c-.74.64-1.48%2c1.26-2.25%2c1.87q-2.805.25506-5.57.52c-1.53.14-3.04.29-4.54.43l-.27.03-.19-1.64-.76-6.64a37.623%2c37.623%2c0%2c0%2c1-3.3-32.44c2.64-7.12%2c7.42-13.41%2c12.12-19.65%2c6.49-8.62%2c12.8-17.14%2c13.03-27.65a60.54415%2c60.54415%2c0%2c0%2c1%2c7.9%2c13.33%2c16.432%2c16.432%2c0%2c0%2c0-5.12%2c3.76995c-.41.45-.82%2c1.08-.54%2c1.62006.24.46.84.57%2c1.36.62994%2c1.25.13%2c2.51.26%2c3.76.39%2c1%2c.11%2c2%2c.21%2c3%2c.32a63.99025%2c63.99025%2c0%2c0%2c1%2c2.45%2c12.18A61.18851%2c61.18851%2c0%2c0%2c1%2c615.30309%2c668.566Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3cpath d='M648.50311%2c642.356c-5.9%2c4.29-9.35%2c10.46-12.03%2c17.26a16.62776%2c16.62776%2c0%2c0%2c0-7.17%2c4.58c-.41.45-.82%2c1.08-.54%2c1.62006.24.46.84.57%2c1.36.62994%2c1.25.13%2c2.51.26%2c3.76.39-2.68%2c8.04-5.14%2c16.36-9.88%2c23.15a36.98942%2c36.98942%2c0%2c0%2c1-12.03%2c10.91%2c38.49166%2c38.49166%2c0%2c0%2c1-4.02%2c1.99q-7.62.585-14.95%2c1.25-2.805.25506-5.57.52c-1.53.14-3.04.29-4.54.43q-.015-.825%2c0-1.65a63.30382%2c63.30382%2c0%2c0%2c1%2c15.25-39.86c.45-.52.91-1.03%2c1.38-1.54a61.7925%2c61.7925%2c0%2c0%2c1%2c16.81-12.7A62.65425%2c62.65425%2c0%2c0%2c1%2c648.50311%2c642.356Z' transform='translate(-169.93432 -164.42601)' fill='%233bd461'/%3e%3cpath d='M589.16308%2c699.526l-1.15%2c3.4-.58%2c1.73c-1.53.14-3.04.29-4.54.43l-.27.03c-1.66.17-3.31.34-4.96.51-.43-.5-.86-1.01-1.28-1.53a62.03045%2c62.03045%2c0%2c0%2c1%2c8.07-87.11c-1.32%2c6.91.22%2c13.53%2c2.75%2c20.1-.27.11-.53.22-.78.34a16.432%2c16.432%2c0%2c0%2c0-5.12%2c3.76995c-.41.45-.82%2c1.08-.54%2c1.62006.24.46.84.57%2c1.36.62994%2c1.25.13%2c2.51.26%2c3.76.39%2c1%2c.11%2c2%2c.21%2c3%2c.32q.705.075%2c1.41.15c.07.15.13.29.2.44%2c2.85%2c6.18%2c5.92%2c12.39%2c7.65%2c18.83a43.66591%2c43.66591%2c0%2c0%2c1%2c1.02%2c4.91A37.604%2c37.604%2c0%2c0%2c1%2c589.16308%2c699.526Z' transform='translate(-169.93432 -164.42601)' fill='%233bd461'/%3e%3cpath d='M689.82123%2c554.48655c-8.60876-16.79219-21.94605-30.92088-37.63219-41.30357a114.2374%2c114.2374%2c0%2c0%2c0-52.5626-18.37992q-3.69043-.33535-7.399-.39281c-2.92141-.04371-46.866%2c12.63176-61.58712%2c22.98214a114.29462%2c114.29462%2c0%2c0%2c0-35.333%2c39.527%2c102.49972%2c102.49972%2c0%2c0%2c0-12.12557%2c51.6334%2c113.56387%2c113.56387%2c0%2c0%2c0%2c14.70268%2c51.47577%2c110.47507%2c110.47507%2c0%2c0%2c0%2c36.44425%2c38.74592C549.66655%2c708.561%2c565.07375%2c734.51%2c583.1831%2c735.426c18.24576.923%2c39.05418-23.55495%2c55.6951-30.98707a104.42533%2c104.42533%2c0%2c0%2c0%2c41.72554-34.005%2c110.24964%2c110.24964%2c0%2c0%2c0%2c19.599-48.94777c2.57368-18.08313%2c1.37415-36.73271-4.80123-54.01627a111.85969%2c111.85969%2c0%2c0%2c0-5.58024-12.9833c-1.77961-3.50519-6.996-4.7959-10.26142-2.69063a7.67979%2c7.67979%2c0%2c0%2c0-2.69064%2c10.26142q1.56766%2c3.08773%2c2.91536%2c6.27758l-.75606-1.7916a101.15088%2c101.15088%2c0%2c0%2c1%2c6.87641%2c25.53816l-.26791-1.99379a109.2286%2c109.2286%2c0%2c0%2c1-.06613%2c28.68252l.26791-1.9938a109.73379%2c109.73379%2c0%2c0%2c1-7.55462%2c27.67419l.75606-1.79159a104.212%2c104.212%2c0%2c0%2c1-6.67151%2c13.09835q-1.92308%2c3.18563-4.08062%2c6.22159c-.63172.8881-1.28287%2c1.761-1.939%2c2.63114-.85625%2c1.13555%2c1.16691-1.48321.28228-.36941-.15068.18972-.30049.3801-.45182.5693q-.68121.85165-1.3818%2c1.68765a93.61337%2c93.61337%2c0%2c0%2c1-10.17647%2c10.38359q-1.36615%2c1.19232-2.77786%2c2.33115c-.46871.37832-.932.77269-1.42079%2c1.12472.01861-.0134%2c1.57956-1.19945.65556-.511-.2905.21644-.57851.43619-.86961.65184q-2.90994%2c2.1558-5.97433%2c4.092a103.48509%2c103.48509%2c0%2c0%2c1-14.75565%2c7.7131l1.7916-.75606a109.21493%2c109.21493%2c0%2c0%2c1-27.59663%2c7.55154l1.9938-.26791a108.15361%2c108.15361%2c0%2c0%2c1-28.58907.0506l1.99379.2679a99.835%2c99.835%2c0%2c0%2c1-25.09531-6.78448l1.79159.75607a93.64314%2c93.64314%2c0%2c0%2c1-13.41605-6.99094q-3.17437-2-6.18358-4.24743c-.2862-.21359-.56992-.43038-.855-.64549-.9155-.69088.65765.50965.67021.51787a19.16864%2c19.16864%2c0%2c0%2c1-1.535-1.22469q-1.45353-1.18358-2.86136-2.4218a101.98931%2c101.98931%2c0%2c0%2c1-10.49319-10.70945q-1.21308-1.43379-2.37407-2.91054c-.33524-.4263-.9465-1.29026.40424.5289-.17775-.23939-.36206-.47414-.54159-.71223q-.64657-.85751-1.27568-1.72793-2.203-3.048-4.18787-6.24586a109.29037%2c109.29037%2c0%2c0%2c1-7.8054-15.10831l.75606%2c1.7916a106.58753%2c106.58753%2c0%2c0%2c1-7.34039-26.837l.26791%2c1.9938a97.86589%2c97.86589%2c0%2c0%2c1-.04843-25.63587l-.2679%2c1.9938A94.673%2c94.673%2c0%2c0%2c1%2c505.27587%2c570.55l-.75606%2c1.7916a101.55725%2c101.55725%2c0%2c0%2c1%2c7.19519-13.85624q2.0655-3.32328%2c4.37767-6.4847.52528-.71832%2c1.06244-1.42786c.324-.4279%2c1.215-1.49333-.30537.38842.14906-.18449.29252-.37428.43942-.56041q1.26882-1.60756%2c2.59959-3.1649A107.40164%2c107.40164%2c0%2c0%2c1%2c530.772%2c536.21508q1.47408-1.29171%2c2.99464-2.52906.6909-.56218%2c1.39108-1.11284c.18664-.14673.37574-.29073.56152-.43858-1.99743%2c1.58953-.555.43261-.10157.09288q3.13393-2.34833%2c6.43534-4.46134a103.64393%2c103.64393%2c0%2c0%2c1%2c15.38655-8.10791l-1.7916.75606c7.76008-3.25839%2c42.14086-10.9492%2c48.394-10.10973l-1.99379-.26791A106.22471%2c106.22471%2c0%2c0%2c1%2c628.768%2c517.419l-1.7916-.75606a110.31334%2c110.31334%2c0%2c0%2c1%2c12.6002%2c6.32922q3.04344%2c1.78405%2c5.96742%2c3.76252%2c1.38351.93658%2c2.73809%2c1.915.677.48917%2c1.34626.98885c.24789.185.49386.37253.74135.558%2c1.03924.779-1.43148-1.1281-.34209-.26655a110.84261%2c110.84261%2c0%2c0%2c1%2c10.36783%2c9.2532q2.401%2c2.445%2c4.63686%2c5.04515%2c1.14659%2c1.33419%2c2.24643%2c2.70757c.36436.45495%2c1.60506%2c2.101.08448.08457.37165.49285.74744.98239%2c1.11436%2c1.47884a97.97718%2c97.97718%2c0%2c0%2c1%2c8.39161%2c13.53807c1.79317%2c3.49775%2c6.98675%2c4.80186%2c10.26142%2c2.69064A7.67666%2c7.67666%2c0%2c0%2c0%2c689.82123%2c554.48655Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3cpath d='M602.43116%2c676.88167a3.77983%2c3.77983%2c0%2c0%2c1-2.73939-6.55137c.09531-.37882.16368-.65085.259-1.02968q-.05115-.12366-.1029-.24717c-3.47987-8.29769-25.685%2c14.83336-26.645%2c22.63179a30.029%2c30.029%2c0%2c0%2c0%2c.52714%2c10.32752A120.39223%2c120.39223%2c0%2c0%2c1%2c562.77838%2c652.01a116.20247%2c116.20247%2c0%2c0%2c1%2c.72078-12.96332q.59712-5.293%2c1.65679-10.51055a121.78667%2c121.78667%2c0%2c0%2c1%2c24.1515-51.61646c6.87378.38364%2c12.898-.66348%2c13.47967-13.98532.10346-2.36972%2c1.86113-4.42156%2c2.24841-6.756-.65621.08607-1.32321.13985-1.97941.18285-.20444.0107-.41958.02149-.624.03228l-.07709.00346a3.745%2c3.745%2c0%2c0%2c1-3.07566-6.10115q.425-.52305.85054-1.04557c.43036-.53793.87143-1.06507%2c1.30171-1.60292a1.865%2c1.865%2c0%2c0%2c0%2c.13986-.16144c.49494-.61322.98971-1.21564%2c1.48465-1.82885a10.82911%2c10.82911%2c0%2c0%2c0-3.55014-3.43169c-4.95941-2.90463-11.80146-.89293-15.38389%2c3.59313-3.59313%2c4.486-4.27083%2c10.77947-3.023%2c16.3843a43.39764%2c43.39764%2c0%2c0%2c0%2c6.003%2c13.3828c-.269.34429-.54872.67779-.81765%2c1.02209a122.57366%2c122.57366%2c0%2c0%2c0-12.79359%2c20.2681c1.0163-7.93863-11.41159-36.60795-16.21776-42.68052-5.773-7.29409-17.61108-4.11077-18.62815%2c5.13562q-.01476.13428-.02884.26849%2c1.07082.60411%2c2.0964%2c1.28237a5.12707%2c5.12707%2c0%2c0%2c1-2.06713%2c9.33031l-.10452.01613c-9.55573%2c13.64367%2c21.07745%2c49.1547%2c28.74518%2c41.18139a125.11045%2c125.11045%2c0%2c0%2c0-6.73449%2c31.69282%2c118.66429%2c118.66429%2c0%2c0%2c0%2c.08607%2c19.15986l-.03231-.22593C558.90163%2c648.154%2c529.674%2c627.51374%2c521.139%2c629.233c-4.91675.99041-9.75952.76525-9.01293%2c5.72484q.01788.11874.03635.2375a34.4418%2c34.4418%2c0%2c0%2c1%2c3.862%2c1.86105q1.07082.60423%2c2.09639%2c1.28237a5.12712%2c5.12712%2c0%2c0%2c1-2.06712%2c9.33039l-.10464.01606c-.07528.01079-.13987.02157-.21507.03237-4.34967%2c14.96631%2c27.90735%2c39.12%2c47.5177%2c31.43461h.01081a125.07484%2c125.07484%2c0%2c0%2c0%2c8.402%2c24.52806H601.679c.10765-.3335.20443-.67779.3013-1.01129a34.102%2c34.102%2c0%2c0%2c1-8.30521-.49477c2.22693-2.73257%2c4.45377-5.48664%2c6.6807-8.21913a1.86122%2c1.86122%2c0%2c0%2c0%2c.13986-.16135c1.12956-1.39849%2c2.26992-2.78627%2c3.39948-4.18476l.00061-.00173a49.95232%2c49.95232%2c0%2c0%2c0-1.46367-12.72495Zm-34.37066-67.613.0158-.02133-.0158.04282Zm-6.64832%2c59.93237-.25822-.58084c.01079-.41957.01079-.83914%2c0-1.26942%2c0-.11845-.0215-.23672-.0215-.35508.09678.74228.18285%2c1.48464.29042%2c2.22692Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3ccircle cx='95.24878' cy='439' r='11' fill='%233f3d56'/%3e%3ccircle cx='227.24878' cy='559' r='11' fill='%233f3d56'/%3e%3ccircle cx='728.24878' cy='559' r='11' fill='%233f3d56'/%3e%3ccircle cx='755.24878' cy='419' r='11' fill='%233f3d56'/%3e%3ccircle cx='723.24878' cy='317' r='11' fill='%233f3d56'/%3e%3cpath d='M434.1831%2c583.426a10.949%2c10.949%2c0%2c1%2c1-.21-2.16A10.9921%2c10.9921%2c0%2c0%2c1%2c434.1831%2c583.426Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3ccircle cx='484.24878' cy='349' r='11' fill='%233f3d56'/%3e%3cpath d='M545.1831%2c513.426a10.949%2c10.949%2c0%2c1%2c1-.21-2.16A10.9921%2c10.9921%2c0%2c0%2c1%2c545.1831%2c513.426Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3cpath d='M403.1831%2c481.426a10.949%2c10.949%2c0%2c1%2c1-.21-2.16A10.9921%2c10.9921%2c0%2c0%2c1%2c403.1831%2c481.426Z' transform='translate(-169.93432 -164.42601)' fill='%233f3d56'/%3e%3ccircle cx='599.24878' cy='443' r='11' fill='%233f3d56'/%3e%3ccircle cx='426.24878' cy='338' r='16' fill='%233f3d56'/%3e%3cpath d='M1028.875%2c735.26666l-857.75.30733a1.19068%2c1.19068%2c0%2c1%2c1%2c0-2.38136l857.75-.30734a1.19069%2c1.19069%2c0%2c0%2c1%2c0%2c2.38137Z' transform='translate(-169.93432 -164.42601)' fill='%23cacaca'/%3e%3c/svg%3e";

/* src\Components\NotFound.svelte generated by Svelte v3.59.2 */
const file$h = "src\\Components\\NotFound.svelte";

function create_fragment$i(ctx) {
	let div;
	let img;
	let img_src_value;
	let t0;
	let h1;
	let t1_value = /*$_*/ ctx[0]("notFound.error404") + "";
	let t1;
	let t2;
	let p;
	let t3_value = /*$_*/ ctx[0]("notFound.pageNotFound") + "";
	let t3;

	const block = {
		c: function create() {
			div = element("div");
			img = element("img");
			t0 = space();
			h1 = element("h1");
			t1 = text(t1_value);
			t2 = space();
			p = element("p");
			t3 = text(t3_value);
			if (!src_url_equal(img.src, img_src_value = img$e)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			attr_dev(img, "class", "svelte-1412f9t");
			add_location(img, file$h, 6, 2, 117);
			add_location(h1, file$h, 7, 2, 149);
			add_location(p, file$h, 8, 2, 186);
			attr_dev(div, "class", "svelte-1412f9t");
			add_location(div, file$h, 5, 0, 109);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, img);
			append_dev(div, t0);
			append_dev(div, h1);
			append_dev(h1, t1);
			append_dev(div, t2);
			append_dev(div, p);
			append_dev(p, t3);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$_*/ 1 && t1_value !== (t1_value = /*$_*/ ctx[0]("notFound.error404") + "")) set_data_dev(t1, t1_value);
			if (dirty & /*$_*/ 1 && t3_value !== (t3_value = /*$_*/ ctx[0]("notFound.pageNotFound") + "")) set_data_dev(t3, t3_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$i($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(0, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('NotFound', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NotFound> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ _: $format, Error404: img$e, $_ });
	return [$_];
}

class NotFound extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$i, create_fragment$i, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "NotFound",
			options,
			id: create_fragment$i.name
		});
	}
}

/* src\Components\Profile.svelte generated by Svelte v3.59.2 */

const { Error: Error_1$4, console: console_1$3 } = globals;
const file$g = "src\\Components\\Profile.svelte";

// (37:2) {:else}
function create_else_block$4(ctx) {
	let div1;
	let img;
	let img_src_value;
	let t0;
	let div0;
	let p0;
	let t1;
	let t2;
	let t3;
	let p1;
	let t4;
	let t5;

	const block = {
		c: function create() {
			div1 = element("div");
			img = element("img");
			t0 = space();
			div0 = element("div");
			p0 = element("p");
			t1 = text("Username: ");
			t2 = text(/*fullname*/ ctx[0]);
			t3 = space();
			p1 = element("p");
			t4 = text("Email: ");
			t5 = text(/*email*/ ctx[1]);
			if (!src_url_equal(img.src, img_src_value = /*imgLink*/ ctx[2])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Profile avatar");
			attr_dev(img, "class", "svelte-7v2i21");
			add_location(img, file$g, 38, 6, 855);
			add_location(p0, file$g, 40, 8, 939);
			add_location(p1, file$g, 41, 8, 975);
			attr_dev(div0, "class", "flex-wrapper svelte-7v2i21");
			add_location(div0, file$g, 39, 6, 904);
			attr_dev(div1, "class", "flex svelte-7v2i21");
			add_location(div1, file$g, 37, 4, 830);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, img);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, p0);
			append_dev(p0, t1);
			append_dev(p0, t2);
			append_dev(div0, t3);
			append_dev(div0, p1);
			append_dev(p1, t4);
			append_dev(p1, t5);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*imgLink*/ 4 && !src_url_equal(img.src, img_src_value = /*imgLink*/ ctx[2])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*fullname*/ 1) set_data_dev(t2, /*fullname*/ ctx[0]);
			if (dirty & /*email*/ 2) set_data_dev(t5, /*email*/ ctx[1]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$4.name,
		type: "else",
		source: "(37:2) {:else}",
		ctx
	});

	return block;
}

// (35:2) {#if error}
function create_if_block$d(ctx) {
	let p;
	let t0;
	let t1;

	const block = {
		c: function create() {
			p = element("p");
			t0 = text("Error: ");
			t1 = text(/*error*/ ctx[3]);
			add_location(p, file$g, 35, 4, 794);
		},
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
			append_dev(p, t0);
			append_dev(p, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*error*/ 8) set_data_dev(t1, /*error*/ ctx[3]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$d.name,
		type: "if",
		source: "(35:2) {#if error}",
		ctx
	});

	return block;
}

function create_fragment$h(ctx) {
	let div;
	let h1;
	let t1;

	function select_block_type(ctx, dirty) {
		if (/*error*/ ctx[3]) return create_if_block$d;
		return create_else_block$4;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			div = element("div");
			h1 = element("h1");
			h1.textContent = "Profile tab";
			t1 = space();
			if_block.c();
			add_location(h1, file$g, 33, 2, 755);
			attr_dev(div, "class", "profile svelte-7v2i21");
			add_location(div, file$g, 32, 0, 731);
		},
		l: function claim(nodes) {
			throw new Error_1$4("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h1);
			append_dev(div, t1);
			if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const backendUrl$6 = "http://localhost:8080";

function instance$h($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Profile', slots, []);
	let fullname = "";
	let email = "";
	let imgLink = "";
	let error = "";

	onMount(async () => {
		try {
			const response = await fetch(backendUrl$6 + "/api/profile", {
				method: "GET",
				headers: { Application: "application/json" },
				credentials: "include"
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			$$invalidate(0, fullname = data.name);
			$$invalidate(1, email = data.email);
			$$invalidate(2, imgLink = data.imageLink);
			console.log(imgLink);
		} catch(e) {
			$$invalidate(3, error = e.message);
		}
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Profile> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		backendUrl: backendUrl$6,
		fullname,
		email,
		imgLink,
		error
	});

	$$self.$inject_state = $$props => {
		if ('fullname' in $$props) $$invalidate(0, fullname = $$props.fullname);
		if ('email' in $$props) $$invalidate(1, email = $$props.email);
		if ('imgLink' in $$props) $$invalidate(2, imgLink = $$props.imgLink);
		if ('error' in $$props) $$invalidate(3, error = $$props.error);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [fullname, email, imgLink, error];
}

class Profile extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$h, create_fragment$h, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Profile",
			options,
			id: create_fragment$h.name
		});
	}
}

var img$d = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cstyle%3e.cls-1%7bfill:none%3bstroke:black%3bstroke-linecap:round%3bstroke-linejoin:round%3bstroke-width:2px%3b%7d%3c/style%3e%3c/defs%3e%3ctitle/%3e%3cg id='plus'%3e%3cline class='cls-1' x1='16' x2='16' y1='7' y2='25'/%3e%3cline class='cls-1' x1='7' x2='25' y1='16' y2='16'/%3e%3c/g%3e%3c/svg%3e";

var img$c = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3ctitle/%3e%3cg data-name='Layer 2' id='Layer_2'%3e%3cpath d='M10.1%2c23a1%2c1%2c0%2c0%2c0%2c0-1.41L5.5%2c17H29.05a1%2c1%2c0%2c0%2c0%2c0-2H5.53l4.57-4.57A1%2c1%2c0%2c0%2c0%2c8.68%2c9L2.32%2c15.37a.9.9%2c0%2c0%2c0%2c0%2c1.27L8.68%2c23A1%2c1%2c0%2c0%2c0%2c10.1%2c23Z'/%3e%3c/g%3e%3c/svg%3e";

function clearableInput(node) {
  const handleClear = event => {
    if (node.value !== "") {
      node.value = ""; 
      node.dispatchEvent(new Event('input'));
    }
  };

  node.addEventListener('click', handleClear);

  return {
    destroy() {
      node.removeEventListener('click', handleClear);
    }
  };
}

/* src\Components\Modal\Components\NameOrRenameProject.svelte generated by Svelte v3.59.2 */

const { Error: Error_1$3 } = globals;
const file$f = "src\\Components\\Modal\\Components\\NameOrRenameProject.svelte";

// (66:2) {#if isRenameComponent}
function create_if_block$c(ctx) {
	let div;
	let button;
	let t_value = /*$_*/ ctx[2]("modalNameOrRenameProject.rename") + "";
	let t;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			button = element("button");
			t = text(t_value);
			attr_dev(button, "class", "button--blue svelte-45ulx8");
			toggle_class(button, "button-disabled", /*projectName*/ ctx[0].trim() === "" || /*projectName*/ ctx[0] === /*CURRENT_PNAME*/ ctx[3] || /*projectName*/ ctx[0].length > MAX_PNAME_LENGTH$1);
			add_location(button, file$f, 67, 6, 2012);
			attr_dev(div, "class", "content-wrapper__button-container svelte-45ulx8");
			add_location(div, file$f, 66, 4, 1957);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, button);
			append_dev(button, t);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*handleProjectNameChange*/ ctx[4], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 4 && t_value !== (t_value = /*$_*/ ctx[2]("modalNameOrRenameProject.rename") + "")) set_data_dev(t, t_value);

			if (dirty & /*projectName, CURRENT_PNAME, MAX_PNAME_LENGTH*/ 9) {
				toggle_class(button, "button-disabled", /*projectName*/ ctx[0].trim() === "" || /*projectName*/ ctx[0] === /*CURRENT_PNAME*/ ctx[3] || /*projectName*/ ctx[0].length > MAX_PNAME_LENGTH$1);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$c.name,
		type: "if",
		source: "(66:2) {#if isRenameComponent}",
		ctx
	});

	return block;
}

function create_fragment$g(ctx) {
	let div1;
	let div0;
	let h3;
	let label;

	let t0_value = (/*isRenameComponent*/ ctx[1]
	? /*$_*/ ctx[2]("modalNameOrRenameProject.providenNewName")
	: /*$_*/ ctx[2]("modalNameOrRenameProject.projectName")) + "";

	let t0;
	let t1;
	let input;
	let input_placeholder_value;
	let t2;
	let div1_style_value;
	let mounted;
	let dispose;
	let if_block = /*isRenameComponent*/ ctx[1] && create_if_block$c(ctx);

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			h3 = element("h3");
			label = element("label");
			t0 = text(t0_value);
			t1 = space();
			input = element("input");
			t2 = space();
			if (if_block) if_block.c();
			attr_dev(label, "for", "pname");
			add_location(label, file$f, 39, 6, 1132);
			attr_dev(h3, "class", "svelte-45ulx8");
			add_location(h3, file$f, 38, 4, 1120);
			attr_dev(input, "type", "text");
			attr_dev(input, "id", "pname");
			attr_dev(input, "name", "pname");

			attr_dev(input, "placeholder", input_placeholder_value = /*isRenameComponent*/ ctx[1]
			? /*projectName*/ ctx[0]
			: /*$_*/ ctx[2]("modalNameOrRenameProject.placeholderMyProject"));

			attr_dev(input, "maxlength", MAX_PNAME_LENGTH$1);
			attr_dev(input, "class", "svelte-45ulx8");
			add_location(input, file$f, 45, 4, 1329);
			attr_dev(div0, "class", "content-wrapper__name-wrapper svelte-45ulx8");
			add_location(div0, file$f, 37, 2, 1071);
			attr_dev(div1, "class", "content-wrapper svelte-45ulx8");

			attr_dev(div1, "style", div1_style_value = /*isRenameComponent*/ ctx[1]
			? "margin-top: 50px;"
			: "margin: 118px 0;");

			add_location(div1, file$f, 33, 0, 961);
		},
		l: function claim(nodes) {
			throw new Error_1$3("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, h3);
			append_dev(h3, label);
			append_dev(label, t0);
			append_dev(div0, t1);
			append_dev(div0, input);
			set_input_value(input, /*projectName*/ ctx[0]);
			append_dev(div1, t2);
			if (if_block) if_block.m(div1, null);

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
					action_destroyer(clearableInput.call(null, input)),
					listen_dev(input, "focus", focus_handler, false, false, false, false),
					listen_dev(input, "blur", /*blur_handler*/ ctx[7], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*isRenameComponent, $_*/ 6 && t0_value !== (t0_value = (/*isRenameComponent*/ ctx[1]
			? /*$_*/ ctx[2]("modalNameOrRenameProject.providenNewName")
			: /*$_*/ ctx[2]("modalNameOrRenameProject.projectName")) + "")) set_data_dev(t0, t0_value);

			if (dirty & /*isRenameComponent, projectName, $_*/ 7 && input_placeholder_value !== (input_placeholder_value = /*isRenameComponent*/ ctx[1]
			? /*projectName*/ ctx[0]
			: /*$_*/ ctx[2]("modalNameOrRenameProject.placeholderMyProject"))) {
				attr_dev(input, "placeholder", input_placeholder_value);
			}

			if (dirty & /*projectName*/ 1 && input.value !== /*projectName*/ ctx[0]) {
				set_input_value(input, /*projectName*/ ctx[0]);
			}

			if (/*isRenameComponent*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$c(ctx);
					if_block.c();
					if_block.m(div1, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*isRenameComponent*/ 2 && div1_style_value !== (div1_style_value = /*isRenameComponent*/ ctx[1]
			? "margin-top: 50px;"
			: "margin: 118px 0;")) {
				attr_dev(div1, "style", div1_style_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const backendUrl$5 = "http://localhost:8080";
const MAX_PNAME_LENGTH$1 = 22;
const focus_handler = event => event.target.placeholder = "";

function instance$g($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(2, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('NameOrRenameProject', slots, []);
	let { projectName = "" } = $$props;
	let { isRenameComponent = false } = $$props;
	let { projectId = null } = $$props;
	const CURRENT_PNAME = projectName;
	const dispatch = createEventDispatcher();

	async function handleProjectNameChange() {
		await fetch(backendUrl$5 + `/api/project/${projectId}:rename`, {
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "text/plain"
			},
			credentials: "include",
			body: projectName
		}).then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response.json();
		});

		dispatch("projectRenamed");
	}

	const writable_props = ['projectName', 'isRenameComponent', 'projectId'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NameOrRenameProject> was created with unknown prop '${key}'`);
	});

	function input_input_handler() {
		projectName = this.value;
		$$invalidate(0, projectName);
	}

	const blur_handler = event => {
		if (event.target.value === "") {
			event.target.placeholder = isRenameComponent
			? ""
			: $_("modalNameOrRenameProject.placeholderMyProject");
		}
	};

	$$self.$$set = $$props => {
		if ('projectName' in $$props) $$invalidate(0, projectName = $$props.projectName);
		if ('isRenameComponent' in $$props) $$invalidate(1, isRenameComponent = $$props.isRenameComponent);
		if ('projectId' in $$props) $$invalidate(5, projectId = $$props.projectId);
	};

	$$self.$capture_state = () => ({
		clearableInput,
		_: $format,
		createEventDispatcher,
		projectName,
		isRenameComponent,
		projectId,
		backendUrl: backendUrl$5,
		CURRENT_PNAME,
		MAX_PNAME_LENGTH: MAX_PNAME_LENGTH$1,
		dispatch,
		handleProjectNameChange,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('projectName' in $$props) $$invalidate(0, projectName = $$props.projectName);
		if ('isRenameComponent' in $$props) $$invalidate(1, isRenameComponent = $$props.isRenameComponent);
		if ('projectId' in $$props) $$invalidate(5, projectId = $$props.projectId);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		projectName,
		isRenameComponent,
		$_,
		CURRENT_PNAME,
		handleProjectNameChange,
		projectId,
		input_input_handler,
		blur_handler
	];
}

class NameOrRenameProject extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$g, create_fragment$g, safe_not_equal, {
			projectName: 0,
			isRenameComponent: 1,
			projectId: 5
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "NameOrRenameProject",
			options,
			id: create_fragment$g.name
		});
	}

	get projectName() {
		throw new Error_1$3("<NameOrRenameProject>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set projectName(value) {
		throw new Error_1$3("<NameOrRenameProject>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isRenameComponent() {
		throw new Error_1$3("<NameOrRenameProject>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isRenameComponent(value) {
		throw new Error_1$3("<NameOrRenameProject>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get projectId() {
		throw new Error_1$3("<NameOrRenameProject>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set projectId(value) {
		throw new Error_1$3("<NameOrRenameProject>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\Components\Modal\Components\ToggleComponent.svelte generated by Svelte v3.59.2 */
const file$e = "src\\Components\\Modal\\Components\\ToggleComponent.svelte";

function create_fragment$f(ctx) {
	let div2;
	let div0;
	let h40;
	let t0;
	let t1;
	let div1;
	let h41;
	let t2;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			h40 = element("h4");
			t0 = text(/*firstName*/ ctx[2]);
			t1 = space();
			div1 = element("div");
			h41 = element("h4");
			t2 = text(/*secondName*/ ctx[3]);
			attr_dev(h40, "class", "svelte-1u7p5p2");
			add_location(h40, file$e, 53, 4, 1418);
			attr_dev(div0, "class", "toggle-wrapper__toggle-first toggle svelte-1u7p5p2");
			toggle_class(div0, "active", /*firstActive*/ ctx[0]);
			add_location(div0, file$e, 47, 2, 1274);
			attr_dev(h41, "class", "svelte-1u7p5p2");
			add_location(h41, file$e, 61, 4, 1598);
			attr_dev(div1, "class", "toggle-wrapper__toggle-second toggle svelte-1u7p5p2");
			toggle_class(div1, "active", /*secondActive*/ ctx[1]);
			add_location(div1, file$e, 55, 2, 1452);
			attr_dev(div2, "class", "toggle-wrapper svelte-1u7p5p2");
			add_location(div2, file$e, 46, 0, 1242);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, h40);
			append_dev(h40, t0);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div1, h41);
			append_dev(h41, t2);

			if (!mounted) {
				dispose = [
					listen_dev(div0, "click", /*toggle*/ ctx[4], false, false, false, false),
					listen_dev(div0, "keydown", /*toggle*/ ctx[4], false, false, false, false),
					listen_dev(div1, "click", /*toggle*/ ctx[4], false, false, false, false),
					listen_dev(div1, "keydown", /*toggle*/ ctx[4], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*firstName*/ 4) set_data_dev(t0, /*firstName*/ ctx[2]);

			if (dirty & /*firstActive*/ 1) {
				toggle_class(div0, "active", /*firstActive*/ ctx[0]);
			}

			if (dirty & /*secondName*/ 8) set_data_dev(t2, /*secondName*/ ctx[3]);

			if (dirty & /*secondActive*/ 2) {
				toggle_class(div1, "active", /*secondActive*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const FIRST_SELECTED = 1;
const SECOND_SELECTED = 2;

function instance$f($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ToggleComponent', slots, []);
	let { firstName } = $$props;
	let { secondName } = $$props;
	let { firstActive = true } = $$props;
	let { secondActive = false } = $$props;
	const dispatch = createEventDispatcher();
	let firstToggleElement;
	let secondToggleElement;

	onMount(() => {
		firstToggleElement = document.querySelector(".toggle-wrapper__toggle-first");
		secondToggleElement = document.querySelector(".toggle-wrapper__toggle-second");
	});

	// handles toggling logic to apply active class
	function toggle(event) {
		const element = event.currentTarget;
		const isFirst = element.classList.contains("toggle-wrapper__toggle-first");
		const isSecond = element.classList.contains("toggle-wrapper__toggle-second");

		// Does nothing if the active toggle is clicked
		if (isFirst && firstActive || isSecond && secondActive) {
			return;
		}

		$$invalidate(0, firstActive = !firstActive);
		$$invalidate(1, secondActive = !secondActive);

		dispatch("toggle", {
			selection: firstActive ? FIRST_SELECTED : SECOND_SELECTED
		});
	}

	$$self.$$.on_mount.push(function () {
		if (firstName === undefined && !('firstName' in $$props || $$self.$$.bound[$$self.$$.props['firstName']])) {
			console.warn("<ToggleComponent> was created without expected prop 'firstName'");
		}

		if (secondName === undefined && !('secondName' in $$props || $$self.$$.bound[$$self.$$.props['secondName']])) {
			console.warn("<ToggleComponent> was created without expected prop 'secondName'");
		}
	});

	const writable_props = ['firstName', 'secondName', 'firstActive', 'secondActive'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToggleComponent> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('firstName' in $$props) $$invalidate(2, firstName = $$props.firstName);
		if ('secondName' in $$props) $$invalidate(3, secondName = $$props.secondName);
		if ('firstActive' in $$props) $$invalidate(0, firstActive = $$props.firstActive);
		if ('secondActive' in $$props) $$invalidate(1, secondActive = $$props.secondActive);
	};

	$$self.$capture_state = () => ({
		onMount,
		createEventDispatcher,
		firstName,
		secondName,
		firstActive,
		secondActive,
		FIRST_SELECTED,
		SECOND_SELECTED,
		dispatch,
		firstToggleElement,
		secondToggleElement,
		toggle
	});

	$$self.$inject_state = $$props => {
		if ('firstName' in $$props) $$invalidate(2, firstName = $$props.firstName);
		if ('secondName' in $$props) $$invalidate(3, secondName = $$props.secondName);
		if ('firstActive' in $$props) $$invalidate(0, firstActive = $$props.firstActive);
		if ('secondActive' in $$props) $$invalidate(1, secondActive = $$props.secondActive);
		if ('firstToggleElement' in $$props) firstToggleElement = $$props.firstToggleElement;
		if ('secondToggleElement' in $$props) secondToggleElement = $$props.secondToggleElement;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [firstActive, secondActive, firstName, secondName, toggle];
}

class ToggleComponent extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$f, create_fragment$f, safe_not_equal, {
			firstName: 2,
			secondName: 3,
			firstActive: 0,
			secondActive: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ToggleComponent",
			options,
			id: create_fragment$f.name
		});
	}

	get firstName() {
		throw new Error("<ToggleComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set firstName(value) {
		throw new Error("<ToggleComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get secondName() {
		throw new Error("<ToggleComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set secondName(value) {
		throw new Error("<ToggleComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get firstActive() {
		throw new Error("<ToggleComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set firstActive(value) {
		throw new Error("<ToggleComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get secondActive() {
		throw new Error("<ToggleComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set secondActive(value) {
		throw new Error("<ToggleComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var img$b = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 448 512' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M432 80h-82.38l-34-56.75C306.1 8.827 291.4 0 274.6 0H173.4C156.6 0 141 8.827 132.4 23.25L98.38 80H16C7.125 80 0 87.13 0 96v16C0 120.9 7.125 128 16 128H32v320c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V128h16C440.9 128 448 120.9 448 112V96C448 87.13 440.9 80 432 80zM171.9 50.88C172.9 49.13 174.9 48 177 48h94c2.125 0 4.125 1.125 5.125 2.875L293.6 80H154.4L171.9 50.88zM352 464H96c-8.837 0-16-7.163-16-16V128h288v320C368 456.8 360.8 464 352 464zM224 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S208 183.2 208 192v208C208 408.8 215.2 416 224 416zM144 416C152.8 416 160 408.8 160 400V192c0-8.844-7.156-16-16-16S128 183.2 128 192v208C128 408.8 135.2 416 144 416zM304 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S288 183.2 288 192v208C288 408.8 295.2 416 304 416z'/%3e%3c/svg%3e";

/* src\Components\Modal\Components\AddByEmail\EmailComponent.svelte generated by Svelte v3.59.2 */
const file$d = "src\\Components\\Modal\\Components\\AddByEmail\\EmailComponent.svelte";

function create_fragment$e(ctx) {
	let div3;
	let div1;
	let input;
	let t0;
	let div0;
	let img;
	let img_src_value;
	let img_alt_value;
	let t1;
	let div2;
	let togglecomponent;
	let div3_class_value;
	let current;
	let mounted;
	let dispose;

	togglecomponent = new ToggleComponent({
			props: {
				firstName: /*$_*/ ctx[2]("modalEmailComponents.viewer"),
				secondName: /*$_*/ ctx[2]("modalEmailComponents.editor"),
				firstActive: /*firstActive*/ ctx[3],
				secondActive: /*secondActive*/ ctx[4]
			},
			$$inline: true
		});

	togglecomponent.$on("toggle", /*handleToggleChange*/ ctx[6]);

	const block = {
		c: function create() {
			div3 = element("div");
			div1 = element("div");
			input = element("input");
			t0 = space();
			div0 = element("div");
			img = element("img");
			t1 = space();
			div2 = element("div");
			create_component(togglecomponent.$$.fragment);
			attr_dev(input, "placeholder", /*email*/ ctx[0]);
			input.disabled = true;
			attr_dev(input, "class", "svelte-gj40du");
			add_location(input, file$d, 29, 4, 875);
			if (!src_url_equal(img.src, img_src_value = img$b)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*$_*/ ctx[2]("modalEmailComponents.altRemove"));
			attr_dev(img, "class", "svelte-gj40du");
			add_location(img, file$d, 31, 6, 968);
			attr_dev(div0, "class", "entry-wrapper__icon-wrapper svelte-gj40du");
			add_location(div0, file$d, 30, 4, 919);
			attr_dev(div1, "class", "entry-wrapper__email-wrapper svelte-gj40du");
			add_location(div1, file$d, 28, 2, 827);
			attr_dev(div2, "class", "entry-wrapper__toggle-wrapper svelte-gj40du");
			add_location(div2, file$d, 39, 2, 1153);
			attr_dev(div3, "class", div3_class_value = "entry-wrapper " + (/*last*/ ctx[1] ? 'last' : '') + " svelte-gj40du");
			add_location(div3, file$d, 27, 0, 775);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div1);
			append_dev(div1, input);
			append_dev(div1, t0);
			append_dev(div1, div0);
			append_dev(div0, img);
			append_dev(div3, t1);
			append_dev(div3, div2);
			mount_component(togglecomponent, div2, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(img, "click", /*handleRemove*/ ctx[5], false, false, false, false),
					listen_dev(img, "keydown", /*handleRemove*/ ctx[5], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*email*/ 1) {
				attr_dev(input, "placeholder", /*email*/ ctx[0]);
			}

			if (!current || dirty & /*$_*/ 4 && img_alt_value !== (img_alt_value = /*$_*/ ctx[2]("modalEmailComponents.altRemove"))) {
				attr_dev(img, "alt", img_alt_value);
			}

			const togglecomponent_changes = {};
			if (dirty & /*$_*/ 4) togglecomponent_changes.firstName = /*$_*/ ctx[2]("modalEmailComponents.viewer");
			if (dirty & /*$_*/ 4) togglecomponent_changes.secondName = /*$_*/ ctx[2]("modalEmailComponents.editor");
			togglecomponent.$set(togglecomponent_changes);

			if (!current || dirty & /*last*/ 2 && div3_class_value !== (div3_class_value = "entry-wrapper " + (/*last*/ ctx[1] ? 'last' : '') + " svelte-gj40du")) {
				attr_dev(div3, "class", div3_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(togglecomponent.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(togglecomponent.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_component(togglecomponent);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(2, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('EmailComponent', slots, []);
	let { email } = $$props;
	let { role } = $$props;
	let { last = false } = $$props;
	let firstActive = role === 1;
	let secondActive = !firstActive;
	const dispatch = createEventDispatcher();

	function handleRemove() {
		dispatch("remove", email);
	}

	function handleToggleChange(event) {
		$$invalidate(7, role = event.detail.selection);
		dispatch("roleChange", { email, role });
	}

	$$self.$$.on_mount.push(function () {
		if (email === undefined && !('email' in $$props || $$self.$$.bound[$$self.$$.props['email']])) {
			console.warn("<EmailComponent> was created without expected prop 'email'");
		}

		if (role === undefined && !('role' in $$props || $$self.$$.bound[$$self.$$.props['role']])) {
			console.warn("<EmailComponent> was created without expected prop 'role'");
		}
	});

	const writable_props = ['email', 'role', 'last'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EmailComponent> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('email' in $$props) $$invalidate(0, email = $$props.email);
		if ('role' in $$props) $$invalidate(7, role = $$props.role);
		if ('last' in $$props) $$invalidate(1, last = $$props.last);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		ToggleComponent,
		trashIcon: img$b,
		_: $format,
		email,
		role,
		last,
		firstActive,
		secondActive,
		dispatch,
		handleRemove,
		handleToggleChange,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('email' in $$props) $$invalidate(0, email = $$props.email);
		if ('role' in $$props) $$invalidate(7, role = $$props.role);
		if ('last' in $$props) $$invalidate(1, last = $$props.last);
		if ('firstActive' in $$props) $$invalidate(3, firstActive = $$props.firstActive);
		if ('secondActive' in $$props) $$invalidate(4, secondActive = $$props.secondActive);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		email,
		last,
		$_,
		firstActive,
		secondActive,
		handleRemove,
		handleToggleChange,
		role
	];
}

class EmailComponent extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$e, create_fragment$e, safe_not_equal, { email: 0, role: 7, last: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "EmailComponent",
			options,
			id: create_fragment$e.name
		});
	}

	get email() {
		throw new Error("<EmailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set email(value) {
		throw new Error("<EmailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get role() {
		throw new Error("<EmailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set role(value) {
		throw new Error("<EmailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get last() {
		throw new Error("<EmailComponent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set last(value) {
		throw new Error("<EmailComponent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\Components\Modal\Components\AddByEmail\AddByEmailBox.svelte generated by Svelte v3.59.2 */
const file$c = "src\\Components\\Modal\\Components\\AddByEmail\\AddByEmailBox.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i].email;
	child_ctx[6] = list[i].role;
	child_ctx[21] = i;
	return child_ctx;
}

// (87:2) {#if showHeader}
function create_if_block_1$4(ctx) {
	let h3;
	let label;
	let t_value = /*$_*/ ctx[4]("modalEmailComponents.addByEmail") + "";
	let t;

	const block = {
		c: function create() {
			h3 = element("h3");
			label = element("label");
			t = text(t_value);
			attr_dev(label, "for", "email");
			add_location(label, file$c, 87, 8, 2809);
			attr_dev(h3, "class", "svelte-1heh4ew");
			add_location(h3, file$c, 87, 4, 2805);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h3, anchor);
			append_dev(h3, label);
			append_dev(label, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 16 && t_value !== (t_value = /*$_*/ ctx[4]("modalEmailComponents.addByEmail") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$4.name,
		type: "if",
		source: "(87:2) {#if showHeader}",
		ctx
	});

	return block;
}

// (115:4) {#if emailEntries.length === 0}
function create_if_block$b(ctx) {
	let div;
	let h3;
	let t_value = /*$_*/ ctx[4]("modalEmailComponents.emptyEmailList") + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			h3 = element("h3");
			t = text(t_value);
			attr_dev(h3, "class", "svelte-1heh4ew");
			add_location(h3, file$c, 116, 8, 3737);
			attr_dev(div, "class", "email-section__empty-text-wrapper svelte-1heh4ew");
			add_location(div, file$c, 115, 6, 3680);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h3);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 16 && t_value !== (t_value = /*$_*/ ctx[4]("modalEmailComponents.emptyEmailList") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$b.name,
		type: "if",
		source: "(115:4) {#if emailEntries.length === 0}",
		ctx
	});

	return block;
}

// (120:4) {#each emailEntries as { email, role }
function create_each_block$2(key_1, ctx) {
	let first;
	let emailcomponent;
	let current;

	function remove_handler() {
		return /*remove_handler*/ ctx[14](/*email*/ ctx[5]);
	}

	function roleChange_handler(...args) {
		return /*roleChange_handler*/ ctx[15](/*email*/ ctx[5], ...args);
	}

	emailcomponent = new EmailComponent({
			props: {
				email: /*email*/ ctx[5],
				role: /*role*/ ctx[6],
				last: /*index*/ ctx[21] === /*emailEntries*/ ctx[0].length - 1
			},
			$$inline: true
		});

	emailcomponent.$on("remove", remove_handler);
	emailcomponent.$on("roleChange", roleChange_handler);

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			first = empty();
			create_component(emailcomponent.$$.fragment);
			this.first = first;
		},
		m: function mount(target, anchor) {
			insert_dev(target, first, anchor);
			mount_component(emailcomponent, target, anchor);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const emailcomponent_changes = {};
			if (dirty & /*emailEntries*/ 1) emailcomponent_changes.email = /*email*/ ctx[5];
			if (dirty & /*emailEntries*/ 1) emailcomponent_changes.role = /*role*/ ctx[6];
			if (dirty & /*emailEntries*/ 1) emailcomponent_changes.last = /*index*/ ctx[21] === /*emailEntries*/ ctx[0].length - 1;
			emailcomponent.$set(emailcomponent_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(emailcomponent.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(emailcomponent.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(first);
			destroy_component(emailcomponent, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(120:4) {#each emailEntries as { email, role }",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let div4;
	let t0;
	let div0;
	let input;
	let input_class_value;
	let t1;
	let button;
	let t3;
	let div2;
	let div1;
	let togglecomponent;
	let t4;
	let div3;
	let t5;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*showHeader*/ ctx[1] && create_if_block_1$4(ctx);

	togglecomponent = new ToggleComponent({
			props: {
				firstName: /*$_*/ ctx[4]("modalEmailComponents.viewer"),
				secondName: /*$_*/ ctx[4]("modalEmailComponents.editor")
			},
			$$inline: true
		});

	togglecomponent.$on("toggle", /*handleToggleChange*/ ctx[9]);
	let if_block1 = /*emailEntries*/ ctx[0].length === 0 && create_if_block$b(ctx);
	let each_value = /*emailEntries*/ ctx[0];
	validate_each_argument(each_value);
	const get_key = ctx => /*email*/ ctx[5];
	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$2(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
	}

	const block = {
		c: function create() {
			div4 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			div0 = element("div");
			input = element("input");
			t1 = space();
			button = element("button");
			button.textContent = "+";
			t3 = space();
			div2 = element("div");
			div1 = element("div");
			create_component(togglecomponent.$$.fragment);
			t4 = space();
			div3 = element("div");
			if (if_block1) if_block1.c();
			t5 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(input, "type", "email");
			attr_dev(input, "name", "email");
			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*inputClass*/ ctx[3]) + " svelte-1heh4ew"));
			attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
			add_location(input, file$c, 90, 4, 2947);
			attr_dev(button, "id", "submit-button");
			attr_dev(button, "class", "button--blue svelte-1heh4ew");
			add_location(button, file$c, 100, 4, 3169);
			attr_dev(div0, "class", "email-section__email-input-wrapper svelte-1heh4ew");
			add_location(div0, file$c, 89, 2, 2893);
			attr_dev(div1, "class", "email-section__main-toggle-container svelte-1heh4ew");
			add_location(div1, file$c, 105, 4, 3333);
			attr_dev(div2, "class", "email-section__main-toggle-wrapper svelte-1heh4ew");
			add_location(div2, file$c, 104, 2, 3279);
			attr_dev(div3, "class", "email-section__list-wrapper svelte-1heh4ew");
			add_location(div3, file$c, 113, 2, 3594);
			attr_dev(div4, "class", "email-section svelte-1heh4ew");
			add_location(div4, file$c, 85, 0, 2752);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			if (if_block0) if_block0.m(div4, null);
			append_dev(div4, t0);
			append_dev(div4, div0);
			append_dev(div0, input);
			set_input_value(input, /*email*/ ctx[5]);
			append_dev(div0, t1);
			append_dev(div0, button);
			append_dev(div4, t3);
			append_dev(div4, div2);
			append_dev(div2, div1);
			mount_component(togglecomponent, div1, null);
			append_dev(div4, t4);
			append_dev(div4, div3);
			if (if_block1) if_block1.m(div3, null);
			append_dev(div3, t5);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div3, null);
				}
			}

			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_input_handler*/ ctx[13]),
					listen_dev(input, "click", /*handleInputClick*/ ctx[7], false, false, false, false),
					listen_dev(input, "blur", /*handleBlur*/ ctx[8], false, false, false, false),
					action_destroyer(clearableInput.call(null, input)),
					listen_dev(button, "click", /*handleSubmit*/ ctx[12], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (/*showHeader*/ ctx[1]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_1$4(ctx);
					if_block0.c();
					if_block0.m(div4, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (!current || dirty & /*inputClass*/ 8 && input_class_value !== (input_class_value = "" + (null_to_empty(/*inputClass*/ ctx[3]) + " svelte-1heh4ew"))) {
				attr_dev(input, "class", input_class_value);
			}

			if (!current || dirty & /*placeholder*/ 4) {
				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
			}

			if (dirty & /*email*/ 32 && input.value !== /*email*/ ctx[5]) {
				set_input_value(input, /*email*/ ctx[5]);
			}

			const togglecomponent_changes = {};
			if (dirty & /*$_*/ 16) togglecomponent_changes.firstName = /*$_*/ ctx[4]("modalEmailComponents.viewer");
			if (dirty & /*$_*/ 16) togglecomponent_changes.secondName = /*$_*/ ctx[4]("modalEmailComponents.editor");
			togglecomponent.$set(togglecomponent_changes);

			if (/*emailEntries*/ ctx[0].length === 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$b(ctx);
					if_block1.c();
					if_block1.m(div3, t5);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*emailEntries, removeEmail, handleRoleChange*/ 3073) {
				each_value = /*emailEntries*/ ctx[0];
				validate_each_argument(each_value);
				group_outros();
				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div3, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(togglecomponent.$$.fragment, local);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			transition_out(togglecomponent.$$.fragment, local);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			if (if_block0) if_block0.d();
			destroy_component(togglecomponent);
			if (if_block1) if_block1.d();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const EMAIL_VALIDATION_REGEX = /^\b[\w.-]+@[\w-]+\.[A-Za-z]{2,}\b$/;

function instance$d($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(4, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('AddByEmailBox', slots, []);
	let { showHeader = true } = $$props;
	let { emailEntries } = $$props;
	const placeholderEmail = $_("modalEmailComponents.placeholderEmail");
	const emailCannotBeEmpty = $_("modalEmailComponents.emailCannotBeEmpty");
	const invalidEmail = $_("modalEmailComponents.invalidEmail");
	const emailAlreadyAdded = $_("modalEmailComponents.emailAlreadyAdded");
	let email = "";
	let role = 1;
	let placeholder = placeholderEmail;
	let inputClass;

	// on click clear any error class from input
	function handleInputClick() {
		$$invalidate(3, inputClass = "");
		$$invalidate(2, placeholder = "");
	}

	// on blur if email is empty set placeholder to "Email"
	// unless the next focus target is the submit button if so
	// do nothing to prevent default placeholder from breefly showing
	function handleBlur(event) {
		const nextFocusTarget = event.relatedTarget;

		if (nextFocusTarget && nextFocusTarget.id !== "submit-button") {
			if (email === "") {
				$$invalidate(2, placeholder = placeholderEmail);
			}
		}
	}

	// get the role from the toggle component
	function handleToggleChange(event) {
		$$invalidate(6, role = event.detail.selection);
	}

	// handle role change if it happens inside EmailComponent
	function handleRoleChange(emailToUpdate, newRole) {
		const entryIndex = emailEntries.findIndex(entry => entry.email === emailToUpdate);

		if (entryIndex !== -1) {
			$$invalidate(0, emailEntries[entryIndex].role = newRole, emailEntries);
		}
	}

	function removeEmail(emailToRemove) {
		$$invalidate(0, emailEntries = emailEntries.filter(entry => entry.email !== emailToRemove));
	}

	// if email is empty or doesnt contain @ symbol change placeholder to error message,
	// else pushes new email to email array if it doesnt already exist
	function handleSubmit() {
		if (!email) {
			$$invalidate(3, inputClass = "error");
			$$invalidate(2, placeholder = emailCannotBeEmpty);
			return;
		} else if (!email.match(EMAIL_VALIDATION_REGEX)) {
			$$invalidate(5, email = "");
			$$invalidate(3, inputClass = "error");
			$$invalidate(2, placeholder = invalidEmail);
			return;
		}

		// Check if the email already exists in the array
		const emailExists = emailEntries.some(entry => entry.email === email);

		if (emailExists) {
			$$invalidate(5, email = "");
			$$invalidate(3, inputClass = "error");
			$$invalidate(2, placeholder = emailAlreadyAdded);
			return;
		}

		// Push a new entry into the emails array
		$$invalidate(0, emailEntries = [...emailEntries, { email, role }]);
	}

	$$self.$$.on_mount.push(function () {
		if (emailEntries === undefined && !('emailEntries' in $$props || $$self.$$.bound[$$self.$$.props['emailEntries']])) {
			console.warn("<AddByEmailBox> was created without expected prop 'emailEntries'");
		}
	});

	const writable_props = ['showHeader', 'emailEntries'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddByEmailBox> was created with unknown prop '${key}'`);
	});

	function input_input_handler() {
		email = this.value;
		$$invalidate(5, email);
	}

	const remove_handler = email => removeEmail(email);
	const roleChange_handler = (email, { detail: { role } }) => handleRoleChange(email, role);

	$$self.$$set = $$props => {
		if ('showHeader' in $$props) $$invalidate(1, showHeader = $$props.showHeader);
		if ('emailEntries' in $$props) $$invalidate(0, emailEntries = $$props.emailEntries);
	};

	$$self.$capture_state = () => ({
		ToggleComponent,
		clearableInput,
		EmailComponent,
		_: $format,
		showHeader,
		emailEntries,
		placeholderEmail,
		emailCannotBeEmpty,
		invalidEmail,
		emailAlreadyAdded,
		EMAIL_VALIDATION_REGEX,
		email,
		role,
		placeholder,
		inputClass,
		handleInputClick,
		handleBlur,
		handleToggleChange,
		handleRoleChange,
		removeEmail,
		handleSubmit,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('showHeader' in $$props) $$invalidate(1, showHeader = $$props.showHeader);
		if ('emailEntries' in $$props) $$invalidate(0, emailEntries = $$props.emailEntries);
		if ('email' in $$props) $$invalidate(5, email = $$props.email);
		if ('role' in $$props) $$invalidate(6, role = $$props.role);
		if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
		if ('inputClass' in $$props) $$invalidate(3, inputClass = $$props.inputClass);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		emailEntries,
		showHeader,
		placeholder,
		inputClass,
		$_,
		email,
		role,
		handleInputClick,
		handleBlur,
		handleToggleChange,
		handleRoleChange,
		removeEmail,
		handleSubmit,
		input_input_handler,
		remove_handler,
		roleChange_handler
	];
}

class AddByEmailBox extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, { showHeader: 1, emailEntries: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AddByEmailBox",
			options,
			id: create_fragment$d.name
		});
	}

	get showHeader() {
		throw new Error("<AddByEmailBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showHeader(value) {
		throw new Error("<AddByEmailBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get emailEntries() {
		throw new Error("<AddByEmailBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set emailEntries(value) {
		throw new Error("<AddByEmailBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var img$a = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 448 512' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z'/%3e%3c/svg%3e";

/* src\Components\Modal\Components\AddByLinkBox.svelte generated by Svelte v3.59.2 */
const file$b = "src\\Components\\Modal\\Components\\AddByLinkBox.svelte";

// (8:2) {#if showHeader}
function create_if_block$a(ctx) {
	let h3;
	let t_value = /*$_*/ ctx[1]("modalAddByLinkBox.addByLink") + "";
	let t;

	const block = {
		c: function create() {
			h3 = element("h3");
			t = text(t_value);
			attr_dev(h3, "class", "link-section__header svelte-acyjkr");
			add_location(h3, file$b, 8, 4, 224);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h3, anchor);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 2 && t_value !== (t_value = /*$_*/ ctx[1]("modalAddByLinkBox.addByLink") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$a.name,
		type: "if",
		source: "(8:2) {#if showHeader}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let div2;
	let t0;
	let form;
	let h30;
	let label0;
	let t1_value = /*$_*/ ctx[1]("modalAddByLinkBox.viewerLink") + "";
	let t1;
	let t2;
	let div0;
	let input0;
	let t3;
	let img0;
	let img0_src_value;
	let img0_alt_value;
	let t4;
	let h31;
	let label1;
	let t5_value = /*$_*/ ctx[1]("modalAddByLinkBox.editorLink") + "";
	let t5;
	let t6;
	let div1;
	let input1;
	let t7;
	let img1;
	let img1_src_value;
	let img1_alt_value;
	let if_block = /*showHeader*/ ctx[0] && create_if_block$a(ctx);

	const block = {
		c: function create() {
			div2 = element("div");
			if (if_block) if_block.c();
			t0 = space();
			form = element("form");
			h30 = element("h3");
			label0 = element("label");
			t1 = text(t1_value);
			t2 = space();
			div0 = element("div");
			input0 = element("input");
			t3 = space();
			img0 = element("img");
			t4 = space();
			h31 = element("h3");
			label1 = element("label");
			t5 = text(t5_value);
			t6 = space();
			div1 = element("div");
			input1 = element("input");
			t7 = space();
			img1 = element("img");
			attr_dev(label0, "for", "vlink");
			add_location(label0, file$b, 12, 6, 379);
			attr_dev(h30, "class", "link-section__label-wrapper svelte-acyjkr");
			add_location(h30, file$b, 11, 4, 331);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "id", "vlink");
			attr_dev(input0, "name", "vlink");
			input0.disabled = true;
			attr_dev(input0, "placeholder", "place for link");
			attr_dev(input0, "class", "svelte-acyjkr");
			add_location(input0, file$b, 15, 6, 507);
			if (!src_url_equal(img0.src, img0_src_value = img$a)) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", img0_alt_value = /*$_*/ ctx[1]("modalAddByLinkBox.altCopyToClipBoard"));
			attr_dev(img0, "class", "svelte-acyjkr");
			add_location(img0, file$b, 22, 6, 650);
			attr_dev(div0, "class", "link-section__link-wrapper svelte-acyjkr");
			add_location(div0, file$b, 14, 4, 459);
			attr_dev(label1, "for", "elink");
			add_location(label1, file$b, 28, 6, 823);
			attr_dev(h31, "class", "link-section__label-wrapper svelte-acyjkr");
			add_location(h31, file$b, 27, 4, 775);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "id", "elink");
			attr_dev(input1, "name", "elink");
			input1.disabled = true;
			attr_dev(input1, "placeholder", "place for link");
			attr_dev(input1, "class", "svelte-acyjkr");
			add_location(input1, file$b, 31, 6, 951);
			if (!src_url_equal(img1.src, img1_src_value = img$a)) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", img1_alt_value = /*$_*/ ctx[1]("modalAddByLinkBox.altCopyToClipBoard"));
			attr_dev(img1, "class", "svelte-acyjkr");
			add_location(img1, file$b, 38, 6, 1094);
			attr_dev(div1, "class", "link-section__link-wrapper svelte-acyjkr");
			add_location(div1, file$b, 30, 4, 903);
			attr_dev(form, "disabled", "");
			add_location(form, file$b, 10, 2, 310);
			attr_dev(div2, "class", "link-section svelte-acyjkr");
			add_location(div2, file$b, 6, 0, 172);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			if (if_block) if_block.m(div2, null);
			append_dev(div2, t0);
			append_dev(div2, form);
			append_dev(form, h30);
			append_dev(h30, label0);
			append_dev(label0, t1);
			append_dev(form, t2);
			append_dev(form, div0);
			append_dev(div0, input0);
			append_dev(div0, t3);
			append_dev(div0, img0);
			append_dev(form, t4);
			append_dev(form, h31);
			append_dev(h31, label1);
			append_dev(label1, t5);
			append_dev(form, t6);
			append_dev(form, div1);
			append_dev(div1, input1);
			append_dev(div1, t7);
			append_dev(div1, img1);
		},
		p: function update(ctx, [dirty]) {
			if (/*showHeader*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$a(ctx);
					if_block.c();
					if_block.m(div2, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*$_*/ 2 && t1_value !== (t1_value = /*$_*/ ctx[1]("modalAddByLinkBox.viewerLink") + "")) set_data_dev(t1, t1_value);

			if (dirty & /*$_*/ 2 && img0_alt_value !== (img0_alt_value = /*$_*/ ctx[1]("modalAddByLinkBox.altCopyToClipBoard"))) {
				attr_dev(img0, "alt", img0_alt_value);
			}

			if (dirty & /*$_*/ 2 && t5_value !== (t5_value = /*$_*/ ctx[1]("modalAddByLinkBox.editorLink") + "")) set_data_dev(t5, t5_value);

			if (dirty & /*$_*/ 2 && img1_alt_value !== (img1_alt_value = /*$_*/ ctx[1]("modalAddByLinkBox.altCopyToClipBoard"))) {
				attr_dev(img1, "alt", img1_alt_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(1, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('AddByLinkBox', slots, []);
	let { showHeader = true } = $$props;
	const writable_props = ['showHeader'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AddByLinkBox> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('showHeader' in $$props) $$invalidate(0, showHeader = $$props.showHeader);
	};

	$$self.$capture_state = () => ({ copyToClipboardIcon: img$a, showHeader, _: $format, $_ });

	$$self.$inject_state = $$props => {
		if ('showHeader' in $$props) $$invalidate(0, showHeader = $$props.showHeader);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [showHeader, $_];
}

class AddByLinkBox extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, { showHeader: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "AddByLinkBox",
			options,
			id: create_fragment$c.name
		});
	}

	get showHeader() {
		throw new Error("<AddByLinkBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showHeader(value) {
		throw new Error("<AddByLinkBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\Components\Modal\Components\ToggleAddByLinkAndEmail.svelte generated by Svelte v3.59.2 */
const file$a = "src\\Components\\Modal\\Components\\ToggleAddByLinkAndEmail.svelte";

// (31:2) {:else}
function create_else_block$3(ctx) {
	let addbyemailbox;
	let updating_emailEntries;
	let current;

	function addbyemailbox_emailEntries_binding(value) {
		/*addbyemailbox_emailEntries_binding*/ ctx[8](value);
	}

	let addbyemailbox_props = { showHeader: false };

	if (/*emailEntries*/ ctx[0] !== void 0) {
		addbyemailbox_props.emailEntries = /*emailEntries*/ ctx[0];
	}

	addbyemailbox = new AddByEmailBox({
			props: addbyemailbox_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(addbyemailbox, 'emailEntries', addbyemailbox_emailEntries_binding));

	const block = {
		c: function create() {
			create_component(addbyemailbox.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(addbyemailbox, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const addbyemailbox_changes = {};

			if (!updating_emailEntries && dirty & /*emailEntries*/ 1) {
				updating_emailEntries = true;
				addbyemailbox_changes.emailEntries = /*emailEntries*/ ctx[0];
				add_flush_callback(() => updating_emailEntries = false);
			}

			addbyemailbox.$set(addbyemailbox_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(addbyemailbox.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(addbyemailbox.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(addbyemailbox, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$3.name,
		type: "else",
		source: "(31:2) {:else}",
		ctx
	});

	return block;
}

// (29:2) {#if selection === 1}
function create_if_block$9(ctx) {
	let addbylinkbox;
	let current;

	addbylinkbox = new AddByLinkBox({
			props: { showHeader: false },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(addbylinkbox.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(addbylinkbox, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(addbylinkbox.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(addbylinkbox.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(addbylinkbox, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$9.name,
		type: "if",
		source: "(29:2) {#if selection === 1}",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let div;
	let togglecomponent;
	let t0;
	let current_block_type_index;
	let if_block;
	let t1;
	let button;

	let t2_value = (/*isUpdateComponent*/ ctx[1]
	? /*$_*/ ctx[3]("toggleAddLinkAndEmail.update")
	: /*$_*/ ctx[3]("toggleAddLinkAndEmail.create")) + "";

	let t2;
	let current;
	let mounted;
	let dispose;

	togglecomponent = new ToggleComponent({
			props: {
				firstName: /*firstName*/ ctx[4],
				secondName: /*secondName*/ ctx[5]
			},
			$$inline: true
		});

	togglecomponent.$on("toggle", /*handleToggleEvent*/ ctx[6]);
	const if_block_creators = [create_if_block$9, create_else_block$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*selection*/ ctx[2] === 1) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			div = element("div");
			create_component(togglecomponent.$$.fragment);
			t0 = space();
			if_block.c();
			t1 = space();
			button = element("button");
			t2 = text(t2_value);
			attr_dev(button, "class", "button--blue svelte-1kts1mo");
			add_location(button, file$a, 33, 2, 1084);
			attr_dev(div, "class", "content-wrapper svelte-1kts1mo");
			add_location(div, file$a, 26, 0, 827);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(togglecomponent, div, null);
			append_dev(div, t0);
			if_blocks[current_block_type_index].m(div, null);
			append_dev(div, t1);
			append_dev(div, button);
			append_dev(button, t2);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button, "click", /*handleButtonClick*/ ctx[7], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div, t1);
			}

			if ((!current || dirty & /*isUpdateComponent, $_*/ 10) && t2_value !== (t2_value = (/*isUpdateComponent*/ ctx[1]
			? /*$_*/ ctx[3]("toggleAddLinkAndEmail.update")
			: /*$_*/ ctx[3]("toggleAddLinkAndEmail.create")) + "")) set_data_dev(t2, t2_value);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(togglecomponent.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(togglecomponent.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(togglecomponent);
			if_blocks[current_block_type_index].d();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$b($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(3, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ToggleAddByLinkAndEmail', slots, []);
	let { emailEntries = [] } = $$props;
	let { isUpdateComponent = false } = $$props;
	const dispatch = createEventDispatcher();
	const firstName = $_("toggleAddLinkAndEmail.addByLink");
	const secondName = $_("toggleAddLinkAndEmail.addByEmail");

	// add by link is active by default
	let selection = 1;

	// listens for disptached event from ToggleComponent and toggles components
	function handleToggleEvent(event) {
		$$invalidate(2, selection = event.detail.selection);
	}

	function handleButtonClick() {
		dispatch("confirm");
	}

	const writable_props = ['emailEntries', 'isUpdateComponent'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToggleAddByLinkAndEmail> was created with unknown prop '${key}'`);
	});

	function addbyemailbox_emailEntries_binding(value) {
		emailEntries = value;
		$$invalidate(0, emailEntries);
	}

	$$self.$$set = $$props => {
		if ('emailEntries' in $$props) $$invalidate(0, emailEntries = $$props.emailEntries);
		if ('isUpdateComponent' in $$props) $$invalidate(1, isUpdateComponent = $$props.isUpdateComponent);
	};

	$$self.$capture_state = () => ({
		_: $format,
		AddByEmailBox,
		AddByLinkBox,
		ToggleComponent,
		createEventDispatcher,
		emailEntries,
		isUpdateComponent,
		dispatch,
		firstName,
		secondName,
		selection,
		handleToggleEvent,
		handleButtonClick,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('emailEntries' in $$props) $$invalidate(0, emailEntries = $$props.emailEntries);
		if ('isUpdateComponent' in $$props) $$invalidate(1, isUpdateComponent = $$props.isUpdateComponent);
		if ('selection' in $$props) $$invalidate(2, selection = $$props.selection);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		emailEntries,
		isUpdateComponent,
		selection,
		$_,
		firstName,
		secondName,
		handleToggleEvent,
		handleButtonClick,
		addbyemailbox_emailEntries_binding
	];
}

class ToggleAddByLinkAndEmail extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, { emailEntries: 0, isUpdateComponent: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ToggleAddByLinkAndEmail",
			options,
			id: create_fragment$b.name
		});
	}

	get emailEntries() {
		throw new Error("<ToggleAddByLinkAndEmail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set emailEntries(value) {
		throw new Error("<ToggleAddByLinkAndEmail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isUpdateComponent() {
		throw new Error("<ToggleAddByLinkAndEmail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isUpdateComponent(value) {
		throw new Error("<ToggleAddByLinkAndEmail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\Components\Modal\Components\CreateProjectScreen.svelte generated by Svelte v3.59.2 */

const { Error: Error_1$2, console: console_1$2 } = globals;
const file$9 = "src\\Components\\Modal\\Components\\CreateProjectScreen.svelte";

// (62:2) {#if currentIndex != 0}
function create_if_block_3$3(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			if (!src_url_equal(img.src, img_src_value = img$c)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*$_*/ ctx[3]("modalCreateProjectScreen.altBack"));
			attr_dev(img, "class", "content-wrapper__back-icon svelte-1o9arsq");
			add_location(img, file$9, 62, 4, 1896);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(img, "click", /*handlePrevious*/ ctx[4], false, false, false, false),
					listen_dev(img, "keydown", /*handlePrevious*/ ctx[4], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 8 && img_alt_value !== (img_alt_value = /*$_*/ ctx[3]("modalCreateProjectScreen.altBack"))) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$3.name,
		type: "if",
		source: "(62:2) {#if currentIndex != 0}",
		ctx
	});

	return block;
}

// (74:33) 
function create_if_block_2$3(ctx) {
	let toggleaddbylinkandemail;
	let updating_emailEntries;
	let current;

	function toggleaddbylinkandemail_emailEntries_binding(value) {
		/*toggleaddbylinkandemail_emailEntries_binding*/ ctx[8](value);
	}

	let toggleaddbylinkandemail_props = {};

	if (/*emailEntries*/ ctx[1] !== void 0) {
		toggleaddbylinkandemail_props.emailEntries = /*emailEntries*/ ctx[1];
	}

	toggleaddbylinkandemail = new ToggleAddByLinkAndEmail({
			props: toggleaddbylinkandemail_props,
			$$inline: true
		});

	binding_callbacks.push(() => bind(toggleaddbylinkandemail, 'emailEntries', toggleaddbylinkandemail_emailEntries_binding));
	toggleaddbylinkandemail.$on("confirm", /*handleSubmitProject*/ ctx[6]);

	const block = {
		c: function create() {
			create_component(toggleaddbylinkandemail.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(toggleaddbylinkandemail, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const toggleaddbylinkandemail_changes = {};

			if (!updating_emailEntries && dirty & /*emailEntries*/ 2) {
				updating_emailEntries = true;
				toggleaddbylinkandemail_changes.emailEntries = /*emailEntries*/ ctx[1];
				add_flush_callback(() => updating_emailEntries = false);
			}

			toggleaddbylinkandemail.$set(toggleaddbylinkandemail_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(toggleaddbylinkandemail.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toggleaddbylinkandemail.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toggleaddbylinkandemail, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$3.name,
		type: "if",
		source: "(74:33) ",
		ctx
	});

	return block;
}

// (72:4) {#if currentIndex === 0}
function create_if_block_1$3(ctx) {
	let nameproject;
	let updating_projectName;
	let current;

	function nameproject_projectName_binding(value) {
		/*nameproject_projectName_binding*/ ctx[7](value);
	}

	let nameproject_props = {};

	if (/*projectName*/ ctx[2] !== void 0) {
		nameproject_props.projectName = /*projectName*/ ctx[2];
	}

	nameproject = new NameOrRenameProject({ props: nameproject_props, $$inline: true });
	binding_callbacks.push(() => bind(nameproject, 'projectName', nameproject_projectName_binding));

	const block = {
		c: function create() {
			create_component(nameproject.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(nameproject, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const nameproject_changes = {};

			if (!updating_projectName && dirty & /*projectName*/ 4) {
				updating_projectName = true;
				nameproject_changes.projectName = /*projectName*/ ctx[2];
				add_flush_callback(() => updating_projectName = false);
			}

			nameproject.$set(nameproject_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nameproject.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nameproject.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(nameproject, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(72:4) {#if currentIndex === 0}",
		ctx
	});

	return block;
}

// (82:4) {#if currentIndex == 0}
function create_if_block$8(ctx) {
	let button;
	let t_value = /*$_*/ ctx[3]("modalCreateProjectScreen.next") + "";
	let t;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			t = text(t_value);
			attr_dev(button, "class", "button--blue svelte-1o9arsq");
			toggle_class(button, "button-disabled", /*projectName*/ ctx[2].trim() === "" && /*currentIndex*/ ctx[0] === 0 || /*projectName*/ ctx[2].length > MAX_PNAME_LENGTH);
			add_location(button, file$9, 82, 6, 2482);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			append_dev(button, t);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*handleNext*/ ctx[5], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 8 && t_value !== (t_value = /*$_*/ ctx[3]("modalCreateProjectScreen.next") + "")) set_data_dev(t, t_value);

			if (dirty & /*projectName, currentIndex, MAX_PNAME_LENGTH*/ 5) {
				toggle_class(button, "button-disabled", /*projectName*/ ctx[2].trim() === "" && /*currentIndex*/ ctx[0] === 0 || /*projectName*/ ctx[2].length > MAX_PNAME_LENGTH);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(82:4) {#if currentIndex == 0}",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let div2;
	let t0;
	let div0;
	let current_block_type_index;
	let if_block1;
	let t1;
	let div1;
	let current;
	let if_block0 = /*currentIndex*/ ctx[0] != 0 && create_if_block_3$3(ctx);
	const if_block_creators = [create_if_block_1$3, create_if_block_2$3];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*currentIndex*/ ctx[0] === 0) return 0;
		if (/*currentIndex*/ ctx[0] === 1) return 1;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	let if_block2 = /*currentIndex*/ ctx[0] == 0 && create_if_block$8(ctx);

	const block = {
		c: function create() {
			div2 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			div0 = element("div");
			if (if_block1) if_block1.c();
			t1 = space();
			div1 = element("div");
			if (if_block2) if_block2.c();
			attr_dev(div0, "class", "content-wrapper__page-content-wrapper");
			add_location(div0, file$9, 70, 2, 2106);
			attr_dev(div1, "class", "content-wrapper__button-container svelte-1o9arsq");
			add_location(div1, file$9, 80, 2, 2398);
			attr_dev(div2, "class", "content-wrapper svelte-1o9arsq");
			add_location(div2, file$9, 60, 0, 1834);
		},
		l: function claim(nodes) {
			throw new Error_1$2("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			if (if_block0) if_block0.m(div2, null);
			append_dev(div2, t0);
			append_dev(div2, div0);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(div0, null);
			}

			append_dev(div2, t1);
			append_dev(div2, div1);
			if (if_block2) if_block2.m(div1, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*currentIndex*/ ctx[0] != 0) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_3$3(ctx);
					if_block0.c();
					if_block0.m(div2, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block1) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block1 = if_blocks[current_block_type_index];

					if (!if_block1) {
						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block1.c();
					} else {
						if_block1.p(ctx, dirty);
					}

					transition_in(if_block1, 1);
					if_block1.m(div0, null);
				} else {
					if_block1 = null;
				}
			}

			if (/*currentIndex*/ ctx[0] == 0) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block$8(ctx);
					if_block2.c();
					if_block2.m(div1, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if (if_block0) if_block0.d();

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}

			if (if_block2) if_block2.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const backendUrl$4 = "http://localhost:8080";
const MAX_PNAME_LENGTH = 22;

function instance$a($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(3, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('CreateProjectScreen', slots, []);
	const dispatch = createEventDispatcher();
	let currentIndex = 0;
	let emailEntries = [];
	const inviteTitle = $_("modalCreateProjectScreen.inviteTitle");
	const createTitle = $_("modalCreateProjectScreen.createProject");

	// add by link is active by default
	let selection = 1;

	let projectName = "";

	// goes back to previous page, also resets AddByLinkBox to active
	// when swapping pages, and disptaches an event to change title
	function handlePrevious() {
		dispatch("titleChange", { createTitle });
		$$invalidate(0, currentIndex -= 1);
		selection = 1;
	}

	// dispatches an event that signals that the page switched meaning
	// the title must be changed to second page, also uses it's parent
	// component to set the modal title
	function handleNext() {
		dispatch("titleChange", { inviteTitle });
		$$invalidate(0, currentIndex += 1);
	}

	async function handleSubmitProject() {
		await fetch(backendUrl$4 + "/api/project/create/" + projectName, {
			method: "GET",
			headers: { Accept: "application/json" },
			credentials: "include"
		}).then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response.json();
		}).catch(error => {
			console.error(error.message);
		});

		dispatch("closeModal");
		dispatch("projectCreated");
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<CreateProjectScreen> was created with unknown prop '${key}'`);
	});

	function nameproject_projectName_binding(value) {
		projectName = value;
		$$invalidate(2, projectName);
	}

	function toggleaddbylinkandemail_emailEntries_binding(value) {
		emailEntries = value;
		$$invalidate(1, emailEntries);
	}

	$$self.$capture_state = () => ({
		createEventDispatcher,
		_: $format,
		ArrowBack: img$c,
		NameProject: NameOrRenameProject,
		ToggleAddByLinkAndEmail,
		backendUrl: backendUrl$4,
		MAX_PNAME_LENGTH,
		dispatch,
		currentIndex,
		emailEntries,
		inviteTitle,
		createTitle,
		selection,
		projectName,
		handlePrevious,
		handleNext,
		handleSubmitProject,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('currentIndex' in $$props) $$invalidate(0, currentIndex = $$props.currentIndex);
		if ('emailEntries' in $$props) $$invalidate(1, emailEntries = $$props.emailEntries);
		if ('selection' in $$props) selection = $$props.selection;
		if ('projectName' in $$props) $$invalidate(2, projectName = $$props.projectName);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		currentIndex,
		emailEntries,
		projectName,
		$_,
		handlePrevious,
		handleNext,
		handleSubmitProject,
		nameproject_projectName_binding,
		toggleaddbylinkandemail_emailEntries_binding
	];
}

class CreateProjectScreen extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CreateProjectScreen",
			options,
			id: create_fragment$a.name
		});
	}
}

var img$9 = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3ctitle/%3e%3cg data-name='Layer 57' id='Layer_57'%3e%3cpath d='M18.83%2c16l8.59-8.59a2%2c2%2c0%2c0%2c0-2.83-2.83L16%2c13.17%2c7.41%2c4.59A2%2c2%2c0%2c0%2c0%2c4.59%2c7.41L13.17%2c16%2c4.59%2c24.59a2%2c2%2c0%2c1%2c0%2c2.83%2c2.83L16%2c18.83l8.59%2c8.59a2%2c2%2c0%2c0%2c0%2c2.83-2.83Z'/%3e%3c/g%3e%3c/svg%3e";

/* src\Components\Modal\Modal.svelte generated by Svelte v3.59.2 */
const file$8 = "src\\Components\\Modal\\Modal.svelte";

// (47:0) {#if isOpen}
function create_if_block$7(ctx) {
	let div2;
	let div1;
	let h1;
	let t0;
	let t1;
	let img;
	let img_src_value;
	let img_alt_value;
	let t2;
	let div0;
	let t3;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[8].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

	const block = {
		c: function create() {
			div2 = element("div");
			div1 = element("div");
			h1 = element("h1");
			t0 = text(/*panelName*/ ctx[0]);
			t1 = space();
			img = element("img");
			t2 = space();
			div0 = element("div");
			t3 = space();
			if (default_slot) default_slot.c();
			attr_dev(h1, "class", "backdrop__header svelte-5t89we");
			add_location(h1, file$8, 60, 6, 1292);
			attr_dev(img, "class", "backdrop__exit-icon svelte-5t89we");
			if (!src_url_equal(img.src, img_src_value = img$9)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*$_*/ ctx[4]("modal.close"));
			add_location(img, file$8, 61, 6, 1345);
			attr_dev(div0, "class", "backdrop__line svelte-5t89we");
			add_location(div0, file$8, 68, 6, 1525);
			attr_dev(div1, "class", "backdrop__modal-content svelte-5t89we");
			set_style(div1, "width", /*width*/ ctx[1]);
			attr_dev(div1, "tabindex", "-1");
			add_location(div1, file$8, 52, 4, 1089);
			attr_dev(div2, "class", "backdrop svelte-5t89we");
			add_location(div2, file$8, 47, 2, 978);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, h1);
			append_dev(h1, t0);
			append_dev(div1, t1);
			append_dev(div1, img);
			append_dev(div1, t2);
			append_dev(div1, div0);
			append_dev(div1, t3);

			if (default_slot) {
				default_slot.m(div1, null);
			}

			/*div1_binding*/ ctx[11](div1);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(img, "click", /*closeModal*/ ctx[5], false, false, false, false),
					listen_dev(img, "keydown", /*closeModal*/ ctx[5], false, false, false, false),
					listen_dev(div1, "click", stop_propagation(/*click_handler*/ ctx[9]), false, false, true, false),
					listen_dev(div1, "keydown", stop_propagation(/*keydown_handler*/ ctx[10]), false, false, true, false),
					listen_dev(div2, "click", /*handleBackdropClick*/ ctx[6], false, false, false, false),
					listen_dev(div2, "keydown", /*handleBackdropClick*/ ctx[6], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (!current || dirty & /*panelName*/ 1) set_data_dev(t0, /*panelName*/ ctx[0]);

			if (!current || dirty & /*$_*/ 16 && img_alt_value !== (img_alt_value = /*$_*/ ctx[4]("modal.close"))) {
				attr_dev(img, "alt", img_alt_value);
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[7],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*width*/ 2) {
				set_style(div1, "width", /*width*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if (default_slot) default_slot.d(detaching);
			/*div1_binding*/ ctx[11](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(47:0) {#if isOpen}",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*isOpen*/ ctx[2] && create_if_block$7(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*isOpen*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*isOpen*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$7(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(4, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Modal', slots, ['default']);
	let { panelName } = $$props;
	let { width } = $$props;
	const dispatch = createEventDispatcher();
	let isOpen = false;
	let content;

	const disableScroll = () => {
		document.body.style.overflow = "hidden";
	};

	const enableScroll = () => {
		document.body.style.overflow = "auto";
	};

	const closeModal = () => {
		$$invalidate(2, isOpen = false);
		enableScroll();
		dispatch("closeModal");
	};

	const handleBackdropClick = event => {
		if (event.target.classList.contains("backdrop")) {
			closeModal();
		}
	};

	onMount(async () => {
		$$invalidate(2, isOpen = true);
		disableScroll();
		await tick();
		if (content) content.focus();
	});

	onDestroy(() => {
		enableScroll();
	});

	$$self.$$.on_mount.push(function () {
		if (panelName === undefined && !('panelName' in $$props || $$self.$$.bound[$$self.$$.props['panelName']])) {
			console.warn("<Modal> was created without expected prop 'panelName'");
		}

		if (width === undefined && !('width' in $$props || $$self.$$.bound[$$self.$$.props['width']])) {
			console.warn("<Modal> was created without expected prop 'width'");
		}
	});

	const writable_props = ['panelName', 'width'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
	});

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	function keydown_handler(event) {
		bubble.call(this, $$self, event);
	}

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			content = $$value;
			$$invalidate(3, content);
		});
	}

	$$self.$$set = $$props => {
		if ('panelName' in $$props) $$invalidate(0, panelName = $$props.panelName);
		if ('width' in $$props) $$invalidate(1, width = $$props.width);
		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		onMount,
		onDestroy,
		tick,
		exitIcon: img$9,
		createEventDispatcher,
		_: $format,
		panelName,
		width,
		dispatch,
		isOpen,
		content,
		disableScroll,
		enableScroll,
		closeModal,
		handleBackdropClick,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('panelName' in $$props) $$invalidate(0, panelName = $$props.panelName);
		if ('width' in $$props) $$invalidate(1, width = $$props.width);
		if ('isOpen' in $$props) $$invalidate(2, isOpen = $$props.isOpen);
		if ('content' in $$props) $$invalidate(3, content = $$props.content);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		panelName,
		width,
		isOpen,
		content,
		$_,
		closeModal,
		handleBackdropClick,
		$$scope,
		slots,
		click_handler,
		keydown_handler,
		div1_binding
	];
}

class Modal extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { panelName: 0, width: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Modal",
			options,
			id: create_fragment$9.name
		});
	}

	get panelName() {
		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set panelName(value) {
		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get width() {
		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set width(value) {
		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\Components\Projects\CreateProject.svelte generated by Svelte v3.59.2 */
const file$7 = "src\\Components\\Projects\\CreateProject.svelte";

// (38:0) {#if showModal}
function create_if_block$6(ctx) {
	let modal;
	let current;

	modal = new Modal({
			props: {
				panelName: /*modalTitle*/ ctx[1]
				? /*modalTitle*/ ctx[1]
				: /*$_*/ ctx[2]("modalCreateProjectScreen.createProject"),
				width: "500px",
				$$slots: { default: [create_default_slot$2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	modal.$on("closeModal", /*toggleModal*/ ctx[3]);

	const block = {
		c: function create() {
			create_component(modal.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(modal, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const modal_changes = {};

			if (dirty & /*modalTitle, $_*/ 6) modal_changes.panelName = /*modalTitle*/ ctx[1]
			? /*modalTitle*/ ctx[1]
			: /*$_*/ ctx[2]("modalCreateProjectScreen.createProject");

			if (dirty & /*$$scope*/ 128) {
				modal_changes.$$scope = { dirty, ctx };
			}

			modal.$set(modal_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(modal.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modal.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(modal, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(38:0) {#if showModal}",
		ctx
	});

	return block;
}

// (39:2) <Modal      panelName={modalTitle        ? modalTitle        : $_("modalCreateProjectScreen.createProject")}      width="500px"      on:closeModal={toggleModal}    >
function create_default_slot$2(ctx) {
	let createprojectscreen;
	let current;
	createprojectscreen = new CreateProjectScreen({ $$inline: true });
	createprojectscreen.$on("closeModal", /*toggleModal*/ ctx[3]);
	createprojectscreen.$on("titleChange", /*updateModalTitle*/ ctx[4]);
	createprojectscreen.$on("projectCreated", /*updateProjectsPage*/ ctx[5]);

	const block = {
		c: function create() {
			create_component(createprojectscreen.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(createprojectscreen, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(createprojectscreen.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(createprojectscreen.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(createprojectscreen, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(39:2) <Modal      panelName={modalTitle        ? modalTitle        : $_(\\\"modalCreateProjectScreen.createProject\\\")}      width=\\\"500px\\\"      on:closeModal={toggleModal}    >",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let div2;
	let div0;
	let p;
	let t0_value = /*$_*/ ctx[2]("projects.createProject") + "";
	let t0;
	let t1;
	let div1;
	let img;
	let img_src_value;
	let img_alt_value;
	let t2;
	let if_block_anchor;
	let current;
	let mounted;
	let dispose;
	let if_block = /*showModal*/ ctx[0] && create_if_block$6(ctx);

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			div1 = element("div");
			img = element("img");
			t2 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr_dev(p, "class", "svelte-1625v8g");
			add_location(p, file$7, 30, 4, 929);
			attr_dev(div0, "class", "project-wrapper__name svelte-1625v8g");
			add_location(div0, file$7, 29, 2, 888);
			if (!src_url_equal(img.src, img_src_value = img$d)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*$_*/ ctx[2]("projects.addNew"));
			attr_dev(img, "class", "svelte-1625v8g");
			add_location(img, file$7, 33, 4, 1021);
			attr_dev(div1, "class", "project-wrapper__play svelte-1625v8g");
			add_location(div1, file$7, 32, 2, 980);
			attr_dev(div2, "class", "project-wrapper svelte-1625v8g");
			add_location(div2, file$7, 28, 0, 807);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, p);
			append_dev(p, t0);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div1, img);
			insert_dev(target, t2, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div2, "click", /*toggleModal*/ ctx[3], false, false, false, false),
					listen_dev(div2, "keydown", /*toggleModal*/ ctx[3], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if ((!current || dirty & /*$_*/ 4) && t0_value !== (t0_value = /*$_*/ ctx[2]("projects.createProject") + "")) set_data_dev(t0, t0_value);

			if (!current || dirty & /*$_*/ 4 && img_alt_value !== (img_alt_value = /*$_*/ ctx[2]("projects.addNew"))) {
				attr_dev(img, "alt", img_alt_value);
			}

			if (/*showModal*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*showModal*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$6(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if (detaching) detach_dev(t2);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(2, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('CreateProject', slots, []);
	const dispatch = createEventDispatcher();
	let showModal = false;
	let modalTitle;

	function toggleModal() {
		$$invalidate(0, showModal = !showModal);

		// clear modalTitle when modal is closed
		$$invalidate(1, modalTitle = "");
	}

	// updates modal title based on passed event from CreateProjectScreen component
	function updateModalTitle(event) {
		$$invalidate(1, modalTitle = event.detail.createTitle || event.detail.inviteTitle);
	}

	function updateProjectsPage() {
		dispatch("updateProjectsPage");
	}

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreateProject> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		createEventDispatcher,
		_: $format,
		AddIcon: img$d,
		CreateProjectScreen,
		Modal,
		dispatch,
		showModal,
		modalTitle,
		toggleModal,
		updateModalTitle,
		updateProjectsPage,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
		if ('modalTitle' in $$props) $$invalidate(1, modalTitle = $$props.modalTitle);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [showModal, modalTitle, $_, toggleModal, updateModalTitle, updateProjectsPage];
}

class CreateProject extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "CreateProject",
			options,
			id: create_fragment$8.name
		});
	}
}

var img$8 = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg enable-background='new 0 0 32 32' id='Layer_3' version='1.1' viewBox='0 0 32 32' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cg%3e%3cpath d='M27.126%2c15.264C28.241%2c14.613%2c29%2c13.417%2c29%2c12.036v-1.571c0-1.477-1.202-2.679-2.679-2.679h-2.643 C22.202%2c7.786%2c21%2c8.987%2c21%2c10.464v1.571c0%2c1.379%2c0.757%2c2.573%2c1.868%2c3.225c-0.912%2c0.416-1.674%2c1.087-2.184%2c1.945 c-0.506-0.341-1.053-0.632-1.639-0.857C19.632%2c15.652%2c20%2c14.765%2c20%2c13.786v-0.888c0-1.716-1.396-3.112-3.112-3.112h-1.775 c-1.716%2c0-3.112%2c1.396-3.112%2c3.112v0.888c0%2c0.98%2c0.368%2c1.866%2c0.954%2c2.562c-0.586%2c0.225-1.133%2c0.516-1.639%2c0.857 c-0.51-0.857-1.272-1.528-2.184-1.945C10.243%2c14.609%2c11%2c13.415%2c11%2c12.036v-1.571c0-1.477-1.202-2.679-2.679-2.679H5.679 C4.202%2c7.786%2c3%2c8.987%2c3%2c10.464v1.571c0%2c1.382%2c0.759%2c2.578%2c1.874%2c3.228C3.182%2c16.043%2c2%2c17.706%2c2%2c19.643c0%2c0.552%2c0.448%2c1%2c1%2c1 s1-0.448%2c1-1c0-1.576%2c1.346-2.857%2c3-2.857c1.222%2c0%2c2.32%2c0.723%2c2.775%2c1.773C8.667%2c19.834%2c8%2c21.452%2c8%2c23.214c0%2c0.552%2c0.448%2c1%2c1%2c1 s1-0.448%2c1-1c0-2.993%2c2.691-5.429%2c6-5.429s6%2c2.436%2c6%2c5.429c0%2c0.552%2c0.448%2c1%2c1%2c1s1-0.448%2c1-1c0-1.762-0.667-3.38-1.775-4.655 c0.455-1.05%2c1.553-1.773%2c2.775-1.773c1.654%2c0%2c3%2c1.282%2c3%2c2.857c0%2c0.552%2c0.448%2c1%2c1%2c1s1-0.448%2c1-1 C30%2c17.706%2c28.818%2c16.043%2c27.126%2c15.264z M5%2c10.464c0-0.374%2c0.305-0.679%2c0.679-0.679h2.643C8.695%2c9.786%2c9%2c10.09%2c9%2c10.464v1.571 c0%2c0.965-0.785%2c1.75-1.75%2c1.75h-0.5C5.785%2c13.786%2c5%2c13%2c5%2c12.036V10.464z M14%2c13.786v-0.888c0-0.613%2c0.499-1.112%2c1.112-1.112h1.775 c0.613%2c0%2c1.112%2c0.499%2c1.112%2c1.112v0.888c0%2c1.103-0.897%2c2-2%2c2S14%2c14.889%2c14%2c13.786z M23%2c10.464c0-0.374%2c0.305-0.679%2c0.679-0.679 h2.643c0.374%2c0%2c0.679%2c0.305%2c0.679%2c0.679v1.571c0%2c0.965-0.785%2c1.75-1.75%2c1.75h-0.5c-0.965%2c0-1.75-0.785-1.75-1.75V10.464z'/%3e%3c/g%3e%3c/svg%3e";

var img$7 = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3e%3crect fill='none' height='256' width='256'/%3e%3cpath d='M32%2c208V64a8%2c8%2c0%2c0%2c1%2c8-8H93.3a8.1%2c8.1%2c0%2c0%2c1%2c4.8%2c1.6l27.8%2c20.8a8.1%2c8.1%2c0%2c0%2c0%2c4.8%2c1.6H200a8%2c8%2c0%2c0%2c1%2c8%2c8v24' fill='none' stroke='black' stroke-linecap='round' stroke-linejoin='round' stroke-width='12'/%3e%3cpath d='M32%2c208l30.2-90.5a8%2c8%2c0%2c0%2c1%2c7.6-5.5H228.9a8%2c8%2c0%2c0%2c1%2c7.6%2c10.5L208%2c208Z' fill='none' stroke='black' stroke-linecap='round' stroke-linejoin='round' stroke-width='12'/%3e%3c/svg%3e";

var img$6 = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cstyle%3e.cls-1%7bfill:none%3bstroke:black%3bstroke-linecap:round%3bstroke-linejoin:round%3bstroke-width:2px%3b%7d%3c/style%3e%3c/defs%3e%3ctitle/%3e%3cg data-name='28-pencil' id='_28-pencil'%3e%3cpolygon class='cls-1' points='1 23 1 31 9 31 31 9 23 1 1 23'/%3e%3cline class='cls-1' x1='19' x2='27' y1='5' y2='13'/%3e%3cline class='cls-1' x1='16' x2='24' y1='8' y2='16'/%3e%3cline class='cls-1' x1='1' x2='9' y1='23' y2='31'/%3e%3cline class='cls-1' x1='5' x2='17' y1='27' y2='15'/%3e%3c/g%3e%3c/svg%3e";

var img$5 = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg fill='none' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath clip-rule='evenodd' d='M6 4C5.44772 4 5 4.44771 5 5L5 19C5 19.5523 5.44772 20 6 20H14C14.5523 20 15 20.4477 15 21C15 21.5523 14.5523 22 14 22H6C4.34315 22 3 20.6569 3 19L3 5C3 3.34314 4.34315 2 6 2L14 2C14.5523 2 15 2.44772 15 3C15 3.55229 14.5523 4 14 4L6 4ZM15.2929 7.29289C15.6834 6.90237 16.3166 6.90237 16.7071 7.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929L17.5858 13H9C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11H17.5858L15.2929 8.70711C14.9024 8.31658 14.9024 7.68342 15.2929 7.29289Z' fill='black' fill-rule='evenodd'/%3e%3c/svg%3e";

/* src\Components\Modal\Components\DeleteOrLeave.svelte generated by Svelte v3.59.2 */

const { Error: Error_1$1, console: console_1$1 } = globals;
const file$6 = "src\\Components\\Modal\\Components\\DeleteOrLeave.svelte";

function create_fragment$7(ctx) {
	let div4;
	let div0;
	let h3;
	let span;
	let t0_value = /*$_*/ ctx[1]("modalDeleteOrLeave.warningDelete") + "";
	let t0;
	let t1;

	let t2_value = (/*isLeaveComponent*/ ctx[0]
	? /*$_*/ ctx[1]("modalDeleteOrLeave.warningLeaveText")
	: /*$_*/ ctx[1]("modalDeleteOrLeave.warningDeleteText")) + "";

	let t2;
	let t3;
	let div3;
	let div1;
	let button0;
	let t4_value = /*$_*/ ctx[1]("modalDeleteOrLeave.cancel") + "";
	let t4;
	let t5;
	let div2;
	let button1;

	let t6_value = (/*isLeaveComponent*/ ctx[0]
	? /*$_*/ ctx[1]("modalDeleteOrLeave.leave")
	: /*$_*/ ctx[1]("modalDeleteOrLeave.delete")) + "";

	let t6;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div4 = element("div");
			div0 = element("div");
			h3 = element("h3");
			span = element("span");
			t0 = text(t0_value);
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			div3 = element("div");
			div1 = element("div");
			button0 = element("button");
			t4 = text(t4_value);
			t5 = space();
			div2 = element("div");
			button1 = element("button");
			t6 = text(t6_value);
			attr_dev(span, "class", "svelte-161ohji");
			add_location(span, file$6, 48, 6, 1145);
			attr_dev(h3, "class", "svelte-161ohji");
			add_location(h3, file$6, 47, 4, 1133);
			attr_dev(div0, "class", "content-wrapper__warning-wrapper svelte-161ohji");
			add_location(div0, file$6, 46, 2, 1081);
			attr_dev(button0, "class", "button--blue font-size-20 svelte-161ohji");
			add_location(button0, file$6, 56, 6, 1462);
			attr_dev(div1, "class", "content-wrapper__button-wrapper svelte-161ohji");
			add_location(div1, file$6, 55, 4, 1409);
			attr_dev(button1, "class", "button-red font-size-20 svelte-161ohji");
			add_location(button1, file$6, 61, 6, 1659);
			attr_dev(div2, "class", "content-wrapper__button-wrapper svelte-161ohji");
			add_location(div2, file$6, 60, 4, 1606);
			attr_dev(div3, "class", "content-wrapper__button-container svelte-161ohji");
			add_location(div3, file$6, 54, 2, 1356);
			attr_dev(div4, "class", "content-wrapper svelte-161ohji");
			add_location(div4, file$6, 45, 0, 1048);
		},
		l: function claim(nodes) {
			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, div0);
			append_dev(div0, h3);
			append_dev(h3, span);
			append_dev(span, t0);
			append_dev(h3, t1);
			append_dev(h3, t2);
			append_dev(div4, t3);
			append_dev(div4, div3);
			append_dev(div3, div1);
			append_dev(div1, button0);
			append_dev(button0, t4);
			append_dev(div3, t5);
			append_dev(div3, div2);
			append_dev(div2, button1);
			append_dev(button1, t6);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*handleCancel*/ ctx[3], false, false, false, false),
					listen_dev(button1, "click", /*handleAction*/ ctx[2], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$_*/ 2 && t0_value !== (t0_value = /*$_*/ ctx[1]("modalDeleteOrLeave.warningDelete") + "")) set_data_dev(t0, t0_value);

			if (dirty & /*isLeaveComponent, $_*/ 3 && t2_value !== (t2_value = (/*isLeaveComponent*/ ctx[0]
			? /*$_*/ ctx[1]("modalDeleteOrLeave.warningLeaveText")
			: /*$_*/ ctx[1]("modalDeleteOrLeave.warningDeleteText")) + "")) set_data_dev(t2, t2_value);

			if (dirty & /*$_*/ 2 && t4_value !== (t4_value = /*$_*/ ctx[1]("modalDeleteOrLeave.cancel") + "")) set_data_dev(t4, t4_value);

			if (dirty & /*isLeaveComponent, $_*/ 3 && t6_value !== (t6_value = (/*isLeaveComponent*/ ctx[0]
			? /*$_*/ ctx[1]("modalDeleteOrLeave.leave")
			: /*$_*/ ctx[1]("modalDeleteOrLeave.delete")) + "")) set_data_dev(t6, t6_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const backendUrl$3 = "http://localhost:8080";

function instance$7($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(1, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DeleteOrLeave', slots, []);
	let { projectId } = $$props;
	let { isLeaveComponent = false } = $$props;
	const dispatch = createEventDispatcher();

	function handleAction() {
		if (isLeaveComponent) {
			handleLeave();
		} else {
			handleDelete();
		}
	}

	function handleCancel() {
		dispatch("closeModal");
	}

	async function handleDelete() {
		await fetch(backendUrl$3 + `/api/project/${projectId}`, {
			method: "DELETE",
			headers: { Accept: "application/json" },
			credentials: "include"
		}).then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response.json();
		});

		dispatch("projectDeleted");
	}

	async function handleLeave() {
		// TODO: Implement handleLeave function
		console.log("Leave project");

		dispatch("projectLeft");
	}

	$$self.$$.on_mount.push(function () {
		if (projectId === undefined && !('projectId' in $$props || $$self.$$.bound[$$self.$$.props['projectId']])) {
			console_1$1.warn("<DeleteOrLeave> was created without expected prop 'projectId'");
		}
	});

	const writable_props = ['projectId', 'isLeaveComponent'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<DeleteOrLeave> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('projectId' in $$props) $$invalidate(4, projectId = $$props.projectId);
		if ('isLeaveComponent' in $$props) $$invalidate(0, isLeaveComponent = $$props.isLeaveComponent);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		_: $format,
		projectId,
		isLeaveComponent,
		dispatch,
		backendUrl: backendUrl$3,
		handleAction,
		handleCancel,
		handleDelete,
		handleLeave,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('projectId' in $$props) $$invalidate(4, projectId = $$props.projectId);
		if ('isLeaveComponent' in $$props) $$invalidate(0, isLeaveComponent = $$props.isLeaveComponent);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [isLeaveComponent, $_, handleAction, handleCancel, projectId];
}

class DeleteOrLeave extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, { projectId: 4, isLeaveComponent: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DeleteOrLeave",
			options,
			id: create_fragment$7.name
		});
	}

	get projectId() {
		throw new Error_1$1("<DeleteOrLeave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set projectId(value) {
		throw new Error_1$1("<DeleteOrLeave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isLeaveComponent() {
		throw new Error_1$1("<DeleteOrLeave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isLeaveComponent(value) {
		throw new Error_1$1("<DeleteOrLeave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var img$4 = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3ctitle/%3e%3cg data-name='Layer 2' id='Layer_2'%3e%3cpath d='M22%2c9a1%2c1%2c0%2c0%2c0%2c0%2c1.42l4.6%2c4.6H3.06a1%2c1%2c0%2c1%2c0%2c0%2c2H26.58L22%2c21.59A1%2c1%2c0%2c0%2c0%2c22%2c23a1%2c1%2c0%2c0%2c0%2c1.41%2c0l6.36-6.36a.88.88%2c0%2c0%2c0%2c0-1.27L23.42%2c9A1%2c1%2c0%2c0%2c0%2c22%2c9Z'/%3e%3c/g%3e%3c/svg%3e";

/* src\Components\Projects\LeftNavigation.svelte generated by Svelte v3.59.2 */

const { console: console_1 } = globals;
const file$5 = "src\\Components\\Projects\\LeftNavigation.svelte";

// (147:4) {#if isOwner}
function create_if_block_5$2(ctx) {
	let li0;
	let button0;
	let img0;
	let img0_src_value;
	let t0;
	let h30;
	let t1_value = /*$_*/ ctx[7]("projectsLeftSideNav.team") + "";
	let t1;
	let h30_class_value;
	let button0_class_value;
	let t2;
	let li1;
	let button1;
	let img1;
	let img1_src_value;
	let t3;
	let h31;
	let t4_value = /*$_*/ ctx[7]("projectsLeftSideNav.rename") + "";
	let t4;
	let h31_class_value;
	let button1_class_value;
	let t5;
	let li2;
	let button2;
	let img2;
	let img2_src_value;
	let t6;
	let h32;
	let t7_value = /*$_*/ ctx[7]("projectsLeftSideNav.delete") + "";
	let t7;
	let h32_class_value;
	let button2_class_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			li0 = element("li");
			button0 = element("button");
			img0 = element("img");
			t0 = space();
			h30 = element("h3");
			t1 = text(t1_value);
			t2 = space();
			li1 = element("li");
			button1 = element("button");
			img1 = element("img");
			t3 = space();
			h31 = element("h3");
			t4 = text(t4_value);
			t5 = space();
			li2 = element("li");
			button2 = element("button");
			img2 = element("img");
			t6 = space();
			h32 = element("h3");
			t7 = text(t7_value);
			attr_dev(img0, "class", "nav-panel__icon svelte-14zhem");
			if (!src_url_equal(img0.src, img0_src_value = img$8)) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", "");
			add_location(img0, file$5, 151, 11, 4394);
			attr_dev(h30, "class", h30_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem");
			add_location(h30, file$5, 152, 10, 4465);
			attr_dev(button0, "class", button0_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem");
			add_location(button0, file$5, 148, 8, 4270);
			add_location(li0, file$5, 147, 6, 4256);
			attr_dev(img1, "class", "nav-panel__icon svelte-14zhem");
			if (!src_url_equal(img1.src, img1_src_value = img$6)) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", "");
			add_location(img1, file$5, 161, 11, 4762);
			attr_dev(h31, "class", h31_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem");
			add_location(h31, file$5, 162, 10, 4829);
			attr_dev(button1, "class", button1_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem");
			add_location(button1, file$5, 158, 8, 4636);
			add_location(li1, file$5, 157, 6, 4622);
			attr_dev(img2, "class", "nav-panel__icon svelte-14zhem");
			if (!src_url_equal(img2.src, img2_src_value = img$b)) attr_dev(img2, "src", img2_src_value);
			attr_dev(img2, "alt", "");
			add_location(img2, file$5, 171, 11, 5128);
			attr_dev(h32, "class", h32_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem");
			add_location(h32, file$5, 172, 10, 5195);
			attr_dev(button2, "class", button2_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem");
			add_location(button2, file$5, 168, 8, 5002);
			add_location(li2, file$5, 167, 6, 4988);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li0, anchor);
			append_dev(li0, button0);
			append_dev(button0, img0);
			append_dev(button0, t0);
			append_dev(button0, h30);
			append_dev(h30, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, li1, anchor);
			append_dev(li1, button1);
			append_dev(button1, img1);
			append_dev(button1, t3);
			append_dev(button1, h31);
			append_dev(h31, t4);
			insert_dev(target, t5, anchor);
			insert_dev(target, li2, anchor);
			append_dev(li2, button2);
			append_dev(button2, img2);
			append_dev(button2, t6);
			append_dev(button2, h32);
			append_dev(h32, t7);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*toggleTeamModal*/ ctx[8], false, false, false, false),
					listen_dev(button1, "click", /*toggleRenameModal*/ ctx[10], false, false, false, false),
					listen_dev(button2, "click", /*toggleDeleteModal*/ ctx[9], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 128 && t1_value !== (t1_value = /*$_*/ ctx[7]("projectsLeftSideNav.team") + "")) set_data_dev(t1, t1_value);

			if (dirty & /*isMenuOpen*/ 64 && h30_class_value !== (h30_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem")) {
				attr_dev(h30, "class", h30_class_value);
			}

			if (dirty & /*isMenuOpen*/ 64 && button0_class_value !== (button0_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem")) {
				attr_dev(button0, "class", button0_class_value);
			}

			if (dirty & /*$_*/ 128 && t4_value !== (t4_value = /*$_*/ ctx[7]("projectsLeftSideNav.rename") + "")) set_data_dev(t4, t4_value);

			if (dirty & /*isMenuOpen*/ 64 && h31_class_value !== (h31_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem")) {
				attr_dev(h31, "class", h31_class_value);
			}

			if (dirty & /*isMenuOpen*/ 64 && button1_class_value !== (button1_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem")) {
				attr_dev(button1, "class", button1_class_value);
			}

			if (dirty & /*$_*/ 128 && t7_value !== (t7_value = /*$_*/ ctx[7]("projectsLeftSideNav.delete") + "")) set_data_dev(t7, t7_value);

			if (dirty & /*isMenuOpen*/ 64 && h32_class_value !== (h32_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem")) {
				attr_dev(h32, "class", h32_class_value);
			}

			if (dirty & /*isMenuOpen*/ 64 && button2_class_value !== (button2_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem")) {
				attr_dev(button2, "class", button2_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li0);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(li1);
			if (detaching) detach_dev(t5);
			if (detaching) detach_dev(li2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_5$2.name,
		type: "if",
		source: "(147:4) {#if isOwner}",
		ctx
	});

	return block;
}

// (179:4) {#if !isOwner}
function create_if_block_4$2(ctx) {
	let li;
	let button;
	let img;
	let img_src_value;
	let t0;
	let h3;
	let t1_value = /*$_*/ ctx[7]("projectsLeftSideNav.leave") + "";
	let t1;
	let h3_class_value;
	let button_class_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			li = element("li");
			button = element("button");
			img = element("img");
			t0 = space();
			h3 = element("h3");
			t1 = text(t1_value);
			attr_dev(img, "class", "nav-panel__icon svelte-14zhem");
			if (!src_url_equal(img.src, img_src_value = img$5)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "");
			add_location(img, file$5, 183, 11, 5524);
			attr_dev(h3, "class", h3_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem");
			add_location(h3, file$5, 184, 10, 5590);
			attr_dev(button, "class", button_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem");
			add_location(button, file$5, 180, 8, 5399);
			add_location(li, file$5, 179, 6, 5385);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, button);
			append_dev(button, img);
			append_dev(button, t0);
			append_dev(button, h3);
			append_dev(h3, t1);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*toggleLeaveModal*/ ctx[11], false, false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 128 && t1_value !== (t1_value = /*$_*/ ctx[7]("projectsLeftSideNav.leave") + "")) set_data_dev(t1, t1_value);

			if (dirty & /*isMenuOpen*/ 64 && h3_class_value !== (h3_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem")) {
				attr_dev(h3, "class", h3_class_value);
			}

			if (dirty & /*isMenuOpen*/ 64 && button_class_value !== (button_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem")) {
				attr_dev(button, "class", button_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4$2.name,
		type: "if",
		source: "(179:4) {#if !isOwner}",
		ctx
	});

	return block;
}

// (193:0) {#if showTeamModal}
function create_if_block_3$2(ctx) {
	let modal;
	let current;

	modal = new Modal({
			props: {
				panelName: /*$_*/ ctx[7]("projectsLeftSideNav.inviteTitle"),
				width: "500px",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	modal.$on("closeModal", /*toggleTeamModal*/ ctx[8]);

	const block = {
		c: function create() {
			create_component(modal.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(modal, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const modal_changes = {};
			if (dirty & /*$_*/ 128) modal_changes.panelName = /*$_*/ ctx[7]("projectsLeftSideNav.inviteTitle");

			if (dirty & /*$$scope*/ 2097152) {
				modal_changes.$$scope = { dirty, ctx };
			}

			modal.$set(modal_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(modal.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modal.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(modal, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$2.name,
		type: "if",
		source: "(193:0) {#if showTeamModal}",
		ctx
	});

	return block;
}

// (194:2) <Modal      panelName={$_("projectsLeftSideNav.inviteTitle")}      width="500px"      on:closeModal={toggleTeamModal}      >
function create_default_slot_3(ctx) {
	let toggleaddbylinkandemail;
	let current;

	toggleaddbylinkandemail = new ToggleAddByLinkAndEmail({
			props: { isUpdateComponent: true },
			$$inline: true
		});

	toggleaddbylinkandemail.$on("confirm", /*handleProjectTeamUpdate*/ ctx[15]);

	const block = {
		c: function create() {
			create_component(toggleaddbylinkandemail.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(toggleaddbylinkandemail, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(toggleaddbylinkandemail.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(toggleaddbylinkandemail.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(toggleaddbylinkandemail, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(194:2) <Modal      panelName={$_(\\\"projectsLeftSideNav.inviteTitle\\\")}      width=\\\"500px\\\"      on:closeModal={toggleTeamModal}      >",
		ctx
	});

	return block;
}

// (204:0) {#if showDeleteModal}
function create_if_block_2$2(ctx) {
	let modal;
	let current;

	modal = new Modal({
			props: {
				panelName: /*$_*/ ctx[7]("modalDeleteOrLeave.deleteProject"),
				width: "500px",
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	modal.$on("closeModal", /*toggleDeleteModal*/ ctx[9]);

	const block = {
		c: function create() {
			create_component(modal.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(modal, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const modal_changes = {};
			if (dirty & /*$_*/ 128) modal_changes.panelName = /*$_*/ ctx[7]("modalDeleteOrLeave.deleteProject");

			if (dirty & /*$$scope, project*/ 2097154) {
				modal_changes.$$scope = { dirty, ctx };
			}

			modal.$set(modal_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(modal.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modal.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(modal, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(204:0) {#if showDeleteModal}",
		ctx
	});

	return block;
}

// (205:2) <Modal      panelName={$_("modalDeleteOrLeave.deleteProject")}      width="500px"      on:closeModal={toggleDeleteModal}      >
function create_default_slot_2(ctx) {
	let deleteorleave;
	let current;

	deleteorleave = new DeleteOrLeave({
			props: { projectId: /*project*/ ctx[1].id },
			$$inline: true
		});

	deleteorleave.$on("closeModal", /*toggleDeleteModal*/ ctx[9]);
	deleteorleave.$on("projectDeleted", /*handleProjectDelete*/ ctx[13]);

	const block = {
		c: function create() {
			create_component(deleteorleave.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(deleteorleave, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const deleteorleave_changes = {};
			if (dirty & /*project*/ 2) deleteorleave_changes.projectId = /*project*/ ctx[1].id;
			deleteorleave.$set(deleteorleave_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(deleteorleave.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(deleteorleave.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(deleteorleave, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(205:2) <Modal      panelName={$_(\\\"modalDeleteOrLeave.deleteProject\\\")}      width=\\\"500px\\\"      on:closeModal={toggleDeleteModal}      >",
		ctx
	});

	return block;
}

// (216:0) {#if showRenameModal}
function create_if_block_1$2(ctx) {
	let modal;
	let current;

	modal = new Modal({
			props: {
				panelName: /*$_*/ ctx[7]("modalNameOrRenameProject.renameProject"),
				width: "500px",
				$$slots: { default: [create_default_slot_1$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	modal.$on("closeModal", /*toggleRenameModal*/ ctx[10]);

	const block = {
		c: function create() {
			create_component(modal.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(modal, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const modal_changes = {};
			if (dirty & /*$_*/ 128) modal_changes.panelName = /*$_*/ ctx[7]("modalNameOrRenameProject.renameProject");

			if (dirty & /*$$scope, project*/ 2097154) {
				modal_changes.$$scope = { dirty, ctx };
			}

			modal.$set(modal_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(modal.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modal.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(modal, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(216:0) {#if showRenameModal}",
		ctx
	});

	return block;
}

// (217:2) <Modal      panelName={$_("modalNameOrRenameProject.renameProject")}      width="500px"      on:closeModal={toggleRenameModal}      >
function create_default_slot_1$1(ctx) {
	let renameproject;
	let current;

	renameproject = new NameOrRenameProject({
			props: {
				isRenameComponent: true,
				projectName: /*project*/ ctx[1].name,
				projectId: /*project*/ ctx[1].id
			},
			$$inline: true
		});

	renameproject.$on("projectRenamed", /*handleProjectRename*/ ctx[12]);

	const block = {
		c: function create() {
			create_component(renameproject.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(renameproject, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const renameproject_changes = {};
			if (dirty & /*project*/ 2) renameproject_changes.projectName = /*project*/ ctx[1].name;
			if (dirty & /*project*/ 2) renameproject_changes.projectId = /*project*/ ctx[1].id;
			renameproject.$set(renameproject_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(renameproject.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(renameproject.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(renameproject, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1$1.name,
		type: "slot",
		source: "(217:2) <Modal      panelName={$_(\\\"modalNameOrRenameProject.renameProject\\\")}      width=\\\"500px\\\"      on:closeModal={toggleRenameModal}      >",
		ctx
	});

	return block;
}

// (229:0) {#if showLeaveModal}
function create_if_block$5(ctx) {
	let modal;
	let current;

	modal = new Modal({
			props: {
				panelName: /*$_*/ ctx[7]("modalDeleteOrLeave.leaveProject"),
				width: "500px",
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	modal.$on("closeModal", /*toggleLeaveModal*/ ctx[11]);

	const block = {
		c: function create() {
			create_component(modal.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(modal, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const modal_changes = {};
			if (dirty & /*$_*/ 128) modal_changes.panelName = /*$_*/ ctx[7]("modalDeleteOrLeave.leaveProject");

			if (dirty & /*$$scope, project*/ 2097154) {
				modal_changes.$$scope = { dirty, ctx };
			}

			modal.$set(modal_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(modal.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modal.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(modal, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(229:0) {#if showLeaveModal}",
		ctx
	});

	return block;
}

// (230:2) <Modal      panelName={$_("modalDeleteOrLeave.leaveProject")}      width="500px"      on:closeModal={toggleLeaveModal}      >
function create_default_slot$1(ctx) {
	let deleteorleave;
	let current;

	deleteorleave = new DeleteOrLeave({
			props: {
				isLeaveComponent: true,
				projectId: /*project*/ ctx[1].id
			},
			$$inline: true
		});

	deleteorleave.$on("closeModal", /*toggleLeaveModal*/ ctx[11]);
	deleteorleave.$on("projectLeft", /*handleLeaveProject*/ ctx[14]);

	const block = {
		c: function create() {
			create_component(deleteorleave.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(deleteorleave, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const deleteorleave_changes = {};
			if (dirty & /*project*/ 2) deleteorleave_changes.projectId = /*project*/ ctx[1].id;
			deleteorleave.$set(deleteorleave_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(deleteorleave.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(deleteorleave.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(deleteorleave, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(230:2) <Modal      panelName={$_(\\\"modalDeleteOrLeave.leaveProject\\\")}      width=\\\"500px\\\"      on:closeModal={toggleLeaveModal}      >",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let nav;
	let ul;
	let li0;
	let img0;
	let img0_src_value;
	let img0_alt_value;
	let t0;
	let img1;
	let img1_src_value;
	let img1_alt_value;
	let img1_class_value;
	let t1;
	let li1;
	let h30;
	let t2_value = /*project*/ ctx[1].name + "";
	let t2;
	let h30_class_value;
	let t3;
	let li2;
	let button0;
	let img2;
	let img2_src_value;
	let t4;
	let h31;
	let t5_value = /*$_*/ ctx[7]("projectsLeftSideNav.open") + "";
	let t5;
	let h31_class_value;
	let button0_class_value;
	let t6;
	let li3;
	let button1;
	let img3;
	let img3_src_value;
	let t7;
	let h32;
	let t8_value = /*$_*/ ctx[7]("projectsLeftSideNav.save") + "";
	let t8;
	let h32_class_value;
	let button1_class_value;
	let t9;
	let t10;
	let nav_class_value;
	let nav_style_value;
	let t11;
	let t12;
	let t13;
	let t14;
	let if_block5_anchor;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*isOwner*/ ctx[0] && create_if_block_5$2(ctx);
	let if_block1 = !/*isOwner*/ ctx[0] && create_if_block_4$2(ctx);
	let if_block2 = /*showTeamModal*/ ctx[2] && create_if_block_3$2(ctx);
	let if_block3 = /*showDeleteModal*/ ctx[3] && create_if_block_2$2(ctx);
	let if_block4 = /*showRenameModal*/ ctx[4] && create_if_block_1$2(ctx);
	let if_block5 = /*showLeaveModal*/ ctx[5] && create_if_block$5(ctx);

	const block = {
		c: function create() {
			nav = element("nav");
			ul = element("ul");
			li0 = element("li");
			img0 = element("img");
			t0 = space();
			img1 = element("img");
			t1 = space();
			li1 = element("li");
			h30 = element("h3");
			t2 = text(t2_value);
			t3 = space();
			li2 = element("li");
			button0 = element("button");
			img2 = element("img");
			t4 = space();
			h31 = element("h3");
			t5 = text(t5_value);
			t6 = space();
			li3 = element("li");
			button1 = element("button");
			img3 = element("img");
			t7 = space();
			h32 = element("h3");
			t8 = text(t8_value);
			t9 = space();
			if (if_block0) if_block0.c();
			t10 = space();
			if (if_block1) if_block1.c();
			t11 = space();
			if (if_block2) if_block2.c();
			t12 = space();
			if (if_block3) if_block3.c();
			t13 = space();
			if (if_block4) if_block4.c();
			t14 = space();
			if (if_block5) if_block5.c();
			if_block5_anchor = empty();
			if (!src_url_equal(img0.src, img0_src_value = img$c)) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", img0_alt_value = /*$_*/ ctx[7]("projectsLeftSideNav.altClose"));
			attr_dev(img0, "class", "nav-panel__toggle-icon-close svelte-14zhem");
			add_location(img0, file$5, 102, 6, 2887);
			if (!src_url_equal(img1.src, img1_src_value = img$4)) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", img1_alt_value = /*$_*/ ctx[7]("projectsLeftSideNav.altOpen"));
			attr_dev(img1, "class", img1_class_value = "nav-panel__toggle-icon-open " + (/*isMenuOpen*/ ctx[6] ? 'transition' : 'show') + " svelte-14zhem");
			add_location(img1, file$5, 109, 6, 3094);
			attr_dev(li0, "class", "nav-panel__icon-container svelte-14zhem");
			add_location(li0, file$5, 101, 4, 2841);
			attr_dev(h30, "class", h30_class_value = "nav-panel__name-container transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem");
			add_location(h30, file$5, 118, 6, 3390);
			attr_dev(li1, "class", "nav-panel__name-wrapper svelte-14zhem");
			add_location(li1, file$5, 117, 4, 3346);
			attr_dev(img2, "class", "nav-panel__icon svelte-14zhem");
			if (!src_url_equal(img2.src, img2_src_value = img$7)) attr_dev(img2, "src", img2_src_value);
			attr_dev(img2, "alt", "");
			add_location(img2, file$5, 130, 9, 3689);
			attr_dev(h31, "class", h31_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem");
			add_location(h31, file$5, 131, 8, 3752);
			attr_dev(button0, "class", button0_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem");
			add_location(button0, file$5, 127, 6, 3575);
			add_location(li2, file$5, 126, 4, 3563);
			attr_dev(img3, "class", "nav-panel__icon svelte-14zhem");
			if (!src_url_equal(img3.src, img3_src_value = img$l)) attr_dev(img3, "src", img3_src_value);
			attr_dev(img3, "alt", "");
			add_location(img3, file$5, 140, 9, 4025);
			attr_dev(h32, "class", h32_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem");
			add_location(h32, file$5, 141, 8, 4088);
			attr_dev(button1, "class", button1_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem");
			add_location(button1, file$5, 137, 6, 3911);
			add_location(li3, file$5, 136, 4, 3899);
			attr_dev(ul, "class", "svelte-14zhem");
			add_location(ul, file$5, 100, 2, 2831);
			attr_dev(nav, "class", nav_class_value = "nav-panel " + (/*isMenuOpen*/ ctx[6] ? 'menu-open' : 'menu-close') + " svelte-14zhem");
			attr_dev(nav, "style", nav_style_value = /*isOwner*/ ctx[0] ? "" : "top: 40%");
			add_location(nav, file$5, 96, 0, 2720);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);
			append_dev(nav, ul);
			append_dev(ul, li0);
			append_dev(li0, img0);
			append_dev(li0, t0);
			append_dev(li0, img1);
			append_dev(ul, t1);
			append_dev(ul, li1);
			append_dev(li1, h30);
			append_dev(h30, t2);
			append_dev(ul, t3);
			append_dev(ul, li2);
			append_dev(li2, button0);
			append_dev(button0, img2);
			append_dev(button0, t4);
			append_dev(button0, h31);
			append_dev(h31, t5);
			append_dev(ul, t6);
			append_dev(ul, li3);
			append_dev(li3, button1);
			append_dev(button1, img3);
			append_dev(button1, t7);
			append_dev(button1, h32);
			append_dev(h32, t8);
			append_dev(ul, t9);
			if (if_block0) if_block0.m(ul, null);
			append_dev(ul, t10);
			if (if_block1) if_block1.m(ul, null);
			insert_dev(target, t11, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert_dev(target, t12, anchor);
			if (if_block3) if_block3.m(target, anchor);
			insert_dev(target, t13, anchor);
			if (if_block4) if_block4.m(target, anchor);
			insert_dev(target, t14, anchor);
			if (if_block5) if_block5.m(target, anchor);
			insert_dev(target, if_block5_anchor, anchor);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(img0, "click", /*toggleMenu*/ ctx[16], false, false, false, false),
					listen_dev(img0, "keydown", /*toggleMenu*/ ctx[16], false, false, false, false),
					listen_dev(img1, "click", /*toggleMenu*/ ctx[16], false, false, false, false),
					listen_dev(img1, "keydown", /*toggleMenu*/ ctx[16], false, false, false, false),
					listen_dev(button0, "click", openProject, false, false, false, false),
					listen_dev(button1, "click", saveProject, false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*$_*/ 128 && img0_alt_value !== (img0_alt_value = /*$_*/ ctx[7]("projectsLeftSideNav.altClose"))) {
				attr_dev(img0, "alt", img0_alt_value);
			}

			if (!current || dirty & /*$_*/ 128 && img1_alt_value !== (img1_alt_value = /*$_*/ ctx[7]("projectsLeftSideNav.altOpen"))) {
				attr_dev(img1, "alt", img1_alt_value);
			}

			if (!current || dirty & /*isMenuOpen*/ 64 && img1_class_value !== (img1_class_value = "nav-panel__toggle-icon-open " + (/*isMenuOpen*/ ctx[6] ? 'transition' : 'show') + " svelte-14zhem")) {
				attr_dev(img1, "class", img1_class_value);
			}

			if ((!current || dirty & /*project*/ 2) && t2_value !== (t2_value = /*project*/ ctx[1].name + "")) set_data_dev(t2, t2_value);

			if (!current || dirty & /*isMenuOpen*/ 64 && h30_class_value !== (h30_class_value = "nav-panel__name-container transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem")) {
				attr_dev(h30, "class", h30_class_value);
			}

			if ((!current || dirty & /*$_*/ 128) && t5_value !== (t5_value = /*$_*/ ctx[7]("projectsLeftSideNav.open") + "")) set_data_dev(t5, t5_value);

			if (!current || dirty & /*isMenuOpen*/ 64 && h31_class_value !== (h31_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem")) {
				attr_dev(h31, "class", h31_class_value);
			}

			if (!current || dirty & /*isMenuOpen*/ 64 && button0_class_value !== (button0_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem")) {
				attr_dev(button0, "class", button0_class_value);
			}

			if ((!current || dirty & /*$_*/ 128) && t8_value !== (t8_value = /*$_*/ ctx[7]("projectsLeftSideNav.save") + "")) set_data_dev(t8, t8_value);

			if (!current || dirty & /*isMenuOpen*/ 64 && h32_class_value !== (h32_class_value = "transition " + (/*isMenuOpen*/ ctx[6] ? 'show' : 'hide') + " svelte-14zhem")) {
				attr_dev(h32, "class", h32_class_value);
			}

			if (!current || dirty & /*isMenuOpen*/ 64 && button1_class_value !== (button1_class_value = "button--default " + (/*isMenuOpen*/ ctx[6] ? '' : 'disabled') + " svelte-14zhem")) {
				attr_dev(button1, "class", button1_class_value);
			}

			if (/*isOwner*/ ctx[0]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_5$2(ctx);
					if_block0.c();
					if_block0.m(ul, t10);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (!/*isOwner*/ ctx[0]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_4$2(ctx);
					if_block1.c();
					if_block1.m(ul, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (!current || dirty & /*isMenuOpen*/ 64 && nav_class_value !== (nav_class_value = "nav-panel " + (/*isMenuOpen*/ ctx[6] ? 'menu-open' : 'menu-close') + " svelte-14zhem")) {
				attr_dev(nav, "class", nav_class_value);
			}

			if (!current || dirty & /*isOwner*/ 1 && nav_style_value !== (nav_style_value = /*isOwner*/ ctx[0] ? "" : "top: 40%")) {
				attr_dev(nav, "style", nav_style_value);
			}

			if (/*showTeamModal*/ ctx[2]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*showTeamModal*/ 4) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block_3$2(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(t12.parentNode, t12);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (/*showDeleteModal*/ ctx[3]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);

					if (dirty & /*showDeleteModal*/ 8) {
						transition_in(if_block3, 1);
					}
				} else {
					if_block3 = create_if_block_2$2(ctx);
					if_block3.c();
					transition_in(if_block3, 1);
					if_block3.m(t13.parentNode, t13);
				}
			} else if (if_block3) {
				group_outros();

				transition_out(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				check_outros();
			}

			if (/*showRenameModal*/ ctx[4]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);

					if (dirty & /*showRenameModal*/ 16) {
						transition_in(if_block4, 1);
					}
				} else {
					if_block4 = create_if_block_1$2(ctx);
					if_block4.c();
					transition_in(if_block4, 1);
					if_block4.m(t14.parentNode, t14);
				}
			} else if (if_block4) {
				group_outros();

				transition_out(if_block4, 1, 1, () => {
					if_block4 = null;
				});

				check_outros();
			}

			if (/*showLeaveModal*/ ctx[5]) {
				if (if_block5) {
					if_block5.p(ctx, dirty);

					if (dirty & /*showLeaveModal*/ 32) {
						transition_in(if_block5, 1);
					}
				} else {
					if_block5 = create_if_block$5(ctx);
					if_block5.c();
					transition_in(if_block5, 1);
					if_block5.m(if_block5_anchor.parentNode, if_block5_anchor);
				}
			} else if (if_block5) {
				group_outros();

				transition_out(if_block5, 1, 1, () => {
					if_block5 = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block2);
			transition_in(if_block3);
			transition_in(if_block4);
			transition_in(if_block5);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block2);
			transition_out(if_block3);
			transition_out(if_block4);
			transition_out(if_block5);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (detaching) detach_dev(t11);
			if (if_block2) if_block2.d(detaching);
			if (detaching) detach_dev(t12);
			if (if_block3) if_block3.d(detaching);
			if (detaching) detach_dev(t13);
			if (if_block4) if_block4.d(detaching);
			if (detaching) detach_dev(t14);
			if (if_block5) if_block5.d(detaching);
			if (detaching) detach_dev(if_block5_anchor);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const BREAKPOINT_WIDTH_FOR_MENU_CLOSE = 840;

function openProject() {
	// TODO: Implement open project functionality
	console.log("Open project");
}

function saveProject() {
	// TODO: Implement save project functionality
	console.log("Save project");
}

function instance$6($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(7, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('LeftNavigation', slots, []);
	let { isOwner } = $$props;
	let { project } = $$props;
	const dispatch = createEventDispatcher();
	let width;
	let showTeamModal = false;
	let showDeleteModal = false;
	let showRenameModal = false;
	let showLeaveModal = false;
	let isMenuOpen = true;

	onMount(() => {
		setWidth();
		window.addEventListener("resize", setWidth);
	});

	function setWidth() {
		$$invalidate(17, width = window.innerWidth);
	}

	function toggleTeamModal() {
		$$invalidate(2, showTeamModal = !showTeamModal);
	}

	function toggleDeleteModal() {
		$$invalidate(3, showDeleteModal = !showDeleteModal);
	}

	function toggleRenameModal() {
		$$invalidate(4, showRenameModal = !showRenameModal);
	}

	function toggleLeaveModal() {
		$$invalidate(5, showLeaveModal = !showLeaveModal);
	}

	function handleProjectRename() {
		updateProjectsPage();
		toggleRenameModal();
	}

	function handleProjectDelete() {
		updateProjectsPage();
		toggleDeleteModal();
	}

	function handleLeaveProject() {
		updateProjectsPage();
		toggleLeaveModal();
	}

	function handleProjectTeamUpdate() {
		// TODO: Implement project collaborators editing functionality
		updateProjectsPage();

		toggleTeamModal();
	}

	function updateProjectsPage() {
		dispatch("updateProjectsPage");
	}

	function toggleMenu() {
		$$invalidate(6, isMenuOpen = !isMenuOpen);
	}

	onDestroy(() => {
		window.removeEventListener("resize", setWidth);
	});

	$$self.$$.on_mount.push(function () {
		if (isOwner === undefined && !('isOwner' in $$props || $$self.$$.bound[$$self.$$.props['isOwner']])) {
			console_1.warn("<LeftNavigation> was created without expected prop 'isOwner'");
		}

		if (project === undefined && !('project' in $$props || $$self.$$.bound[$$self.$$.props['project']])) {
			console_1.warn("<LeftNavigation> was created without expected prop 'project'");
		}
	});

	const writable_props = ['isOwner', 'project'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<LeftNavigation> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('isOwner' in $$props) $$invalidate(0, isOwner = $$props.isOwner);
		if ('project' in $$props) $$invalidate(1, project = $$props.project);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		onMount,
		onDestroy,
		_: $format,
		saveIcon: img$l,
		manageTeamIcon: img$8,
		openIcon: img$7,
		renameIcon: img$6,
		deleteIcon: img$b,
		leaveIcon: img$5,
		DeleteOrLeave,
		ArrowLeft: img$c,
		ArrowRight: img$4,
		RenameProject: NameOrRenameProject,
		ToggleAddByLinkAndEmail,
		Modal,
		isOwner,
		project,
		dispatch,
		BREAKPOINT_WIDTH_FOR_MENU_CLOSE,
		width,
		showTeamModal,
		showDeleteModal,
		showRenameModal,
		showLeaveModal,
		isMenuOpen,
		setWidth,
		toggleTeamModal,
		toggleDeleteModal,
		toggleRenameModal,
		toggleLeaveModal,
		handleProjectRename,
		handleProjectDelete,
		handleLeaveProject,
		handleProjectTeamUpdate,
		updateProjectsPage,
		openProject,
		saveProject,
		toggleMenu,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('isOwner' in $$props) $$invalidate(0, isOwner = $$props.isOwner);
		if ('project' in $$props) $$invalidate(1, project = $$props.project);
		if ('width' in $$props) $$invalidate(17, width = $$props.width);
		if ('showTeamModal' in $$props) $$invalidate(2, showTeamModal = $$props.showTeamModal);
		if ('showDeleteModal' in $$props) $$invalidate(3, showDeleteModal = $$props.showDeleteModal);
		if ('showRenameModal' in $$props) $$invalidate(4, showRenameModal = $$props.showRenameModal);
		if ('showLeaveModal' in $$props) $$invalidate(5, showLeaveModal = $$props.showLeaveModal);
		if ('isMenuOpen' in $$props) $$invalidate(6, isMenuOpen = $$props.isMenuOpen);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*width*/ 131072) {
			$$invalidate(6, isMenuOpen = width >= BREAKPOINT_WIDTH_FOR_MENU_CLOSE);
		}
	};

	return [
		isOwner,
		project,
		showTeamModal,
		showDeleteModal,
		showRenameModal,
		showLeaveModal,
		isMenuOpen,
		$_,
		toggleTeamModal,
		toggleDeleteModal,
		toggleRenameModal,
		toggleLeaveModal,
		handleProjectRename,
		handleProjectDelete,
		handleLeaveProject,
		handleProjectTeamUpdate,
		toggleMenu,
		width
	];
}

class LeftNavigation extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, { isOwner: 0, project: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LeftNavigation",
			options,
			id: create_fragment$6.name
		});
	}

	get isOwner() {
		throw new Error("<LeftNavigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isOwner(value) {
		throw new Error("<LeftNavigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get project() {
		throw new Error("<LeftNavigation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set project(value) {
		throw new Error("<LeftNavigation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\Components\Projects\Pagination.svelte generated by Svelte v3.59.2 */
const file$4 = "src\\Components\\Projects\\Pagination.svelte";

// (40:2) {#if itemArray.length > projectPerPage}
function create_if_block$4(ctx) {
	let button0;
	let img0;
	let img0_src_value;
	let img0_alt_value;
	let button0_disabled_value;
	let t0;
	let h3;
	let t1;
	let t2;
	let button1;
	let img1;
	let img1_src_value;
	let img1_alt_value;
	let button1_disabled_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button0 = element("button");
			img0 = element("img");
			t0 = space();
			h3 = element("h3");
			t1 = text(/*currentPage*/ ctx[0]);
			t2 = space();
			button1 = element("button");
			img1 = element("img");
			if (!src_url_equal(img0.src, img0_src_value = img$c)) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", img0_alt_value = /*$_*/ ctx[4]("projects.previous"));
			attr_dev(img0, "class", "svelte-1h4mzhq");
			toggle_class(img0, "hidden", /*currentPage*/ ctx[0] === 1);
			add_location(img0, file$4, 46, 6, 1289);
			attr_dev(button0, "class", "button--default svelte-1h4mzhq");
			button0.disabled = button0_disabled_value = /*currentPage*/ ctx[0] === 1;
			toggle_class(button0, "hide-button", /*currentPage*/ ctx[0] === 1);
			add_location(button0, file$4, 40, 4, 1105);
			attr_dev(h3, "class", "paggination-wrapper__current-page svelte-1h4mzhq");
			add_location(h3, file$4, 52, 4, 1430);
			if (!src_url_equal(img1.src, img1_src_value = img$4)) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", img1_alt_value = /*$_*/ ctx[4]("projects.next"));
			attr_dev(img1, "class", "svelte-1h4mzhq");
			toggle_class(img1, "hidden", !/*showNextButton*/ ctx[3]);
			add_location(img1, file$4, 59, 6, 1680);
			attr_dev(button1, "class", "button--default svelte-1h4mzhq");
			button1.disabled = button1_disabled_value = !/*showNextButton*/ ctx[3];
			toggle_class(button1, "hide-button", !/*showNextButton*/ ctx[3]);
			add_location(button1, file$4, 53, 4, 1500);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button0, anchor);
			append_dev(button0, img0);
			insert_dev(target, t0, anchor);
			insert_dev(target, h3, anchor);
			append_dev(h3, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, button1, anchor);
			append_dev(button1, img1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[7], false, false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[8], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 16 && img0_alt_value !== (img0_alt_value = /*$_*/ ctx[4]("projects.previous"))) {
				attr_dev(img0, "alt", img0_alt_value);
			}

			if (dirty & /*currentPage*/ 1) {
				toggle_class(img0, "hidden", /*currentPage*/ ctx[0] === 1);
			}

			if (dirty & /*currentPage*/ 1 && button0_disabled_value !== (button0_disabled_value = /*currentPage*/ ctx[0] === 1)) {
				prop_dev(button0, "disabled", button0_disabled_value);
			}

			if (dirty & /*currentPage*/ 1) {
				toggle_class(button0, "hide-button", /*currentPage*/ ctx[0] === 1);
			}

			if (dirty & /*currentPage*/ 1) set_data_dev(t1, /*currentPage*/ ctx[0]);

			if (dirty & /*$_*/ 16 && img1_alt_value !== (img1_alt_value = /*$_*/ ctx[4]("projects.next"))) {
				attr_dev(img1, "alt", img1_alt_value);
			}

			if (dirty & /*showNextButton*/ 8) {
				toggle_class(img1, "hidden", !/*showNextButton*/ ctx[3]);
			}

			if (dirty & /*showNextButton*/ 8 && button1_disabled_value !== (button1_disabled_value = !/*showNextButton*/ ctx[3])) {
				prop_dev(button1, "disabled", button1_disabled_value);
			}

			if (dirty & /*showNextButton*/ 8) {
				toggle_class(button1, "hide-button", !/*showNextButton*/ ctx[3]);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button0);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(h3);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(button1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(40:2) {#if itemArray.length > projectPerPage}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let div;
	let if_block = /*itemArray*/ ctx[2].length > /*projectPerPage*/ ctx[1] && create_if_block$4(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(div, "class", "paggination-wrapper svelte-1h4mzhq");
			add_location(div, file$4, 38, 0, 1023);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
		},
		p: function update(ctx, [dirty]) {
			if (/*itemArray*/ ctx[2].length > /*projectPerPage*/ ctx[1]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$4(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(4, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Pagination', slots, []);
	let { projectPerPage } = $$props;
	let { itemArray } = $$props;
	let { currentPage = 1 } = $$props;
	let showNextButton;
	const dispatch = createEventDispatcher();

	function getStartIndex() {
		return (currentPage - 1) * projectPerPage;
	}

	function getEndIndex() {
		return currentPage * projectPerPage;
	}

	function getCurrentPageItems() {
		return itemArray.slice(getStartIndex(), getEndIndex());
	}

	function goToPage(page) {
		$$invalidate(0, currentPage = page);
		dispatch("pageChange", getCurrentPageItems());
	}

	function hasMoreItems() {
		return getEndIndex() < itemArray.length;
	}

	$$self.$$.on_mount.push(function () {
		if (projectPerPage === undefined && !('projectPerPage' in $$props || $$self.$$.bound[$$self.$$.props['projectPerPage']])) {
			console.warn("<Pagination> was created without expected prop 'projectPerPage'");
		}

		if (itemArray === undefined && !('itemArray' in $$props || $$self.$$.bound[$$self.$$.props['itemArray']])) {
			console.warn("<Pagination> was created without expected prop 'itemArray'");
		}
	});

	const writable_props = ['projectPerPage', 'itemArray', 'currentPage'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pagination> was created with unknown prop '${key}'`);
	});

	const click_handler = () => goToPage(currentPage - 1);
	const click_handler_1 = () => goToPage(currentPage + 1);

	$$self.$$set = $$props => {
		if ('projectPerPage' in $$props) $$invalidate(1, projectPerPage = $$props.projectPerPage);
		if ('itemArray' in $$props) $$invalidate(2, itemArray = $$props.itemArray);
		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		ArrowLeft: img$c,
		ArrowRight: img$4,
		_: $format,
		projectPerPage,
		itemArray,
		currentPage,
		showNextButton,
		dispatch,
		getStartIndex,
		getEndIndex,
		getCurrentPageItems,
		goToPage,
		hasMoreItems,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('projectPerPage' in $$props) $$invalidate(1, projectPerPage = $$props.projectPerPage);
		if ('itemArray' in $$props) $$invalidate(2, itemArray = $$props.itemArray);
		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
		if ('showNextButton' in $$props) $$invalidate(3, showNextButton = $$props.showNextButton);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*currentPage, itemArray*/ 5) {
			// reactive statment that updates showNextButton variable when currentPage changes
			($$invalidate(3, showNextButton = hasMoreItems()));
		}
	};

	return [
		currentPage,
		projectPerPage,
		itemArray,
		showNextButton,
		$_,
		goToPage,
		getCurrentPageItems,
		click_handler,
		click_handler_1
	];
}

class Pagination extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {
			projectPerPage: 1,
			itemArray: 2,
			currentPage: 0,
			getCurrentPageItems: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Pagination",
			options,
			id: create_fragment$5.name
		});
	}

	get projectPerPage() {
		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set projectPerPage(value) {
		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get itemArray() {
		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set itemArray(value) {
		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get currentPage() {
		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set currentPage(value) {
		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getCurrentPageItems() {
		return this.$$.ctx[6];
	}

	set getCurrentPageItems(value) {
		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var img$3 = "data:image/svg+xml,%3c%3fxml version='1.0' %3f%3e%3c!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg height='512px' id='Layer_1' style='enable-background:new 0 0 512 512%3b' version='1.1' viewBox='0 0 512 512' width='512px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3e%3cpath d='M405.2%2c232.9L126.8%2c67.2c-3.4-2-6.9-3.2-10.9-3.2c-10.9%2c0-19.8%2c9-19.8%2c20H96v344h0.1c0%2c11%2c8.9%2c20%2c19.8%2c20 c4.1%2c0%2c7.5-1.4%2c11.2-3.4l278.1-165.5c6.6-5.5%2c10.8-13.8%2c10.8-23.1C416%2c246.7%2c411.8%2c238.5%2c405.2%2c232.9z'/%3e%3c/svg%3e";

/* src\Components\Projects\ProjectEntry.svelte generated by Svelte v3.59.2 */
const file$3 = "src\\Components\\Projects\\ProjectEntry.svelte";

function create_fragment$4(ctx) {
	let div2;
	let div0;
	let p;
	let t0;
	let t1;
	let div1;
	let img;
	let img_src_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			p = element("p");
			t0 = text(/*projectName*/ ctx[0]);
			t1 = space();
			div1 = element("div");
			img = element("img");
			attr_dev(p, "class", "svelte-yplxnp");
			add_location(p, file$3, 15, 4, 324);
			attr_dev(div0, "class", "project-wrapper__name svelte-yplxnp");
			add_location(div0, file$3, 14, 2, 283);
			if (!src_url_equal(img.src, img_src_value = img$3)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Launch");
			attr_dev(img, "class", "svelte-yplxnp");
			add_location(img, file$3, 18, 4, 399);
			attr_dev(div1, "class", "project-wrapper__play svelte-yplxnp");
			add_location(div1, file$3, 17, 2, 358);
			attr_dev(div2, "class", "project-wrapper svelte-yplxnp");
			toggle_class(div2, "active", /*isActive*/ ctx[1]);
			add_location(div2, file$3, 8, 0, 162);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, p);
			append_dev(p, t0);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div1, img);

			if (!mounted) {
				dispose = [
					listen_dev(
						div2,
						"click",
						function () {
							if (is_function(/*toggleActive*/ ctx[2])) /*toggleActive*/ ctx[2].apply(this, arguments);
						},
						false,
						false,
						false,
						false
					),
					listen_dev(
						div2,
						"keydown",
						function () {
							if (is_function(/*toggleActive*/ ctx[2])) /*toggleActive*/ ctx[2].apply(this, arguments);
						},
						false,
						false,
						false,
						false
					)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, [dirty]) {
			ctx = new_ctx;
			if (dirty & /*projectName*/ 1) set_data_dev(t0, /*projectName*/ ctx[0]);

			if (dirty & /*isActive*/ 2) {
				toggle_class(div2, "active", /*isActive*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ProjectEntry', slots, []);
	let { projectName } = $$props;
	let { isActive } = $$props;
	let { toggleActive } = $$props;

	$$self.$$.on_mount.push(function () {
		if (projectName === undefined && !('projectName' in $$props || $$self.$$.bound[$$self.$$.props['projectName']])) {
			console.warn("<ProjectEntry> was created without expected prop 'projectName'");
		}

		if (isActive === undefined && !('isActive' in $$props || $$self.$$.bound[$$self.$$.props['isActive']])) {
			console.warn("<ProjectEntry> was created without expected prop 'isActive'");
		}

		if (toggleActive === undefined && !('toggleActive' in $$props || $$self.$$.bound[$$self.$$.props['toggleActive']])) {
			console.warn("<ProjectEntry> was created without expected prop 'toggleActive'");
		}
	});

	const writable_props = ['projectName', 'isActive', 'toggleActive'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProjectEntry> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('projectName' in $$props) $$invalidate(0, projectName = $$props.projectName);
		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
		if ('toggleActive' in $$props) $$invalidate(2, toggleActive = $$props.toggleActive);
	};

	$$self.$capture_state = () => ({
		projectName,
		isActive,
		toggleActive,
		PlayIcon: img$3
	});

	$$self.$inject_state = $$props => {
		if ('projectName' in $$props) $$invalidate(0, projectName = $$props.projectName);
		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
		if ('toggleActive' in $$props) $$invalidate(2, toggleActive = $$props.toggleActive);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [projectName, isActive, toggleActive];
}

class ProjectEntry extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {
			projectName: 0,
			isActive: 1,
			toggleActive: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ProjectEntry",
			options,
			id: create_fragment$4.name
		});
	}

	get projectName() {
		throw new Error("<ProjectEntry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set projectName(value) {
		throw new Error("<ProjectEntry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isActive() {
		throw new Error("<ProjectEntry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isActive(value) {
		throw new Error("<ProjectEntry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggleActive() {
		throw new Error("<ProjectEntry>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggleActive(value) {
		throw new Error("<ProjectEntry>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\Components\Projects\Projects.svelte generated by Svelte v3.59.2 */

const { Error: Error_1 } = globals;
const file$2 = "src\\Components\\Projects\\Projects.svelte";

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	return child_ctx;
}

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	return child_ctx;
}

// (155:89) 
function create_if_block_8(ctx) {
	let leftnavigation;
	let current;

	leftnavigation = new LeftNavigation({
			props: {
				isOwner: false,
				project: /*sharedActiveProject*/ ctx[8]
			},
			$$inline: true
		});

	leftnavigation.$on("updateProjectsPage", /*loadAndDisplayProjects*/ ctx[11]);

	const block = {
		c: function create() {
			create_component(leftnavigation.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(leftnavigation, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const leftnavigation_changes = {};
			if (dirty & /*sharedActiveProject*/ 256) leftnavigation_changes.project = /*sharedActiveProject*/ ctx[8];
			leftnavigation.$set(leftnavigation_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(leftnavigation.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(leftnavigation.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(leftnavigation, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_8.name,
		type: "if",
		source: "(155:89) ",
		ctx
	});

	return block;
}

// (149:0) {#if projectsActive && !isLoading && !errorLoadingProjects && !isEmptyArray(yourProjects)}
function create_if_block_7(ctx) {
	let leftnavigation;
	let current;

	leftnavigation = new LeftNavigation({
			props: {
				isOwner: true,
				project: /*yourActiveProject*/ ctx[9]
			},
			$$inline: true
		});

	leftnavigation.$on("updateProjectsPage", /*loadAndDisplayProjects*/ ctx[11]);

	const block = {
		c: function create() {
			create_component(leftnavigation.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(leftnavigation, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const leftnavigation_changes = {};
			if (dirty & /*yourActiveProject*/ 512) leftnavigation_changes.project = /*yourActiveProject*/ ctx[9];
			leftnavigation.$set(leftnavigation_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(leftnavigation.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(leftnavigation.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(leftnavigation, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_7.name,
		type: "if",
		source: "(149:0) {#if projectsActive && !isLoading && !errorLoadingProjects && !isEmptyArray(yourProjects)}",
		ctx
	});

	return block;
}

// (192:35) 
function create_if_block_6(ctx) {
	let pagination;
	let current;

	pagination = new Pagination({
			props: {
				projectPerPage: PROJECTS_PER_PAGE,
				itemArray: /*sharedProjects*/ ctx[7]
			},
			$$inline: true
		});

	pagination.$on("pageChange", /*handlePaginationChange*/ ctx[13]);

	const block = {
		c: function create() {
			create_component(pagination.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(pagination, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const pagination_changes = {};
			if (dirty & /*sharedProjects*/ 128) pagination_changes.itemArray = /*sharedProjects*/ ctx[7];
			pagination.$set(pagination_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(pagination.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(pagination.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(pagination, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_6.name,
		type: "if",
		source: "(192:35) ",
		ctx
	});

	return block;
}

// (186:29) 
function create_if_block_5$1(ctx) {
	let pagination;
	let current;

	pagination = new Pagination({
			props: {
				projectPerPage: PROJECTS_PER_PAGE,
				itemArray: /*yourProjects*/ ctx[6]
			},
			$$inline: true
		});

	pagination.$on("pageChange", /*handlePaginationChange*/ ctx[13]);

	const block = {
		c: function create() {
			create_component(pagination.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(pagination, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const pagination_changes = {};
			if (dirty & /*yourProjects*/ 64) pagination_changes.itemArray = /*yourProjects*/ ctx[6];
			pagination.$set(pagination_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(pagination.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(pagination.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(pagination, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_5$1.name,
		type: "if",
		source: "(186:29) ",
		ctx
	});

	return block;
}

// (184:35) 
function create_if_block_4$1(ctx) {
	let div;
	let t_value = /*$_*/ ctx[10]("projects.errorLoadingProjects") + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			add_location(div, file$2, 184, 6, 6057);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 1024 && t_value !== (t_value = /*$_*/ ctx[10]("projects.errorLoadingProjects") + "")) set_data_dev(t, t_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4$1.name,
		type: "if",
		source: "(184:35) ",
		ctx
	});

	return block;
}

// (182:4) {#if isLoading}
function create_if_block_3$1(ctx) {
	let div;
	let t_value = /*$_*/ ctx[10]("projects.loadingProjects") + "";
	let t;

	const block = {
		c: function create() {
			div = element("div");
			t = text(t_value);
			add_location(div, file$2, 182, 6, 5969);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 1024 && t_value !== (t_value = /*$_*/ ctx[10]("projects.loadingProjects") + "")) set_data_dev(t, t_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3$1.name,
		type: "if",
		source: "(182:4) {#if isLoading}",
		ctx
	});

	return block;
}

// (215:35) 
function create_if_block_1$1(ctx) {
	let show_if;
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_2$1, create_else_block$2];
	const if_blocks = [];

	function select_block_type_3(ctx, dirty) {
		if (dirty & /*sharedProjects*/ 128) show_if = null;
		if (show_if == null) show_if = !!isEmptyArray(/*sharedProjects*/ ctx[7]);
		if (show_if) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_3(ctx, -1);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_3(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(215:35) ",
		ctx
	});

	return block;
}

// (201:4) {#if projectsActive && !isLoading && !errorLoadingProjects}
function create_if_block$3(ctx) {
	let createproject;
	let t;
	let each_1_anchor;
	let current;
	createproject = new CreateProject({ $$inline: true });
	createproject.$on("updateProjectsPage", /*loadAndDisplayProjects*/ ctx[11]);
	let each_value = /*currentlyDisplayedYourProjects*/ ctx[0];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			create_component(createproject.$$.fragment);
			t = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			mount_component(createproject, target, anchor);
			insert_dev(target, t, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert_dev(target, each_1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*currentlyDisplayedYourProjects, toggleProjectActive*/ 1) {
				each_value = /*currentlyDisplayedYourProjects*/ ctx[0];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(createproject.$$.fragment, local);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			transition_out(createproject.$$.fragment, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(createproject, detaching);
			if (detaching) detach_dev(t);
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(201:4) {#if projectsActive && !isLoading && !errorLoadingProjects}",
		ctx
	});

	return block;
}

// (219:6) {:else}
function create_else_block$2(ctx) {
	let each_1_anchor;
	let current;
	let each_value_1 = /*currentlyDisplayedSharedProjects*/ ctx[1];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert_dev(target, each_1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*currentlyDisplayedSharedProjects, toggleProjectActive*/ 2) {
				each_value_1 = /*currentlyDisplayedSharedProjects*/ ctx[1];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(219:6) {:else}",
		ctx
	});

	return block;
}

// (216:6) {#if isEmptyArray(sharedProjects)}
function create_if_block_2$1(ctx) {
	let h30;
	let t0_value = /*$_*/ ctx[10]("projects.noProjectsFirstLine") + "";
	let t0;
	let t1;
	let h31;
	let t2_value = /*$_*/ ctx[10]("projects.noProjectsSecondLine") + "";
	let t2;

	const block = {
		c: function create() {
			h30 = element("h3");
			t0 = text(t0_value);
			t1 = space();
			h31 = element("h3");
			t2 = text(t2_value);
			add_location(h30, file$2, 216, 8, 7169);
			add_location(h31, file$2, 217, 8, 7224);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h30, anchor);
			append_dev(h30, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, h31, anchor);
			append_dev(h31, t2);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 1024 && t0_value !== (t0_value = /*$_*/ ctx[10]("projects.noProjectsFirstLine") + "")) set_data_dev(t0, t0_value);
			if (dirty & /*$_*/ 1024 && t2_value !== (t2_value = /*$_*/ ctx[10]("projects.noProjectsSecondLine") + "")) set_data_dev(t2, t2_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(h30);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(h31);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(216:6) {#if isEmptyArray(sharedProjects)}",
		ctx
	});

	return block;
}

// (220:8) {#each currentlyDisplayedSharedProjects as project}
function create_each_block_1(ctx) {
	let projectentry;
	let current;

	function func_1() {
		return /*func_1*/ ctx[19](/*project*/ ctx[20]);
	}

	projectentry = new ProjectEntry({
			props: {
				projectName: /*project*/ ctx[20].name,
				isActive: /*project*/ ctx[20].isActive,
				toggleActive: func_1
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(projectentry.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(projectentry, target, anchor);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const projectentry_changes = {};
			if (dirty & /*currentlyDisplayedSharedProjects*/ 2) projectentry_changes.projectName = /*project*/ ctx[20].name;
			if (dirty & /*currentlyDisplayedSharedProjects*/ 2) projectentry_changes.isActive = /*project*/ ctx[20].isActive;
			if (dirty & /*currentlyDisplayedSharedProjects*/ 2) projectentry_changes.toggleActive = func_1;
			projectentry.$set(projectentry_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(projectentry.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(projectentry.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(projectentry, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(220:8) {#each currentlyDisplayedSharedProjects as project}",
		ctx
	});

	return block;
}

// (203:6) {#each currentlyDisplayedYourProjects as project}
function create_each_block$1(ctx) {
	let projectentry;
	let current;

	function func() {
		return /*func*/ ctx[18](/*project*/ ctx[20]);
	}

	projectentry = new ProjectEntry({
			props: {
				projectName: /*project*/ ctx[20].name,
				isActive: /*project*/ ctx[20].isActive,
				toggleActive: func
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(projectentry.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(projectentry, target, anchor);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const projectentry_changes = {};
			if (dirty & /*currentlyDisplayedYourProjects*/ 1) projectentry_changes.projectName = /*project*/ ctx[20].name;
			if (dirty & /*currentlyDisplayedYourProjects*/ 1) projectentry_changes.isActive = /*project*/ ctx[20].isActive;
			if (dirty & /*currentlyDisplayedYourProjects*/ 1) projectentry_changes.toggleActive = func;
			projectentry.$set(projectentry_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(projectentry.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(projectentry.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(projectentry, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(203:6) {#each currentlyDisplayedYourProjects as project}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let show_if;
	let show_if_1;
	let current_block_type_index;
	let if_block0;
	let t0;
	let div6;
	let div4;
	let h1;
	let t1_value = /*$_*/ ctx[10]("projects.projects") + "";
	let t1;
	let t2;
	let div0;
	let t3;
	let div3;
	let div1;
	let h30;
	let t4_value = /*$_*/ ctx[10]("projects.yourProjects") + "";
	let t4;
	let t5;
	let div2;
	let h31;
	let t6_value = /*$_*/ ctx[10]("projects.sharedWithYou") + "";
	let t6;
	let t7;
	let current_block_type_index_1;
	let if_block1;
	let t8;
	let div5;
	let current_block_type_index_2;
	let if_block2;
	let current;
	let mounted;
	let dispose;
	const if_block_creators = [create_if_block_7, create_if_block_8];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (dirty & /*projectsActive, isLoading, errorLoadingProjects, yourProjects*/ 108) show_if = null;
		if (dirty & /*sharedProjectsActive, errorLoadingProjects, sharedProjects*/ 148) show_if_1 = null;
		if (show_if == null) show_if = !!(/*projectsActive*/ ctx[3] && !/*isLoading*/ ctx[5] && !/*errorLoadingProjects*/ ctx[2] && !isEmptyArray(/*yourProjects*/ ctx[6]));
		if (show_if) return 0;
		if (show_if_1 == null) show_if_1 = !!(/*sharedProjectsActive*/ ctx[4] && !/*errorLoadingProjects*/ ctx[2] && !isEmptyArray(/*sharedProjects*/ ctx[7]));
		if (show_if_1) return 1;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx, -1))) {
		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	const if_block_creators_1 = [create_if_block_3$1, create_if_block_4$1, create_if_block_5$1, create_if_block_6];
	const if_blocks_1 = [];

	function select_block_type_1(ctx, dirty) {
		if (/*isLoading*/ ctx[5]) return 0;
		if (/*errorLoadingProjects*/ ctx[2]) return 1;
		if (/*projectsActive*/ ctx[3]) return 2;
		if (/*sharedProjectsActive*/ ctx[4]) return 3;
		return -1;
	}

	if (~(current_block_type_index_1 = select_block_type_1(ctx))) {
		if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
	}

	const if_block_creators_2 = [create_if_block$3, create_if_block_1$1];
	const if_blocks_2 = [];

	function select_block_type_2(ctx, dirty) {
		if (/*projectsActive*/ ctx[3] && !/*isLoading*/ ctx[5] && !/*errorLoadingProjects*/ ctx[2]) return 0;
		if (/*sharedProjectsActive*/ ctx[4]) return 1;
		return -1;
	}

	if (~(current_block_type_index_2 = select_block_type_2(ctx))) {
		if_block2 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
	}

	const block = {
		c: function create() {
			if (if_block0) if_block0.c();
			t0 = space();
			div6 = element("div");
			div4 = element("div");
			h1 = element("h1");
			t1 = text(t1_value);
			t2 = space();
			div0 = element("div");
			t3 = space();
			div3 = element("div");
			div1 = element("div");
			h30 = element("h3");
			t4 = text(t4_value);
			t5 = space();
			div2 = element("div");
			h31 = element("h3");
			t6 = text(t6_value);
			t7 = space();
			if (if_block1) if_block1.c();
			t8 = space();
			div5 = element("div");
			if (if_block2) if_block2.c();
			attr_dev(h1, "class", "svelte-nw46hh");
			add_location(h1, file$2, 163, 4, 5326);
			attr_dev(div0, "class", "projects-wrapper__line svelte-nw46hh");
			add_location(div0, file$2, 164, 4, 5366);
			attr_dev(h30, "class", "svelte-nw46hh");
			add_location(h30, file$2, 171, 8, 5631);
			attr_dev(div1, "class", "svelte-nw46hh");
			toggle_class(div1, "active", /*projectsActive*/ ctx[3]);
			add_location(div1, file$2, 166, 6, 5465);
			attr_dev(h31, "class", "svelte-nw46hh");
			add_location(h31, file$2, 178, 8, 5875);
			attr_dev(div2, "class", "svelte-nw46hh");
			toggle_class(div2, "active", /*sharedProjectsActive*/ ctx[4]);
			add_location(div2, file$2, 173, 6, 5691);
			attr_dev(div3, "class", "projects-wrapper__nav-wrapper svelte-nw46hh");
			add_location(div3, file$2, 165, 4, 5414);
			attr_dev(div4, "class", "projects-wrapper__top-section svelte-nw46hh");
			add_location(div4, file$2, 162, 2, 5277);
			attr_dev(div5, "class", "projects-wrapper__bottom-section svelte-nw46hh");
			add_location(div5, file$2, 199, 2, 6510);
			attr_dev(div6, "class", "projects-wrapper svelte-nw46hh");
			add_location(div6, file$2, 161, 0, 5243);
		},
		l: function claim(nodes) {
			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(target, anchor);
			}

			insert_dev(target, t0, anchor);
			insert_dev(target, div6, anchor);
			append_dev(div6, div4);
			append_dev(div4, h1);
			append_dev(h1, t1);
			append_dev(div4, t2);
			append_dev(div4, div0);
			append_dev(div4, t3);
			append_dev(div4, div3);
			append_dev(div3, div1);
			append_dev(div1, h30);
			append_dev(h30, t4);
			append_dev(div3, t5);
			append_dev(div3, div2);
			append_dev(div2, h31);
			append_dev(h31, t6);
			append_dev(div4, t7);

			if (~current_block_type_index_1) {
				if_blocks_1[current_block_type_index_1].m(div4, null);
			}

			append_dev(div6, t8);
			append_dev(div6, div5);

			if (~current_block_type_index_2) {
				if_blocks_2[current_block_type_index_2].m(div5, null);
			}

			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(div1, "click", /*click_handler*/ ctx[14], false, false, false, false),
					listen_dev(div1, "keydown", /*keydown_handler*/ ctx[15], false, false, false, false),
					listen_dev(div2, "click", /*click_handler_1*/ ctx[16], false, false, false, false),
					listen_dev(div2, "keydown", /*keydown_handler_1*/ ctx[17], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx, dirty);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block0) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block0 = if_blocks[current_block_type_index];

					if (!if_block0) {
						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block0.c();
					} else {
						if_block0.p(ctx, dirty);
					}

					transition_in(if_block0, 1);
					if_block0.m(t0.parentNode, t0);
				} else {
					if_block0 = null;
				}
			}

			if ((!current || dirty & /*$_*/ 1024) && t1_value !== (t1_value = /*$_*/ ctx[10]("projects.projects") + "")) set_data_dev(t1, t1_value);
			if ((!current || dirty & /*$_*/ 1024) && t4_value !== (t4_value = /*$_*/ ctx[10]("projects.yourProjects") + "")) set_data_dev(t4, t4_value);

			if (!current || dirty & /*projectsActive*/ 8) {
				toggle_class(div1, "active", /*projectsActive*/ ctx[3]);
			}

			if ((!current || dirty & /*$_*/ 1024) && t6_value !== (t6_value = /*$_*/ ctx[10]("projects.sharedWithYou") + "")) set_data_dev(t6, t6_value);

			if (!current || dirty & /*sharedProjectsActive*/ 16) {
				toggle_class(div2, "active", /*sharedProjectsActive*/ ctx[4]);
			}

			let previous_block_index_1 = current_block_type_index_1;
			current_block_type_index_1 = select_block_type_1(ctx);

			if (current_block_type_index_1 === previous_block_index_1) {
				if (~current_block_type_index_1) {
					if_blocks_1[current_block_type_index_1].p(ctx, dirty);
				}
			} else {
				if (if_block1) {
					group_outros();

					transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
						if_blocks_1[previous_block_index_1] = null;
					});

					check_outros();
				}

				if (~current_block_type_index_1) {
					if_block1 = if_blocks_1[current_block_type_index_1];

					if (!if_block1) {
						if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
						if_block1.c();
					} else {
						if_block1.p(ctx, dirty);
					}

					transition_in(if_block1, 1);
					if_block1.m(div4, null);
				} else {
					if_block1 = null;
				}
			}

			let previous_block_index_2 = current_block_type_index_2;
			current_block_type_index_2 = select_block_type_2(ctx);

			if (current_block_type_index_2 === previous_block_index_2) {
				if (~current_block_type_index_2) {
					if_blocks_2[current_block_type_index_2].p(ctx, dirty);
				}
			} else {
				if (if_block2) {
					group_outros();

					transition_out(if_blocks_2[previous_block_index_2], 1, 1, () => {
						if_blocks_2[previous_block_index_2] = null;
					});

					check_outros();
				}

				if (~current_block_type_index_2) {
					if_block2 = if_blocks_2[current_block_type_index_2];

					if (!if_block2) {
						if_block2 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
						if_block2.c();
					} else {
						if_block2.p(ctx, dirty);
					}

					transition_in(if_block2, 1);
					if_block2.m(div5, null);
				} else {
					if_block2 = null;
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			current = false;
		},
		d: function destroy(detaching) {
			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d(detaching);
			}

			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div6);

			if (~current_block_type_index_1) {
				if_blocks_1[current_block_type_index_1].d();
			}

			if (~current_block_type_index_2) {
				if_blocks_2[current_block_type_index_2].d();
			}

			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const backendUrl$2 = "http://localhost:8080";
const PROJECTS_PER_PAGE = 8;

async function fetchProjects() {
	return fetch(backendUrl$2 + "/api/projects", {
		method: "GET",
		headers: { Accept: "application/json" },
		credentials: "include"
	}).then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}).then(data => {
		return data;
	}).catch(() => {
		return null;
	});
}

// toggles the active class on the project that was clicked & unsets the rest
function toggleProjectActive(id, projectsArray) {
	return projectsArray.map(project => ({ ...project, isActive: project.id === id }));
}

function isEmptyArray(arr) {
	return arr.length === 0;
}

function instance$3($$self, $$props, $$invalidate) {
	let yourActiveProject;
	let sharedActiveProject;
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(10, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Projects', slots, []);
	let errorLoadingProjects = false;
	let projectsActive = true;
	let sharedProjectsActive = false;
	let currentlyDisplayedYourProjects = [];
	let currentlyDisplayedSharedProjects = [];

	// tracks if projects are loading, used for conditional rendering
	let isLoading = true;

	let yourProjects = [];
	let sharedProjects = [];

	async function loadAndDisplayProjects() {
		$$invalidate(6, yourProjects = []);
		$$invalidate(7, sharedProjects = []);
		$$invalidate(5, isLoading = true);
		const fetchedProjects = await fetchProjects();

		if (fetchedProjects === null) {
			$$invalidate(5, isLoading = false);
			$$invalidate(2, errorLoadingProjects = true);
			return;
		}

		fetchedProjects.forEach(project => {
			if (project.role === "Owner") {
				yourProjects.push(project);
			} else {
				sharedProjects.push(project);
			}
		});

		// slice on page load so only the first projects are shown and the rest are paginated
		if (projectsActive) {
			$$invalidate(0, currentlyDisplayedYourProjects = yourProjects.slice(0, PROJECTS_PER_PAGE));
		} else {
			$$invalidate(1, currentlyDisplayedSharedProjects = sharedProjects.slice(0, PROJECTS_PER_PAGE));
		}

		// sets the first element as active, since the projects will be sorted by most recent
		if (!isEmptyArray(yourProjects)) {
			$$invalidate(6, yourProjects[0].isActive = true, yourProjects);
		}

		$$invalidate(5, isLoading = false);
	}

	// toggles the active class on nav items (Your Projects, Shared with you), as well as defaults to first page when tabs are switched
	function toggleActive(item) {
		if (item === "projects" && !projectsActive) {
			$$invalidate(3, projectsActive = true);
			$$invalidate(4, sharedProjectsActive = false);
			$$invalidate(0, currentlyDisplayedYourProjects = yourProjects.slice(0, PROJECTS_PER_PAGE));

			if (!isEmptyArray(yourProjects)) {
				$$invalidate(6, yourProjects[0].isActive = true, yourProjects);
			}

			if (!isEmptyArray(sharedProjects)) {
				$$invalidate(7, sharedProjects[0].isActive = false, sharedProjects);
			}
		} else if (item === "sharedProjects" && !sharedProjectsActive && !isLoading) {
			$$invalidate(3, projectsActive = false); // prevents toggling when loading
			$$invalidate(4, sharedProjectsActive = true);
			$$invalidate(1, currentlyDisplayedSharedProjects = sharedProjects.slice(0, PROJECTS_PER_PAGE));

			if (!isEmptyArray(sharedProjects)) {
				$$invalidate(7, sharedProjects[0].isActive = true, sharedProjects);
			}

			if (!isEmptyArray(yourProjects)) {
				$$invalidate(6, yourProjects[0].isActive = false, yourProjects);
			}
		}
	}

	// when the page change function is triggered inside the pagination component, this function is called
	// which assigns a new slice of the all projects array using getCurrentPageItems defined in the pagination component
	// event.detail is equal to the return value of getCurrentPageItems, also sets the first element as active on page change
	function handlePaginationChange(event) {
		if (projectsActive) {
			$$invalidate(0, currentlyDisplayedYourProjects = event.detail);
			$$invalidate(0, currentlyDisplayedYourProjects[0].isActive = true, currentlyDisplayedYourProjects);
		} else {
			$$invalidate(1, currentlyDisplayedSharedProjects = event.detail);
			$$invalidate(1, currentlyDisplayedSharedProjects[0].isActive = true, currentlyDisplayedSharedProjects);
		}
	}

	onMount(() => {
		loadAndDisplayProjects();
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
	});

	const click_handler = () => toggleActive("projects");
	const keydown_handler = () => toggleActive("projects");
	const click_handler_1 = () => toggleActive("sharedProjects");
	const keydown_handler_1 = () => toggleActive("sharedProjects");

	const func = project => {
		$$invalidate(0, currentlyDisplayedYourProjects = toggleProjectActive(project.id, currentlyDisplayedYourProjects));
	};

	const func_1 = project => {
		$$invalidate(1, currentlyDisplayedSharedProjects = toggleProjectActive(project.id, currentlyDisplayedSharedProjects));
	};

	$$self.$capture_state = () => ({
		onMount,
		_: $format,
		CreateProject,
		LeftNavigation,
		Pagination,
		ProjectEntry,
		backendUrl: backendUrl$2,
		errorLoadingProjects,
		projectsActive,
		sharedProjectsActive,
		PROJECTS_PER_PAGE,
		currentlyDisplayedYourProjects,
		currentlyDisplayedSharedProjects,
		isLoading,
		yourProjects,
		sharedProjects,
		fetchProjects,
		loadAndDisplayProjects,
		toggleProjectActive,
		toggleActive,
		isEmptyArray,
		handlePaginationChange,
		sharedActiveProject,
		yourActiveProject,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('errorLoadingProjects' in $$props) $$invalidate(2, errorLoadingProjects = $$props.errorLoadingProjects);
		if ('projectsActive' in $$props) $$invalidate(3, projectsActive = $$props.projectsActive);
		if ('sharedProjectsActive' in $$props) $$invalidate(4, sharedProjectsActive = $$props.sharedProjectsActive);
		if ('currentlyDisplayedYourProjects' in $$props) $$invalidate(0, currentlyDisplayedYourProjects = $$props.currentlyDisplayedYourProjects);
		if ('currentlyDisplayedSharedProjects' in $$props) $$invalidate(1, currentlyDisplayedSharedProjects = $$props.currentlyDisplayedSharedProjects);
		if ('isLoading' in $$props) $$invalidate(5, isLoading = $$props.isLoading);
		if ('yourProjects' in $$props) $$invalidate(6, yourProjects = $$props.yourProjects);
		if ('sharedProjects' in $$props) $$invalidate(7, sharedProjects = $$props.sharedProjects);
		if ('sharedActiveProject' in $$props) $$invalidate(8, sharedActiveProject = $$props.sharedActiveProject);
		if ('yourActiveProject' in $$props) $$invalidate(9, yourActiveProject = $$props.yourActiveProject);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*currentlyDisplayedYourProjects*/ 1) {
			// reactive statments to conditinonally pass the current active
			// project to left side navigation component on project entry click
			$$invalidate(9, yourActiveProject = currentlyDisplayedYourProjects.find(project => project.isActive) || null);
		}

		if ($$self.$$.dirty & /*currentlyDisplayedSharedProjects*/ 2) {
			$$invalidate(8, sharedActiveProject = currentlyDisplayedSharedProjects.find(project => project.isActive) || null);
		}
	};

	return [
		currentlyDisplayedYourProjects,
		currentlyDisplayedSharedProjects,
		errorLoadingProjects,
		projectsActive,
		sharedProjectsActive,
		isLoading,
		yourProjects,
		sharedProjects,
		sharedActiveProject,
		yourActiveProject,
		$_,
		loadAndDisplayProjects,
		toggleActive,
		handlePaginationChange,
		click_handler,
		keydown_handler,
		click_handler_1,
		keydown_handler_1,
		func,
		func_1
	];
}

class Projects extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Projects",
			options,
			id: create_fragment$3.name
		});
	}
}

/* src\Components\Register.svelte generated by Svelte v3.59.2 */
const file$1 = "src\\Components\\Register.svelte";

// (21:6) {#if errorMessage}
function create_if_block$2(ctx) {
	let h3;
	let t_value = /*$_*/ ctx[2](`register.errorMessages.${/*errorMessageKey*/ ctx[1]}`) + "";
	let t;

	const block = {
		c: function create() {
			h3 = element("h3");
			t = text(t_value);
			attr_dev(h3, "class", "error svelte-1n1a53w");
			add_location(h3, file$1, 21, 8, 577);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h3, anchor);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_, errorMessageKey*/ 6 && t_value !== (t_value = /*$_*/ ctx[2](`register.errorMessages.${/*errorMessageKey*/ ctx[1]}`) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(21:6) {#if errorMessage}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let main;
	let div3;
	let h1;
	let t1;
	let div2;
	let t2;
	let div1;
	let form;
	let input0;
	let input0_placeholder_value;
	let t3;
	let input1;
	let input1_placeholder_value;
	let t4;
	let input2;
	let input2_placeholder_value;
	let t5;
	let div0;
	let button;
	let t6_value = /*$_*/ ctx[2]("register.register") + "";
	let t6;
	let t7;
	let a;
	let t8_value = /*$_*/ ctx[2]("register.login") + "";
	let t8;
	let if_block = /*errorMessage*/ ctx[0] && create_if_block$2(ctx);

	const block = {
		c: function create() {
			main = element("main");
			div3 = element("div");
			h1 = element("h1");
			h1.textContent = "Studiosus";
			t1 = space();
			div2 = element("div");
			if (if_block) if_block.c();
			t2 = space();
			div1 = element("div");
			form = element("form");
			input0 = element("input");
			t3 = space();
			input1 = element("input");
			t4 = space();
			input2 = element("input");
			t5 = space();
			div0 = element("div");
			button = element("button");
			t6 = text(t6_value);
			t7 = space();
			a = element("a");
			t8 = text(t8_value);
			add_location(h1, file$1, 18, 4, 491);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "name", "username");
			attr_dev(input0, "placeholder", input0_placeholder_value = /*$_*/ ctx[2]("register.username"));
			input0.required = true;
			attr_dev(input0, "class", "svelte-1n1a53w");
			add_location(input0, file$1, 25, 10, 770);
			attr_dev(input1, "type", "email");
			attr_dev(input1, "name", "email");
			attr_dev(input1, "placeholder", input1_placeholder_value = /*$_*/ ctx[2]("register.email"));
			input1.required = true;
			attr_dev(input1, "class", "svelte-1n1a53w");
			add_location(input1, file$1, 31, 10, 923);
			attr_dev(input2, "type", "password");
			attr_dev(input2, "name", "password");
			attr_dev(input2, "placeholder", input2_placeholder_value = /*$_*/ ctx[2]("register.password"));
			input2.required = true;
			attr_dev(input2, "class", "svelte-1n1a53w");
			add_location(input2, file$1, 37, 10, 1071);
			attr_dev(button, "class", "button--blue");
			attr_dev(button, "type", "submit");
			add_location(button, file$1, 44, 12, 1271);
			attr_dev(div0, "class", "button-container svelte-1n1a53w");
			add_location(div0, file$1, 43, 10, 1228);
			attr_dev(form, "action", backendUrl$1 + "/register");
			attr_dev(form, "method", "post");
			attr_dev(form, "class", "svelte-1n1a53w");
			add_location(form, file$1, 24, 8, 705);
			attr_dev(a, "href", "/login");
			attr_dev(a, "class", "svelte-1n1a53w");
			add_location(a, file$1, 49, 8, 1418);
			attr_dev(div1, "class", "password-login svelte-1n1a53w");
			add_location(div1, file$1, 23, 6, 668);
			attr_dev(div2, "class", "login-component");
			add_location(div2, file$1, 19, 4, 514);
			attr_dev(div3, "class", "main-component svelte-1n1a53w");
			add_location(div3, file$1, 17, 2, 458);
			add_location(main, file$1, 16, 0, 449);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div3);
			append_dev(div3, h1);
			append_dev(div3, t1);
			append_dev(div3, div2);
			if (if_block) if_block.m(div2, null);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div1, form);
			append_dev(form, input0);
			append_dev(form, t3);
			append_dev(form, input1);
			append_dev(form, t4);
			append_dev(form, input2);
			append_dev(form, t5);
			append_dev(form, div0);
			append_dev(div0, button);
			append_dev(button, t6);
			append_dev(div1, t7);
			append_dev(div1, a);
			append_dev(a, t8);
		},
		p: function update(ctx, [dirty]) {
			if (/*errorMessage*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(div2, t2);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*$_*/ 4 && input0_placeholder_value !== (input0_placeholder_value = /*$_*/ ctx[2]("register.username"))) {
				attr_dev(input0, "placeholder", input0_placeholder_value);
			}

			if (dirty & /*$_*/ 4 && input1_placeholder_value !== (input1_placeholder_value = /*$_*/ ctx[2]("register.email"))) {
				attr_dev(input1, "placeholder", input1_placeholder_value);
			}

			if (dirty & /*$_*/ 4 && input2_placeholder_value !== (input2_placeholder_value = /*$_*/ ctx[2]("register.password"))) {
				attr_dev(input2, "placeholder", input2_placeholder_value);
			}

			if (dirty & /*$_*/ 4 && t6_value !== (t6_value = /*$_*/ ctx[2]("register.register") + "")) set_data_dev(t6, t6_value);
			if (dirty & /*$_*/ 4 && t8_value !== (t8_value = /*$_*/ ctx[2]("register.login") + "")) set_data_dev(t8, t8_value);
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const backendUrl$1 = "http://localhost:8080";

function instance$2($$self, $$props, $$invalidate) {
	let $_;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(2, $_ = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Register', slots, []);
	let errorMessage = "";
	let errorMessageKey = "undefinedError";

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		$$invalidate(0, errorMessage = params.get("exception"));

		if (errorMessage === "IllegalArgumentException") {
			$$invalidate(1, errorMessageKey = "emailAlreadyInUse");
		}
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Register> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		_: $format,
		backendUrl: backendUrl$1,
		errorMessage,
		errorMessageKey,
		$_
	});

	$$self.$inject_state = $$props => {
		if ('errorMessage' in $$props) $$invalidate(0, errorMessage = $$props.errorMessage);
		if ('errorMessageKey' in $$props) $$invalidate(1, errorMessageKey = $$props.errorMessageKey);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [errorMessage, errorMessageKey, $_];
}

class Register extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Register",
			options,
			id: create_fragment$2.name
		});
	}
}

var img$2 = "data:image/svg+xml,%3csvg viewBox='0 0 512 512' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 512 512'%3e%3cpath d='m396.6 160 19.4 20.7L256 352 96 180.7l19.3-20.7L256 310.5z' fill='white' class='fill-000000'%3e%3c/path%3e%3c/svg%3e";

var img$1 = "data:image/svg+xml,%3csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' d='m8 9.414-4.293 4.293-1.414-1.414L6.586 8 2.293 3.707l1.414-1.414L8 6.586l4.293-4.293 1.414 1.414L9.414 8l4.293 4.293-1.414 1.414L8 9.414z' fill='white' class='fill-000000'%3e%3c/path%3e%3c/svg%3e";

var img = "data:image/svg+xml,%3csvg viewBox='0 0 32 32' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 32 32'%3e%3cpath d='M4 10h24a2 2 0 0 0 0-4H4a2 2 0 0 0 0 4zm24 4H4a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4zm0 8H4a2 2 0 0 0 0 4h24a2 2 0 0 0 0-4z' fill='white' class='fill-000000'%3e%3c/path%3e%3c/svg%3e";

/* src\Components\TopNavigation.svelte generated by Svelte v3.59.2 */

const { Object: Object_1 } = globals;
const file = "src\\Components\\TopNavigation.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	return child_ctx;
}

// (138:4) {#if isLoggedIn}
function create_if_block_5(ctx) {
	let li;
	let a;
	let h3;
	let t_value = /*$_*/ ctx[3]("navigation.projects") + "";
	let t;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			h3 = element("h3");
			t = text(t_value);
			add_location(h3, file, 140, 10, 4930);
			attr_dev(a, "href", "/projects");
			attr_dev(a, "class", "svelte-24zu8");
			add_location(a, file, 139, 8, 4899);
			attr_dev(li, "class", "top-nav__item " + (isActivePage('/projects') ? 'active' : '') + " svelte-24zu8");
			add_location(li, file, 138, 6, 4820);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, h3);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 8 && t_value !== (t_value = /*$_*/ ctx[3]("navigation.projects") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_5.name,
		type: "if",
		source: "(138:4) {#if isLoggedIn}",
		ctx
	});

	return block;
}

// (150:4) {#if isLoggedIn}
function create_if_block_4(ctx) {
	let li;
	let a;
	let h3;
	let t_value = /*$_*/ ctx[3]("navigation.profile") + "";
	let t;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			h3 = element("h3");
			t = text(t_value);
			add_location(h3, file, 152, 10, 5308);
			attr_dev(a, "href", "/profile");
			attr_dev(a, "class", "svelte-24zu8");
			add_location(a, file, 151, 8, 5278);
			attr_dev(li, "class", "top-nav__item " + (isActivePage('/profile') ? 'active' : '') + " svelte-24zu8");
			add_location(li, file, 150, 6, 5200);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, h3);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 8 && t_value !== (t_value = /*$_*/ ctx[3]("navigation.profile") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_4.name,
		type: "if",
		source: "(150:4) {#if isLoggedIn}",
		ctx
	});

	return block;
}

// (163:4) {:else}
function create_else_block$1(ctx) {
	let li;
	let a;
	let h3;
	let t_value = /*$_*/ ctx[3]("navigation.login") + "";
	let t;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			h3 = element("h3");
			t = text(t_value);
			add_location(h3, file, 165, 10, 5667);
			attr_dev(a, "href", "/login");
			attr_dev(a, "class", "svelte-24zu8");
			add_location(a, file, 164, 8, 5639);
			attr_dev(li, "class", "top-nav__item " + (isActivePage('/login') ? 'active' : '') + " svelte-24zu8");
			add_location(li, file, 163, 6, 5563);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, h3);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 8 && t_value !== (t_value = /*$_*/ ctx[3]("navigation.login") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(163:4) {:else}",
		ctx
	});

	return block;
}

// (157:4) {#if isLoggedIn}
function create_if_block_3(ctx) {
	let li;
	let a;
	let h3;
	let t_value = /*$_*/ ctx[3]("navigation.logout") + "";
	let t;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			h3 = element("h3");
			t = text(t_value);
			add_location(h3, file, 159, 10, 5485);
			attr_dev(a, "href", backendUrl + "/logout");
			attr_dev(a, "class", "svelte-24zu8");
			add_location(a, file, 158, 8, 5441);
			attr_dev(li, "class", "top-nav__item svelte-24zu8");
			add_location(li, file, 157, 6, 5406);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, h3);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 8 && t_value !== (t_value = /*$_*/ ctx[3]("navigation.logout") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(157:4) {#if isLoggedIn}",
		ctx
	});

	return block;
}

// (170:4) {#if !isLoggedIn}
function create_if_block_2(ctx) {
	let li;
	let a;
	let h3;
	let t_value = /*$_*/ ctx[3]("navigation.register") + "";
	let t;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			h3 = element("h3");
			t = text(t_value);
			add_location(h3, file, 172, 10, 5874);
			attr_dev(a, "href", "/register");
			attr_dev(a, "class", "svelte-24zu8");
			add_location(a, file, 171, 8, 5843);
			attr_dev(li, "class", "top-nav__item " + (isActivePage('/register') ? 'active' : '') + " svelte-24zu8");
			add_location(li, file, 170, 6, 5764);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, h3);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$_*/ 8 && t_value !== (t_value = /*$_*/ ctx[3]("navigation.register") + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(170:4) {#if !isLoggedIn}",
		ctx
	});

	return block;
}

// (187:8) {#if $locale !== "lt"}
function create_if_block_1(ctx) {
	let h3;
	let t;

	const block = {
		c: function create() {
			h3 = element("h3");
			t = text(/*$locale*/ ctx[4]);
			add_location(h3, file, 187, 10, 6241);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h3, anchor);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$locale*/ 16) set_data_dev(t, /*$locale*/ ctx[4]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(187:8) {#if $locale !== \\\"lt\\\"}",
		ctx
	});

	return block;
}

// (190:8) {#if $locale !== "en"}
function create_if_block$1(ctx) {
	let h3;
	let t;

	const block = {
		c: function create() {
			h3 = element("h3");
			t = text(/*$locale*/ ctx[4]);
			add_location(h3, file, 190, 10, 6315);
		},
		m: function mount(target, anchor) {
			insert_dev(target, h3, anchor);
			append_dev(h3, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*$locale*/ 16) set_data_dev(t, /*$locale*/ ctx[4]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h3);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(190:8) {#if $locale !== \\\"en\\\"}",
		ctx
	});

	return block;
}

// (204:8) {#each Object.values(AVAILABLE_LOCALES) as item}
function create_each_block(ctx) {
	let div;
	let h3;
	let t0_value = /*item*/ ctx[16] + "";
	let t0;
	let t1;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			h3 = element("h3");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(h3, "class", "svelte-24zu8");
			add_location(h3, file, 209, 12, 6871);
			attr_dev(div, "class", "dropdown__item-container svelte-24zu8");
			add_location(div, file, 204, 10, 6707);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h3);
			append_dev(h3, t0);
			append_dev(div, t1);

			if (!mounted) {
				dispose = [
					listen_dev(div, "click", /*handleLanguageSelect*/ ctx[7], false, false, false, false),
					listen_dev(div, "keydown", /*handleLanguageSelect*/ ctx[7], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(204:8) {#each Object.values(AVAILABLE_LOCALES) as item}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let header;
	let div2;
	let div1;
	let a0;
	let div0;
	let h30;
	let t1;
	let div3;
	let button0;
	let img0;
	let img0_src_value;
	let img0_alt_value;
	let t2;
	let img1;
	let img1_class_value;
	let img1_src_value;
	let img1_alt_value;
	let t3;
	let menu;
	let li0;
	let a1;
	let h31;
	let t4_value = /*$_*/ ctx[3]("navigation.editor") + "";
	let t4;
	let t5;
	let t6;
	let li1;
	let a2;
	let h32;
	let t7_value = /*$_*/ ctx[3]("navigation.templates") + "";
	let t7;
	let t8;
	let t9;
	let t10;
	let t11;
	let li2;
	let button1;
	let t12;
	let t13;
	let img2;
	let img2_src_value;
	let t14;
	let div4;
	let mounted;
	let dispose;
	let if_block0 = /*isLoggedIn*/ ctx[0] && create_if_block_5(ctx);
	let if_block1 = /*isLoggedIn*/ ctx[0] && create_if_block_4(ctx);

	function select_block_type(ctx, dirty) {
		if (/*isLoggedIn*/ ctx[0]) return create_if_block_3;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block2 = current_block_type(ctx);
	let if_block3 = !/*isLoggedIn*/ ctx[0] && create_if_block_2(ctx);
	let if_block4 = /*$locale*/ ctx[4] !== "lt" && create_if_block_1(ctx);
	let if_block5 = /*$locale*/ ctx[4] !== "en" && create_if_block$1(ctx);
	let each_value = Object.values(AVAILABLE_LOCALES);
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			header = element("header");
			div2 = element("div");
			div1 = element("div");
			a0 = element("a");
			div0 = element("div");
			h30 = element("h3");
			h30.textContent = "Studiosus";
			t1 = space();
			div3 = element("div");
			button0 = element("button");
			img0 = element("img");
			t2 = space();
			img1 = element("img");
			t3 = space();
			menu = element("menu");
			li0 = element("li");
			a1 = element("a");
			h31 = element("h3");
			t4 = text(t4_value);
			t5 = space();
			if (if_block0) if_block0.c();
			t6 = space();
			li1 = element("li");
			a2 = element("a");
			h32 = element("h3");
			t7 = text(t7_value);
			t8 = space();
			if (if_block1) if_block1.c();
			t9 = space();
			if_block2.c();
			t10 = space();
			if (if_block3) if_block3.c();
			t11 = space();
			li2 = element("li");
			button1 = element("button");
			if (if_block4) if_block4.c();
			t12 = space();
			if (if_block5) if_block5.c();
			t13 = space();
			img2 = element("img");
			t14 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(h30, "class", "svelte-24zu8");
			add_location(h30, file, 104, 10, 3927);
			attr_dev(div0, "class", "top-nav__logo svelte-24zu8");
			add_location(div0, file, 103, 8, 3889);
			attr_dev(a0, "href", "/");
			attr_dev(a0, "class", "svelte-24zu8");
			add_location(a0, file, 102, 6, 3868);
			attr_dev(div1, "class", "top-nav__route-wrapper");
			add_location(div1, file, 101, 4, 3825);
			attr_dev(div2, "class", "top-nav__logo-container svelte-24zu8");
			add_location(div2, file, 100, 2, 3783);
			attr_dev(img0, "class", "hamburger--btn__exit-icon svelte-24zu8");
			if (!src_url_equal(img0.src, img0_src_value = img$1)) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", img0_alt_value = /*$_*/ ctx[3]("navigation.close"));
			toggle_class(img0, "active", /*hamburgerDropdownVisible*/ ctx[2]);
			add_location(img0, file, 116, 6, 4215);

			attr_dev(img1, "class", img1_class_value = "hamburger--btn__burger-icon " + (/*hamburgerDropdownVisible*/ ctx[2]
			? 'hidden'
			: 'active') + " svelte-24zu8");

			if (!src_url_equal(img1.src, img1_src_value = img)) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", img1_alt_value = /*$_*/ ctx[3]("navigation.open"));
			add_location(img1, file, 122, 6, 4386);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "hamburger--btn button--default svelte-24zu8");
			toggle_class(button0, "active", /*hamburgerDropdownVisible*/ ctx[2]);
			add_location(button0, file, 110, 4, 4038);
			attr_dev(div3, "class", "top-nav__button-container svelte-24zu8");
			add_location(div3, file, 109, 2, 3994);
			add_location(h31, file, 134, 8, 4737);
			attr_dev(a1, "href", "/editor");
			attr_dev(a1, "class", "svelte-24zu8");
			add_location(a1, file, 133, 6, 4710);
			attr_dev(li0, "class", "top-nav__item " + (isActivePage('/editor') ? 'active' : '') + " svelte-24zu8");
			add_location(li0, file, 132, 4, 4635);
			add_location(h32, file, 146, 8, 5114);
			attr_dev(a2, "href", "/templates");
			attr_dev(a2, "class", "svelte-24zu8");
			add_location(a2, file, 145, 6, 5084);
			attr_dev(li1, "class", "top-nav__item " + (isActivePage('/templates') ? 'active' : '') + " svelte-24zu8");
			add_location(li1, file, 144, 4, 5006);
			attr_dev(img2, "id", "dropdown__arrow-icon");
			if (!src_url_equal(img2.src, img2_src_value = img$2)) attr_dev(img2, "src", img2_src_value);
			attr_dev(img2, "alt", "toggle language select");
			attr_dev(img2, "class", "svelte-24zu8");
			toggle_class(img2, "active", /*langDropdownVisible*/ ctx[1]);
			add_location(img2, file, 192, 8, 6356);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "dropdown--btn button--default svelte-24zu8");
			toggle_class(button1, "active", /*langDropdownVisible*/ ctx[1]);
			add_location(button1, file, 181, 6, 6073);
			attr_dev(div4, "class", "dropdown__dropdown-content svelte-24zu8");
			toggle_class(div4, "visible", /*langDropdownVisible*/ ctx[1]);
			add_location(div4, file, 199, 6, 6540);
			attr_dev(li2, "class", "dropdown svelte-24zu8");
			add_location(li2, file, 176, 4, 5950);
			attr_dev(menu, "class", "top-nav__list svelte-24zu8");
			add_location(menu, file, 131, 2, 4602);
			attr_dev(header, "class", "top-nav svelte-24zu8");
			add_location(header, file, 99, 0, 3756);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, header, anchor);
			append_dev(header, div2);
			append_dev(div2, div1);
			append_dev(div1, a0);
			append_dev(a0, div0);
			append_dev(div0, h30);
			append_dev(header, t1);
			append_dev(header, div3);
			append_dev(div3, button0);
			append_dev(button0, img0);
			append_dev(button0, t2);
			append_dev(button0, img1);
			append_dev(header, t3);
			append_dev(header, menu);
			append_dev(menu, li0);
			append_dev(li0, a1);
			append_dev(a1, h31);
			append_dev(h31, t4);
			append_dev(menu, t5);
			if (if_block0) if_block0.m(menu, null);
			append_dev(menu, t6);
			append_dev(menu, li1);
			append_dev(li1, a2);
			append_dev(a2, h32);
			append_dev(h32, t7);
			append_dev(menu, t8);
			if (if_block1) if_block1.m(menu, null);
			append_dev(menu, t9);
			if_block2.m(menu, null);
			append_dev(menu, t10);
			if (if_block3) if_block3.m(menu, null);
			append_dev(menu, t11);
			append_dev(menu, li2);
			append_dev(li2, button1);
			if (if_block4) if_block4.m(button1, null);
			append_dev(button1, t12);
			if (if_block5) if_block5.m(button1, null);
			append_dev(button1, t13);
			append_dev(button1, img2);
			append_dev(li2, t14);
			append_dev(li2, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div4, null);
				}
			}

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*handleHamburgerDropdownClick*/ ctx[6], false, false, false, false),
					listen_dev(li2, "click", /*handleLangDropdownClick*/ ctx[5], false, false, false, false),
					listen_dev(li2, "keydown", /*handleLangDropdownClick*/ ctx[5], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$_*/ 8 && img0_alt_value !== (img0_alt_value = /*$_*/ ctx[3]("navigation.close"))) {
				attr_dev(img0, "alt", img0_alt_value);
			}

			if (dirty & /*hamburgerDropdownVisible*/ 4) {
				toggle_class(img0, "active", /*hamburgerDropdownVisible*/ ctx[2]);
			}

			if (dirty & /*hamburgerDropdownVisible*/ 4 && img1_class_value !== (img1_class_value = "hamburger--btn__burger-icon " + (/*hamburgerDropdownVisible*/ ctx[2]
			? 'hidden'
			: 'active') + " svelte-24zu8")) {
				attr_dev(img1, "class", img1_class_value);
			}

			if (dirty & /*$_*/ 8 && img1_alt_value !== (img1_alt_value = /*$_*/ ctx[3]("navigation.open"))) {
				attr_dev(img1, "alt", img1_alt_value);
			}

			if (dirty & /*hamburgerDropdownVisible*/ 4) {
				toggle_class(button0, "active", /*hamburgerDropdownVisible*/ ctx[2]);
			}

			if (dirty & /*$_*/ 8 && t4_value !== (t4_value = /*$_*/ ctx[3]("navigation.editor") + "")) set_data_dev(t4, t4_value);

			if (/*isLoggedIn*/ ctx[0]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_5(ctx);
					if_block0.c();
					if_block0.m(menu, t6);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (dirty & /*$_*/ 8 && t7_value !== (t7_value = /*$_*/ ctx[3]("navigation.templates") + "")) set_data_dev(t7, t7_value);

			if (/*isLoggedIn*/ ctx[0]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_4(ctx);
					if_block1.c();
					if_block1.m(menu, t9);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block2) {
				if_block2.p(ctx, dirty);
			} else {
				if_block2.d(1);
				if_block2 = current_block_type(ctx);

				if (if_block2) {
					if_block2.c();
					if_block2.m(menu, t10);
				}
			}

			if (!/*isLoggedIn*/ ctx[0]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block_2(ctx);
					if_block3.c();
					if_block3.m(menu, t11);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (/*$locale*/ ctx[4] !== "lt") {
				if (if_block4) {
					if_block4.p(ctx, dirty);
				} else {
					if_block4 = create_if_block_1(ctx);
					if_block4.c();
					if_block4.m(button1, t12);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (/*$locale*/ ctx[4] !== "en") {
				if (if_block5) {
					if_block5.p(ctx, dirty);
				} else {
					if_block5 = create_if_block$1(ctx);
					if_block5.c();
					if_block5.m(button1, t13);
				}
			} else if (if_block5) {
				if_block5.d(1);
				if_block5 = null;
			}

			if (dirty & /*langDropdownVisible*/ 2) {
				toggle_class(img2, "active", /*langDropdownVisible*/ ctx[1]);
			}

			if (dirty & /*langDropdownVisible*/ 2) {
				toggle_class(button1, "active", /*langDropdownVisible*/ ctx[1]);
			}

			if (dirty & /*handleLanguageSelect, Object, AVAILABLE_LOCALES*/ 128) {
				each_value = Object.values(AVAILABLE_LOCALES);
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*langDropdownVisible*/ 2) {
				toggle_class(div4, "visible", /*langDropdownVisible*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(header);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
			if (if_block5) if_block5.d();
			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const backendUrl = "http://localhost:8080";

// Changes background color if page is active
function isActivePage(page) {
	return window.location.pathname === page;
}

function instance$1($$self, $$props, $$invalidate) {
	let $_;
	let $locale$1;
	validate_store($format, '_');
	component_subscribe($$self, $format, $$value => $$invalidate(3, $_ = $$value));
	validate_store($locale, 'locale');
	component_subscribe($$self, $locale, $$value => $$invalidate(4, $locale$1 = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('TopNavigation', slots, []);
	let isLoggedIn = false;
	let langDropdownVisible = false;
	let hamburgerDropdownVisible = false;
	let dropdownContainer;
	let dropdownTopMenu;
	let hamburgerButton;
	let langDropdownButtonText;
	let dropdownMenuClass;

	// checks if user is logged to differently render the navigation by
	// checking if a specific cookie exists, on logout the backend takes
	// care of clearing the cookie
	function isUserLoggedIn() {
		$$invalidate(0, isLoggedIn = document.cookie.includes("JSESSIONID="));
	}

	onMount(() => {
		isUserLoggedIn();

		isLoggedIn
		? dropdownMenuClass = "show-menu-logged-in"
		: dropdownMenuClass = "show-menu";

		dropdownContainer = document.querySelector(".dropdown");
		dropdownTopMenu = document.querySelector(".top-nav__list");
		hamburgerButton = document.querySelector(".hamburger--btn");
		langDropdownButtonText = document.querySelector(".dropdown--btn h3");
		document.addEventListener("click", handleDocumentClick);
		window.addEventListener("resize", handleWindowResize);
	});

	// closes the dropdown menu when the window is resized & changes icons (hamburger/exit)
	function handleWindowResize() {
		if (window.innerWidth > 920) {
			$$invalidate(2, hamburgerDropdownVisible = false);

			if (dropdownTopMenu.classList.contains(dropdownMenuClass)) {
				dropdownTopMenu.classList.remove(dropdownMenuClass);
			}

			if (dropdownTopMenu.classList.contains("hide-menu")) {
				dropdownTopMenu.classList.remove("hide-menu");
			}

			// closes the language dropdown menu when window is resized
			if (langDropdownVisible) {
				$$invalidate(1, langDropdownVisible = false);
			}
		}
	}

	// toggles the display of the language dropdown menu + arrow rotation on user click
	function handleLangDropdownClick() {
		isUserLoggedIn();
		$$invalidate(1, langDropdownVisible = !langDropdownVisible);
	}

	// Closes the dropdown menus when user clicks outside of the dropdown container
	function handleDocumentClick(event) {
		if (!dropdownContainer.contains(event.target)) {
			$$invalidate(1, langDropdownVisible = false);
		}

		// toggles the transition of the hamburger dropdown menu
		if (!hamburgerButton.contains(event.target) && dropdownTopMenu.classList.contains(dropdownMenuClass)) {
			dropdownTopMenu.classList.remove(dropdownMenuClass);
			dropdownTopMenu.classList.add("hide-menu");
			$$invalidate(2, hamburgerDropdownVisible = !hamburgerDropdownVisible);
		}
	}

	// Toggles the display of the hamburger dropdown menu + changes the hamburger icon to an exit icon
	function handleHamburgerDropdownClick() {
		$$invalidate(2, hamburgerDropdownVisible = !hamburgerDropdownVisible);

		if (dropdownTopMenu.classList.contains(dropdownMenuClass)) {
			dropdownTopMenu.classList.remove(dropdownMenuClass);
			dropdownTopMenu.classList.add("hide-menu");
		} else {
			dropdownTopMenu.classList.remove("hide-menu");
			dropdownTopMenu.classList.add(dropdownMenuClass);
		}
	}

	// Changes the language displayed in the language dropdown button
	function handleLanguageSelect(event) {
		const selectedLanguage = event.target.textContent;
		langDropdownButtonText.textContent = selectedLanguage;
		changeLocale(selectedLanguage);
	}

	const writable_props = [];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopNavigation> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		_: $format,
		locale: $locale,
		ArrowDown: img$2,
		CloseIcon: img$1,
		HamburgerIcon: img,
		AVAILABLE_LOCALES,
		changeLocale,
		backendUrl,
		isLoggedIn,
		langDropdownVisible,
		hamburgerDropdownVisible,
		dropdownContainer,
		dropdownTopMenu,
		hamburgerButton,
		langDropdownButtonText,
		dropdownMenuClass,
		isUserLoggedIn,
		handleWindowResize,
		handleLangDropdownClick,
		handleDocumentClick,
		handleHamburgerDropdownClick,
		handleLanguageSelect,
		isActivePage,
		$_,
		$locale: $locale$1
	});

	$$self.$inject_state = $$props => {
		if ('isLoggedIn' in $$props) $$invalidate(0, isLoggedIn = $$props.isLoggedIn);
		if ('langDropdownVisible' in $$props) $$invalidate(1, langDropdownVisible = $$props.langDropdownVisible);
		if ('hamburgerDropdownVisible' in $$props) $$invalidate(2, hamburgerDropdownVisible = $$props.hamburgerDropdownVisible);
		if ('dropdownContainer' in $$props) dropdownContainer = $$props.dropdownContainer;
		if ('dropdownTopMenu' in $$props) dropdownTopMenu = $$props.dropdownTopMenu;
		if ('hamburgerButton' in $$props) hamburgerButton = $$props.hamburgerButton;
		if ('langDropdownButtonText' in $$props) langDropdownButtonText = $$props.langDropdownButtonText;
		if ('dropdownMenuClass' in $$props) dropdownMenuClass = $$props.dropdownMenuClass;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		isLoggedIn,
		langDropdownVisible,
		hamburgerDropdownVisible,
		$_,
		$locale$1,
		handleLangDropdownClick,
		handleHamburgerDropdownClick,
		handleLanguageSelect
	];
}

class TopNavigation extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "TopNavigation",
			options,
			id: create_fragment$1.name
		});
	}
}

/* src\App.svelte generated by Svelte v3.59.2 */

// (17:0) {:else}
function create_else_block(ctx) {
	let layoutmanager;
	let current;

	layoutmanager = new LayoutManager({
			props: {
				header: TopNavigation,
				footer: Footer,
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(layoutmanager.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(layoutmanager, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const layoutmanager_changes = {};

			if (dirty & /*$$scope*/ 2) {
				layoutmanager_changes.$$scope = { dirty, ctx };
			}

			layoutmanager.$set(layoutmanager_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(layoutmanager.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(layoutmanager.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(layoutmanager, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(17:0) {:else}",
		ctx
	});

	return block;
}

// (15:0) {#if $isLoading}
function create_if_block(ctx) {
	const block = {
		c: noop,
		m: noop,
		p: noop,
		i: noop,
		o: noop,
		d: noop
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(15:0) {#if $isLoading}",
		ctx
	});

	return block;
}

// (19:4) <Router>
function create_default_slot_1(ctx) {
	let route0;
	let t0;
	let route1;
	let t1;
	let route2;
	let t2;
	let route3;
	let t3;
	let route4;
	let t4;
	let route5;
	let t5;
	let route6;
	let current;

	route0 = new Route({
			props: { path: "/", component: CodeEditor_1 },
			$$inline: true
		});

	route1 = new Route({
			props: { path: "/login", component: Login },
			$$inline: true
		});

	route2 = new Route({
			props: { path: "/register", component: Register },
			$$inline: true
		});

	route3 = new Route({
			props: { path: "/profile", component: Profile },
			$$inline: true
		});

	route4 = new Route({
			props: { path: "/projects", component: Projects },
			$$inline: true
		});

	route5 = new Route({
			props: { path: "/editor", component: CodeEditor_1 },
			$$inline: true
		});

	route6 = new Route({
			props: { path: "*", component: NotFound },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(route0.$$.fragment);
			t0 = space();
			create_component(route1.$$.fragment);
			t1 = space();
			create_component(route2.$$.fragment);
			t2 = space();
			create_component(route3.$$.fragment);
			t3 = space();
			create_component(route4.$$.fragment);
			t4 = space();
			create_component(route5.$$.fragment);
			t5 = space();
			create_component(route6.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(route0, target, anchor);
			insert_dev(target, t0, anchor);
			mount_component(route1, target, anchor);
			insert_dev(target, t1, anchor);
			mount_component(route2, target, anchor);
			insert_dev(target, t2, anchor);
			mount_component(route3, target, anchor);
			insert_dev(target, t3, anchor);
			mount_component(route4, target, anchor);
			insert_dev(target, t4, anchor);
			mount_component(route5, target, anchor);
			insert_dev(target, t5, anchor);
			mount_component(route6, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(route0.$$.fragment, local);
			transition_in(route1.$$.fragment, local);
			transition_in(route2.$$.fragment, local);
			transition_in(route3.$$.fragment, local);
			transition_in(route4.$$.fragment, local);
			transition_in(route5.$$.fragment, local);
			transition_in(route6.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(route0.$$.fragment, local);
			transition_out(route1.$$.fragment, local);
			transition_out(route2.$$.fragment, local);
			transition_out(route3.$$.fragment, local);
			transition_out(route4.$$.fragment, local);
			transition_out(route5.$$.fragment, local);
			transition_out(route6.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(route0, detaching);
			if (detaching) detach_dev(t0);
			destroy_component(route1, detaching);
			if (detaching) detach_dev(t1);
			destroy_component(route2, detaching);
			if (detaching) detach_dev(t2);
			destroy_component(route3, detaching);
			if (detaching) detach_dev(t3);
			destroy_component(route4, detaching);
			if (detaching) detach_dev(t4);
			destroy_component(route5, detaching);
			if (detaching) detach_dev(t5);
			destroy_component(route6, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(19:4) <Router>",
		ctx
	});

	return block;
}

// (18:2) <LayoutManager header={TopNavigation} footer={Footer}>
function create_default_slot(ctx) {
	let router;
	let current;

	router = new Router({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(router.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(router, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const router_changes = {};

			if (dirty & /*$$scope*/ 2) {
				router_changes.$$scope = { dirty, ctx };
			}

			router.$set(router_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(router.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(router.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(router, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(18:2) <LayoutManager header={TopNavigation} footer={Footer}>",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$isLoading*/ ctx[0]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let $isLoading$1;
	validate_store($isLoading, 'isLoading');
	component_subscribe($$self, $isLoading, $$value => $$invalidate(0, $isLoading$1 = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		isLoading: $isLoading,
		Route,
		Router,
		CodeEditor: CodeEditor_1,
		Footer,
		LayoutManager,
		Login,
		NotFound,
		Profile,
		Projects,
		Register,
		TopNavigation,
		$isLoading: $isLoading$1
	});

	return [$isLoading$1];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init$1(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

new App({
  target: document.body,
  props: {
    // name: 'world',
    // backendUrl: 'http://localhost:3000',
  },
});

// export default app;
//# sourceMappingURL=bundle.js.map
