<p align="center">
  <img src="banner.png" alt="Banner" style="width: 512px; max-width: 90%"></img>
</p>

# Goo

This is a custom HTML element that runs and displays a gooey simulation.

## Usage

Make sure to import the module, otherwise the custom element will not be
registered. Make sure bundlers don't tree-shake the import away.

```js
import "goo-html";
```

Now simply add the custom element to your HTML. You must provide the attributes
`radius`, `count` and `color`. You also need to set a size for the element with
CSS.

```html
<goo-simulation
  radius="50"
  count="10"
  color="pink"
  style="width: 100%; height: 100%"
>
</goo-simulation>
```

## Documentation

The entire module uses JSDoc comments. You can import `Goo` from `goo-html` and
check the documentation for extra attributes and usage.
