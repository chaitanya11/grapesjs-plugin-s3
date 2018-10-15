import grapesjs from 'grapesjs';
import S3 from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk';


export default grapesjs.plugins.add('gjs-plugin-s3', (editor, opts = {}) => {
  let c = opts;
  let config = editor.getConfig();
  let pfx = config.stylePrefix || '';
  let btnEl;

  let defaults = {

    // Custom button element which triggers s3 modal
    btnEl: '',

    // Text for the button in case the custom one is not provided
    btnText: 'Add images',

    imgFormats: [],
    bucketName: '',
    prefix: '',
    accessKeyId: undefined,
    secretAccessKey: undefined,
    sessionToken: undefined,



    // On complete upload callback
    // blobs - Array of Objects, eg. [{url:'...', filename: 'name.jpeg', ...}]
    // assets - Array of inserted assets
    // for debug: console.log(JSON.stringify(blobs));
    onComplete: (blobs, assets) => { },
  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  if ([c.secretAccessKey, c.accessKeyId, c.sessionToken].some(
    (configuration) => (configuration == undefined) | (configuration == null))
  ) {
    console.log('coming');
    throw new Error('Aws configuration is missing');
  }
  if (!c.imgFormats) {
    c.imgFormats = ["png", "jpeg", "jpg"];
  }

  if (!c.bucketName) {
    c.bucketName = "bodylesscms";
  }

  if (!c.prefix) {
    c.prefix = "content/img/";
  }



  AWS.config.update({
    accessKeyId: c.accessKeyId,
    secretAccessKey: c.secretAccessKey,
    sessionToken: c.sessionToken
  });
  const s3 = new S3();
  const s3Params = {
    Bucket: c.bucketName,
    Prefix: c.prefix
  };

  s3.listObjects(s3Params, (err, data) => {
    if (err) console.error(err);
    else {
      const signedUrls = data.Contents.map((s3Object) => {
        if (c.imgFormats.some((imgFormat) => s3Object.Key.includes(imgFormat))) {
          let fileName = s3Object.Key.split('/');
          fileName = fileName[fileName.length - 1];
          const s3ObjectUrl = 'https://' + c.bucketName + '.s3.amazonaws.com/' + s3Object.Key;
          return {
            url: s3ObjectUrl,
            name: fileName
          };
        }
      }).filter(signedUrl => signedUrl != undefined);
      addAssets(signedUrls);
    }
  });

  // When the Asset Manager modal is opened
  editor.on('run:open-assets', () => {
    let inputEl;
    const modal = editor.Modal;
    const modalBody = modal.getContentEl();
    const uploader = modalBody.querySelector('.' + pfx + 'am-file-uploader');
    const assetsHeader = modalBody.querySelector('.' + pfx + 'am-assets-header');
    const assetsBody = modalBody.querySelector('.' + pfx + 'am-assets-cont');

    uploader && (uploader.style.display = 'none');
    assetsHeader && (assetsHeader.style.display = 'none');
    assetsBody.style.width = '100%';

    // Instance button if not yet exists
    if (!btnEl) {
      btnEl = c.btnEl;

      if (!btnEl) {
        btnEl = document.createElement('button');
        btnEl.className = pfx + 'btn-prim ' + pfx + 'btn-s3';
        btnEl.innerHTML = c.btnText;
        inputEl = document.createElement("INPUT");
        inputEl.setAttribute("type", "file");
        inputEl.style.opacity = 0;
        inputEl.onchange = (e) => {
          console.log(e);
          let file = e.target.files[0];
          // upload to s3
          console.log(file);
          uploadToS3(file);
        }
        document.body.appendChild(inputEl);
      }

      btnEl.onclick = () => {
        // TODO should create a popup to upload new image.
        console.log('Add images');
        inputEl.click();
      };
    }

    assetsBody.insertBefore(btnEl, assetsHeader);
  });

  /**
   * Add new assets to the editor
   * @param {Array} files
   */
  const addAssets = (files) => {
    const urls = files.map((file) => {
      file.src = file.url;
      return file;
    });
    return editor.AssetManager.add(urls);
  };

  const uploadToS3 = (file) => {
    const objectName = c.prefix + file.name;
    const params = {
      Bucket: c.bucketName,
      Key: objectName,
      ContentType: file.type,
      Body: file
    }
    s3.putObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });
  }

});
