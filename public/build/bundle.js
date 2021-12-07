
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    const outroing = new Set();
    let outros;
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
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
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
            flush();
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
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
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
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

    /* src/ProofFramework.svelte generated by Svelte v3.44.2 */

    const file$1 = "src/ProofFramework.svelte";
    const get_body_slot_changes = dirty => ({});
    const get_body_slot_context = ctx => ({});
    const get_premise_slot_changes = dirty => ({});
    const get_premise_slot_context = ctx => ({});

    function create_fragment$1(ctx) {
    	let div4;
    	let div3;
    	let div1;
    	let div0;
    	let t;
    	let div2;
    	let current;
    	const premise_slot_template = /*#slots*/ ctx[1].premise;
    	const premise_slot = create_slot(premise_slot_template, ctx, /*$$scope*/ ctx[0], get_premise_slot_context);
    	const body_slot_template = /*#slots*/ ctx[1].body;
    	const body_slot = create_slot(body_slot_template, ctx, /*$$scope*/ ctx[0], get_body_slot_context);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (premise_slot) premise_slot.c();
    			t = space();
    			div2 = element("div");
    			if (body_slot) body_slot.c();
    			attr_dev(div0, "class", "premise-inner");
    			add_location(div0, file$1, 3, 12, 110);
    			attr_dev(div1, "class", "premise-outer");
    			add_location(div1, file$1, 2, 8, 70);
    			attr_dev(div2, "class", "proof-body");
    			add_location(div2, file$1, 5, 8, 195);
    			add_location(div3, file$1, 1, 4, 56);
    			attr_dev(div4, "class", "sub-proof");
    			set_style(div4, "height", "fit-content");
    			add_location(div4, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);

    			if (premise_slot) {
    				premise_slot.m(div0, null);
    			}

    			append_dev(div3, t);
    			append_dev(div3, div2);

    			if (body_slot) {
    				body_slot.m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (premise_slot) {
    				if (premise_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						premise_slot,
    						premise_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(premise_slot_template, /*$$scope*/ ctx[0], dirty, get_premise_slot_changes),
    						get_premise_slot_context
    					);
    				}
    			}

    			if (body_slot) {
    				if (body_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						body_slot,
    						body_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(body_slot_template, /*$$scope*/ ctx[0], dirty, get_body_slot_changes),
    						get_body_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(premise_slot, local);
    			transition_in(body_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(premise_slot, local);
    			transition_out(body_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (premise_slot) premise_slot.d(detaching);
    			if (body_slot) body_slot.d(detaching);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProofFramework', slots, ['premise','body']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProofFramework> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class ProofFramework extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProofFramework",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.2 */
    const file = "src/App.svelte";

    // (27:4) 
    function create_premise_slot_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "A -> B";
    			attr_dev(div, "slot", "premise");
    			add_location(div, file, 26, 4, 464);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_premise_slot_2.name,
    		type: "slot",
    		source: "(27:4) ",
    		ctx
    	});

    	return block;
    }

    // (32:6) 
    function create_premise_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "A -> B ^ D -> E";
    			attr_dev(div, "slot", "premise");
    			add_location(div, file, 31, 6, 605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_premise_slot_1.name,
    		type: "slot",
    		source: "(32:6) ",
    		ctx
    	});

    	return block;
    }

    // (35:8) 
    function create_premise_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "A -> B";
    			attr_dev(div, "slot", "premise");
    			add_location(div, file, 34, 8, 715);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_premise_slot.name,
    		type: "slot",
    		source: "(35:8) ",
    		ctx
    	});

    	return block;
    }

    // (36:8) <svelte:fragment slot="body">
    function create_body_slot_2(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div2;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "A -> B";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "C -> D";
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "C -> D";
    			add_location(div0, file, 36, 9, 795);
    			add_location(div1, file, 37, 9, 822);
    			add_location(div2, file, 38, 9, 849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_body_slot_2.name,
    		type: "slot",
    		source: "(36:8) <svelte:fragment slot=\\\"body\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:6) <svelte:fragment slot="body">
    function create_body_slot_1(ctx) {
    	let proofframework;
    	let current;

    	proofframework = new ProofFramework({
    			props: {
    				$$slots: {
    					body: [create_body_slot_2],
    					premise: [create_premise_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(proofframework.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(proofframework, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const proofframework_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				proofframework_changes.$$scope = { dirty, ctx };
    			}

    			proofframework.$set(proofframework_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(proofframework.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(proofframework.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(proofframework, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_body_slot_1.name,
    		type: "slot",
    		source: "(33:6) <svelte:fragment slot=\\\"body\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:4) <svelte:fragment slot="body">
    function create_body_slot(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let proofframework;
    	let current;

    	proofframework = new ProofFramework({
    			props: {
    				$$slots: {
    					body: [create_body_slot_1],
    					premise: [create_premise_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "A -> B";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "C -> D";
    			t3 = space();
    			create_component(proofframework.$$.fragment);
    			add_location(div0, file, 28, 5, 536);
    			add_location(div1, file, 29, 5, 559);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(proofframework, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const proofframework_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				proofframework_changes.$$scope = { dirty, ctx };
    			}

    			proofframework.$set(proofframework_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(proofframework.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(proofframework.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			destroy_component(proofframework, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_body_slot.name,
    		type: "slot",
    		source: "(28:4) <svelte:fragment slot=\\\"body\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div24;
    	let div0;
    	let t1;
    	let div1;
    	let t3;
    	let div2;
    	let t5;
    	let div16;
    	let div3;
    	let t7;
    	let div4;
    	let t9;
    	let div5;
    	let t11;
    	let div6;
    	let t13;
    	let div7;
    	let t15;
    	let div8;
    	let t17;
    	let div9;
    	let t19;
    	let div10;
    	let t21;
    	let div11;
    	let t23;
    	let div12;
    	let t25;
    	let div13;
    	let t27;
    	let div14;
    	let t29;
    	let div15;
    	let t31;
    	let div17;
    	let proofframework;
    	let t32;
    	let div23;
    	let div18;
    	let t34;
    	let div19;
    	let t36;
    	let div20;
    	let t38;
    	let div21;
    	let t40;
    	let div22;
    	let current;

    	proofframework = new ProofFramework({
    			props: {
    				$$slots: {
    					body: [create_body_slot],
    					premise: [create_premise_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div24 = element("div");
    			div0 = element("div");
    			div0.textContent = "#";
    			t1 = space();
    			div1 = element("div");
    			div1.textContent = "Statement";
    			t3 = space();
    			div2 = element("div");
    			div2.textContent = "Justification";
    			t5 = space();
    			div16 = element("div");
    			div3 = element("div");
    			div3.textContent = "1";
    			t7 = space();
    			div4 = element("div");
    			div4.textContent = "2";
    			t9 = space();
    			div5 = element("div");
    			div5.textContent = "5";
    			t11 = space();
    			div6 = element("div");
    			div6.textContent = "1";
    			t13 = space();
    			div7 = element("div");
    			div7.textContent = "2";
    			t15 = space();
    			div8 = element("div");
    			div8.textContent = "3";
    			t17 = space();
    			div9 = element("div");
    			div9.textContent = "4";
    			t19 = space();
    			div10 = element("div");
    			div10.textContent = "5";
    			t21 = space();
    			div11 = element("div");
    			div11.textContent = "1";
    			t23 = space();
    			div12 = element("div");
    			div12.textContent = "2";
    			t25 = space();
    			div13 = element("div");
    			div13.textContent = "3";
    			t27 = space();
    			div14 = element("div");
    			div14.textContent = "4";
    			t29 = space();
    			div15 = element("div");
    			div15.textContent = "5";
    			t31 = space();
    			div17 = element("div");
    			create_component(proofframework.$$.fragment);
    			t32 = space();
    			div23 = element("div");
    			div18 = element("div");
    			div18.textContent = "AI 1,2";
    			t34 = space();
    			div19 = element("div");
    			div19.textContent = "^E, 1-3";
    			t36 = space();
    			div20 = element("div");
    			div20.textContent = "5";
    			t38 = space();
    			div21 = element("div");
    			div21.textContent = "1";
    			t40 = space();
    			div22 = element("div");
    			div22.textContent = "2";
    			add_location(div0, file, 6, 2, 107);
    			add_location(div1, file, 7, 2, 122);
    			add_location(div2, file, 8, 2, 145);
    			add_location(div3, file, 10, 3, 197);
    			add_location(div4, file, 11, 3, 213);
    			add_location(div5, file, 12, 3, 229);
    			add_location(div6, file, 13, 3, 245);
    			add_location(div7, file, 14, 3, 261);
    			add_location(div8, file, 15, 3, 277);
    			add_location(div9, file, 16, 3, 293);
    			add_location(div10, file, 17, 3, 309);
    			add_location(div11, file, 18, 3, 325);
    			add_location(div12, file, 19, 3, 341);
    			add_location(div13, file, 20, 3, 357);
    			add_location(div14, file, 21, 3, 373);
    			add_location(div15, file, 22, 3, 389);
    			attr_dev(div16, "class", "num-col");
    			add_location(div16, file, 9, 2, 172);
    			attr_dev(div17, "name", "statement-col");
    			add_location(div17, file, 24, 2, 413);
    			add_location(div18, file, 47, 3, 1057);
    			add_location(div19, file, 48, 3, 1078);
    			add_location(div20, file, 49, 3, 1100);
    			add_location(div21, file, 50, 3, 1116);
    			add_location(div22, file, 51, 3, 1132);
    			attr_dev(div23, "class", "justification-col");
    			add_location(div23, file, 46, 2, 1022);
    			attr_dev(div24, "class", "wrapper svelte-1d76cdh");
    			add_location(div24, file, 5, 1, 83);
    			add_location(main, file, 4, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div24);
    			append_dev(div24, div0);
    			append_dev(div24, t1);
    			append_dev(div24, div1);
    			append_dev(div24, t3);
    			append_dev(div24, div2);
    			append_dev(div24, t5);
    			append_dev(div24, div16);
    			append_dev(div16, div3);
    			append_dev(div16, t7);
    			append_dev(div16, div4);
    			append_dev(div16, t9);
    			append_dev(div16, div5);
    			append_dev(div16, t11);
    			append_dev(div16, div6);
    			append_dev(div16, t13);
    			append_dev(div16, div7);
    			append_dev(div16, t15);
    			append_dev(div16, div8);
    			append_dev(div16, t17);
    			append_dev(div16, div9);
    			append_dev(div16, t19);
    			append_dev(div16, div10);
    			append_dev(div16, t21);
    			append_dev(div16, div11);
    			append_dev(div16, t23);
    			append_dev(div16, div12);
    			append_dev(div16, t25);
    			append_dev(div16, div13);
    			append_dev(div16, t27);
    			append_dev(div16, div14);
    			append_dev(div16, t29);
    			append_dev(div16, div15);
    			append_dev(div24, t31);
    			append_dev(div24, div17);
    			mount_component(proofframework, div17, null);
    			append_dev(div24, t32);
    			append_dev(div24, div23);
    			append_dev(div23, div18);
    			append_dev(div23, t34);
    			append_dev(div23, div19);
    			append_dev(div23, t36);
    			append_dev(div23, div20);
    			append_dev(div23, t38);
    			append_dev(div23, div21);
    			append_dev(div23, t40);
    			append_dev(div23, div22);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const proofframework_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				proofframework_changes.$$scope = { dirty, ctx };
    			}

    			proofframework.$set(proofframework_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(proofframework.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(proofframework.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(proofframework);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ProofFramework });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
