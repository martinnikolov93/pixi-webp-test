const app = new PIXI.Application({ transparent: true, width: 900, height: 800 });
document.body.appendChild(app.view);

// load spine data
app.loader
    .add('main-scene', 'assets/main-scene.json')
    .load(onAssetsLoaded);

app.stage.interactive = true;

function onAssetsLoaded(loader, res) {
    console.log("pixi works");
    console.log(PIXI.utils.TextureCache);

    let panda = new PIXI.Sprite(PIXI.utils.TextureCache["panda"])

    app.stage.addChild(panda)
}