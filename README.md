# TermIt Annotate

TermIt Annotate is a one-of-kind tool for seamlessly creating semantic vocabularies from terms as they appear in websites on the web. It allows you to get automatic suggestions of new, existing or unknown term occurrences on webpages, making your vocabulary creation effortless. 

### Quick links
[Open source repository](https://github.com/alanbuzek/termit-extension) | 
[Chrome Web Store Listing](https://chrome.google.com/webstore/detail/termit-annotate-semantic/penpnbbgbibnedeecnkbnemoilfdjlbh) | [About TermIt](https://kbss-cvut.github.io/termit-web/)


# Local development 

NPM and Node.js is required to build the extension.

### 1. Install dependencies
```
npm install
```
### 2. Spin up local development (continiously build extension on each change)
```
npm run watch // builds extensino
npm run watch:css // builds css (tailwind)

```
### 3. Load into browser

Once the a built has been successful, its contents will appear in the `build` folder in the root directory of this repository. You can then take it and say choose the `Load unpacked` on the `chrome://extensions` page in your Google Chrome (or in another Manifest v3 compatible browser). Once the extension has been loaded successfully, a Tutorial page will open automatically, indicating a successful setup. 

### 4. Make changes as you go

Assuming your scripts from step 2 are still running, your extension will rebuild everytime you save a code change. You can then just hit the 'reload' icon on the extension's page of your browser to see your changes live. 

### 5. Dependencies 

Note that TermIt Annotate should work for anonymous annotations, but once you'd like to test out integration with the rest of the components from the TermIt system. Namely, there are 4 dependencies to configure: [Annotace](https://github.com/alanbuzek/annotace/tree/termit-extension), [TermIt UI](https://github.com/alanbuzek/termit-ui/tree/termit-extension) and [TermIt Server](https://github.com/alanbuzek/termit/tree/termit-extension) with its GraphDB. Once you have those up and running, you can go to `src/content/component/shared/InstanceSelection.tsx` and fill in the URLs of those services. Afterwards, you will be ready to run a fully. 

Unfortunately, the preconfigured instance Testování doesn't currently work when developing locally, as its server is pointing to the production extension's ID, so please download it from the [Chrome Store](https://chrome.google.com/webstore/detail/termit-annotate-semantic/penpnbbgbibnedeecnkbnemoilfdjlbh) if needed.

### 6. Store submission 

If you want to publish or update the store listing, just take the /build directory, zip it and upload it to the Chrome store (or any other supported vendor). 