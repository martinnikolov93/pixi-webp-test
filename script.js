window.webp = {}
window.webp.isSupported = null;
window.webp.features = { lossy: null, lossless: null, alpha: null };
window.webp.checkWebpFeature = (feature, callback) => {
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
};
window.webp.onFeatureCheck = (callback) => {
    if (window.webp.features.lossy !== null && window.webp.features.lossless !== null && window.webp.features.alpha !== null) {
        window.webp.isSupported = window.webp.features.lossy && window.webp.features.lossless && window.webp.features.alpha;

        callback();
    }
}
window.webp.checkSupport = (onComplete) => {
    window.webp.checkWebpFeature('lossy', function (feature, isSupported) {
        if (isSupported) {
            window.webp.features.lossy = true
        } else {
            window.webp.features.lossy = false
        }

        window.webp.onFeatureCheck(onComplete);
    });

    window.webp.checkWebpFeature('lossless', function (feature, isSupported) {
        if (isSupported) {
            window.webp.features.lossless = true;
        } else {
            window.webp.features.lossless = false;
        }

        window.webp.onFeatureCheck(onComplete);
    });

    window.webp.checkWebpFeature('alpha', function (feature, isSupported) {
        if (isSupported) {
            window.webp.features.alpha = true;
        } else {
            window.webp.features.alpha = false;
        }

        window.webp.onFeatureCheck(onComplete);
    });
}

function initPixiApp() {
    const app = new PIXI.Application({ transparent: true, width: 900, height: 800, view: document.getElementById("pixi-app") });

    app.loader.onStart.add(() => { console.log("onStart") });
    app.loader.onProgress.add((l, r) => { console.log("onProgress", r.url) });
    app.loader.onError.add((e, l, r) => { console.log("onError") });
    app.loader.onLoad.add((l, r) => { console.log("onLoad", r.url) });
    app.loader.onComplete.add((l, r) => { console.log("onComplete") });

    function middleWare(resource, next) {
        console.log("middleWare", resource)
        console.log(resource)

        if (resource.extension === "webp" && !window.webp.isSupported) {
            if (window.webp.isSupported === null) {
                window.webp.checkSupport(() => {
                    if (window.webp.isSupported === false) {
                        resource.url = resource.url.replace("webp", "png")
                        resource.extension = "png";
                    }

                    next();
                })

                return
            }
            console.log("webPIsSupported", window.webp.isSupported);
            resource.url = resource.url.replace("webp", "png")
            resource.extension = "png"
        }

        next()
    }


    PIXI.loaders.Loader.addPixiMiddleware(middleWare)

    app.loader
        .pre(middleWare)
        .add('main-scene', 'assets/main-scene.json')
        .load(onAssetsLoaded);

    app.stage.interactive = true;

    function onAssetsLoaded(loader, res) {
        console.log("pixi start");
        console.log(PIXI.utils.TextureCache);

        let panda = new PIXI.Sprite(PIXI.utils.TextureCache["panda"])
        app.stage.addChild(panda)

        let lossy = new PIXI.Text()
        app.stage.addChild(lossy)

        if (window.webp.features.lossy) {
            lossy.text = "WebP lossy is supported"
        } else {
            lossy.text = "WebP lossy NOT supported"
        }

        let lossless = new PIXI.Text()
        lossless.y = 30
        app.stage.addChild(lossless)

        if (window.webp.features.lossless) {
            lossless.text = "WebP lossless is supported"
        } else {
            lossless.text = "WebP lossless NOT supported"
        }

        let alpha = new PIXI.Text()
        alpha.y = 60
        app.stage.addChild(alpha)

        if (window.webp.features.alpha) {
            alpha.text = "WebP alpha is supported"
        } else {
            alpha.text = "WebP alpha NOT supported"
        }

        // let animation = new PIXI.Text()
        // animation.y = 90
        // app.stage.addChild(animation)

        // if (animationIsSupported) {
        //     animation.text = "WebP animation is supported"
        // } else {
        //     animation.text = "WebP animation NOT supported"
        // }
    }
}

initPixiApp();
