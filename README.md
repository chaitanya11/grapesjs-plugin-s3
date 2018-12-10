# [GrapesJS S3]

This plugin replaces the default file uploader with the one from Filestack



## Summary

* Plugin
  * Name: `gjs-plugin-s3`
  * Options:
      * imgFormats: ["png", "jpeg", "jpg"],
      * bucketName: "bodylesscms",
      * prefix: "content/img/",
      * accessKeyId: `<AWS Access key Id>`,
      * secretAccessKey: `<Aws secret access key>`,
      * sessionToken: `<AWS Sessions Token>`



## Download

* `npm i grapesjs-plugin-s3`



## Usage

```html
<link href="path/to/grapes.min.css" rel="stylesheet"/>
<link href="path/to/grapesjs-plugin-s3.css" rel="stylesheet"/>

<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-plugin-s3.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      plugins: ['gjs-plugin-filestack'],
      pluginsOpts: {
        'gjs-plugin-s3': {/* ...options */}
      }
  });
</script>
```



## Development

Clone the repository

```sh
$ git clone https://github.com/chaitanya11/grapesjs-plugin-s3.git
$ cd grapesjs-plugin-s3
```

Install it

```sh
$ npm i
```

The plugin relies on GrapesJS via `peerDependencies` so you have to install it manually (without adding it to package.json)

```sh
$ npm i grapesjs --no-save
```

Start the dev server

```sh
$ npm start
```



## License

BSD 3-Clause
