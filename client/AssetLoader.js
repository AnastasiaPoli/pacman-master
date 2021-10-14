export default 
class AssetLoader {
    _loadAsset(name, url) {
      return new Promise(resolve => {
        const image = new Image();
        image.src = url;
        image.addEventListener("load", function() {
          return resolve({ name, image: this });
        });
      });
    }
  
    loadAssets(assetsToLoad) {
      return Promise.all(
        assetsToLoad.map(asset => this._loadAsset(asset.name, asset.url))
      ).then(assets =>
        assets.reduceRight(
          (acc, elem) => ({ ...acc, [elem.name]: elem.image }),
          {}
        )
      );
    }
}