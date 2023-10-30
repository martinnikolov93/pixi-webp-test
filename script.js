const app = new PIXI.Application({ transparent: true, width: 900, height: 800, view: document.getElementById("pixi-app") });
// document.body.appendChild(app.view);

app.loader
    .add('main-scene', 'assets/main-scene.json')
    .load(onAssetsLoaded);

app.stage.interactive = true;

function onAssetsLoaded(loader, res) {
    console.log("pixi works");
    console.log(PIXI.utils.TextureCache);

    let panda = new PIXI.Sprite(PIXI.utils.TextureCache["panda"])
    app.stage.addChild(panda)

    let lossy = new PIXI.Text()
    app.stage.addChild(lossy)

    check_webp_feature('lossy', function (feature, isSupported) {
        if (isSupported) {
            lossy.text = "WebP lossy is supported"
        } else {
            lossy.text = "WebP lossy NOT supported"
        }
    });

    let lossless = new PIXI.Text()
    lossless.y = 30
    app.stage.addChild(lossless)

    check_webp_feature('lossless', function (feature, isSupported) {
        if (isSupported) {
            lossless.text = "WebP lossless is supported"
        } else {
            lossless.text = "WebP lossless NOT supported"
        }
    });

    let alpha = new PIXI.Text()
    alpha.y = 60
    app.stage.addChild(alpha)

    check_webp_feature('alpha', function (feature, isSupported) {
        if (isSupported) {
            alpha.text = "WebP alpha is supported"
        } else {
            alpha.text = "WebP alpha NOT supported"
        }
    });

    let animation = new PIXI.Text()
    animation.y = 90
    app.stage.addChild(animation)

    check_webp_feature('animation', function (feature, isSupported) {
        if (isSupported) {
            animation.text = "WebP animation is supported"
        } else {
            animation.text = "WebP animation NOT supported"
        }
    });
}

// check_webp_feature:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, isSupported)' will be passed back the detection result (in an asynchronous way!)
function check_webp_feature(feature, callback) {
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    };
    var img = new Image();
    img.onload = function () {
        var result = (img.width > 0) && (img.height > 0);
        callback(feature, result);
    };
    img.onerror = function () {
        callback(feature, false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
}