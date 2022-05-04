const Tracy = () => {
    const tracyCss = document.createElement("link"),
        tracyJS = document.createElement("script"),
        tracyOverload = document.createElement("script");

    tracyCss.setAttribute("href", "/files/style/tracy.all.css");
    tracyCss.setAttribute("rel", "stylesheet");
    tracyCss.setAttribute("type", "text/css")
    
    tracyJS.src = "/files/script/tracy.all.js";
    tracyOverload.src = "/files/script/tracy.overload.js";

    document.head.appendChild(tracyCss);
    document.body.appendChild(tracyJS);
    document.body.appendChild(tracyOverload);
};

export default Tracy;