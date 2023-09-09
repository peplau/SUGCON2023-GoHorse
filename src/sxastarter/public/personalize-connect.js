function GetDatasource(experienceId, experienceValue) {
    debugger;
    if (__personalizeDatasources == null || __personalizeDatasources.length==0)
        return null;
    var datasource = null;
    for (var i = 0; i < __personalizeDatasources.length; i++) {
        if (__personalizeDatasources[i].ExperienceId == experienceId && __personalizeDatasources[i].ExperienceValue == experienceValue) {
            datasource = __personalizeDatasources[i];
            break;
        }
    }
    return datasource;
}

function PopulateBlock(datasource) {
    debugger;
    var containerId = datasource.UniqueId;
    var container = document.querySelector('[cdp-container="' + containerId + '"]');
    if (container == undefined)
        return;

    var datasourceItem = datasource.DataSource;
    Object.keys(datasourceItem.fields).forEach(key => {
        var subcontainer = container.querySelector('[cdp-field="' + key + '"]');
        if (subcontainer != undefined) {
            var value = datasourceItem.fields[key];

            if (subcontainer.tagName.toLowerCase() == "img") {
                if (value.src != "")
                    subcontainer.src = value.src;
                if (value.alt != "")
                    subcontainer.alt = value.alt;
            }
            else if (subcontainer.tagName.toLowerCase() == "a") {

                if (value.href != "")
                    subcontainer.href = value.href;
                if (value.target != "")
                    subcontainer.target = value.target;
                if (value.text != "")
                    subcontainer.innerHTML = value.text;
                if (value.title != "")
                    subcontainer.title = value.title;
                if (value.class != "")
                    subcontainer.className = value.class;
            }
            else {
                subcontainer.innerHTML = value;
            }
        }

    });
}

// Initialize the engage variable
var engage = undefined;

// Create and inject the <script> tag into the HTML
var s = document.createElement("script");
s.type = "text/javascript";
s.async = true;
s.src = "https://d1mj578wat5n4o.cloudfront.net/sitecore-engage-v.1.4.0.min.js";
var x = document.querySelector("script");
x.parentNode.insertBefore(s, x);    

// Initialize the Engage SDK
s.addEventListener("load", async () => {
    var settings = {
        clientKey: "b8dfe13eec6770da21a64f765e118af5",
        targetURL: "https://api-engage-us.sitecorecloud.io",
        pointOfSale: "SUGCON2023-GoHorse",
        cookieDomain: window.location.host.replace(/^www./, ''),
        cookieExpiryDays: 365,
        forceServerCookieMode: false,
        includeUTMParameters: true,
        webPersonalization: true /* boolean or object. See Settings object for all options. Default: false */
    };
    engage = await window.Engage.init(settings);                
});