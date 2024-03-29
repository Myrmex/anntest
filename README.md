# Anntest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.6.

This is a repro project following the discussion at <https://github.com/recogito/annotorious/issues/278>.

I am trying to use [Annotorious](https://recogito.github.io/annotorious/) with its [plugin](https://recogito.github.io/annotorious/getting-started/osd-plugin/) for [OpenSeadragon](http://openseadragon.github.io/) in Angular 15.

When running my demo app, I get errors when creating the OpenSeadragon viewer, so probably I'm just missing some basic setup.
As it seems this is a [recurring issue](https://github.com/openseadragon/openseadragon/issues/1858), I'm trying to contribute here with some guidance to use OSD with Angular, detailing the steps I followed up to this point. Eventually, I can provide my full sample code in a GitHub repository.

This is the toplevel error:

```txt
core.mjs:8506 ERROR TypeError: Cannot read properties of undefined (reading 'disableEditor')
    at new jc (annotorious.min.js:24:109315)
    at SdImgAnnotatorDirective.ngAfterViewInit (sd-img-annotator.directive.ts:127:17)
    at callHook (core.mjs:2488:22)
    at callHooks (core.mjs:2457:17)
    at executeInitAndCheckHooks (core.mjs:2408:9)
    at refreshView (core.mjs:10490:21)
    at refreshComponent (core.mjs:11480:13)
    at refreshChildComponents (core.mjs:10210:9)
    at refreshView (core.mjs:10469:13)
    at refreshEmbeddedViews (core.mjs:11434:17)
```

Additionally, I get a number of 404 as apparently the plugin is trying to load some UI image resources like `GET http://localhost:4200/images/zoomin_rest.png 404 (Not Found)` etc.

## Updates

Following the suggestions posted [here](https://github.com/recogito/annotorious/issues/278), I changed the imports in the directive. This removes the above issues. Now I get a single error and a couple of warnings:

```txt
TypeError: _recogito_annotorious_openseadragon__WEBPACK_IMPORTED_MODULE_0__ is not a constructor
    at SdImgAnnotatorDirective.ngAfterViewInit (sd-img-annotator.directive.ts:154:17)

Viewer.buttons is deprecated; Please use Viewer.buttonGroup
get buttons @ openseadragon.js:8076

sd-img-annotator.directive.ts:143 Tile constructor needs 'cacheKey' variable: creation tile cache in Tile class is deprecated. TileSource.prototype.getTileHashKey will be used.
```

## Procedure

To start simple, I'd like to create an essential directive, whose only purpose is using Annotorious Seadragon to annotate an image and get an event whenever an annotation is changed.

In my sample project I'm using a legacy simple image as the source for OSD, following the configuration in the [OSD sample page](http://openseadragon.github.io/examples/tilesource-image/) for this scenario. Essentially, all what it takes is something like:

```js
OpenSeadragon({
    ...
    tileSources: {
        type: 'image',
        url:  '/example-images/grand-canyon-landscape-overlooking.jpg'
    }
    ...
});
```

Also, as I learn from [this page](http://openseadragon.github.io/docs/), performance reasons suggest to run OSD outside Angular zones. So, here is the procedure:

(1) create an Angular app and install the required **packages**:

```bash
npm i @recogito/annotorious @recogito/annotorious-openseadragon openseadragon
npm i @types/openseadragon --save-dev
```

Also add a `types.ts` file to your `src` folder with this content:

```ts
declare module "@recogito/annotorious-openseadragon";
```

and then import it where required. Alternatively, add a comment just before the import statement:

```ts
// @ts-ignore
import * as OSDAnnotorious from '@recogito/annotorious-openseadragon';
```

(2) add the required Annotorious **CSS** to `angular.json` under `projects/architect/build/options/styles`:

```json
"styles": [
  "node_modules/@recogito/annotorious/dist/annotorious.min.css",
  "src/styles.css"
]
```

>According to the documentation, this is required at least when using OSD in fullscreen mode.

(3) add the [directive](projects/sd-img-annotator/src/lib/directives/sd-img-annotator.directive.ts).

(4) add a sample image in the demo app `assets`, and a page using the directive like this:

```html
<div id="osd" sdImgAnnotator source="/assets/sample.jpg"></div>
```
